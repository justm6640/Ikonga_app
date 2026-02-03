"use client"

import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Calendar, Timer, TrendingDown, Target, Zap, Waves } from "lucide-react"
import { cn } from "@/lib/utils"

interface PhaseCardProps {
    phaseName: string;
    currentDay: number;
    totalDays: number;
    planName: string;
    currentWeight: number;
    weightLost: number;
    startWeight: number;
    pisi: number;
}

export function PhaseCard({
    phaseName,
    currentDay = 1,
    totalDays = 21,
    planName,
    currentWeight = 0,
    weightLost = 0,
    startWeight = 0,
    pisi = 0
}: PhaseCardProps) {
    // 1. Safe Calculations
    const safeCurrentDay = Number(currentDay) || 1;
    const safeTotalDays = Number(totalDays) || 21;

    // Protection against division by zero
    const timeProgress = safeTotalDays > 0
        ? Math.min(100, Math.max(0, (safeCurrentDay / safeTotalDays) * 100))
        : 0;

    const safeStartWeight = Number(startWeight) || 0;
    const safePisi = Number(pisi) || 0;
    const safeCurrentWeight = Number(currentWeight) || 0;
    const safeWeightLost = Number(weightLost) || 0;

    const weightToLose = safeStartWeight - safePisi;

    const weightProgress = weightToLose > 0.1
        ? Math.min(100, Math.max(0, (safeWeightLost / weightToLose) * 100))
        : 0;

    return (
        <Card className="rounded-[2.5rem] border-none shadow-premium bg-ikonga-gradient text-white overflow-hidden relative group">
            {/* Animated Ambient Background - Simplified for Lifestyle Gradient */}
            <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-700">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-white rounded-full blur-[100px] animate-pulse" />
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-black rounded-full blur-[100px]" />
            </div>

            <CardContent className="p-8 relative z-10">
                {/* Header Section */}
                <div className="flex justify-between items-start mb-8">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-white/90 mb-1">
                            <Zap size={14} fill="currentColor" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Programme Actif</span>
                        </div>
                        <h3 className="text-3xl font-black tracking-tight text-white">{phaseName}</h3>
                        <p className="text-sm font-bold text-white/70 flex items-center gap-2">
                            <Waves size={14} className="text-white/60" />
                            {planName}
                        </p>
                    </div>

                    <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-4 border border-white/10 text-center min-w-[80px] shadow-lg">
                        <p className="text-2xl font-black text-white">J{safeCurrentDay}</p>
                        <p className="text-[8px] font-black uppercase tracking-widest text-white/60">Sur {safeTotalDays}</p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="p-4 bg-white/15 backdrop-blur-md rounded-2xl border border-white/10 shadow-sm">
                        <p className="text-[8px] font-black uppercase text-white/70 tracking-widest mb-1.5 text-center">Actuel</p>
                        <p className="text-xl font-black text-center text-white">{safeCurrentWeight.toFixed(1)}<span className="text-[10px] text-white/50 ml-0.5">kg</span></p>
                    </div>
                    <div className="p-4 bg-white/25 backdrop-blur-md rounded-2xl border border-white/20 shadow-md">
                        <p className="text-[8px] font-black uppercase text-white/95 tracking-widest mb-1.5 text-center">Perte</p>
                        <p className="text-xl font-black text-white text-center">{safeWeightLost.toFixed(1)}<span className="text-[10px] ml-0.5 opacity-60">kg</span></p>
                    </div>
                    <div className="p-4 bg-white/15 backdrop-blur-md rounded-2xl border border-white/10 shadow-sm">
                        <p className="text-[8px] font-black uppercase text-white/70 tracking-widest mb-1.5 text-center">Reste</p>
                        <p className="text-xl font-black text-center text-white">{(safeCurrentWeight - safePisi).toFixed(1)}<span className="text-[10px] text-white/50 ml-0.5">kg</span></p>
                    </div>
                </div>

                {/* Dual Progress Bars */}
                <div className="space-y-6">
                    {/* Time Progress */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-end">
                            <div className="flex items-center gap-2">
                                <Timer size={12} className="text-white/40" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Progression Phase</span>
                            </div>
                            <span className="text-xs font-black">{Math.round(timeProgress)}%</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${timeProgress}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="h-full bg-white rounded-full relative"
                            >
                                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.3)_50%,transparent_100%)] animate-shimmer" />
                            </motion.div>
                        </div>
                    </div>

                    {/* Weight Progress */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-end">
                            <div className="flex items-center gap-2">
                                <Target size={12} className="text-white/60" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Vers l'objectif (PISI)</span>
                            </div>
                            <span className="text-xs font-black text-white">{Math.round(weightProgress)}%</span>
                        </div>
                        <div className="h-2 bg-white/15 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${weightProgress}%` }}
                                transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                                className="h-full bg-white rounded-full"
                            />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
