import { NextRequest, NextResponse } from "next/server";
import { processDailyTransitions } from "@/lib/engines/phase-transition";

export async function GET(req: NextRequest) {
    try {
        // 1. Security Check
        const authHeader = req.headers.get("authorization");
        const expectedSecret = process.env.CRON_SECRET;

        if (!expectedSecret || authHeader !== `Bearer ${expectedSecret}`) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 2. Process Transitions
        const result = await processDailyTransitions();

        return NextResponse.json({
            success: true,
            ...result
        });

    } catch (error) {
        console.error("Cron Phase Transition Error:", error);
        return NextResponse.json({
            error: "Internal Server Error",
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}
