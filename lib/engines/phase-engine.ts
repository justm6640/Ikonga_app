import { PrismaClient, PhaseType, SubscriptionTier, SessionStatus } from "@prisma/client"
import { addDays, differenceInDays } from "date-fns"
import { NotificationEngine } from "./notification-engine"

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
                sessions = [
                    { sessionNumber: 1, phaseType: PhaseType.DETOX_VIP, durationDays: 21 },
                    { sessionNumber: 2, phaseType: PhaseType.EQUILIBRE, durationDays: 21 },
                    { sessionNumber: 3, phaseType: PhaseType.DETOX_VIP, durationDays: 21 },
                    { sessionNumber: 4, phaseType: PhaseType.EQUILIBRE, durationDays: 21 }
                ]
                break
            case SubscriptionTier.VIP_PLUS_16:
                sessions = [
                    { sessionNumber: 1, phaseType: PhaseType.DETOX_VIP, durationDays: 21 },
                    { sessionNumber: 2, phaseType: PhaseType.EQUILIBRE, durationDays: 21 },
                    { sessionNumber: 3, phaseType: PhaseType.DETOX_VIP, durationDays: 21 },
                    { sessionNumber: 4, phaseType: PhaseType.EQUILIBRE, durationDays: 21 },
                    { sessionNumber: 5, phaseType: PhaseType.EQUILIBRE, durationDays: 28 }
                ]
                break
        }

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

        await prisma.phaseSession.deleteMany({ where: { userId } })

        return await prisma.phaseSession.createMany({
            data: phaseSessions
        })
    }

    /**
     * Vérifie si le PISI est atteint
     */
    static async checkPisiStatus(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { weighIns: { orderBy: { date: 'desc' }, take: 2 } }
        })

        if (!user || !user.pisi || user.weighIns.length < 2) return false

        const [latest, previous] = user.weighIns
        const pisi = user.pisi

        const underPisi = latest.weight <= pisi && previous.weight <= pisi
        const dayDiff = differenceInDays(latest.date, previous.date)
        const timeValid = Math.abs(dayDiff) >= 2

        return underPisi && timeValid
    }

    /**
     * Calcule la durée de consolidation
     */
    static calculateConsolidationDays(startWeight: number, currentWeight: number) {
        const lost = startWeight - currentWeight
        return Math.max(0, Math.ceil(lost * 10))
    }

    /**
     * Détermine la phase actuelle
     */
    static async resolveCurrentPhase(userId: string) {
        const now = new Date()

        const activeSession = await prisma.phaseSession.findFirst({
            where: {
                userId,
                startDate: { lte: now },
                endDate: { gte: now }
            }
        })

        return activeSession || null
    }

    /**
     * Vérifie et envoie les notifications de phase (J-48h et Jour J)
     */
    static async checkAndSendPhaseNotifications(userId: string) {
        const now = new Date()
        const startOfToday = new Date(new Date(now).setHours(0, 0, 0, 0))
        const endOfToday = new Date(new Date(now).setHours(23, 59, 59, 999))

        const startingToday = await prisma.phaseSession.findFirst({
            where: {
                userId,
                startDate: { gte: startOfToday, lte: endOfToday }
            }
        })

        if (startingToday) {
            await NotificationEngine.send({
                userId,
                title: `🌱 Bienvenue en phase ${startingToday.phaseType}`,
                message: "Ton corps est prêt. On avance ensemble.",
                category: "PHASE",
                priority: "HIGH",
                type: "SUCCESS"
            })
        }

        const inTwoDays = addDays(new Date(), 2)
        const startOfInTwoDays = new Date(new Date(inTwoDays).setHours(0, 0, 0, 0))
        const endOfInTwoDays = new Date(new Date(inTwoDays).setHours(23, 59, 59, 999))

        const approachingPhase = await prisma.phaseSession.findFirst({
            where: {
                userId,
                startDate: { gte: startOfInTwoDays, lte: endOfInTwoDays }
            }
        })

        if (approachingPhase) {
            await NotificationEngine.send({
                userId,
                title: "🔔 Ta prochaine phase arrive bientôt",
                message: `Prépare-toi doucement pour la phase ${approachingPhase.phaseType}. On t'expliquera tout bientôt.`,
                category: "PHASE",
                priority: "HIGH",
                type: "INFO"
            })
        }
    }
}
