import { motion } from "framer-motion";
import { redirect } from "next/navigation";
import { PhaseCard } from "@/components/dashboard/PhaseCard";
import { WeightMiniChart } from "@/components/dashboard/WeightMiniChart";
import { PillarsGrid } from "@/components/dashboard/PillarsGrid";
import { DailyJournalCard } from "@/components/dashboard/DailyJournalCard";
import { AnalysisWidget } from "@/components/dashboard/AnalysisWidget";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import { AnalysisResult } from "@/lib/ai/generator";
import { BadgeGrid } from "@/components/gamification/BadgeGrid";
import { getUserBadges } from "@/lib/actions/gamification";
import { AnalyticsWidget } from "@/components/dashboard/AnalyticsWidget";
import { WellnessChart } from "@/components/dashboard/WellnessChart";
import { getRecentWellnessLogs } from "@/lib/actions/journal";
import { analyzeTrend } from "@/lib/engines/wellness";
import { format, startOfDay } from "date-fns";
import { MetricsGrid } from "@/components/dashboard/MetricsGrid";
import { getOrCreateUser } from "@/lib/actions/user";

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

    let analysisData: AnalysisResult | null = null;
    let pillarsData = {
        nutrition: null as any,
        fitness: null as any,
        wellness: null as any,
        beauty: null as any
    };

    // A. Analysis
    if (dbUser.analysis?.content) {
        analysisData = dbUser.analysis.content as unknown as AnalysisResult;
    }

    // B. Pillars Data (Contextual to Phase)
    const activePhase = dbUser.phases[0];
    const activePhaseType = activePhase?.type || "DETOX";

    // Parallel Fetch for Pillars
    const [menu, fitness, wellness, beauty] = await Promise.all([
        prisma.menu.findFirst({
            where: { phaseCompat: { has: activePhaseType } }
        }),
        prisma.contentLibrary.findFirst({
            where: { category: "FITNESS", targetPhases: { has: activePhaseType } }
        }),
        prisma.contentLibrary.findFirst({
            where: { category: "WELLNESS", targetPhases: { has: activePhaseType } }
        }),
        prisma.contentLibrary.findFirst({
            where: { category: "BEAUTY", targetPhases: { has: activePhaseType } }
        })
    ]);

    pillarsData = {
        nutrition: menu ? { title: menu.title, content: menu.content } : null,
        fitness: fitness ? { title: fitness.title } : null,
        wellness: wellness ? { title: wellness.title } : null,
        beauty: beauty ? { title: beauty.title } : null
    };

    const lastWeightLog = dbUser.dailyLogs.find(l => l.weight !== null);
    const currentWeight = lastWeightLog?.weight || dbUser.startWeight || 0;

    return (
        <div className="flex flex-col gap-6 max-w-xl mx-auto md:max-w-4xl">
            {/* Analysis Widget (AI) */}
            <AnalysisWidget analysis={analysisData} />

            {/* Motivational Quote */}
            <div className="mb-2">
                <p className="text-lg font-hand text-muted-foreground italic">
                    "Petit pas + Petit pas = Grande Victoire"
                </p>
            </div>

            {/* Hero Section: Phase & Analytics */}
            <div className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Phase Card (Main) */}
                    <PhaseCard
                        phase={activePhaseType}
                        startDate={activePhase?.startDate || (dbUser as any).startDate || new Date()}
                    />
                    <div className="h-full">
                        <DailyJournalCard />
                    </div>
                </div>

                {/* Health Gauges (IMC, Body Fat, Battery) */}
                <MetricsGrid
                    user={dbUser as any}
                    currentWeight={currentWeight}
                    lastLog={dbUser.dailyLogs[0] || null}
                />

                {/* Performance Analytics (Full Width) */}
                <AnalyticsWidget />

                {/* Wellness Analytics (Full Width) */}
                <WellnessWrapper />
            </div>

            {/* Mes Piliers */}
            <div className="mt-2">
                <h3 className="text-lg font-serif font-medium mb-4 ml-1">Mes Piliers</h3>
                <PillarsGrid
                    nutrition={pillarsData.nutrition}
                    fitness={pillarsData.fitness}
                    wellness={pillarsData.wellness}
                    beauty={pillarsData.beauty}
                />
            </div>

            {/* Badges Section */}
            <div className="mt-4 pb-12">
                <h3 className="text-lg font-serif font-medium mb-4 ml-1">Mes Badges</h3>
                <BadgeGridWrapper userId={dbUser.id} />
            </div>
        </div>
    );
}

// Small server component wrapper to fetch badges
async function BadgeGridWrapper({ userId }: { userId: string }) {
    if (!userId) return null;
    const badges = await getUserBadges(userId);
    return <BadgeGrid badges={badges as any} />;
}

async function WellnessWrapper() {
    const logs = await getRecentWellnessLogs(7);
    const analysis = analyzeTrend(logs as any);
    const chartData = logs.map(l => ({
        date: format(l.date, "dd/MM"),
        score: (l as any).wellnessScore || 0
    }));

    return <WellnessChart data={chartData} analysis={analysis} />;
}

async function MetricsWrapper({ user }: { user: any }) {
    if (!user) return null;

    // Fetch current weight (most recent log with weight)
    const lastWeightLog = await prisma.dailyLog.findFirst({
        where: { userId: user.id, weight: { not: null } },
        orderBy: { date: 'desc' }
    });

    // Fetch today's log for body battery
    const todayLog = await prisma.dailyLog.findUnique({
        where: { userId_date: { userId: user.id, date: startOfDay(new Date()) } }
    });

    const currentWeight = lastWeightLog?.weight || user.startWeight || 0;

    return <MetricsGrid user={user} currentWeight={currentWeight} lastLog={todayLog as any} />;
}
