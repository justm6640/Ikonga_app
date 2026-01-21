import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/actions/user";
import { differenceInCalendarDays, startOfDay } from "date-fns";
import { AnalysisWidget } from "@/components/dashboard/AnalysisWidget";
import { AnalysisResult } from "@/lib/ai/generator";

// New Components
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { PhaseCard } from "@/components/dashboard/PhaseCard";
import { WeightMiniChart } from "@/components/dashboard/WeightMiniChart";
import { PillarsGrid } from "@/components/dashboard/PillarsGrid";
import { DailyJournalCard } from "@/components/dashboard/DailyJournalCard";
import { TrackingGrid } from "@/components/dashboard/TrackingGrid";
import { ComingSoonGrid } from "@/components/dashboard/ComingSoonGrid";
import { CountdownHero } from "@/components/dashboard/CountdownHero";

export default async function DashboardPage() {
    // 1. Fetch User (Self-healing)
    const prismaUser = await getOrCreateUser();

    if (!prismaUser) {
        redirect("/login");
    }

    // Fetch full user data including logs for metrics
    const dbUser = await prisma.user.findUnique({
        where: { id: prismaUser.id },
        include: {
            dailyLogs: { orderBy: { date: 'desc' } },
            phases: { orderBy: { startDate: 'desc' }, take: 1 },
            analysis: true
        }
    });

    if (!dbUser) redirect("/login");

    // 2. Temporal Logic - Check if program has started
    if (!dbUser.startDate) {
        redirect("/onboarding");
    }

    const today = startOfDay(new Date());
    const programStart = startOfDay(new Date(dbUser.startDate));
    const isProgramActive = differenceInCalendarDays(today, programStart) >= 0;

    // 3. If not started yet, show Countdown Hero
    if (!isProgramActive) {
        const userName = dbUser.firstName || "Championne";
        const daysRemaining = differenceInCalendarDays(programStart, today);
        return (
            <div className="flex flex-col gap-6 max-w-xl mx-auto p-6">
                <CountdownHero daysRemaining={daysRemaining} userName={userName} />
            </div>
        );
    }

    // 4. Data for Blocks

    // Weight Chart (last 7 points)
    const weightHistory = await prisma.dailyLog.findMany({
        where: { userId: dbUser.id, weight: { not: null } },
        orderBy: { date: 'asc' },
        take: 7
    });

    const recentWeightLogs = weightHistory.map(log => ({
        date: log.date.toISOString(),
        weight: log.weight || 0
    }));

    const lastLog = dbUser.dailyLogs.find(l => l.weight !== null);
    const currentWeight = lastLog?.weight || dbUser.startWeight || 0;

    // Phase Info
    const activePhase = dbUser.phases[0];
    const activePhaseType = activePhase?.type || "DETOX";
    const phaseStartDate = activePhase?.startDate || dbUser.startDate;
    const isCoachOverridden = activePhase?.adminNote ? true : false;

    // AI Analysis
    let analysisData: AnalysisResult | null = null;
    if (dbUser.analysis?.content) {
        analysisData = dbUser.analysis.content as unknown as AnalysisResult;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            <div className="max-w-xl mx-auto pb-32 px-4 sm:px-6 space-y-6 sm:space-y-8 relative">
                {/* Decorative background blurs */}
                <div className="fixed top-20 right-0 w-72 h-72 bg-ikonga-pink/5 rounded-full blur-3xl -z-10" />
                <div className="fixed bottom-40 left-0 w-96 h-96 bg-orange-400/5 rounded-full blur-3xl -z-10" />

                {/* AI Analysis (Stays on top but discrete) */}
                {analysisData && (
                    <div className="mb-6 animate-fade-in-up">
                        <AnalysisWidget analysis={analysisData} />
                    </div>
                )}

                {/* BLOCK 1: Header */}
                <DashboardHeader
                    firstName={dbUser.firstName || undefined}
                    notificationsCount={0}
                />

                {/* BLOCK 2: Phase Card */}
                <PhaseCard
                    phase={activePhaseType}
                    startDate={phaseStartDate}
                    currentWeight={currentWeight}
                    startWeight={dbUser.startWeight || currentWeight}
                    pisi={dbUser.pisi || 0}
                    dayTotal={21}
                    plan="Standard 12"
                    isCoachOverridden={isCoachOverridden}
                />

                {/* BLOCK 3: Weight Chart */}
                <WeightMiniChart
                    data={recentWeightLogs}
                    currentWeight={currentWeight}
                    startWeight={dbUser.startWeight || 0}
                    pisi={dbUser.pisi || 0}
                />

                {/* BLOCK 4: 4 Pillars */}
                <section className="space-y-4">
                    <h2 className="text-xl font-serif font-black text-slate-900 ml-1">Tes Piliers</h2>
                    <PillarsGrid />
                </section>

                {/* BLOCK 5: Journal CTA */}
                <div className="mt-8">
                    <DailyJournalCard />
                </div>

                {/* BLOCK 6: Tracking Grid */}
                <TrackingGrid />

                {/* BLOCK 7: Coming Soon */}
                <ComingSoonGrid />

            </div>
        </div>
    );
}
