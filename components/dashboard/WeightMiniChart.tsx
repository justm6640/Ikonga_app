"use client"

import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import {
    Area,
    AreaChart,
    ResponsiveContainer,
    ReferenceLine
} from "recharts"
import { Scale, TrendingDown, ArrowRight } from "lucide-react"
import Link from "next/link"

interface WeightMiniChartProps {
    data: { date: string | Date; weight: number }[];
    currentWeight: number;
    startWeight: number;
    pisi?: number;
}

export function WeightMiniChart({ data, currentWeight, startWeight, pisi = 65 }: WeightMiniChartProps) {
    const loss = startWeight - currentWeight;
    const isLoss = loss > 0;

    // Calculate total progress towards goal
    const totalToLose = startWeight - pisi;
    const progressPercent = totalToLose > 0 ? Math.min(100, Math.round((loss / totalToLose) * 100)) : 0;

    return (
        <Card className="rounded-[2.5rem] border-none shadow-xl bg-white/70 backdrop-blur-xl overflow-hidden group hover:shadow-2xl transition-all duration-500">
            <CardContent className="p-8">
                <div className="flex justify-between items-start mb-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-8 h-8 rounded-xl bg-pink-50 flex items-center justify-center">
                                <Scale className="text-pink-500" size={16} />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Poids Actuel</p>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-5xl font-black text-slate-900 tracking-tighter transition-transform group-hover:scale-110 origin-left duration-500">
                                {currentWeight.toFixed(1)}
                            </span>
                            <span className="text-xl font-bold text-slate-300">kg</span>
                        </div>
                    </div>

                    {isLoss && (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-2xl shadow-sm border border-emerald-100"
                        >
                            <TrendingDown size={14} strokeWidth={3} />
                            <span className="text-xs font-black">-{loss.toFixed(1)} kg</span>
                        </motion.div>
                    )}
                </div>

                {/* Progress towards goal */}
                <div className="space-y-3 mb-8">
                    <div className="flex justify-between items-end">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Progression Objectif</span>
                        <span className="text-sm font-black text-slate-700">{progressPercent}%</span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-50">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercent}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-pink-500 via-pink-400 to-orange-400 rounded-full shadow-[0_0_10px_rgba(236,72,153,0.3)]"
                        />
                    </div>
                </div>

                {/* Mini Chart Area */}
                <div className="h-24 w-full -mx-2 opacity-60 group-hover:opacity-100 transition-opacity duration-500">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data.slice(-7)}>
                            <defs>
                                <linearGradient id="miniGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#EC4899" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#EC4899" stopOpacity={0.01} />
                                </linearGradient>
                            </defs>
                            {pisi && (
                                <ReferenceLine
                                    y={pisi}
                                    stroke="#10b981"
                                    strokeDasharray="4 4"
                                    strokeWidth={1}
                                />
                            )}
                            <Area
                                type="monotone"
                                dataKey="weight"
                                stroke="#EC4899"
                                strokeWidth={3}
                                fill="url(#miniGradient)"
                                animationDuration={2000}
                                activeDot={false}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <Link
                    href="/weigh-in"
                    className="mt-6 flex items-center justify-center gap-2 w-full py-4 bg-slate-900 text-white rounded-[1.5rem] text-sm font-black hover:bg-slate-800 transition-all active:scale-95 group/btn"
                >
                    <span>Voir mes pesées</span>
                    <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                </Link>
            </CardContent>
        </Card>
    );
}
