"use client";

import { Area, AreaChart, ResponsiveContainer, YAxis, ReferenceLine } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button"
import { ChevronRight, TrendingDown, Scale } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

interface WeightMiniChartProps {
    data: { date: Date | string; weight: number }[];
    currentWeight: number;
    startWeight: number;
    pisi?: number;
}

export function WeightMiniChart({ data, currentWeight, startWeight, pisi = 65 }: WeightMiniChartProps) {
    const loss = startWeight - currentWeight;
    const isLoss = loss > 0;

    return (
        <Card className="rounded-[2.5rem] border-none shadow-xl shadow-slate-100 overflow-hidden bg-white/50 backdrop-blur-sm relative group hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-white to-transparent opacity-50" />

            <CardContent className="p-8 relative h-full flex flex-col gap-6 z-10">
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <div className="bg-rose-50 p-1.5 rounded-xl">
                                <Scale size={14} className="text-ikonga-pink" />
                            </div>
                            <p className="text-[10px] uppercase font-black text-slate-400 tracking-[0.2em]">Poids actuel</p>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <motion.span
                                key={currentWeight}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-5xl font-serif font-black text-slate-900 tracking-tighter"
                            >
                                {currentWeight}
                            </motion.span>
                            <span className="text-sm font-bold text-slate-400">kg</span>
                        </div>
                    </div>
                    {isLoss && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            whileHover={{ scale: 1.05 }}
                            className="bg-emerald-50 text-emerald-600 px-3 py-2 rounded-2xl flex items-center gap-1.5 shadow-sm border border-emerald-100"
                        >
                            <TrendingDown size={14} className="stroke-[3]" />
                            <span className="text-[11px] font-black uppercase tracking-wider">-{loss.toFixed(1)} kg</span>
                        </motion.div>
                    )}
                </div>

                <div className="h-[140px] w-full relative -mx-4 group-hover:scale-[1.02] transition-transform duration-500">
                    <ResponsiveContainer width="100%" height="100%" minHeight={140}>
                        <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#E5488A" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#E5488A" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <YAxis domain={['dataMin - 1', 'dataMax + 1']} hide />

                            <ReferenceLine
                                y={pisi}
                                stroke="#94a3b8"
                                strokeDasharray="4 4"
                                strokeWidth={1}
                                label={{
                                    value: `OBJECTIF ${pisi}KG`,
                                    position: 'insideBottomRight',
                                    fill: '#94a3b8',
                                    fontSize: 9,
                                    fontWeight: 900,
                                    dy: -10,
                                    className: 'tracking-widest'
                                }}
                            />

                            <Area
                                type="monotone"
                                dataKey="weight"
                                stroke="#E5488A"
                                strokeWidth={4}
                                fillOpacity={1}
                                fill="url(#colorWeight)"
                                animationDuration={2000}
                                strokeLinecap="round"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <Link href="/weigh-in" className="mt-2 text-center relative z-20">
                    <Button variant="ghost" className="w-full h-14 rounded-2xl group/btn text-slate-400 hover:text-ikonga-pink hover:bg-pink-50 transition-all font-black text-[10px] uppercase tracking-[0.2em] gap-2 border border-slate-100 hover:border-pink-100 shadow-sm hover:shadow-md">
                        Voir mes pesées
                        <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform stroke-[3]" />
                    </Button>
                </Link>
            </CardContent>
        </Card>
    );
}
