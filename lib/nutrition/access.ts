
import { SubscriptionTier, PhaseType } from "@prisma/client"
import { addDays, isAfter, isBefore, subHours, startOfDay, differenceInCalendarDays } from "date-fns"

// --- CONSTANTS ---

export const SUBSCRIPTION_PHASE_ACCESS: Record<SubscriptionTier, PhaseType[]> = {
    STANDARD_6: ["DETOX", "EQUILIBRE"],
    STANDARD_12: ["DETOX", "EQUILIBRE"],
    STANDARD_24: ["DETOX", "EQUILIBRE"],
    STANDARD_48: ["DETOX", "EQUILIBRE"],
    VIP_6: ["DETOX", "EQUILIBRE"],
    VIP_12: ["DETOX", "EQUILIBRE", "CONSOLIDATION"], // Assuming VIP 12 gets more
    VIP_24: ["DETOX", "EQUILIBRE", "CONSOLIDATION"],
    VIP_48: ["DETOX", "EQUILIBRE", "CONSOLIDATION", "ENTRETIEN"],
    VIP_PLUS_16: ["DETOX", "EQUILIBRE", "CONSOLIDATION", "ENTRETIEN"]
}

// --- TYPES ---

export interface AccessResult {
    allowed: boolean
    reason?: "FUTURE_PHASE" | "LOCKED_48H" | "SUBSCRIPTION_RESTRICTED" | "NO_ACTIVE_PHASE"
    unlockDate?: Date
}


// --- CORE LOGIC ---

/**
 * Vérifie si un utilisateur a le droit d'accéder à une phase donnée selon son abonnement.
 */
export function canAccessPhase(tier: SubscriptionTier, phase: PhaseType): boolean {
    const allowedPhases = SUBSCRIPTION_PHASE_ACCESS[tier] || []
    return allowedPhases.includes(phase)
}

/**
 * Vérifie si le contenu d'une date future est visible (Règle J-48h).
 * @param targetDate La date du menu demandé
 * @param activePhaseEndDate La date de fin planifiée de la phase actuelle
 */
export function isContentLocked(targetDate: Date, activePhaseEndDate?: Date | null): AccessResult {
    if (!activePhaseEndDate) {
        // Si pas de date de fin précisée, on assume que c'est ouvert ou que c'est la dernière phase
        return { allowed: true }
    }

    const now = new Date()
    const target = startOfDay(targetDate)
    const phaseEnd = startOfDay(activePhaseEndDate)

    // Si la date cible est APRES la fin de la phase actuelle, c'est une phase future
    if (isAfter(target, phaseEnd)) {
        // Règle J-48h : On débloque 48h avant la fin de la phase actuelle
        const unlockTime = subHours(activePhaseEndDate, 48)

        if (isBefore(now, unlockTime)) {
            return {
                allowed: false,
                reason: "LOCKED_48H",
                unlockDate: unlockTime
            }
        }
    }

    return { allowed: true }
}

/**
 * Calcule les jours restants avant la prochaine phase ou avant le déblocage.
 */
export function getPhaseProgress(startDate: Date, endDate?: Date | null) {
    if (!endDate) return null

    const totalDays = differenceInCalendarDays(endDate, startDate)
    const currentDay = differenceInCalendarDays(new Date(), startDate) + 1
    const daysRemaining = differenceInCalendarDays(endDate, new Date())

    return {
        totalDays,
        currentDay,
        daysRemaining,
        progressPercent: Math.min(100, Math.max(0, (currentDay / totalDays) * 100))
    }
}
