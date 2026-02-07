"use server"

import prisma from "@/lib/prisma"
import { addDays, isBefore, differenceInDays } from "date-fns"
import { PhaseType } from "@prisma/client"

/**
 * Retourne les phases accessibles pour un utilisateur selon les règles IKONGA.
 * - Phase active : toujours visible
 * - Phase suivante : visible si J-2 ou moins
 * - Phases passées : toujours accessibles
 */
export async function getUserAccessiblePhases(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            phases: {
                orderBy: { startDate: 'asc' }
            },
            currentPhase: true
        }
    })

    if (!user) {
        throw new Error("Utilisateur introuvable")
    }

    const today = new Date()
    const phases = user.phases

    // Phase active
    let currentPhase = user.currentPhase

    // Si pas de currentPhase définie, prendre la phase active ou la première
    if (!currentPhase) {
        currentPhase = phases.find(p => p.isActive) || phases[0]
    }

    // Phases passées (celles dont la date de fin est avant aujourd'hui)
    const pastPhases = phases.filter(phase =>
        phase.actualEndDate
            ? isBefore(phase.actualEndDate, today)
            : phase.plannedEndDate && isBefore(phase.plannedEndDate, today)
    )

    // Phase suivante (celle qui vient après la phase active)
    const currentIndex = phases.findIndex(p => p.id === currentPhase?.id)
    const nextPhase = currentIndex >= 0 && currentIndex < phases.length - 1
        ? phases[currentIndex + 1]
        : null

    // Vérifier si la phase suivante est accessible (J-2)
    let upcomingPhase: typeof nextPhase | null = null
    if (nextPhase && nextPhase.startDate) {
        const daysUntilStart = differenceInDays(nextPhase.startDate, today)
        if (daysUntilStart <= 2) {
            upcomingPhase = nextPhase
        }
    }

    return {
        current: currentPhase,
        upcoming: upcomingPhase,
        past: pastPhases,
        all: phases
    }
}

/**
 * Vérifie si une phase spécifique est accessible pour un utilisateur.
 */
export async function isPhaseAccessible(userId: string, phaseId: string): Promise<boolean> {
    const accessible = await getUserAccessiblePhases(userId)

    return (
        accessible.current?.id === phaseId ||
        accessible.upcoming?.id === phaseId ||
        accessible.past.some(p => p.id === phaseId)
    )
}

/**
 * Active manuellement une phase spécifique (action coach).
 */
export async function setCurrentPhase(userId: string, phaseId: string, reason?: string) {
    const phase = await prisma.userPhase.findUnique({
        where: { id: phaseId }
    })

    if (!phase || phase.userId !== userId) {
        throw new Error("Phase introuvable")
    }

    // Désactiver toutes les phases
    await prisma.userPhase.updateMany({
        where: { userId },
        data: { isActive: false }
    })

    // Activer la phase ciblée
    await prisma.userPhase.update({
        where: { id: phaseId },
        data: {
            isActive: true,
            isManualOverride: true,
            adminNote: reason
        }
    })

    // Mettre à jour currentPhaseId de l'utilisateur
    await prisma.user.update({
        where: { id: userId },
        data: {
            currentPhaseId: phaseId,
            isPhaseManual: true,
            manualPhaseReason: reason
        }
    })

    return { success: true }
}

/**
 * Obtient tous les utilisateurs qui sont à J-2 d'une nouvelle phase.
 * Utilisé pour le cron job de notifications.
 */
export async function getUsersNearTransition(daysBeforeTransition: number = 2) {
    const targetDate = addDays(new Date(), daysBeforeTransition)
    const startOfDay = new Date(targetDate)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(targetDate)
    endOfDay.setHours(23, 59, 59, 999)

    // Trouver toutes les phases qui commencent à la date cible
    const upcomingPhases = await prisma.userPhase.findMany({
        where: {
            startDate: {
                gte: startOfDay,
                lte: endOfDay
            },
            isActive: false
        },
        include: {
            user: true
        }
    })

    return upcomingPhases.map(phase => ({
        userId: phase.userId,
        user: phase.user,
        nextPhase: phase
    }))
}

/**
 * Obtient un utilisateur avec toutes ses informations de phase.
 */
export async function getUserWithPhases(userId: string) {
    return await prisma.user.findUnique({
        where: { id: userId },
        include: {
            phases: {
                orderBy: { startDate: 'asc' }
            },
            currentPhase: true
        }
    })
}
