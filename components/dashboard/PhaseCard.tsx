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
        <Card className="rounded-[2.5rem] border-none shadow-xl bg-slate-900 text-white overflow-hidden relative group">
            {/* Animated Ambient Background */}
            <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-700">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-pink-500 rounded-full blur-[80px] animate-pulse" />
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-orange-500 rounded-full blur-[80px]" />
            </div>

            <CardContent className="p-8 relative z-10">
                {/* Header Section */}
                <div className="flex justify-between items-start mb-8">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-pink-400 mb-1">
                            <Zap size={14} fill="currentColor" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Programme Actif</span>
                        </div>
                        <h3 className="text-3xl font-black tracking-tight">{phaseName}</h3>
                        <p className="text-sm font-bold text-slate-400 flex items-center gap-2">
                            <Waves size={14} className="text-slate-400" />
                            {planName}
                        </p>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/5 text-center min-w-[80px]">
                        <p className="text-2xl font-black">J{safeCurrentDay}</p>
                        <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Sur {safeTotalDays}</p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                        <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest mb-1.5 text-center">Actuel</p>
                        <p className="text-xl font-black text-center">{safeCurrentWeight.toFixed(1)}<span className="text-[10px] text-slate-500 ml-0.5">kg</span></p>
                    </div>
                    <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/10">
                        <p className="text-[8px] font-black uppercase text-emerald-400 tracking-widest mb-1.5 text-center">Perte</p>
                        <p className="text-xl font-black text-emerald-400 text-center">{safeWeightLost.toFixed(1)}<span className="text-[10px] ml-0.5 opacity-60">kg</span></p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                        <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest mb-1.5 text-center">Reste</p>
                        <p className="text-xl font-black text-center">{(safeCurrentWeight - safePisi).toFixed(1)}<span className="text-[10px] text-slate-500 ml-0.5">kg</span></p>
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
                                <Target size={12} className="text-emerald-400/50" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400/50">Vers l'objectif (PISI)</span>
                            </div>
                            <span className="text-xs font-black text-emerald-400">{Math.round(weightProgress)}%</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${weightProgress}%` }}
                                transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-300 rounded-full"
                            />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
