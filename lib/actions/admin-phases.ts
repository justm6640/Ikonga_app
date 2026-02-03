"use server"

import { getOrCreateUser } from "./user"
import prisma from "@/lib/prisma"
import { PhaseType, SubscriptionTier, SessionStatus } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { PhaseEngine } from "@/lib/engines/phase-engine"

/**
 * INITIALISATION / RÉINITIALISATION DU CALENDRIER
 */
export async function initializeUserCalendar(userId: string, tier: SubscriptionTier, startDate: Date) {
    try {
        const admin = await getOrCreateUser()
        if (admin?.role !== "ADMIN") throw new Error("Forbidden")

        await PhaseEngine.generateCalendar(userId, tier, startDate)

        // Mettre à jour le tier de l'utilisateur en DB
        await prisma.user.update({
            where: { id: userId },
            data: {
                subscriptionTier: tier,
                planStartDate: startDate
            }
        })

        revalidatePath(`/admin/users/${userId}`)
        return { success: true }
    } catch (error) {
        console.error("Error initializing calendar:", error)
        return { success: false, error: "Failed to initialize calendar" }
    }
}

/**
 * RÉCUPÉRATION DU CALENDRIER
 */
export async function getUserPhaseSessions(userId: string) {
    try {
        const sessions = await prisma.phaseSession.findMany({
            where: { userId },
            orderBy: { sessionNumber: 'asc' }
        })
        return sessions
    } catch (error) {
        console.error("Error fetching sessions:", error)
        return []
    }
}

/**
 * FORCE LE CHANGEMENT DE PHASE
 */
export async function overridePhase(userId: string, phaseType: PhaseType) {
    try {
        const admin = await getOrCreateUser()
        if (admin?.role !== "ADMIN") throw new Error("Forbidden")

        // 1. Désactiver les phases actives actuelles de l'utilisateur
        await prisma.userPhase.updateMany({
            where: { userId, isActive: true },
            data: { isActive: false, actualEndDate: new Date() }
        })

        // 2. Créer la nouvelle phase forcée
        await prisma.userPhase.create({
            data: {
                userId,
                type: phaseType,
                isActive: true,
                isManualOverride: true,
                adminNote: "Forcé par l'admin"
            }
        })

        // 3. Noter l'action dans les logs admin
        await prisma.adminLog.create({
            data: {
                adminId: admin.id,
                targetUserId: userId,
                actionType: "PHASE_OVERRIDE",
                details: { newPhase: phaseType }
            }
        })

        revalidatePath("/admin/users")
        revalidatePath(`/admin/users/${userId}`)
        return { success: true }
    } catch (error) {
        console.error("Error overriding phase:", error)
        return { success: false }
    }
}
