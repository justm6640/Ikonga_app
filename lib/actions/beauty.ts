"use server"

import { getOrCreateUser } from "./user"
import prisma from "@/lib/prisma"
import { SkinType, BeautyCategory, BeautyContentType, BeautyLevel, PhaseType, WorkoutGender, RecommendationStatus } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { BeautyEngine } from "@/lib/engines/beauty-engine"

/**
 * PROFIL UTILISATEUR
 */
export async function getBeautyProfile() {
    try {
        const user = await getOrCreateUser()
        if (!user) return null

        const profile = await prisma.beautyProfile.findUnique({
            where: { userId: user.id }
        })

        return profile
    } catch (error) {
        console.error("Error fetching beauty profile:", error)
        return null
    }
}

export async function upsertBeautyProfile(data: {
    skinType?: SkinType
    hairType?: string
    concerns?: string[]
}) {
    try {
        const user = await getOrCreateUser()
        if (!user) throw new Error("Unauthorized")

        const profile = await prisma.beautyProfile.upsert({
            where: { userId: user.id },
            update: {
                skinType: data.skinType,
                hairType: data.hairType,
                concerns: data.concerns
            },
            create: {
                userId: user.id,
                skinType: data.skinType,
                hairType: data.hairType,
                concerns: data.concerns
            }
        })

        revalidatePath("/beauty")
        return { success: true, profile }
    } catch (error) {
        console.error("Error updating beauty profile:", error)
        return { success: false, error: "Failed to update profile" }
    }
}

/**
 * CATALOGUE CONTENUS (ADMIN)
 */
export async function createBeautyContent(data: {
    title: string
    description: string
    category: BeautyCategory
    type: BeautyContentType
    duration?: number
    targetPhases: PhaseType[]
    targetGender: WorkoutGender
    level: BeautyLevel
}) {
    try {
        const user = await getOrCreateUser()
        if (user?.role !== "ADMIN") throw new Error("Forbidden")

        const content = await prisma.beautyContent.create({
            data
        })

        revalidatePath("/admin/beauty")
        return { success: true, content }
    } catch (error) {
        console.error("Error creating beauty content:", error)
        return { success: false, error: "Failed to create content" }
    }
}

export async function getBeautyLibrary() {
    try {
        const contents = await prisma.beautyContent.findMany({
            orderBy: { createdAt: 'desc' }
        })
        return contents
    } catch (error) {
        console.error("Error fetching beauty library:", error)
        return []
    }
}

/**
 * RECOMMANDATIONS UTILISATEUR
 */
export async function getBeautyRecommendations() {
    try {
        const user = await getOrCreateUser()
        if (!user) return []

        // 1. Obtenir les recommandations via le moteur
        const recommended = await BeautyEngine.getRecommendations(user.id)

        // 2. Vérifier si on doit créer des recommandations en DB pour le suivi
        // Pour l'instant, on retourne simplement les contenus filtrés
        return recommended
    } catch (error) {
        console.error("Error getting recommendations:", error)
        return []
    }
}

/**
 * RECETTES DIY
 */
export async function generateDIYRecipe(ingredients: string) {
    // MOCK AI GENERATION for now
    await new Promise(resolve => setTimeout(resolve, 1500))

    const recipes = [
        {
            title: "Masque Éclat Miel & Citron",
            instructions: "Mélangez 1 cuillère à soupe de miel avec quelques gouttes de citron. Appliquez sur le visage propre, laissez poser 15 min puis rincez à l'eau tiède.",
            ingredients: ["Miel", "Citron"]
        },
        {
            title: "Gommage Doux Sucre & Huile",
            instructions: "Mélangez une cuillère de sucre fin avec un peu d'huile d'olive. Massez doucement en cercles sur peau humide, puis rincez.",
            ingredients: ["Sucre", "Huile d'olive"]
        }
    ]

    return recipes[Math.floor(Math.random() * recipes.length)]
}

export async function saveBeautyRecipe(data: {
    title: string
    ingredients: string[]
    instructions: string
}) {
    try {
        const user = await getOrCreateUser()
        if (!user) throw new Error("Unauthorized")

        await prisma.beautyRecipe.create({
            data: {
                userId: user.id,
                title: data.title,
                ingredients: data.ingredients,
                instructions: data.instructions,
                isFavorite: true
            }
        })

        revalidatePath("/beauty")
        return { success: true }
    } catch (error) {
        console.error("Error saving recipe:", error)
        return { success: false }
    }
}
