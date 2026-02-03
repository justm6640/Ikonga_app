"use server"

import { revalidatePath } from "next/cache"
import { startOfDay, addDays, isAfter, subHours, isBefore, differenceInCalendarDays, addHours } from "date-fns"
import prisma from "@/lib/prisma"
import { getOrCreateUser } from "./user"
import { PhaseType } from "@prisma/client"

/**
 * Récupère les données nutritionnelles pour une date donnée.
 * Respecte la hiérarchie des menus et la règle de verrouillage J-48h.
 */
export async function getNutritionData(dateInput?: string | Date) {
    console.log(`[SERVER ENTRY] getNutritionData called. Raw dateInput:`, dateInput, `Type:`, typeof dateInput)

    const user = await getOrCreateUser()
    if (!user) {
        console.log("DEBUG: No user found in getNutritionData")
        return null
    }

    // console.log(`DEBUG: Fetching nutrition for user ${user.id} (${user.email})`)

    // Parse date if it's a string, otherwise use as-is
    const inputDate = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
    const targetDate = startOfDay(inputDate || new Date())
    const activePhase = user.phases[0] // La phase actuelle active

    if (!activePhase) {
        console.log("DEBUG: No active phase for user")
        return null
    }

    console.log(`DEBUG: Active phase found: ${activePhase.type}`)

    // --- 1. Règles d'Accès Strictes (Part 9) ---
    const { isContentLocked, canAccessPhase } = await import("../nutrition/access")

    // A. Vérification Abonnement
    if (!canAccessPhase(user.subscriptionTier, activePhase.type)) {
        console.log(`[ACCESS DENIED] User tier ${user.subscriptionTier} cannot access phase ${activePhase.type}`)
        // On pourrait retourner une erreur ou un fallback, mais ici on log juste pour le debug
        // En théorie l'user ne devrait pas avoir cette phase "active" si son abo ne le permet pas
    }

    // B. Vérification Temporelle (J-48h)
    // On regarde si la date demandée est dans une phase future par rapport à la phase active
    const accessCheck = isContentLocked(targetDate, activePhase.plannedEndDate)

    if (!accessCheck.allowed) {
        return {
            locked: true,
            unlockDate: accessCheck.unlockDate,
            reason: accessCheck.reason === "LOCKED_48H"
                ? "Ce contenu sera disponible 48h avant le début de cette phase."
                : "Contenu verrouillé pour le moment."
        }
    }


    // --- 2. Hiérarchy des Menus (Level 3 > Level 2 > Level 1) ---
    let finalMenu: any = null
    let sourcePhase: PhaseType = activePhase.type

    // A. UserCustomMenu (Niveau 3 - Priorité absolue: Abonné)
    const customMenu = await prisma.userCustomMenu.findUnique({
        where: { userId_date: { userId: user.id, date: targetDate } }
    })

    if (customMenu) {
        finalMenu = customMenu.content
        console.log(`[DEBUG] Resolved Level 3 Menu (User)`)
    } else {
        // B. WeeklyPlan (Check Level 2 & 1)
        const weeklyPlan = await prisma.weeklyPlan.findFirst({
            where: {
                userId: user.id,
                weekStart: { lte: targetDate }
            },
            orderBy: { weekStart: 'desc' }
        })

        if (weeklyPlan && isBefore(targetDate, addDays(weeklyPlan.weekStart, 7))) {
            const safeTarget = addHours(targetDate, 4)
            const safeStart = addHours(weeklyPlan.weekStart, 4)
            const dayIndex = differenceInCalendarDays(safeTarget, safeStart)
            sourcePhase = weeklyPlan.phase as PhaseType

            // B1. Level 2 (Overrides Coach/Admin)
            if (weeklyPlan.overrides) {
                const overrides = weeklyPlan.overrides as any
                if (overrides.days && Array.isArray(overrides.days)) {
                    const overrideData = overrides.days.find((d: any) => d.dayIndex === dayIndex)
                    if (overrideData) {
                        finalMenu = overrideData
                        console.log(`[DEBUG] Resolved Level 2 Menu (Admin Override)`)
                    }
                }
            }

            // B2. Level 1 (Automatic AI) - Fallback
            if (!finalMenu) {
                const content = weeklyPlan.content as any
                const dayNames = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
                const targetDayName = dayNames[dayIndex]

                if (content.days && Array.isArray(content.days)) {
                    finalMenu = content.days.find((d: any) => d.dayIndex === dayIndex) || content.days[dayIndex]
                } else if (content[targetDayName]) {
                    finalMenu = content[targetDayName]
                }

                if (finalMenu) console.log(`[DEBUG] Resolved Level 1 Menu (AI Auto)`)
            }
        } else {
            // B3. FALLBACK: Trigger Automatic AI Generation if missing OR if plan doesn't cover the target date
            console.log(`[DEBUG] No WeeklyPlan covers target date. Triggering GPT generation for ${targetDate.toISOString()}`)

            const { generateUserWeeklyPlan } = await import("../ai/menu-generator")
            const result = await generateUserWeeklyPlan(user.id, false, targetDate)

            if (result.success && result.plan) {
                const generatedPlan = result.plan
                sourcePhase = generatedPlan.phase as PhaseType
                const content = generatedPlan.content as any
                const weekStart = new Date(generatedPlan.weekStart)
                const dayIndex = differenceInCalendarDays(targetDate, weekStart)

                const dayNames = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
                const targetDayName = dayNames[dayIndex]

                if (content.days && Array.isArray(content.days)) {
                    finalMenu = content.days.find((d: any) => d.dayIndex === dayIndex) || content.days[dayIndex]
                } else if (content[targetDayName]) {
                    finalMenu = content[targetDayName]
                }

                if (finalMenu) console.log(`[DEBUG] Resolved Level 1 Menu (Newly GPT-Generated)`)
            }
        }
    }

    if (!finalMenu) return { menu: null, phase: activePhase.type }

    // --- 3. Récupération des Recettes ---
    const meals = ['breakfast', 'lunch', 'dinner', 'snack']
    const enrichedMenu: any = {}

    for (const meal of meals) {
        const recipeName = finalMenu[meal]
        if (recipeName) {
            // First try to find a real recipe
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
                enrichedMenu[meal] = recipe
            } else {
                // If no recipe found (it's a custom text), create a text-only placeholder
                enrichedMenu[meal] = {
                    id: `custom-${Math.random()}`, // Temporary ID
                    name: recipeName,
                    ingredients: [],
                    instructions: [],
                    isCustom: true // Flag to indicate it's text only
                }
            }
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
        source: customMenu ? 'USER' : 'COACH', // Explicit source tracking
        isCompleted: dailyLog?.nutritionDone || false,
        date: targetDate
    }
}

/**
 * Récupère tous les jours de la phase active avec leurs informations.
 */
export async function getPhaseDays() {
    const user = await getOrCreateUser()
    if (!user) return []

    const activePhase = user.phases[0]
    if (!activePhase) return []

    const startDate = startOfDay(activePhase.startDate)
    const endDate = activePhase.plannedEndDate
        ? startOfDay(activePhase.plannedEndDate)
        : addDays(startDate, 7) // Default 7 days if no end date

    const days = []
    let currentDate = startDate
    let dayNumber = 1

    // Fetch completion status for all days in the range
    const logs = await prisma.dailyLog.findMany({
        where: {
            userId: user.id,
            date: {
                gte: startDate,
                lte: endDate || startDate // Fallback
            }
        }
    })

    const completedDates = new Set(logs.filter(l => l.nutritionDone).map(l => startOfDay(l.date).getTime()))

    while (isBefore(currentDate, endDate) || currentDate.getTime() === endDate.getTime()) {
        const time = startOfDay(currentDate).getTime()
        days.push({
            dayNumber,
            date: currentDate,
            label: `Jour ${dayNumber}`,
            isCompleted: completedDates.has(time)
        })
        currentDate = addDays(currentDate, 1)
        dayNumber++
    }

    return days
}

/**
 * Récupère les données de menu pour une semaine complète.
 */
import { NutritionEngine } from "../engines/nutrition-engine"

/**
 * Récupère les données de menu pour une semaine complète.
 */
export async function getWeekData(weekNumber: number = 1) {
    const user = await getOrCreateUser()
    if (!user) return null

    const activePhase = user.phases[0]
    if (!activePhase) return null

    const phaseStartDate = startOfDay(activePhase.startDate)
    const weekStartDate = addDays(phaseStartDate, (weekNumber - 1) * 7)

    // Check if WeeklyPlan exists
    let weeklyPlan = await prisma.weeklyPlan.findFirst({
        where: {
            userId: user.id,
            weekStart: weekStartDate
        }
    })

    // If NO plan exists, GENERATE one automatically
    if (!weeklyPlan) {
        console.log(`Generating new AI WeeklyPlan for User ${user.id} - Week ${weekNumber}`)
        const { generateUserWeeklyPlan } = await import("../ai/menu-generator")
        const result = await generateUserWeeklyPlan(user.id, false, weekStartDate)

        if (result.success && result.plan) {
            weeklyPlan = result.plan
        } else {
            return null // Fail gracefully
        }
    }

    const daysData = []
    for (let i = 0; i < 7; i++) {
        const currentDate = addDays(weekStartDate, i)
        // Check if override exists (UserCustomMenu)
        const customMenu = await prisma.userCustomMenu.findUnique({
            where: { userId_date: { userId: user.id, date: currentDate } }
        })

        let menuForDay = null

        if (customMenu) {
            menuForDay = customMenu.content
        } else if (weeklyPlan && weeklyPlan.content) {
            const content = weeklyPlan.content as any
            // Find day in generated content (assuming it's an array or indexed by dayIndex 0-6)
            const dayIndex = i
            if (content.days && Array.isArray(content.days)) {
                const dayData = content.days.find((d: any) => d.dayIndex === dayIndex)
                if (dayData) {
                    menuForDay = {
                        breakfast: dayData.breakfast,
                        lunch: dayData.lunch,
                        snack: dayData.snack,
                        dinner: dayData.dinner
                    }
                }
            }
        }

        // Enrich with Recipe Details (calling existing logic helper if needed, or largely duplicating the enrichment logic for now for speed)
        // Actually, getNutritionData already does this enrichment. 
        // OPTIMIZATION: We could just return the raw names here and let the frontend fetch details or enrich here.
        // Existing helper `getNutritionData` calls DB for each recipe.
        // Let's keep it simple: we reconstruct expected return format.
        // For efficiency, we should probably batch fetch recipes here if we wanted to be perfect.
        // But `getWeekData` in the original file called `getNutritionData` 7 times.
        // That logic was:
        /*
          const menuData = await getNutritionData(currentDate)
          daysData.push({ ... menu: menuData?.menu ... })
        */
        // Since `getNutritionData` ALSO falls back to WeeklyPlan, we can just ensure the WeeklyPlan EXISTS (which we did above) and then let `getNutritionData` do its job!
        // So actually, I don't need to manually parse the plan here if `getNutritionData` handles it.
        // I just need to make sure the plan exists.

        // Let's revert to calling getNutritionData, now that we know a plan exists!
        const menuData = await getNutritionData(currentDate)

        const dayNumber = Math.floor((currentDate.getTime() - phaseStartDate.getTime()) / (1000 * 60 * 60 * 24)) + 1

        daysData.push({
            dayNumber,
            date: currentDate,
            menu: menuData?.menu || null,
            isCompleted: menuData?.isCompleted || false
        })
    }

    return {
        weekNumber,
        weekStartDate,
        days: daysData,
        phase: activePhase.type
    }
}

/**
 * Récupère les données complètes de la phase active.
 */
export async function getPhaseData() {
    const user = await getOrCreateUser()
    if (!user) return null

    const activePhase = user.phases[0]
    if (!activePhase) return null

    const phaseStartDate = startOfDay(activePhase.startDate)
    const phaseEndDate = activePhase.plannedEndDate
        ? startOfDay(activePhase.plannedEndDate)
        : addDays(phaseStartDate, 84) // Default 12 weeks

    // Calculate total days and current day
    const totalDays = Math.floor((phaseEndDate.getTime() - phaseStartDate.getTime()) / (1000 * 60 * 60 * 24))
    const currentDay = Math.floor((new Date().getTime() - phaseStartDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
    const totalWeeks = Math.ceil(totalDays / 7)

    // Build weeks data
    const weeksData = []
    for (let weekNum = 1; weekNum <= totalWeeks; weekNum++) {
        const weekStart = addDays(phaseStartDate, (weekNum - 1) * 7)
        const weekEnd = addDays(weekStart, 6)

        // Count completed days in this week
        let completedDays = 0
        for (let i = 0; i < 7; i++) {
            const dayDate = addDays(weekStart, i)
            if (isBefore(dayDate, phaseEndDate) || dayDate.getTime() === phaseEndDate.getTime()) {
                const log = await prisma.dailyLog.findUnique({
                    where: {
                        userId_date: {
                            userId: user.id,
                            date: startOfDay(dayDate)
                        }
                    }
                })
                if (log?.nutritionDone) completedDays++
            }
        }

        // Check for J-48h lock: if week starts after active phase and we are > 48h away
        let isLocked = false
        if (activePhase.plannedEndDate && isAfter(weekStart, activePhase.plannedEndDate)) {
            const unlockTime = subHours(activePhase.plannedEndDate, 48)
            if (isBefore(new Date(), unlockTime)) {
                isLocked = true
            }
        }

        weeksData.push({
            weekNumber: weekNum,
            weekStart,
            weekEnd,
            completedDays,
            totalDays: 7,
            isLocked
        })
    }

    return {
        phase: activePhase.type,
        startDate: phaseStartDate,
        endDate: phaseEndDate,
        currentDay,
        totalDays,
        totalWeeks,
        weeks: weeksData,
        progressPercentage: Math.min(100, Math.round((currentDay / totalDays) * 100))
    }
}

/**
 * Récupère toutes les recettes avec filtres optionnels.
 * Si aucune recette n'existe pour la phase, génère automatiquement les recettes à partir des menus.
 */
export async function getRecipes(filters?: {
    phase?: PhaseType
    mealType?: string
    search?: string
    date?: string  // ISO date string - si fourni, récupère les recettes du menu de ce jour
}) {
    const user = await getOrCreateUser()
    if (!user) return []

    const activePhase = filters?.phase || user.phases[0]?.type || "DETOX"

    // Check if we have any recipes for this phase
    const existingRecipesCount = await prisma.recipe.count({
        where: { phase: activePhase.toString() }
    })

    // If no recipes exist for this phase, generate from user's menus
    if (existingRecipesCount === 0) {
        console.log(`[getRecipes] No recipes found for phase ${activePhase}. Triggering generation from menus...`)
        await generateRecipesFromUserMenus(user.id, activePhase.toString())
    }

    // Si une date est fournie, récupérer les noms des repas du menu de ce jour
    let dayMenuNames: string[] = []
    if (filters?.date) {
        const menuData = await getNutritionData(filters.date)
        if (menuData?.menu) {
            const menu = menuData.menu
            dayMenuNames = [
                menu.breakfast,
                menu.lunch,
                menu.snack,
                menu.dinner
            ].filter(Boolean)
        }
    }

    const where: any = {}

    // Filter by phase
    if (filters?.phase) {
        where.phase = filters.phase
    }

    // Filter by meal type
    if (filters?.mealType && filters.mealType !== "Tous") {
        where.mealType = filters.mealType
    }

    // Search filter
    if (filters?.search) {
        where.name = {
            contains: filters.search,
            mode: 'insensitive'
        }
    }

    // Filter by day menu names if date is provided
    if (dayMenuNames.length > 0) {
        where.name = {
            in: dayMenuNames
        }
    }

    const recipes = await prisma.recipe.findMany({
        where,
        orderBy: {
            name: 'asc'
        },
        take: 50 // Limit results
    })

    return recipes
}

/**
 * Génère les recettes manquantes à partir des menus de l'utilisateur.
 */
async function generateRecipesFromUserMenus(userId: string, phase: string) {
    try {
        // Récupérer tous les WeeklyPlans de l'utilisateur pour cette phase
        const weeklyPlans = await prisma.weeklyPlan.findMany({
            where: {
                userId,
                phase
            }
        })

        if (weeklyPlans.length === 0) {
            console.log(`[generateRecipesFromUserMenus] No weekly plans found for user ${userId}`)
            return
        }

        const mealItems: { name: string, mealType: string }[] = []

        const addMeal = (name: string, type: string) => {
            if (name && name !== "Repas Libre" && !mealItems.some(m => m.name === name)) {
                mealItems.push({ name, mealType: type })
            }
        }

        const extractMealsFromDay = (day: any) => {
            if (day.breakfast) addMeal(day.breakfast, "BREAKFAST")
            if (day.lunch) addMeal(day.lunch, "LUNCH")
            if (day.snack) addMeal(day.snack, "SNACK")
            if (day.dinner) addMeal(day.dinner, "DINNER")
        }

        // Extraire les noms de repas de tous les menus
        for (const plan of weeklyPlans) {
            const content = plan.content as any

            if (content.days && Array.isArray(content.days)) {
                content.days.forEach(extractMealsFromDay)
            } else {
                // Format alternatif avec les noms de jours
                const dayKeys = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
                dayKeys.forEach(key => {
                    if (content[key]) extractMealsFromDay(content[key])
                })
            }
        }

        if (mealItems.length > 0) {
            console.log(`[generateRecipesFromUserMenus] Generating ${mealItems.length} recipes for phase ${phase}`)
            const { batchGenerateRecipes } = await import("../ai/recipe-generator")
            await batchGenerateRecipes(mealItems, phase)
        }

    } catch (error) {
        console.error("[generateRecipesFromUserMenus] Error:", error)
    }
}

/**
 * Génère une liste de courses basée sur les menus de la semaine.
 */
export async function getShoppingList(weekNumber: number = 1) {
    const user = await getOrCreateUser()
    if (!user) return null

    const activePhase = user.phases[0]
    if (!activePhase) return null

    const phaseStartDate = startOfDay(activePhase.startDate)
    const weekStartDate = addDays(phaseStartDate, (weekNumber - 1) * 7)

    // Collect all unique recipes for the week
    const allRecipes: any[] = []

    for (let i = 0; i < 7; i++) {
        const currentDate = addDays(weekStartDate, i)
        const menuData = await getNutritionData(currentDate)

        if (menuData?.menu) {
            if (menuData.menu.breakfast) allRecipes.push(menuData.menu.breakfast)
            if (menuData.menu.lunch) allRecipes.push(menuData.menu.lunch)
            if (menuData.menu.snack) allRecipes.push(menuData.menu.snack)
            if (menuData.menu.dinner) allRecipes.push(menuData.menu.dinner)
            if (menuData.menu.snack_afternoon) allRecipes.push(menuData.menu.snack_afternoon)
        }
    }

    // Use the shopping engine
    const { generateShoppingListFromRecipes } = await import("../nutrition/shopping")
    const categories = generateShoppingListFromRecipes(allRecipes)

    // Count total items
    const totalItems = categories.reduce((acc, cat) => acc + cat.items.length, 0)

    return {
        weekNumber,
        weekStartDate,
        categories,
        totalItems
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

/**
 * Sauvegarde un menu personnalisé pour une date donnée.
 */
export async function saveCustomMenu(date: Date, content: any) {
    const user = await getOrCreateUser()
    if (!user) return null

    const targetDate = startOfDay(date)

    const result = await prisma.userCustomMenu.upsert({
        where: {
            userId_date: {
                userId: user.id,
                date: targetDate
            }
        },
        update: {
            content
        },
        create: {
            userId: user.id,
            date: targetDate,
            content
        }
    })

    revalidatePath("/nutrition")
    return result
}
