"use server"

import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"

/**
 * Aggregates ingredients from all recipes to build a shopping list.
 * Also fetches the active menu to provide context to the user.
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
        const { startOfWeek } = await import("date-fns");
        const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });

        const weeklyPlan = await prisma.weeklyPlan.findUnique({
            where: {
                userId_weekStart: {
                    userId: dbUser.id,
                    weekStart: weekStart
                }
            }
        });

        // 3. Fetch recipes and aggregate ingredients
        const recipes = await prisma.recipe.findMany()
        const allIngredients = recipes.flatMap(recipe => recipe.ingredients as string[])

        // Normalize and deduplicate
        const uniqueIngredients = Array.from(new Set(
            allIngredients.map(item => item.trim())
        )).sort((a, b) => a.localeCompare(b, "fr"))

        return {
            ingredients: uniqueIngredients,
            phaseName: currentPhase,
            weeklyPlan: weeklyPlan,
            error: null
        }
    } catch (error) {
        console.error("Error generating shopping list:", error)
        return {
            ingredients: [],
            phaseName: "Détox",
            menu: null,
            error: "Erreur lors de la génération"
        }
    }
}
