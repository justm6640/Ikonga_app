"use server"

import { revalidatePath } from "next/cache"
import { startOfDay, addDays, isAfter, subHours, isBefore } from "date-fns"
import prisma from "@/lib/prisma"
import { getOrCreateUser } from "./user"
import { PhaseType } from "@prisma/client"

/**
 * Récupère les données nutritionnelles pour une date donnée.
 * Respecte la hiérarchie des menus et la règle de verrouillage J-48h.
 */
export async function getNutritionData(dateInput?: Date) {
    const user = await getOrCreateUser()
    if (!user) {
        console.log("DEBUG: No user found in getNutritionData")
        return null
    }

    console.log(`DEBUG: Fetching nutrition for user ${user.id} (${user.email})`)

    const targetDate = startOfDay(dateInput || new Date())
    const activePhase = user.phases[0] // La phase actuelle active

    if (!activePhase) {
        console.log("DEBUG: No active phase for user")
        return null
    }

    console.log(`DEBUG: Active phase found: ${activePhase.type}`)

    // --- 1. Règle J-48h et Sécurité de Phase ---
    // On doit déterminer si la targetDate appartient à la phase actuelle ou une phase future.
    // Ce calcul dépend de la durée des phases. Pour simplifier, on regarde si la date est après la fin de la phase active.

    let targetPhase = activePhase.type

    if (activePhase.plannedEndDate && isAfter(targetDate, activePhase.plannedEndDate)) {
        // La date est dans le futur, après la phase actuelle. 
        // Vérification du verrouillage : on débloque 48h avant le début de la phase suivante (fin de l'actuelle).
        const unlockTime = subHours(activePhase.plannedEndDate, 48)
        const now = new Date()

        if (isBefore(now, unlockTime)) {
            return { locked: true, unlockDate: unlockTime, reason: "Contenu verrouillé (J-48h)" }
        }

        // Note: Dans un système réel, on déterminerait quelle est la phase N+1.
        // Ici on suppose que l'utilisateur progresse selon la séquence définie dans le business logic.
        // Pour les guidelines, on pourrait avoir besoin de savoir laquelle c'est.
        // Par simplicité, on va chercher s'il y a un plan hebdomadaire qui définit la phase pour cette date.
    }

    // --- 2. Hiérarchie des Menus ---
    // A. UserCustomMenu (Niveau 3 - Priorité absolue)
    let menuContent = await prisma.userCustomMenu.findUnique({
        where: {
            userId_date: {
                userId: user.id,
                date: targetDate
            }
        }
    })

    let finalMenu: any = null
    let sourcePhase: PhaseType = activePhase.type

    if (menuContent) {
        finalMenu = menuContent.content
    } else {
        // B. WeeklyPlan (Niveau 1/2 - Menu généré)
        // On cherche le plan qui englobe la targetDate
        const weeklyPlan = await prisma.weeklyPlan.findFirst({
            where: {
                userId: user.id,
                weekStart: { lte: targetDate }
            },
            orderBy: { weekStart: 'desc' }
        })

        // Vérification que la date est bien dans la semaine du plan
        if (weeklyPlan && isBefore(targetDate, addDays(weeklyPlan.weekStart, 7))) {
            const content = weeklyPlan.content as any
            const dayIndex = Math.floor((targetDate.getTime() - weeklyPlan.weekStart.getTime()) / (1000 * 60 * 60 * 24))

            // On récupère le menu spécifique au jour dans le JSON du WeeklyPlan
            // Structure attendue : { "days": [ { "breakfast": "...", ... }, ... ] }
            if (content.days && content.days[dayIndex]) {
                finalMenu = content.days[dayIndex]
                sourcePhase = weeklyPlan.phase as PhaseType
            }
        }
    }

    if (!finalMenu) return { menu: null, phase: activePhase.type }

    // --- 3. Récupération des Recettes ---
    // finalMenu est supposé être { breakfast: "NomRecette", lunch: "...", ... }
    const meals = ['breakfast', 'lunch', 'dinner', 'snack']
    const enrichedMenu: any = {}

    for (const meal of meals) {
        const recipeName = finalMenu[meal]
        if (recipeName) {
            const recipe = await prisma.recipe.findUnique({
                where: {
                    name_phase: {
                        name: recipeName,
                        phase: sourcePhase
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
            if (recipe) {
                console.log(`DEBUG: Recipe found: ${recipe.name}`)
            } else {
                console.log(`DEBUG: Recipe NOT FOUND: ${recipeName} for phase ${sourcePhase}`)
            }
            enrichedMenu[meal] = recipe
        }
    }

    // --- 4. Guidelines (PhaseGuideline) ---
    const guidelines = await prisma.phaseGuideline.findMany({
        where: { phase: sourcePhase },
        orderBy: { order: 'asc' }
    })

    const formattedGuidelines = {
        allowed: guidelines.filter(g => g.type === 'ALLOWED').map(g => g.content),
        forbidden: guidelines.filter(g => g.type === 'FORBIDDEN').map(g => g.content)
    }

    // --- 5. État de complétion (DailyLog) ---
    const dailyLog = await prisma.dailyLog.findUnique({
        where: {
            userId_date: {
                userId: user.id,
                date: targetDate
            }
        }
    })

    return {
        menu: enrichedMenu,
        guidelines: formattedGuidelines,
        phase: sourcePhase,
        isCompleted: dailyLog?.nutritionDone || false,
        date: targetDate
    }
}

/**
 * Valide la nutrition pour une journée donnée.
 */
export async function validateDailyNutrition(dateInput: Date) {
    const user = await getOrCreateUser()
    if (!user) throw new Error("Non autorisé")

    const date = startOfDay(dateInput)

    await prisma.dailyLog.upsert({
        where: {
            userId_date: {
                userId: user.id,
                date: date
            }
        },
        create: {
            userId: user.id,
            date: date,
            nutritionDone: true
        },
        update: {
            nutritionDone: true
        }
    })

    revalidatePath("/nutrition")
    return { success: true }
}
