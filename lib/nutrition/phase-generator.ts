"use server"

import prisma from "@/lib/prisma"
import { SubscriptionTier, PhaseType } from "@prisma/client"
import { addDays, addWeeks } from "date-fns"

/**
 * Configuration des phases par type d'abonnement.
 * Chaque session est composée d'une phase DETOX suivie d'une phase ECE.
 */
interface PhaseConfig {
    sessionsCount: number
    detoxWeeks: number
    eceWeeks: number
    detoxType: PhaseType
}

const SUBSCRIPTION_PHASE_CONFIG: Record<SubscriptionTier, PhaseConfig> = {
    // Standard : 2 semaines DETOX + 4 semaines ECE par session
    STANDARD_6: { sessionsCount: 1, detoxWeeks: 2, eceWeeks: 4, detoxType: PhaseType.DETOX },
    STANDARD_12: { sessionsCount: 2, detoxWeeks: 2, eceWeeks: 4, detoxType: PhaseType.DETOX },
    STANDARD_24: { sessionsCount: 4, detoxWeeks: 2, eceWeeks: 4, detoxType: PhaseType.DETOX },
    STANDARD_48: { sessionsCount: 8, detoxWeeks: 2, eceWeeks: 4, detoxType: PhaseType.DETOX },

    // VIP : 3 semaines DETOX_VIP + 3 semaines ECE par session
    VIP_6: { sessionsCount: 1, detoxWeeks: 3, eceWeeks: 3, detoxType: PhaseType.DETOX_VIP },
    VIP_12: { sessionsCount: 2, detoxWeeks: 3, eceWeeks: 3, detoxType: PhaseType.DETOX_VIP },
    VIP_24: { sessionsCount: 4, detoxWeeks: 3, eceWeeks: 3, detoxType: PhaseType.DETOX_VIP },
    VIP_48: { sessionsCount: 8, detoxWeeks: 3, eceWeeks: 3, detoxType: PhaseType.DETOX_VIP },

    // VIP++ : Identique au VIP mais avec suivi personnalisé
    VIP_PLUS_16: { sessionsCount: 2, detoxWeeks: 3, eceWeeks: 3, detoxType: PhaseType.DETOX_VIP },
}

/**
 * Génère toutes les phases pour un utilisateur en fonction de son abonnement.
 * @param userId - ID de l'utilisateur
 * @param tier - Type d'abonnement
 * @param startDate - Date de début de l'abonnement (défaut: aujourd'hui)
 * @returns Les phases créées
 */
export async function generatePhasesForSubscription(
    userId: string,
    tier: SubscriptionTier,
    startDate: Date = new Date()
) {
    const config = SUBSCRIPTION_PHASE_CONFIG[tier]

    if (!config) {
        console.error(`[PhaseGenerator] Unknown subscription tier: ${tier}`)
        throw new Error(`Configuration de phase inconnue pour l'abonnement ${tier}`)
    }

    console.log(`[PhaseGenerator] Generating ${config.sessionsCount} sessions for user ${userId} (${tier})`)

    const phasesToCreate: Array<{
        userId: string
        type: PhaseType
        startDate: Date
        plannedEndDate: Date
        isActive: boolean
        sessionNumber: number
    }> = []

    let currentDate = startDate

    for (let session = 1; session <= config.sessionsCount; session++) {
        // Phase DETOX
        const detoxStart = currentDate
        const detoxEnd = addWeeks(detoxStart, config.detoxWeeks)

        phasesToCreate.push({
            userId,
            type: config.detoxType,
            startDate: detoxStart,
            plannedEndDate: addDays(detoxEnd, -1), // Fin = veille du début de la suivante
            isActive: session === 1, // Seule la première phase est active
            sessionNumber: session
        })

        // Phase ECE (Équilibre Culinaire Équilibré)
        const eceStart = detoxEnd
        const eceEnd = addWeeks(eceStart, config.eceWeeks)

        phasesToCreate.push({
            userId,
            type: PhaseType.ECE,
            startDate: eceStart,
            plannedEndDate: addDays(eceEnd, -1),
            isActive: false,
            sessionNumber: session
        })

        // Avancer la date pour la prochaine session
        currentDate = eceEnd
    }

    // Créer toutes les phases en batch
    const createdPhases = await prisma.userPhase.createMany({
        data: phasesToCreate.map(p => ({
            userId: p.userId,
            type: p.type,
            startDate: p.startDate,
            plannedEndDate: p.plannedEndDate,
            isActive: p.isActive
        }))
    })

    console.log(`[PhaseGenerator] Created ${createdPhases.count} phases for user ${userId}`)

    return createdPhases
}

/**
 * Récupère le résumé des phases d'un utilisateur.
 */
export async function getUserPhasesSummary(userId: string) {
    const phases = await prisma.userPhase.findMany({
        where: { userId },
        orderBy: { startDate: "asc" }
    })

    return {
        total: phases.length,
        active: phases.find(p => p.isActive),
        upcoming: phases.filter(p => p.startDate > new Date() && !p.isActive),
        completed: phases.filter(p => p.plannedEndDate && p.plannedEndDate < new Date())
    }
}

/**
 * Active la phase suivante pour un utilisateur (transition automatique).
 */
export async function activateNextPhase(userId: string) {
    const currentPhase = await prisma.userPhase.findFirst({
        where: { userId, isActive: true }
    })

    if (!currentPhase) {
        console.log(`[PhaseGenerator] No active phase found for user ${userId}`)
        return null
    }

    // Désactiver la phase actuelle
    await prisma.userPhase.update({
        where: { id: currentPhase.id },
        data: { isActive: false, actualEndDate: new Date() }
    })

    // Trouver la phase suivante
    const nextPhase = await prisma.userPhase.findFirst({
        where: {
            userId,
            startDate: { gt: currentPhase.startDate }
        },
        orderBy: { startDate: "asc" }
    })

    if (nextPhase) {
        await prisma.userPhase.update({
            where: { id: nextPhase.id },
            data: { isActive: true }
        })
        console.log(`[PhaseGenerator] Activated phase ${nextPhase.type} for user ${userId}`)
        return nextPhase
    }

    console.log(`[PhaseGenerator] No next phase found for user ${userId} - subscription may have ended`)
    return null
}
