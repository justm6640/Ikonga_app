import prisma from "@/lib/prisma"
import { addDays, isAfter, startOfDay } from "date-fns"
import { PHASE_DURATIONS, CONSOLIDATION_DAYS_PER_KG, getDurationRule } from "@/config/phase-rules"
import { PhaseType } from "@prisma/client"

/**
 * Main engine function to evaluate and transition user phases.
 */
export async function runPhaseEngine() {
    const results = {
        processed: 0,
        transitions: [] as string[],
        errors: [] as string[]
    }

    try {
        // 1. Fetch active users with their current phase and latest weight
        // Focus on users without manual phase override
        const users = await prisma.user.findMany({
            where: {
                isActive: true,
                isPhaseManual: false
            },
            include: {
                phases: {
                    where: { isActive: true },
                    take: 1
                },
                dailyLogs: {
                    orderBy: { date: 'desc' },
                    take: 1
                }
            }
        })

        results.processed = users.length
        const now = new Date()

        for (const user of users) {
            try {
                const activePhase = user.phases[0]
                const lastLog = user.dailyLogs[0]
                const currentWeight = lastLog?.weight || user.startWeight || 0
                const pisi = user.pisi || 0

                // Logic Decision Tree

                // Rule A: Immediate move to CONSOLIDATION if weight target (PISI) reached
                if (currentWeight > 0 && pisi > 0 && currentWeight <= pisi && activePhase?.type !== PhaseType.CONSOLIDATION && activePhase?.type !== PhaseType.ENTRETIEN) {
                    await transitionPhase(user.id, activePhase?.id, PhaseType.CONSOLIDATION, user.startWeight || currentWeight, currentWeight, user.firstName || "Champion(ne)")
                    results.transitions.push(`${user.email}: -> CONSOLIDATION (PISI Reached)`)
                    continue
                }

                if (!activePhase) continue

                // Rule B: Switch from CONSOLIDATION to ENTRETIEN when duration ends
                if (activePhase.type === PhaseType.CONSOLIDATION && activePhase.plannedEndDate && isAfter(now, activePhase.plannedEndDate)) {
                    await transitionPhase(user.id, activePhase.id, PhaseType.ENTRETIEN, 0, 0, user.firstName || "Champion(ne)")
                    results.transitions.push(`${user.email}: -> ENTRETIEN (Consolidation Done)`)
                    continue
                }

                // Rule C: Alternate DETOX / EQUILIBRE cycles if time is up
                if ((activePhase.type === PhaseType.DETOX || activePhase.type === PhaseType.EQUILIBRE) && activePhase.plannedEndDate && isAfter(now, activePhase.plannedEndDate)) {
                    const nextType = activePhase.type === PhaseType.DETOX ? PhaseType.EQUILIBRE : PhaseType.DETOX
                    const ruleSet = getDurationRule(user.subscriptionTier)
                    const durationInDays = PHASE_DURATIONS[ruleSet][nextType]

                    await transitionPhase(user.id, activePhase.id, nextType, 0, 0, user.firstName || "Champion(ne)", durationInDays)
                    results.transitions.push(`${user.email}: -> ${nextType} (Cycle completed)`)
                }

            } catch (userError: any) {
                const msg = `Error for ${user.email}: ${userError.message}`
                console.error(msg)
                results.errors.push(msg)
            }
        }

        return results
    } catch (globalError: any) {
        console.error("Global Phase Engine Error:", globalError)
        throw globalError
    }
}

/**
 * Helper to perform atomic phase transition using a Prisma Transaction.
 */
async function transitionPhase(
    userId: string,
    oldPhaseId: string | undefined,
    nextType: PhaseType,
    startWeight: number,
    currentWeight: number,
    userName: string,
    customDurationDays?: number
) {
    let plannedEndDate: Date | null = null

    if (nextType === PhaseType.CONSOLIDATION) {
        const weightLost = startWeight - currentWeight
        // Rule: 10 days per kg lost. If negative or zero, default to 30 days.
        const days = weightLost > 0 ? Math.ceil(weightLost * CONSOLIDATION_DAYS_PER_KG) : 30
        plannedEndDate = addDays(new Date(), days)
    } else if (customDurationDays) {
        plannedEndDate = addDays(new Date(), customDurationDays)
    } else if (nextType === PhaseType.ENTRETIEN) {
        plannedEndDate = null // Unspecified duration
    }

    const notificationMessages = {
        [PhaseType.DETOX]: "C'est parti pour ta phase DÉTOX ! Purifie ton corps et boost ton énergie. 💪",
        [PhaseType.EQUILIBRE]: "Place à l'ÉQUILIBRE. On installe des habitudes durables ensemble. ✨",
        [PhaseType.CONSOLIDATION]: "Félicitations, tu as atteint ton but ! 🎉 On passe en CONSOLIDATION pour stabiliser tes résultats.",
        [PhaseType.ENTRETIEN]: "Tu es maintenant en ENTRETIEN. Bravo pour tout le chemin parcouru ! 💎"
    }

    return await prisma.$transaction([
        // 1. Close old phase if exists
        ...(oldPhaseId ? [
            prisma.userPhase.update({
                where: { id: oldPhaseId },
                data: { isActive: false, actualEndDate: new Date() }
            })
        ] : []),

        // 2. Create new phase
        prisma.userPhase.create({
            data: {
                userId,
                type: nextType,
                isActive: true,
                startDate: new Date(),
                plannedEndDate
            }
        }),

        // 3. Notify user
        prisma.notification.create({
            data: {
                userId,
                title: "Changement de Phase 🌀",
                message: `Bonjour ${userName}, ${notificationMessages[nextType]}`,
                type: 'SUCCESS',
                link: '/dashboard'
            }
        })
    ])
}
