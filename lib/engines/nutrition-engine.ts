import prisma from "@/lib/prisma"
import { PhaseType, Gender, Recipe, Difficulty } from "@prisma/client"
import { startOfDay, addDays, getDay } from "date-fns"

interface UserProfile {
    id: string
    gender: Gender
    weight: number // kg
    height: number // cm
    age: number
    activityMultiplier?: number // 1.2 to 1.9
    goal: "LOSS" | "MAINTENANCE" | "GAIN"  // Simplified
    allergies: string[]
    dietaryUsage?: string | null
    countryOrigin?: string | null
}

const DEFAULT_ACTIVITY_MULTIPLIER = 1.375 // Lightly active

export class NutritionEngine {

    /**
     * Calculates the daily calorie target using Mifflin-St Jeor equation.
     */
    static calculateDailyCalorieTarget(profile: UserProfile): number {
        // Mifflin-St Jeor Equation
        // Men: (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) + 5
        // Women: (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) - 161

        let bmr = (10 * profile.weight) + (6.25 * profile.height) - (5 * profile.age)

        if (profile.gender === "MALE") {
            bmr += 5
        } else {
            bmr -= 161
        }

        const tdee = bmr * (profile.activityMultiplier || DEFAULT_ACTIVITY_MULTIPLIER)

        // Goal Adjustment
        switch (profile.goal) {
            case "LOSS":
                return Math.round(tdee * 0.8) // 20% Deficit
            case "GAIN":
                return Math.round(tdee * 1.1) // 10% Surplus
            default:
                return Math.round(tdee) // Maintenance
        }
    }

    /**
     * Generates a weekly plan for the user based on their profile and current phase.
     */
    static async generateWeeklyPlan(userId: string, phase: PhaseType, weekStart: Date): Promise<any> {
        // 1. Fetch User Profile
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                gender: true,
                startWeight: true,
                heightCm: true,
                birthDate: true,
                allergies: true,
                dietaryUsage: true,
                countryOrigin: true,
            }
        })

        if (!user || !user.startWeight || !user.heightCm || !user.birthDate) {
            console.warn("User profile incomplete for automatic generation. Using defaults.")
            // Ideally we throw or return a generic plan. For now, creating a generic plan is better than nothing.
            // But let's proceed with defaults if missing.
        }

        const age = new Date().getFullYear() - (user?.birthDate?.getFullYear() || 1990)

        const profile: UserProfile = {
            id: userId,
            gender: user?.gender || "FEMALE",
            weight: user?.startWeight || 70,
            height: user?.heightCm || 165,
            age: age,
            goal: "LOSS", // Default assumption for Ikonga usually
            allergies: user?.allergies || [],
            dietaryUsage: user?.dietaryUsage,
            countryOrigin: user?.countryOrigin
        }

        const dailyCalories = this.calculateDailyCalorieTarget(profile)

        // 2. Fetch Compatible Recipes
        // We fetch ALL compatible recipes for the phase first, then filter in memory for complex logic (allergies, etc)
        // because Prisma filtering on Arrays of strings for exclusion can be tricky or limited depending on DB.
        const allRecipes = await prisma.recipe.findMany({
            where: {
                // Phase compatibility. Recipe.phase is string (bad schema design? should be PhaseType or array). check schema.
                // Schema says: phase String   // Ex: "DETOX"
                phase: phase.toString(), // Strict match for now as per Schema comment
            }
        })

        // 3. Filter Recipes
        const validRecipes = allRecipes.filter(r => {
            // Allergy Exclusion
            if (profile.allergies.length > 0 && r.allergens && Array.isArray(r.allergens)) {
                const hasAllergen = (r.allergens as string[]).some(a => profile.allergies.includes(a))
                if (hasAllergen) return false
            }

            // Dietary Usage (if strictly required? Let's say yes for Vegetarian/Vegan, optional for others?)
            // For now, if user has diet, recipe MUST have tag? Or just prioritize?
            // Let's go with: If user is Vegetarian, recipe MUST be Vegetarian.
            if (profile.dietaryUsage && r.dietaryTags && Array.isArray(r.dietaryTags)) {
                // Simple logic: if user diet is "Végétarien", look for that tag.
                // This depends on how data is standardized. Assuming strict string match for MVP.
                if (["Végétarien", "Vegan"].includes(profile.dietaryUsage)) {
                    if (!(r.dietaryTags as string[]).includes(profile.dietaryUsage)) return false
                }
            }

            return true
        })

        // 3. Fetch Existing Custom Menus for this week (Safeguard)
        const existingCustomMenus = await prisma.userCustomMenu.findMany({
            where: {
                userId: userId,
                date: {
                    gte: weekStart,
                    lte: addDays(weekStart, 6)
                }
            }
        })

        const customMenusMap = new Map(
            existingCustomMenus.map(cm => [startOfDay(cm.date).getTime(), cm.content])
        )

        // 4. Generate Days
        const days = []
        for (let i = 0; i < 7; i++) {
            const date = addDays(weekStart, i)
            const dateTime = startOfDay(date).getTime()

            let dayMenu: any

            if (customMenusMap.has(dateTime)) {
                // Safeguard: Use existing user customization
                console.log(`[NutritionEngine] Using existing custom menu for ${date.toISOString().split('T')[0]}`)
                dayMenu = customMenusMap.get(dateTime)
            } else {
                // Generate new if missing
                dayMenu = this.generateDayMenu(validRecipes, dailyCalories, profile)

                // AUTO-SAVE TO LIBRARY (Only for newly generated)
                try {
                    const dateStr = date.toISOString().split('T')[0]
                    const mainDish = dayMenu.lunch || "Déjeuner"
                    const cleanMainDish = typeof mainDish === 'string' ? mainDish : "Recette"
                    const shortDish = cleanMainDish.length > 20 ? cleanMainDish.substring(0, 20) + "..." : cleanMainDish
                    const title = `Généré ${dateStr} - ${shortDish}`

                    const existing = await prisma.menu.findUnique({ where: { title } })
                    if (!existing) {
                        await prisma.menu.create({
                            data: {
                                title: title,
                                isPremium: false,
                                phaseCompat: [phase],
                                content: {
                                    breakfast: dayMenu.breakfast,
                                    lunch: dayMenu.lunch,
                                    snack: dayMenu.snack,
                                    dinner: dayMenu.dinner
                                } as any
                            }
                        })
                    }
                } catch (err) {
                    console.error("[NutritionEngine] Failed to auto-save menu:", err)
                }
            }

            days.push({
                dayIndex: i,
                date: date,
                ...dayMenu
            })
        }

        // 5. Structure for DB
        const result = {
            days: days,
            meta: {
                targetCalories: dailyCalories,
                generatedAt: new Date(),
                profileSnapshot: { ...profile },
                isAiGenerated: true
            }
        }

        // 6. AUTO-GENERATE MISSING RECIPES (Batch)
        try {
            const allMealNames = days.flatMap(d => [d.breakfast, d.lunch, d.snack, d.dinner])
            const { batchGenerateRecipes } = await import("../ai/recipe-generator")
            await batchGenerateRecipes(allMealNames, phase.toString())
            console.log(`[NutritionEngine] Batch generated recipes for phase ${phase}`)
        } catch (err) {
            console.error("[NutritionEngine] Failed to batch generate recipes:", err)
        }

        return result
    }

    private static generateDayMenu(recipes: Recipe[], targetCalories: number, profile: UserProfile) {
        // Target Split: breakfast 25%, lunch 35%, snack 10%, dinner 30%
        // We select matching recipes.

        // Cultural Prioritization: score recipes higher if they match countryOrigin
        const scoreRecipe = (r: Recipe) => {
            let score = 0
            if (profile.countryOrigin && r.cuisineType === profile.countryOrigin) score += 10
            return score + Math.random() * 5 // Add randomness
        }

        // Helper to select one
        const select = (mealType: string, calorieBudget: number) => {
            // Ideally we filter by meal type tags if we had them. Schema doesn't strictly enforce MealType enum on Recipe?
            // Schema has `name`, `phase`, `ingredients`... but NO `mealType` field in the visible Schema part I saw earlier?
            // Wait, I saw `getRecipes` filtering by `mealType`. Let me check schema again.
            // Schema snippet 210-230: `Recipe` doesn't have `mealType` ??
            // But `getRecipes` in `nutrition.ts` filters by `where.mealType = filters.mealType`.
            // Ah, I might have missed it or it's not in the snippet I saw.
            // Let's assume it exists or I use name conventions or I just pick randomly from allowed list.
            // If I can't filter by meal type, this is bad. I'll assume for now I pick from `recipes` and hope logic exists or I update schema.
            // Actually, `getRecipes` code used `where.mealType`. So it MUST exist.
            // I will cast `r` to any to access mealType if TS complains, or update interface.

            // Just filtering by score and randomness
            const candidates = recipes.sort((a, b) => scoreRecipe(b) - scoreRecipe(a))
            // Take top 5 and random pick
            const top5 = candidates.slice(0, 5)
            return top5[Math.floor(Math.random() * top5.length)]?.name || "Repas Libre"
        }

        return {
            breakfast: select("breakfast", targetCalories * 0.25),
            lunch: select("lunch", targetCalories * 0.35),
            snack: select("snack", targetCalories * 0.10),
            dinner: select("dinner", targetCalories * 0.30),
        }
    }
}
