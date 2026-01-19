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

            // Fix: Add 4 hours to both dates to push "23:00" timestamps (due to timezone) into the correct calendar day
            // This ensures safe diffing even if DB stores dates as UTC-1 (23:00 prev day)
            const safeTarget = addHours(targetDate, 4)
            const safeStart = addHours(weeklyPlan.weekStart, 4)
            const dayIndex = differenceInCalendarDays(safeTarget, safeStart)

            console.log(`[DEBUG] Target: ${targetDate.toISOString()}, SafeTarget: ${safeTarget.toISOString()}`)
            console.log(`[DEBUG] WeekStart: ${weeklyPlan.weekStart.toISOString()}, SafeStart: ${safeStart.toISOString()}`)
            console.log(`[DEBUG] Calculated DayIndex: ${dayIndex}`)

            // Find day in content.days array using dayIndex property if available, or fallback to array index
            // We search robustly to handle potential unsorted arrays or sparse data
            let dayData = null
            if (content.days && Array.isArray(content.days)) {
                dayData = content.days.find((d: any) => d.dayIndex === dayIndex)
                console.log(`[DEBUG] Found by dayIndex prop: ${!!dayData}`)
                // Fallback to direct index if dayIndex property is missing but array exists
                if (!dayData && content.days[dayIndex]) {
                    dayData = content.days[dayIndex]
                    console.log(`[DEBUG] Found by array index: ${!!dayData}`)
                }
            }

            if (dayData) {
                console.log(`[DEBUG] DayData found:`, dayData)
                finalMenu = dayData
                sourcePhase = weeklyPlan.phase as PhaseType
            } else {
                console.log(`[DEBUG] NO DayData found for index ${dayIndex}`)
            }
        } else {
            console.log(`[DEBUG] WeeklyPlan check failed. Plan exists: ${!!weeklyPlan}, isBefore check: ${weeklyPlan ? isBefore(targetDate, addDays(weeklyPlan.weekStart, 7)) : 'N/A'}`)
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

    while (isBefore(currentDate, endDate) || currentDate.getTime() === endDate.getTime()) {
        days.push({
            dayNumber,
            date: currentDate,
            label: `Jour ${dayNumber}`
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
        console.log(`Generating new WeeklyPlan for User ${user.id} - Week ${weekNumber}`)
        const generatedContent = await NutritionEngine.generateWeeklyPlan(user.id, activePhase.type, weekStartDate)

        weeklyPlan = await prisma.weeklyPlan.create({
            data: {
                userId: user.id,
                weekStart: weekStartDate,
                phase: activePhase.type,
                content: generatedContent
            }
        })
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

        weeksData.push({
            weekNumber: weekNum,
            weekStart,
            weekEnd,
            completedDays,
            totalDays: 7
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
 */
export async function getRecipes(filters?: {
    phase?: PhaseType
    mealType?: string
    search?: string
}) {
    const user = await getOrCreateUser()
    if (!user) return []

    const where: any = {}

    // Filter by phase
    if (filters?.phase) {
        where.allowedPhases = {
            has: filters.phase
        }
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
 * Génère une liste de courses basée sur les menus de la semaine.
 */
export async function getShoppingList(weekNumber: number = 1) {
    const user = await getOrCreateUser()
    if (!user) return null

    const activePhase = user.phases[0]
    if (!activePhase) return null

    const phaseStartDate = startOfDay(activePhase.startDate)
    const weekStartDate = addDays(phaseStartDate, (weekNumber - 1) * 7)

    // Collect all ingredients from the week's recipes
    const ingredientsMap = new Map<string, { name: string; quantity: string; category: string }>()

    for (let i = 0; i < 7; i++) {
        const currentDate = addDays(weekStartDate, i)
        const menuData = await getNutritionData(currentDate)

        if (menuData?.menu) {
            const recipes = [
                menuData.menu.breakfast,
                menuData.menu.snack,
                menuData.menu.lunch,
                menuData.menu.dinner
            ].filter(Boolean)

            for (const recipe of recipes) {
                if (recipe?.ingredients) {
                    // Parse ingredients (assuming they're stored as JSON array)
                    const ingredients = typeof recipe.ingredients === 'string'
                        ? JSON.parse(recipe.ingredients)
                        : recipe.ingredients

                    if (Array.isArray(ingredients)) {
                        ingredients.forEach((ing: any) => {
                            const key = ing.name?.toLowerCase() || ''
                            if (key && !ingredientsMap.has(key)) {
                                ingredientsMap.set(key, {
                                    name: ing.name || '',
                                    quantity: ing.quantity || '',
                                    category: ing.category || 'Autres'
                                })
                            }
                        })
                    }
                }
            }
        }
    }

    // Group by category
    const categorized: Record<string, Array<{ name: string; quantity: string }>> = {}

    ingredientsMap.forEach((ingredient) => {
        const category = ingredient.category || 'Autres'
        if (!categorized[category]) {
            categorized[category] = []
        }
        categorized[category].push({
            name: ingredient.name,
            quantity: ingredient.quantity
        })
    })

    // Sort categories and items
    const sortedCategories = Object.keys(categorized).sort()
    const result: Array<{ category: string; items: Array<{ name: string; quantity: string }> }> = []

    sortedCategories.forEach(category => {
        result.push({
            category,
            items: categorized[category].sort((a, b) => a.name.localeCompare(b.name))
        })
    })

    return {
        weekNumber,
        weekStartDate,
        categories: result,
        totalItems: ingredientsMap.size
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
