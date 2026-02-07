"use server"

import { getOrCreateUser } from "./user"
import prisma from "@/lib/prisma"
import { Role } from "@prisma/client"
import { redirect } from "next/navigation"

/**
 * Verifies if the current user is an ADMIN.
 * If not, redirects to the main dashboard or access denied.
 */
export async function checkAdminAccess() {
    try {
        const user = await getOrCreateUser()
        if (!user || user.role !== Role.ADMIN) {
            redirect("/dashboard")
        }
        return user
    } catch (error) {
        console.error("[Admin] Access check failed:", error)
        redirect("/dashboard")
    }
}

export async function getAdminDashboardStats() {
    try {
        await checkAdminAccess()

        const [
            totalActive,
            usersByPhase, // Group logic requires raw query or manual aggregation, simplified here for now
            pendingAlertsCount
        ] = await Promise.all([
            prisma.user.count({ where: { isActive: true, role: "USER" } }),
            prisma.userPhase.findMany({
                where: { isActive: true },
                select: { type: true }
            }),
            prisma.adminAlert.count({ where: { status: "PENDING" } })
        ])

        // Aggregate Phase stats
        const phaseDistribution = {
            DETOX: usersByPhase.filter(p => p.type === "DETOX").length,
            EQUILIBRE: usersByPhase.filter(p => p.type === "EQUILIBRE").length,
            CONSOLIDATION: usersByPhase.filter(p => p.type === "CONSOLIDATION").length,
            ENTRETIEN: usersByPhase.filter(p => p.type === "ENTRETIEN").length,
        }

        return {
            totalActive,
            phaseDistribution,
            pendingAlertsCount
        }
    } catch (error) {
        console.error("[Admin] Dashboard stats fetch failed:", error)
        return {
            totalActive: 0,
            phaseDistribution: {
                DETOX: 0,
                EQUILIBRE: 0,
                CONSOLIDATION: 0,
                ENTRETIEN: 0,
            },
            pendingAlertsCount: 0
        }
    }
}

export async function getAdminAlerts() {
    try {
        await checkAdminAccess()

        return await prisma.adminAlert.findMany({
            where: { status: "PENDING" },
            include: { user: true },
            orderBy: { createdAt: "desc" },
            take: 20
        })
    } catch (error) {
        console.error("[Admin] Alerts fetch failed:", error)
        return []
    }
}

export async function createContentItem(data: any) {
    await checkAdminAccess()

    return await prisma.contentLibrary.create({
        data: {
            ...data,
            isActive: true
        }
    })
}

export async function getNewSubscribers() {
    try {
        await checkAdminAccess();
        const { subDays } = await import("date-fns");
        const sevenDaysAgo = subDays(new Date(), 7);

        const users = await prisma.user.findMany({
            where: {
                OR: [
                    { hasCompletedOnboarding: false },
                    { createdAt: { gte: sevenDaysAgo } }
                ],
                role: { not: Role.ADMIN }
            },
            include: {
                analysis: true,
                phases: {
                    orderBy: { startDate: 'asc' }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Calculate basic metrics for each user
        return users.map(user => {
            const height = user.heightCm || 0;
            const weight = user.startWeight || 0;
            const imc = height > 0 ? (weight / ((height / 100) ** 2)) : 0;

            return {
                id: user.id,
                email: user.email,
                name: `${user.firstName} ${user.lastName}`.trim() || user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                imc: parseFloat(imc.toFixed(1)),
                pisi: user.pisi || 0,
                startDate: user.startDate,
                hasCompletedOnboarding: user.hasCompletedOnboarding,
                createdAt: user.createdAt,
                subscriptionTier: user.subscriptionTier,
                currentPhase: user.phases.find(p => p.isActive)?.type || "En attente"
            };
        });
    } catch (error) {
        console.error("Error fetching new subscribers:", error);
        return [];
    }
}

export async function adjustUserPhase(userId: string, phaseType: string, startDate: Date, note?: string) {
    try {
        await checkAdminAccess();

        // 1. Deactivate current active phase
        await prisma.userPhase.updateMany({
            where: { userId, isActive: true },
            data: { isActive: false, actualEndDate: new Date() }
        });

        // 2. Create or update new phase
        const newPhase = await prisma.userPhase.create({
            data: {
                userId,
                type: phaseType as any,
                startDate,
                isActive: true,
                isManualOverride: true,
                adminNote: note
            }
        });

        // 3. Update user currentPhaseId
        await prisma.user.update({
            where: { id: userId },
            data: { currentPhaseId: newPhase.id }
        });

        return { success: true };
    } catch (error) {
        console.error("Error adjusting user phase:", error);
        return { success: false, error: "Erreur lors de l'ajustement de la phase" };
    }
}

export async function updateCoachNote(userId: string, note: string) {
    try {
        await checkAdminAccess();
        await prisma.user.update({
            where: { id: userId },
            data: { adminNote: note }
        });
        return { success: true };
    } catch (error) {
        console.error("Error updating coach note:", error);
        return { success: false, error: "Erreur lors de la mise à jour de la note" };
    }
}
