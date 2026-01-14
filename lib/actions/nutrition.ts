"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"
import { getOrCreateUser } from "./user"
import { startOfDay, endOfDay, addHours, isAfter, subHours } from "date-fns"
import { PhaseType } from "@prisma/client"

/**
 * Retrieves nutrition data for a specific date, adhering to security and hierarchy rules.
 */
export async function getNutritionData(dateRaw?: Date | string) {
    const user = await getOrCreateUser()
    if (!user) {
        throw new Error("Utilisateur non authentifié")
    }

    const targetDate = dateRaw ? new Date(dateRaw) : new Date()
    const targetDateStart = startOfDay(targetDate)
    const now = new Date()

    // 1. SECURITY: J-48h Rule
    // We check if the target date belongs to a future phase that isn't unlocked yet.
    const activePhase = user.phases[0] // Assuming phases are ordered by startDate DESC or filtered in getOrCreateUser

    // Check if the target date is beyond the active phase
    if (activePhase && activePhase.plannedEndDate && isAfter(targetDateStart, activePhase.plannedEndDate)) {
        const unlockTime = subHours(activePhase.plannedEndDate, 48)
        if (isAfter(now, unlockTime)) {
            // Unlocked (J-48h)
        } else {
            // Locked content
            return null
        }
    }

    // 2. Determine target phase for guidelines and recipe lookup
    // If targetDate is during activePhase, use activePhase.type
    // Otherwise, we might need to find which phase the targetDate belongs to in UserPhase history or projected timeline.
    let targetPhaseType: PhaseType = activePhase?.type || "DETOX"

    // Simple logic: if targetDate is after activePhase, we assume it's the "next" phase in sequence 
    // or we fetch the UserPhase covering that date if it exists.
    const specificPhase = await prisma.userPhase.findFirst({
        where: {
            userId: user.id,
            startDate: { lte: targetDateStart },
            OR: [
                { actualEndDate: { gte: targetDateStart } },
                { actualEndDate: null, plannedEndDate: { gte: targetDateStart } },
                { actualEndDate: null, plannedEndDate: null }
            ]
        }
    })
    if (specificPhase) targetPhaseType = specificPhase.type

    // 3. MENU HIERARCHY
    // Priority: UserCustomMenu -> WeeklyPlan
    let menuJson: any = null

    // Attempt Level 3 (Custom Menu)
    const customMenu = await prisma.userCustomMenu.findUnique({
        where: {
            userId_date: {
                userId: user.id,
                date: targetDateStart
            }
        }
    })

    if (customMenu) {
        menuJson = customMenu.content
    } else {
        // Fallback Level 2 (Weekly Plan)
        // WeeklyPlan is usually stored by weekStart
        const dayOfWeek = targetDateStart.getDay() // 0 is Sunday
        const diff = targetDateStart.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1) // Adjust to Monday
        const weekStart = startOfDay(new Date(targetDateStart.setDate(diff)))

        // Reset targetDateStart to original value after manipulation
        const originalTargetDateStart = startOfDay(new Date(dateRaw || new Date()))

        const weeklyPlan = await prisma.weeklyPlan.findUnique({
            where: {
                userId_weekStart: {
                    userId: user.id,
                    weekStart: weekStart
                }
            }
        })

        if (weeklyPlan && weeklyPlan.content) {
            const fullContent = weeklyPlan.content as any
            // Extract the specific day from the weekly JSON structure (e.g., { "Monday": { ... }, "Tuesday": { ... } })
            const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
            const dayKey = dayNames[originalTargetDateStart.getDay()]
            menuJson = fullContent[dayKey] || null
        }
    }

    if (!menuJson) return null

    // 4. FETCH RECIPE DETAILS
    // Typical menuJson structure: { breakfast: "Recipe Name", lunch: "Recipe Name", ... }
    const mealKeys = ["breakfast", "lunch", "dinner", "snack"]
    const menuDetails: any = {}

    for (const key of mealKeys) {
        const recipeName = menuJson[key]
        if (recipeName) {
            const recipe = await prisma.recipe.findUnique({
                where: {
                    name_phase: {
                        name: recipeName,
                        phase: targetPhaseType
                    }
                },
                select: {
                    id: true,
                    name: true,
                    ingredients: true,
                    instructions: true,
                    calories: true,
                    protein: true,
                    carbs: true,
                    fat: true,
                    prepTime: true,
                    difficulty: true,
                    isPremium: true
                }
            })
            menuDetails[key] = recipe
        } else {
            menuDetails[key] = null
        }
    }

    // 5. FETCH GUIDELINES (PhaseGuideline)
    const guidelines = await prisma.phaseGuideline.findMany({
        where: { phase: targetPhaseType },
        orderBy: { order: "asc" }
    })

    const allowed = guidelines.filter(g => g.type === "ALLOWED").map(g => g.content)
    const forbidden = guidelines.filter(g => g.type === "FORBIDDEN").map(g => g.content)

    // 6. CHECK COMPLETION (DailyLog)
    const dailyLog = await prisma.dailyLog.findUnique({
        where: {
            userId_date: {
                userId: user.id,
                date: startOfDay(targetDate)
            }
        },
        select: { nutritionDone: true }
    })

    return {
        menu: menuDetails,
        guidelines: {
            allowed,
            forbidden
        },
        phase: targetPhaseType,
        isCompleted: dailyLog?.nutritionDone || false
    }
}

/**
 * Validates daily nutrition by marking it as done in the DailyLog.
 */
export async function validateDailyNutrition(dateRaw: Date | string) {
    const user = await getOrCreateUser()
    if (!user) {
        throw new Error("Utilisateur non authentifié")
    }

    const targetDate = startOfDay(new Date(dateRaw))

    await prisma.dailyLog.upsert({
        where: {
            userId_date: {
                userId: user.id,
                date: targetDate
            }
        },
        update: {
            nutritionDone: true
        },
        create: {
            userId: user.id,
            date: targetDate,
            nutritionDone: true
        }
    })

    revalidatePath("/nutrition")
    revalidatePath("/dashboard")

    return { success: true }
}
