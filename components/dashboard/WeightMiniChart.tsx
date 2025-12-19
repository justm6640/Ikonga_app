"use client";

import { Area, AreaChart, ResponsiveContainer, YAxis } from "recharts";
import { Card, CardContent } from "@/components/ui/card";

interface WeightMiniChartProps {
    data: { date: Date | string; weight: number }[];
    currentWeight: number;
    startWeight: number;
}

export function WeightMiniChart({ data, currentWeight, startWeight }: WeightMiniChartProps) {
    const loss = (currentWeight - startWeight).toFixed(1);
    const isLoss = (currentWeight - startWeight) < 0;

    return (
        <Card className="rounded-3xl border-none shadow-none overflow-hidden h-full bg-transparent">
            <CardContent className="p-6 relative h-full flex flex-col justify-between">
                <div>
                    <p className="text-sm text-slate-500 font-medium">Poids actuel</p>
                    <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-4xl font-serif font-bold text-slate-900">{currentWeight}</span>
                        <span className="text-sm font-medium text-slate-400">kg</span>
                    </div>
                    <div className={`mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${isLoss ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-600'
                        }`}>
                        {isLoss ? '📉' : '📊'} {loss} kg
                    </div>
                </div>

                <div className="h-[100px] w-full absolute bottom-0 left-0 right-0 opacity-40">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#E5488A" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#E5488A" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <Area
                                type="monotone"
                                dataKey="weight"
                                stroke="#E5488A"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorWeight)"
                                animationDuration={1500}
                                isAnimationActive={true}
                            />
                            <YAxis domain={['dataMin - 0.5', 'dataMax + 0.5']} hide />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
