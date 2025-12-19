import prisma from "@/lib/prisma";
import { PhaseType, NotifCategory } from "@prisma/client";
import { differenceInWeeks } from "date-fns";
import { getExpectedPhaseAtWeek } from "@/config/plans";

export async function processDailyTransitions() {
    console.log("Starting daily phase transitions processing (Blueprint Mode)...");

    const users = await prisma.user.findMany({
        where: { isActive: true },
        include: {
            phases: {
                where: { isActive: true },
                take: 1,
            },
            dailyLogs: {
                orderBy: { date: 'desc' },
                take: 1,
            }
        },
    });

    let processedCount = 0;
    let updatedCount = 0;

    const now = new Date();

    for (const user of users) {
        processedCount++;
        const activePhase = user.phases[0];

        // PRIORITAIRE: Si le mode manuel est activé, on ne recalcule rien.
        if (user.isPhaseManual || !activePhase) continue;

        const startDate = user.planStartDate || user.createdAt;
        const weekIndex = differenceInWeeks(now, startDate);
        const tier = user.subscriptionTier;

        // Use a fallback for weight if no log exists
        const currentWeight = user.dailyLogs[0]?.weight ?? user.startWeight ?? 0;
        const pisi = user.pisi || user.targetWeight || 0;

        let nextPhaseType: PhaseType | null = null;

        // 1. Determine Expected Phase from Blueprint
        const expectedPhase = getExpectedPhaseAtWeek(tier, weekIndex) as PhaseType;

        // 2. Specialized Logic for Switching to CONSOLIDATION
        // Rule: We switch to Consolidation only if PISI is reached
        if (currentWeight <= pisi && activePhase.type === PhaseType.EQUILIBRE) {
            // Force transition to Consolidation if PISI achieved during Equilibre
            nextPhaseType = PhaseType.CONSOLIDATION;
        }
        // Otherwise, follow the blueprint if the phase should change
        else if (activePhase.type !== expectedPhase) {
            // Only transition if the expected phase is different and we haven't reached consolidation yet
            // (Unless we need a loop back, which getExpectedPhaseAtWeek should handle)
            nextPhaseType = expectedPhase;
        }

        // 3. Execute Transition
        if (nextPhaseType && nextPhaseType !== activePhase.type) {
            console.log(`Transitioning user ${user.email} from ${activePhase.type} to ${nextPhaseType} (Week ${weekIndex})`);

            await prisma.$transaction(async (tx) => {
                // Deactivate current phase
                await tx.userPhase.update({
                    where: { id: activePhase.id },
                    data: {
                        isActive: false,
                        actualEndDate: now
                    },
                });

                // Create new phase
                await tx.userPhase.create({
                    data: {
                        userId: user.id,
                        type: nextPhaseType!,
                        startDate: now,
                        isActive: true,
                    },
                });

                // Create Notification
                const phaseNames: Record<PhaseType, string> = {
                    [PhaseType.DETOX]: "Détox",
                    [PhaseType.EQUILIBRE]: "Équilibre",
                    [PhaseType.CONSOLIDATION]: "Consolidation (Stabilisation)",
                    [PhaseType.ENTRETIEN]: "Entretien (Liberté)",
                };

                await tx.notification.create({
                    data: {
                        userId: user.id,
                        title: "Nouvelle Phase ! 🎉",
                        body: `Félicitations ! Votre profil IKONGA évolue. Vous passez aujourd'hui en phase ${phaseNames[nextPhaseType!]}.`,
                        category: NotifCategory.PROGRAM,
                    },
                });
            });

            updatedCount++;
        }
    }

    return {
        processed: processedCount,
        updated: updatedCount,
    };
}
