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
    const user = await getOrCreateUser()
    if (!user || user.role !== Role.ADMIN) {
        redirect("/dashboard")
    }
    return user
}

export async function getAdminDashboardStats() {
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
}

export async function getAdminAlerts() {
    await checkAdminAccess()

    return await prisma.adminAlert.findMany({
        where: { status: "PENDING" },
        include: { user: true },
        orderBy: { createdAt: "desc" },
        take: 20
    })
}
