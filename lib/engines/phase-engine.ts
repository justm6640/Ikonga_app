import { PrismaClient, PhaseType, SubscriptionTier, SessionStatus } from "@prisma/client"
import { addDays, differenceInDays } from "date-fns"

const prisma = new PrismaClient()

export class PhaseEngine {
    /**
     * Génère le calendrier complet des phases pour un nouvel abonnement
     */
    static async generateCalendar(userId: string, tier: SubscriptionTier, startDate: Date) {
        let sessions: Array<{ sessionNumber: number; phaseType: PhaseType; durationDays: number }> = []

        switch (tier) {
            case SubscriptionTier.STANDARD_6:
                sessions = [
                    { sessionNumber: 1, phaseType: PhaseType.DETOX, durationDays: 14 },
                    { sessionNumber: 2, phaseType: PhaseType.EQUILIBRE, durationDays: 28 }
                ]
                break
            case SubscriptionTier.STANDARD_12:
                sessions = [
                    { sessionNumber: 1, phaseType: PhaseType.DETOX, durationDays: 14 },
                    { sessionNumber: 2, phaseType: PhaseType.EQUILIBRE, durationDays: 28 },
                    { sessionNumber: 3, phaseType: PhaseType.DETOX, durationDays: 14 },
                    { sessionNumber: 4, phaseType: PhaseType.EQUILIBRE, durationDays: 28 }
                ]
                break
            case SubscriptionTier.STANDARD_24:
            case SubscriptionTier.STANDARD_48:
                const totalWeeks = tier === SubscriptionTier.STANDARD_24 ? 24 : 48
                let currentWeek = 0
                let num = 1
                while (currentWeek < totalWeeks) {
                    sessions.push({ sessionNumber: num++, phaseType: PhaseType.DETOX, durationDays: 14 })
                    currentWeek += 2
                    if (currentWeek < totalWeeks) {
                        sessions.push({ sessionNumber: num++, phaseType: PhaseType.EQUILIBRE, durationDays: 28 })
                        currentWeek += 4
                    }
                }
                break
            case SubscriptionTier.VIP_12:
                // VIP 12: 3w Detox + 3w Equilibre
                sessions = [
                    { sessionNumber: 1, phaseType: PhaseType.DETOX_VIP, durationDays: 21 },
                    { sessionNumber: 2, phaseType: PhaseType.EQUILIBRE, durationDays: 21 },
                    { sessionNumber: 3, phaseType: PhaseType.DETOX_VIP, durationDays: 21 },
                    { sessionNumber: 4, phaseType: PhaseType.EQUILIBRE, durationDays: 21 }
                ]
                break
            case SubscriptionTier.VIP_PLUS_16:
                // VIP++ 16: 3w Detox + 3w Equilibre (repeated) + 4w Equilibre offered
                sessions = [
                    { sessionNumber: 1, phaseType: PhaseType.DETOX_VIP, durationDays: 21 },
                    { sessionNumber: 2, phaseType: PhaseType.EQUILIBRE, durationDays: 21 },
                    { sessionNumber: 3, phaseType: PhaseType.DETOX_VIP, durationDays: 21 },
                    { sessionNumber: 4, phaseType: PhaseType.EQUILIBRE, durationDays: 21 },
                    { sessionNumber: 5, phaseType: PhaseType.EQUILIBRE, durationDays: 28 }
                ]
                break
        }

        // Création des entrées dans la DB
        let currentStartDate = startDate
        const phaseSessions = []

        for (const s of sessions) {
            const endDate = addDays(currentStartDate, s.durationDays)
            phaseSessions.push({
                userId,
                sessionNumber: s.sessionNumber,
                phaseType: s.phaseType,
                startDate: currentStartDate,
                endDate: endDate,
                status: SessionStatus.UPCOMING
            })
            currentStartDate = endDate
        }

        // Nettoyage des sessions existantes avant d'ajouter les nouvelles
        await prisma.phaseSession.deleteMany({ where: { userId } })

        return await prisma.phaseSession.createMany({
            data: phaseSessions
        })
    }

    /**
     * Vérifie si le PISI est atteint (2 pesées consécutives <= PISI à 48h d'écart)
     */
    static async checkPisiStatus(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { weighIns: { orderBy: { date: 'desc' }, take: 2 } }
        })

        if (!user || !user.pisi || user.weighIns.length < 2) return false

        const [latest, previous] = user.weighIns
        const pisi = user.pisi

        // Condition 1: Les deux pesées sont sous le PISI
        const underPisi = latest.weight <= pisi && previous.weight <= pisi

        // Condition 2: Intervalle suffisant (ex: 48h) pour éviter les fluctuations d'eau
        const dayDiff = differenceInDays(latest.date, previous.date)
        const timeValid = Math.abs(dayDiff) >= 2

        return underPisi && timeValid
    }

    /**
     * Calcule la durée de consolidation : 10 jours par kilo perdu
     */
    static calculateConsolidationDays(startWeight: number, currentWeight: number) {
        const lost = startWeight - currentWeight
        return Math.max(0, Math.ceil(lost * 10))
    }

    /**
     * Détermine la phase actuelle d'un utilisateur
     */
    static async resolveCurrentPhase(userId: string) {
        const now = new Date()

        // 1. Vérifier si une phase manuelle est active
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { isPhaseManual: true, pisiReachedAt: true, startWeight: true }
        })

        // 2. Si PISI atteint, on est soit en Consolidation soit en Entretien
        if (user?.pisiReachedAt) {
            // Logique de consolidation ici...
            // Pour simplifier, on cherche la session active
        }

        const activeSession = await prisma.phaseSession.findFirst({
            where: {
                userId,
                startDate: { lte: now },
                endDate: { gte: now }
            }
        })

        return activeSession || null
    }
}
