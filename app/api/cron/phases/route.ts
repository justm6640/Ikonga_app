import { NextResponse } from "next/server"
import { runPhaseEngine } from "@/lib/engines/phase-engine"

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
        // 2. Run Engine
        const summary = await runPhaseEngine()

        return NextResponse.json({
            success: true,
            summary
        })
    } catch (error) {
        console.error("[CRON_PHASE_ENGINE_ERROR]", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
