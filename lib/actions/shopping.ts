"use server"

import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"

/**
 * Aggregates ingredients from all recipes to build a shopping list.
 * In a real-world scenario, this would filter by the recipes actually 
 * linked to the user's current menu for the week.
 */
export async function getShoppingList() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || !user.email) {
        throw new Error("Non autorisé")
    }

    try {
        // 1. Get user and active phase (to know which recipes to aggregate eventually)
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

        // 2. Fetch recipes
        // For now, we fetch all recipes as requested.
        const recipes = await prisma.recipe.findMany()

        // 3. Aggregate and deduplicate ingredients
        const allIngredients = recipes.flatMap(recipe => recipe.ingredients)

        // Normalize strings (lowercase, trim) for better deduplication
        const uniqueIngredients = Array.from(new Set(
            allIngredients.map(item => item.trim())
        )).sort((a, b) => a.localeCompare(b, "fr"))

        return {
            ingredients: uniqueIngredients,
            phaseName: dbUser.phases?.[0]?.type || "Détox"
        }
    } catch (error) {
        console.error("Error generating shopping list:", error)
        return { ingredients: [], phaseName: "Détox", error: "Erreur lors de la génération" }
    }
}
