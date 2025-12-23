import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { generateUserWeeklyPlan } from '@/lib/ai/menu-generator';

export const dynamic = 'force-dynamic';

/**
 * Standard API route for Cron jobs (Self-Hosted/Dokploy compatible).
 * Triggers weekly menu generation for all active users.
 * Security: Authorization Header with CRON_SECRET.
 */
export async function GET(req: Request) {
    // 1. Security Check
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // 2. Fetch Active Users
        const activeUsers = await prisma.user.findMany({
            where: { isActive: true },
            select: { id: true, firstName: true }
        });

        console.log(`[Cron] Starting weekly menu generation for ${activeUsers.length} users.`);

        // 3. Parallel Generation with Promise.allSettled
        // Using allSettled to ensure failure for one user doesn't crash the whole job.
        const results = await Promise.allSettled(
            activeUsers.map(async (user) => {
                const result = await generateUserWeeklyPlan(user.id);
                if (result.success) {
                    console.log(`[Cron] Success: Menu generated for ${user.firstName || user.id}`);
                } else {
                    console.error(`[Cron] Error for ${user.firstName || user.id}: ${result.error}`);
                    throw new Error(result.error);
                }
                return result;
            })
        );

        // 4. Summarize Results
        const generated = results.filter((r) => r.status === 'fulfilled').length;
        const errors = results.filter((r) => r.status === 'rejected').length;

        console.log(`[Cron] Job completed. Generated: ${generated}, Errors: ${errors}`);

        return NextResponse.json({
            success: true,
            total: activeUsers.length,
            generated,
            errors
        });

    } catch (error) {
        console.error('[Cron] Critical failure:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
