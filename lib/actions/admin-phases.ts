"use server"

import prisma from "@/lib/prisma"
import { PhaseType, SubscriptionTier } from "@prisma/client"
import { revalidatePath } from "next/cache"

/**
 * Toggles the manual phase override for a user.
 */
export async function toggleManualMode(userId: string, isManual: boolean, reason?: string) {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: {
                isPhaseManual: isManual,
                manualPhaseReason: reason ?? null
            }
        })

        revalidatePath(`/admin/users/${userId}`)
        return { success: true }
    } catch (error) {
        console.error("Error toggling manual mode:", error)
        return { error: "Erreur lors de la modification du mode manuel" }
    }
}

/**
 * Forces a specific phase for a user and enables manual mode.
 */
export async function forcePhase(userId: string, newPhase: PhaseType) {
    try {
        const now = new Date()

        await prisma.$transaction(async (tx) => {
            // 1. Deactivate current active phase
            await tx.userPhase.updateMany({
                where: { userId, isActive: true },
                data: { isActive: false, actualEndDate: now }
            })

            // 2. Create new manual phase
            await tx.userPhase.create({
                data: {
                    userId,
                    type: newPhase,
                    startDate: now,
                    isActive: true,
                    isManualOverride: true,
                    adminNote: "Forçage manuel par l'administrateur"
                }
            })

            // 3. Update user global state
            await tx.user.update({
                where: { id: userId },
                data: {
                    isPhaseManual: true,
                    // Note: We don't necessarily update subEndDate here unless requested
                }
            })
        })

        revalidatePath(`/admin/users/${userId}`)
        revalidatePath("/admin/users")
        return { success: true }
    } catch (error) {
        console.error("Error forcing phase:", error)
        return { error: "Erreur lors du forçage de la phase" }
    }
}

/**
 * Updates a user's subscription tier.
 */
export async function updateSubscriptionTier(userId: string, newTier: SubscriptionTier) {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: { subscriptionTier: newTier }
        })

        revalidatePath(`/admin/users/${userId}`)
        revalidatePath("/admin/users")
        return { success: true }
    } catch (error) {
        console.error("Error updating subscription tier:", error)
        return { error: "Erreur lors de la mise à jour de l'abonnement" }
    }
}
