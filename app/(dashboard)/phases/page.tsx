import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/actions/user";
import {
    calculateIkongaSessions,
    calculateBmiThresholds,
    getSubscriptionEndIndex,
    addDays
} from "@/lib/utils/ikonga-engine";
import { PhaseHeroCard } from "@/components/phases/PhaseHeroCard";
import { EvolutionChart } from "@/components/phases/EvolutionChart";
import { PhaseTimeline } from "@/components/phases/PhaseTimeline";
import { ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function PhasesPage() {
    const prismaUser = await getOrCreateUser();
    if (!prismaUser) redirect("/login");

    const dbUser = await prisma.user.findUnique({
        where: { id: prismaUser.id },
        include: {
            phases: { orderBy: { startDate: 'desc' } },
            weighIns: { orderBy: { date: 'asc' } },
            sessions: { orderBy: { sessionNumber: 'asc' } }
        }
    });

    if (!dbUser) redirect("/login");

    const startWeight = dbUser.startWeight || 70;
    const height = dbUser.heightCm || 170;
    const pisi = dbUser.pisi || 65;
    const startDate = dbUser.startDate || new Date();
    const subTier = dbUser.subscriptionTier || "standard_12";

    // 1. Generate Projection
    const projectedSessions = calculateIkongaSessions({
        startWeight,
        heightCm: height,
        pisi,
        startDate,
        subscriptionTier: subTier
    });

    // 2. Prepare Chart Data
    // We combine projection with aggregated reality
    const chartData = projectedSessions.map(ps => {
        // Find real weights in this session window
        const sessionWeights = dbUser.weighIns.filter(w =>
            w.date >= ps.startDate && w.date <= ps.endDate
        );

        const avgRealWeight = sessionWeights.length > 0
            ? sessionWeights[sessionWeights.length - 1].weight // Use last weight of session
            : null;

        return {
            session: `S${ps.sessionNumber}`,
            projection: ps.projectedWeightEnd,
            reality: avgRealWeight,
            date: ps.endDate.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })
        };
    });

    // Add "Start" point for the chart
    chartData.unshift({
        session: "Départ",
        projection: startWeight,
        reality: dbUser.weighIns.length > 0 ? dbUser.weighIns[0].weight : startWeight,
        date: startDate.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })
    });

    const subEndIdx = getSubscriptionEndIndex(subTier);
    const bmiThresholds = calculateBmiThresholds(height);

    // 3. Current Phase Stats
    const currentPhaseRecord = dbUser.phases.find(p => p.isActive) || dbUser.phases[0];
    const dayNumber = currentPhaseRecord
        ? Math.ceil((new Date().getTime() - currentPhaseRecord.startDate.getTime()) / (1000 * 60 * 60 * 24))
        : 1;

    // Theoretical durations for phases in IKONGA
    const phaseDurations: Record<string, number> = {
        'DETOX': 21,
        'EQUILIBRE': 42,
        'CONSOLIDATION': 90,
        'ENTRETIEN': 365
    };

    const currentPhase = {
        type: currentPhaseRecord?.type || "DETOX",
        startDate: currentPhaseRecord?.startDate || startDate,
        endDate: currentPhaseRecord?.plannedEndDate || addDays(currentPhaseRecord?.startDate || startDate, phaseDurations[currentPhaseRecord?.type || 'DETOX']),
        dayNumber: Math.max(1, dayNumber),
        totalDays: phaseDurations[currentPhaseRecord?.type || 'DETOX']
    };

    const nextPhase = dbUser.phases.find(p => !p.isActive && p.startDate > (currentPhaseRecord?.startDate || new Date()));

    return (
        <div className="min-h-screen bg-slate-50/50">
            <div className="max-w-xl mx-auto pb-32 px-4 sm:px-6 pt-6 space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard">
                            <Button variant="ghost" size="icon" className="rounded-2xl hover:bg-white shadow-sm">
                                <ArrowLeft size={20} />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-serif font-black text-slate-900">Calendrier</h1>
                            <p className="text-sm text-slate-500 mt-1">Ton parcours IKONGA vers ton PISI</p>
                        </div>
                    </div>
                </div>

                {/* Hero Card */}
                <PhaseHeroCard
                    currentPhase={currentPhase}
                    nextPhase={nextPhase}
                    subscriptionTier={subTier}
                />

                {/* Evolution Chart */}
                <EvolutionChart
                    data={chartData}
                    pisi={pisi}
                    goal={dbUser.targetWeight}
                    subscriptionEndIndex={subEndIdx}
                />

                {/* Timeline Section */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-xl font-serif font-black text-slate-800">Sessions IKONGA</h3>
                        <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                            <RefreshCw size={12} />
                            <span>Projection Live</span>
                        </div>
                    </div>

                    <PhaseTimeline
                        sessions={projectedSessions.map(s => ({
                            ...s,
                            isCurrent: new Date() >= s.startDate && new Date() <= s.endDate,
                            isFirstAboEnd: s.sessionNumber === subEndIdx
                        }))}
                    />
                </div>
            </div>
        </div>
    );
}


