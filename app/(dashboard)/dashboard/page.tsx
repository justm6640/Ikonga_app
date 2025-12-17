"use client";

import { motion } from "framer-motion";
import { PhaseCard } from "@/components/dashboard/PhaseCard";
import { WeightMiniChart } from "@/components/dashboard/WeightMiniChart";
import { PillarsGrid } from "@/components/dashboard/PillarsGrid";
import { DailyJournalCard } from "@/components/dashboard/DailyJournalCard";

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
};

export default function DashboardPage() {
    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-6 max-w-xl mx-auto md:max-w-4xl"
        >
            {/* Motivational Quote (Mobile Header Placeholder) */}
            <motion.div variants={item} className="mb-2">
                <p className="text-lg font-hand text-muted-foreground italic">
                    "Petit pas + Petit pas = Grande Victoire"
                </p>
            </motion.div>

            {/* Hero Section: Phase & Weight */}
            <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Phase Card (Main) */}
                <PhaseCard />

                {/* Weight Chart (Mini) */}
                <div className="h-40 md:h-auto">
                    <WeightMiniChart />
                </div>
            </motion.div>

            {/* Action: Daily Journal */}
            <motion.div variants={item}>
                <DailyJournalCard />
            </motion.div>

            {/* Pillars Grid */}
            <motion.div variants={item} className="mt-2">
                <h3 className="text-lg font-serif font-medium mb-4 ml-1">Mes Piliers</h3>
                <PillarsGrid />
            </motion.div>

        </motion.div>
    );
}
