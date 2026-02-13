import { NextResponse } from "next/server"
import { PhaseEngine } from "@/lib/engines/phase-engine"
import prisma from "@/lib/prisma"

/**
 * Cron Job route to trigger the Phase Engine.
 * Targeted by Dokploy or any CRON service.
 */
export async function GET(request: Request) {
    // 1. Security Check
    const authHeader = request.headers.get("authorization")
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        // 2. Run Engine on all active users
        const users = await prisma.user.findMany({
            where: { phases: { some: { isActive: true } } },
            select: { id: true }
        })

        const results = []
        for (const user of users) {
            try {
                await PhaseEngine.resolveCurrentPhase(user.id)
                await PhaseEngine.checkAndSendPhaseNotifications(user.id)
                results.push({ userId: user.id, success: true })
            } catch (err) {
                console.error(`[CRON] Error for user ${user.id}:`, err)
                results.push({ userId: user.id, success: false })
            }
        }

        return NextResponse.json({
            success: true,
            summary: { usersProcessed: users.length, results }
        })
    } catch (error) {
        console.error("[CRON_PHASE_ENGINE_ERROR]", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
