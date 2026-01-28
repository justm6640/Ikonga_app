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
