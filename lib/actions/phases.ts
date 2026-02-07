"use server"

import prisma from "@/lib/prisma"
import { NotificationEngine } from "@/lib/engines/notification-engine"
import { awardBadge } from "./gamification"
import { revalidatePath } from "next/cache"
import { addDays } from "date-fns"

/**
 * Main logic for PISI Achievement
 * Transition from DETOX/EQUILIBRE to CONSOLIDATION
 */
export async function handlePISIAchievement(userId: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { phases: { where: { isActive: true } } }
        });

        if (!user) return;

        const activePhase = user.phases[0];
        if (!activePhase || activePhase.type === 'CONSOLIDATION' || activePhase.type === 'ENTRETIEN') {
            return; // Already in consolidation or further
        }

        // 1. Deactivate current phase
        await prisma.userPhase.update({
            where: { id: activePhase.id },
            data: { isActive: false, actualEndDate: new Date() }
        });

        // 2. Create CONSOLIDATION phase (21 days)
        const consolidation = await prisma.userPhase.create({
            data: {
                userId,
                type: 'CONSOLIDATION',
                startDate: new Date(),
                plannedEndDate: addDays(new Date(), 21),
                isActive: true
            }
        });

        // 3. Update User currentPhaseId
        await prisma.user.update({
            where: { id: userId },
            data: { currentPhaseId: consolidation.id }
        });

        // 4. Award Badge
        await awardBadge(userId, "PISI_ACHIEVED");

        // 5. Send Notification
        await NotificationEngine.send({
            userId,
            title: "🏆 PISI ATTEINT ! Félicitations !",
            message: "Tu as atteint ton Poids de Santé Idéal. Tu passes maintenant en phase de CONSOLIDATION pour 21 jours. Rosy est tellement fière de toi ! ✨",
            category: "FOLLOWUP",
            priority: "HIGH",
            type: "SUCCESS",
            link: "/dashboard"
        });

        revalidatePath("/dashboard");
    } catch (error) {
        console.error("[handlePISIAchievement] Error:", error);
    }
}
