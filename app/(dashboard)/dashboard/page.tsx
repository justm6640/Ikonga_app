import { motion } from "framer-motion";
import { PhaseCard } from "@/components/dashboard/PhaseCard";
import { WeightMiniChart } from "@/components/dashboard/WeightMiniChart";
import { PillarsGrid } from "@/components/dashboard/PillarsGrid";
import { DailyJournalCard } from "@/components/dashboard/DailyJournalCard";
import { AnalysisWidget } from "@/components/dashboard/AnalysisWidget";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import { AnalysisResult } from "@/lib/ai/generator";

export default async function DashboardPage() {
    // 1. Fetch User
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let analysisData: AnalysisResult | null = null;

    if (user && user.email) {
        // 2. Fetch UserAnalysis
        const prismaUser = await prisma.user.findUnique({
            where: { email: user.email },
            include: { analysis: true }
        });

        if (prismaUser?.analysis?.content) {
            analysisData = prismaUser.analysis.content as unknown as AnalysisResult;
        }
    }

    return (
        <div className="flex flex-col gap-6 max-w-xl mx-auto md:max-w-4xl">
            {/* Analysis Widget (AI) */}
            <AnalysisWidget analysis={analysisData} />

            {/* Motivational Quote (Mobile Header Placeholder) */}
            <div className="mb-2">
                <p className="text-lg font-hand text-muted-foreground italic">
                    "Petit pas + Petit pas = Grande Victoire"
                </p>
            </div>

            {/* Hero Section: Phase & Weight */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Phase Card (Main) */}
                <PhaseCard />

                {/* Weight Chart (Mini) */}
                <div className="h-40 md:h-auto">
                    <WeightMiniChart />
                </div>
            </div>

            {/* Action: Daily Journal */}
            <div>
                <DailyJournalCard />
            </div>

            {/* Pillars Grid */}
            <div className="mt-2">
                <h3 className="text-lg font-serif font-medium mb-4 ml-1">Mes Piliers</h3>
                <PillarsGrid />
            </div>
        </div>
    );
}
