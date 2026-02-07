import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/actions/user";
import { differenceInCalendarDays, startOfDay } from "date-fns";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

// Dashboard Components
import { PhaseCard } from "@/components/dashboard/PhaseCard";
import { WeightMiniChart } from "@/components/dashboard/WeightMiniChart";
import { PillarsGrid } from "@/components/dashboard/PillarsGrid";
import { DailyJournalCard } from "@/components/dashboard/DailyJournalCard";
import { TrackingGrid } from "@/components/dashboard/TrackingGrid";
import { ComingSoonGrid } from "@/components/dashboard/ComingSoonGrid";
import { CountdownHero } from "@/components/dashboard/CountdownHero";
import { UpcomingPhaseBanner } from "@/components/phases/UpcomingPhaseBanner";
import { getUserAccessiblePhasesSync } from "@/lib/utils/phase-access-sync";

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
            phases: { orderBy: { startDate: 'desc' } } // Fetch all phases to determine correct active one
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

    // Phase Info - Smart Selection
    const accessiblePhases = getUserAccessiblePhasesSync(dbUser);

    // Priority: 1. Current Running Phase, 2. Last Completed Phase (gap), 3. Fallback
    const activePhase = accessiblePhases.current || (accessiblePhases.past.length > 0 ? accessiblePhases.past[0] : dbUser.phases[0]);

    const activePhaseType = activePhase?.type || "DETOX";
    const phaseStartDate = activePhase?.startDate || dbUser.startDate;
    const isCoachOverridden = activePhase?.adminNote ? true : false;

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            <div className="max-w-xl mx-auto pb-32 px-4 sm:px-6 space-y-6 sm:space-y-8 relative">
                {/* Decorative background blurs */}
                <div className="fixed top-20 right-0 w-72 h-72 bg-ikonga-coral/5 rounded-full blur-3xl -z-10" />
                <div className="fixed bottom-40 left-0 w-96 h-96 bg-orange-400/5 rounded-full blur-2xl -z-10" />
                <div className="fixed bottom-40 left-0 w-96 h-96 bg-orange-400/5 rounded-full blur-3xl -z-10" />

                {/* BLOCK 0: Profile Completion CTA if skipped */}
                {!dbUser.hasCompletedOnboarding && (
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 p-4 rounded-3xl mb-2 flex items-center justify-between group animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className="flex items-center gap-3">
                            <div className="bg-amber-100 p-2 rounded-xl">
                                <Sparkles size={16} className="text-amber-600" />
                            </div>
                            <p className="text-amber-900 text-sm font-medium">
                                Personnalise ton programme à 100%
                            </p>
                        </div>
                        <Link href="/onboarding" className="text-amber-700 text-xs font-black uppercase tracking-wider hover:text-amber-900 transition-colors flex items-center gap-1">
                            Finir mon profil <ArrowRight size={14} />
                        </Link>
                    </div>
                )}

                {/* BLOCK 1: Phase Card */}
                <PhaseCard
                    phaseName={activePhaseType}
                    currentDay={differenceInCalendarDays(today, new Date(phaseStartDate)) + 1}
                    totalDays={21}
                    planName="Standard 12"
                    currentWeight={currentWeight}
                    weightLost={dbUser.startWeight ? dbUser.startWeight - currentWeight : 0}
                    startWeight={dbUser.startWeight || currentWeight}
                    pisi={dbUser.pisi || 0}
                />

                {/* BLOCK 2: Phase Timeline & Upcoming Banner */}
                {(() => {
                    const accessible = getUserAccessiblePhasesSync(dbUser);
                    return (
                        <>
                            {accessible.upcoming && (
                                <UpcomingPhaseBanner upcomingPhase={accessible.upcoming} />
                            )}
                            {accessible.upcoming && (
                                <UpcomingPhaseBanner upcomingPhase={accessible.upcoming} />
                            )}
                        </>
                    );
                })()}

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
