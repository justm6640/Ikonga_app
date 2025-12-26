"use client"

import { useState, useEffect } from "react"
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
        const projectedPoint = payload.find((p: any) => p.dataKey === "projected")
        const actualPoint = payload.find((p: any) => p.dataKey === "actual")

        return (
            <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-100 shadow-xl">
                <p className="text-[10px] uppercase font-black text-slate-400 mb-2 tracking-widest">{label}</p>
                <div className="space-y-2">
                    {projectedPoint && (
                        <div className="flex items-center justify-between gap-4">
                            <span className="text-xs font-bold text-slate-600 italic">Objectif:</span>
                            <span className="text-xs font-black text-emerald-500">{projectedPoint.value} kg</span>
                        </div>
                    )}
                    {actualPoint && actualPoint.value !== null && (
                        <div className="flex items-center justify-between gap-4 border-t border-slate-50 pt-1">
                            <span className="text-xs font-bold text-slate-600">Réel:</span>
                            <span className="text-xs font-black text-pink-500">{actualPoint.value} kg</span>
                        </div>
                    )}
                </div>
            </div>
        )
    }
    return null
}

export function ProgressChart({ data, minWeight, maxWeight }: ProgressChartProps) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return <div className="h-[300px] w-full mt-4 bg-slate-50/50 animate-pulse rounded-3xl" />
    }

    // We only want to show the dots for actual weigh-ins, not for the connected path if it's null
    // But connectNulls=true on Line draws the path. 
    // To make it pop, we can use a slightly different styling.

    return (
        <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#E5488A" stopOpacity={0.25} />
                            <stop offset="95%" stopColor="#E5488A" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                        minTickGap={40}
                    />
                    <YAxis
                        domain={['dataMin - 2', 'dataMax + 2']}
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
                        connectNulls
                    />
                    <Line
                        type="monotone"
                        dataKey="actual"
                        stroke="#E5488A"
                        strokeWidth={5}
                        dot={{
                            r: 6,
                            fill: '#E5488A',
                            strokeWidth: 3,
                            stroke: '#fff',
                        }}
                        activeDot={{ r: 8, strokeWidth: 0 }}
                        connectNulls
                    />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    )
}
