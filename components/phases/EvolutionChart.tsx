"use client"

import { useState, useEffect } from "react"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
    ComposedChart,
    Area
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingDown, Info } from "lucide-react"

interface EvolutionChartProps {
    data: {
        session: string
        projection: number
        reality?: number | null
        date: string
    }[]
    pisi: number
    goal?: number | null
    subscriptionEndIndex?: number
    bmiThresholds?: {
        imc30: number
        imc25: number
    }
}

export function EvolutionChart({
    data,
    pisi,
    goal,
    subscriptionEndIndex,
    bmiThresholds
}: EvolutionChartProps) {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const minY = Math.min(pisi, ...data.map(d => d.projection)) - 5;
    const maxY = Math.max(...data.map(d => d.projection)) + 5;

    if (!isMounted) {
        return (
            <Card className="rounded-[2.5rem] border-none shadow-xl bg-white overflow-hidden">
                <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                        <TrendingDown size={14} className="text-ikonga-coral animate-pulse" />
                        <CardTitle className="text-xl font-serif font-black text-slate-900">Courbe des Phases</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="pt-4">
                    <div className="h-80 w-full bg-slate-50/50 animate-pulse rounded-3xl" />
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="rounded-[2.5rem] border-none shadow-xl bg-white overflow-hidden">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <TrendingDown size={14} className="text-ikonga-coral" />
                            <span className="text-[10px] font-black uppercase tracking-wider text-ikonga-coral">Performances</span>
                        </div>
                        <CardTitle className="text-xl font-serif font-black text-slate-900">Courbe des Phases</CardTitle>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-4 rounded-full bg-ikonga-gradient" />
                            <span className="text-[10px] font-bold text-slate-500 uppercase">Plan</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-0.5 w-4 border-t-2 border-dashed border-slate-300" />
                            <span className="text-[10px] font-bold text-slate-500 uppercase">Réel</span>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-4">
                <div className="h-80 w-full -ml-4 pr-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                            <defs>
                                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#E5488A" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#E5488A" stopOpacity={0} />
                                </linearGradient>
                            </defs>

                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />

                            <XAxis
                                dataKey="session"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                                dy={10}
                            />

                            <YAxis
                                domain={[Math.floor(minY), Math.ceil(maxY)]}
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                                hide
                            />

                            <Tooltip
                                contentStyle={{
                                    borderRadius: '1.5rem',
                                    border: 'none',
                                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                                    padding: '12px'
                                }}
                                labelStyle={{ fontWeight: 900, marginBottom: '4px', color: '#1e293b', fontSize: '12px' }}
                                itemStyle={{ fontWeight: 700, fontSize: '12px' }}
                            />

                            {/* Reference Lines */}
                            <ReferenceLine
                                y={pisi}
                                stroke="#10b981"
                                strokeDasharray="5 5"
                                label={{
                                    value: 'PISI',
                                    position: 'right',
                                    fill: '#10b981',
                                    fontSize: 10,
                                    fontWeight: 900
                                }}
                            />

                            {goal && goal !== pisi && (
                                <ReferenceLine
                                    y={goal}
                                    stroke="#8b5cf6"
                                    strokeDasharray="5 5"
                                    label={{
                                        value: 'OBJECTIF',
                                        position: 'right',
                                        fill: '#8b5cf6',
                                        fontSize: 10,
                                        fontWeight: 900
                                    }}
                                />
                            )}

                            {/* Sub End Line */}
                            {subscriptionEndIndex !== undefined && (
                                <ReferenceLine
                                    x={data[subscriptionEndIndex]?.session}
                                    stroke="#cbd5e1"
                                    strokeWidth={1}
                                    label={{
                                        value: 'FIN ABO',
                                        position: 'top',
                                        fill: '#94a3b8',
                                        fontSize: 8,
                                        fontWeight: 900
                                    }}
                                />
                            )}

                            {/* Area for depth */}
                            <Area
                                type="monotone"
                                dataKey="projection"
                                stroke="none"
                                fill="url(#areaGradient)"
                                animationDuration={2000}
                            />

                            {/* Lines */}
                            <Line
                                type="monotone"
                                dataKey="projection"
                                stroke="#E5488A"
                                strokeWidth={4}
                                dot={{ fill: '#E5488A', strokeWidth: 2, r: 4, stroke: "#fff" }}
                                activeDot={{ r: 6, strokeWidth: 0 }}
                                name="Plan IKONGA"
                                animationDuration={2500}
                            />

                            <Line
                                type="monotone"
                                dataKey="reality"
                                stroke="#cbd5e1"
                                strokeWidth={2}
                                strokeDasharray="5 5"
                                dot={{ fill: '#fff', strokeWidth: 2, r: 4, stroke: "#cbd5e1" }}
                                name="Réalité"
                                connectNulls
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>

                <div className="mt-4 flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                    <Info size={16} className="text-slate-400 shrink-0" />
                    <p className="text-[10px] text-slate-500 leading-relaxed italic">
                        La ligne rose représente ta projection théorique IKONGA. <br />
                        La ligne pointillée suit tes pesées réelles.
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
