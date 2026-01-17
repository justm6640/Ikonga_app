"use server"

import { getOrCreateUser } from "./user" // Using existing auth helper
import prisma from "@/lib/prisma"
import { SkinType } from "@prisma/client"
import { revalidatePath } from "next/cache"

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

export async function generateDIYRecipe(ingredients: string) {
    // MOCK AI GENERATION for now
    // In real implementation, this would call an LLM

    await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate generic delay

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
        },
        {
            title: "Cataplasme Apaisant Yaourt",
            instructions: "Appliquez une couche épaisse de yaourt nature frais sur le visage. Laissez agir 10 min pour calmer les rougeurs.",
            ingredients: ["Yaourt nature"]
        }
    ]

    // Simple random selection
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
