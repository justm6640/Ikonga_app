"use client"

import {
    ResponsiveContainer,
    ComposedChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Area,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ProgressChartProps {
    data: any[]
    minWeight: number
    maxWeight: number
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-slate-100 shadow-xl">
                <p className="text-[10px] uppercase font-black text-slate-400 mb-2 tracking-widest">{label}</p>
                <div className="space-y-1">
                    <div className="flex items-center justify-between gap-4">
                        <span className="text-xs font-bold text-slate-600">Objectif:</span>
                        <span className="text-xs font-black text-emerald-500">{payload[0].value} kg</span>
                    </div>
                    {payload[1] && payload[1].value && (
                        <div className="flex items-center justify-between gap-4">
                            <span className="text-xs font-bold text-slate-600">Réel:</span>
                            <span className="text-xs font-black text-blue-600">{payload[1].value} kg</span>
                        </div>
                    )}
                </div>
            </div>
        )
    }
    return null
}

export function ProgressChart({ data, minWeight, maxWeight }: ProgressChartProps) {
    return (
        <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                        minTickGap={30}
                    />
                    <YAxis
                        domain={[Math.floor(minWeight - 2), Math.ceil(maxWeight + 2)]}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                    />
                    <Tooltip content={<CustomTooltip />} />

                    {/* Objective Line */}
                    <Line
                        type="monotone"
                        dataKey="projected"
                        stroke="#10b981"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={false}
                        activeDot={false}
                    />

                    {/* Reality Area & Line */}
                    <Area
                        type="monotone"
                        dataKey="actual"
                        stroke="none"
                        fill="url(#colorActual)"
                        activeDot={false}
                    />
                    <Line
                        type="monotone"
                        dataKey="actual"
                        stroke="#2563eb"
                        strokeWidth={4}
                        dot={{ r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 6, strokeWidth: 0 }}
                        connectNulls
                    />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    )
}
