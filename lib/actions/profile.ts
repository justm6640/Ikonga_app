"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { Gender } from "@prisma/client"

interface UpdateProfileData {
    name?: string
    phone?: string
    height?: number
    startingWeight?: number
    targetWeight?: number
    gender?: Gender
    birthDate?: Date
}

export async function updateUserProfile(userId: string, data: UpdateProfileData) {
    try {
        if (!userId) {
            return { success: false, message: "ID utilisateur manquant" }
        }

        // 1. Validation de base
        if (data.height && (data.height < 50 || data.height > 300)) {
            return { success: false, message: "La taille doit être comprise entre 50 et 300 cm" }
        }
        if (data.startingWeight && (data.startingWeight < 20 || data.startingWeight > 500)) {
            return { success: false, message: "Le poids de départ semble incorrect" }
        }
        if (data.targetWeight && (data.targetWeight < 20 || data.targetWeight > 500)) {
            return { success: false, message: "Le poids cible semble incorrect" }
        }

        // 2. Préparation des données Prisma
        // On sépare le name en firstName/lastName si fourni
        let firstName, lastName;
        if (data.name) {
            const parts = data.name.trim().split(' ');
            firstName = parts[0];
            lastName = parts.slice(1).join(' ') || '';
        }

        // 3. Mise à jour via Prisma
        await prisma.user.update({
            where: { id: userId },
            data: {
                ...(firstName && { firstName }),
                ...(lastName !== undefined && { lastName }), // On update lastName seulement si name était fourni
                ...(data.phone && { phoneNumber: data.phone }),
                ...(data.height && { heightCm: data.height }),
                ...(data.startingWeight && { startWeight: data.startingWeight }),
                ...(data.targetWeight && { targetWeight: data.targetWeight }),
                ...(data.gender && { gender: data.gender }),
                ...(data.birthDate && { birthDate: data.birthDate }),
            }
        })

        // 4. Revalidation
        revalidatePath('/profile')
        revalidatePath('/dashboard')

        return { success: true, message: "Profil mis à jour avec succès" }

    } catch (error) {
        console.error("[UPDATE_USER_PROFILE]", error)
        return { success: false, message: "Erreur lors de la mise à jour du profil" }
    }
}
