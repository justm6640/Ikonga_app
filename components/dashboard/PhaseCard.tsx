"use client"

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { PhaseType } from "@prisma/client";
import { differenceInDays } from "date-fns";
import { ArrowDown, Info, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface PhaseCardProps {
    phase: PhaseType | string;
    startDate: Date;
    plan?: string;
    currentWeight?: number;
    startWeight?: number;
    targetWeight?: number;
    pisi?: number;
    dayTotal?: number;
    isCoachOverridden?: boolean;
}

export function PhaseCard({
    phase,
    startDate,
    plan = "Standard 12",
    currentWeight = 0,
    startWeight = 0,
    targetWeight = 0,
    pisi = 0,
    dayTotal = 21,
    isCoachOverridden = false
}: PhaseCardProps) {
    const dayCurrent = Math.max(1, differenceInDays(new Date(), new Date(startDate)) + 1);
    const progress = Math.min(100, (dayCurrent / dayTotal) * 100);
    const weightLost = startWeight - currentWeight;
    const remainingToGoal = Math.max(0, currentWeight - (pisi || targetWeight));

    const phaseLabel = phase.toString().replace("_", " ");

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                "relative overflow-hidden rounded-[2.5rem] p-8 text-white shadow-2xl shadow-pink-200/50",
                "bg-ikonga-gradient group cursor-pointer"
            )}
        >
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-24 -mt-24 blur-3xl animate-pulse" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/20 rounded-full -ml-16 -mb-16 blur-2xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <div className="relative z-10 space-y-8">
                {/* Top Row: Phase & Plan */}
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <h3 className="text-3xl font-serif font-black tracking-tight uppercase drop-shadow-sm">{phaseLabel}</h3>
                            {isCoachOverridden && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-white/20"
                                >
                                    <Sparkles size={10} className="text-yellow-200" />
                                    <span className="text-[9px] font-black uppercase tracking-wider">Coach</span>
                                </motion.div>
                            )}
                        </div>
                        <p className="text-xs font-bold opacity-80 tracking-[0.2em] uppercase">{plan}</p>
                    </div>
                    <div className="text-right">
                        <div className="flex items-baseline justify-end gap-1">
                            <span className="text-5xl font-black italic tracking-tighter drop-shadow-sm">J{dayCurrent}</span>
                            <span className="text-lg opacity-60 font-bold">/{dayTotal}</span>
                        </div>
                        <p className="text-[10px] uppercase font-black opacity-80 tracking-widest">Calendrier</p>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-4 py-5 border-y border-white/10 bg-white/5 rounded-3xl backdrop-blur-sm">
                    <div className="text-center group-hover:scale-105 transition-transform duration-300">
                        <p className="text-[9px] uppercase font-bold opacity-60 mb-1 tracking-wider">Actuel</p>
                        <p className="text-xl font-black">{currentWeight} <span className="text-sm font-medium opacity-70">kg</span></p>
                    </div>
                    <div className="text-center border-x border-white/10 px-2 group-hover:scale-105 transition-transform duration-300 delay-75">
                        <p className="text-[9px] uppercase font-bold opacity-60 mb-1 tracking-wider">Perte</p>
                        <div className="flex items-center justify-center gap-1">
                            <ArrowDown size={14} className="text-emerald-300 stroke-[3] animate-bounce" />
                            <p className="text-2xl font-black text-white">{weightLost > 0 ? `${weightLost.toFixed(1)}` : '0'} <span className="text-sm font-medium opacity-70">kg</span></p>
                        </div>
                    </div>
                    <div className="text-center group-hover:scale-105 transition-transform duration-300 delay-150">
                        <p className="text-[9px] uppercase font-bold opacity-60 mb-1 tracking-wider">Objectif</p>
                        <p className="text-xl font-black">{remainingToGoal.toFixed(1)} <span className="text-sm font-medium opacity-70">kg</span></p>
                    </div>
                </div>

                {/* Bottom Row: Progress */}
                <div className="space-y-3">
                    <div className="flex justify-between items-end">
                        <p className="text-xs font-bold uppercase tracking-widest opacity-80">Progression Phase</p>
                        <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-2xl font-black italic"
                        >
                            {Math.round(progress)}%
                        </motion.span>
                    </div>
                    <div className="h-4 bg-black/20 rounded-full p-1 overflow-hidden backdrop-blur-sm">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="h-full bg-white rounded-full relative shadow-[0_0_15px_rgba(255,255,255,0.6)]"
                        >
                            <div className="absolute top-0 right-0 h-full w-full bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-30 animate-shimmer" />
                        </motion.div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
