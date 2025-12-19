"use server"

import prisma from "@/lib/prisma"

/**
 * Fetches a recipe by its exact title or a partial match.
 */
export async function getRecipeByTitle(title: string) {
    if (!title) return null

    try {
        // Try exact match first
        let recipe = await prisma.recipe.findUnique({
            where: { title }
        })

        // If no exact match, try a partial match (case insensitive)
        if (!recipe) {
            recipe = await prisma.recipe.findFirst({
                where: {
                    title: {
                        contains: title,
                        mode: 'insensitive'
                    }
                }
            })
        }

        return recipe
    } catch (error) {
        console.error("Error fetching recipe by title:", error)
        return null
    }
}

/**
 * Fetches a recipe by its ID.
 */
export async function getRecipeById(id: string) {
    if (!id) return null

    try {
        return await prisma.recipe.findUnique({
            where: { id }
        })
    } catch (error) {
        console.error("Error fetching recipe by id:", error)
        return null
    }
}
