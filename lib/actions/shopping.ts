"use server"

import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"

/**
 * Aggregates ingredients from all recipes to build a shopping list.
 * Groups identical items and sums quantities where possible.
 */
export async function getShoppingList() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || !user.email) {
        throw new Error("Non autorisé")
    }

    try {
        // 1. Get user and active phase
        const dbUser = await prisma.user.findUnique({
            where: { email: user.email },
            include: {
                phases: {
                    where: { isActive: true },
                    take: 1
                }
            }
        })

        if (!dbUser) throw new Error("Utilisateur non trouvé")

        const currentPhase = dbUser.phases?.[0]?.type || "DETOX"

        // 2. Fetch the WeeklyPlan for this user for the current week
        const { startOfWeek, startOfDay } = await import("date-fns");
        const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });

        const weeklyPlan = await prisma.weeklyPlan.findUnique({
            where: {
                userId_weekStart: {
                    userId: dbUser.id,
                    weekStart: startOfDay(weekStart)
                }
            }
        });

        if (!weeklyPlan || !weeklyPlan.content) {
            return {
                categories: [],
                phaseName: currentPhase,
                weeklyPlan: null,
                error: null
            }
        }

        const content = weeklyPlan.content as any
        const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        const mealKeys = ["breakfast", "lunch", "dinner", "snack"]

        // Collect all recipe names from the week
        const recipeNames = new Set<string>()
        dayNames.forEach(day => {
            const dayMenu = content[day] || {}
            mealKeys.forEach(meal => {
                const recipeName = dayMenu[meal]
                if (recipeName) recipeNames.add(recipeName)
            })
        })

        // Fetch all unique recipes
        const recipes = await prisma.recipe.findMany({
            where: {
                name: { in: Array.from(recipeNames) },
                phase: currentPhase
            }
        })

        // 3. Aggregate and Parse Ingredients
        // Map to store: name -> unit -> { quantity, category }
        const ingredientsMap: Record<string, Record<string, { quantity: number, category: string }>> = {}

        const getCategory = (name: string) => {
            const lower = name.toLowerCase();
            if (lower.match(/poulet|boeuf|viande|dinde|lardons|jambon|steak|haché|porc|veau/)) return "BOUCHERIE & VIANDES";
            if (lower.match(/saumon|cabillaud|poisson|crevettes|thon|daurade|fruits de mer|truite|colin/)) return "POISSONNERIE";
            if (lower.match(/pomme|banane|carotte|épinard|avocat|citron|oignon|tomate|salade|courgette|brocoli|légume|fruit|ail|persil|herbe/)) return "FRUITS & LÉGUMES";
            if (lower.match(/riz|pâtes|quinoa|lentilles|pois|farine|sucre|huile|vinaigre|sel|poivre|épice|couscous|miel|pain|galette/)) return "ÉPICERIE";
            if (lower.match(/yaourt|lait|fromage|crème|beurre|oeuf|œuf|feta|mozzarella/)) return "CRÉMERIE";
            return "DIVERS";
        }

        const parseIng = (ing: string) => {
            // Match: "150g de riz", "2 oeufs", "un demi citron" (simple version)
            const regex = /^([\d,.]+)\s*([a-zA-Z]*)\s+(?:de\s+)?(.*)$/i;
            const match = ing.match(regex);

            if (match) {
                return {
                    quantity: parseFloat(match[1].replace(',', '.')),
                    unit: match[2].toLowerCase(),
                    name: match[3].trim()
                };
            }
            return { quantity: 0, unit: "", name: ing.trim() };
        }

        recipes.forEach(recipe => {
            const ingredients = Array.isArray(recipe.ingredients)
                ? recipe.ingredients
                : (typeof recipe.ingredients === 'string' ? JSON.parse(recipe.ingredients) : [])

            ingredients.forEach((ing: string) => {
                const { quantity, unit, name } = parseIng(ing)
                const category = getCategory(name)

                if (!ingredientsMap[name]) ingredientsMap[name] = {}
                if (!ingredientsMap[name][unit]) {
                    ingredientsMap[name][unit] = { quantity: 0, category }
                }
                ingredientsMap[name][unit].quantity += quantity
            })
        })

        // 4. Format into Requested Structure
        // { categories: { name: string, items: { name: string, amount: string, checked: boolean }[] }[] }
        const categoryGroups: Record<string, any[]> = {}

        Object.entries(ingredientsMap).forEach(([name, units]) => {
            Object.entries(units).forEach(([unit, data]) => {
                if (!categoryGroups[data.category]) categoryGroups[data.category] = []

                const amount = data.quantity > 0 ? `${data.quantity}${unit}` : ""
                categoryGroups[data.category].push({
                    name: name,
                    amount: amount,
                    checked: false
                })
            })
        })

        const resultCategories = Object.entries(categoryGroups)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([name, items]) => ({
                name,
                items: items.sort((a, b) => a.name.localeCompare(b.name))
            }))

        return {
            categories: resultCategories,
            phaseName: currentPhase,
            weeklyPlan: weeklyPlan,
            error: null
        }
    } catch (error) {
        console.error("Error generating shopping list:", error)
        return {
            categories: [],
            phaseName: "Détox",
            weeklyPlan: null,
            error: "Erreur lors de la génération"
        }
    }
}
