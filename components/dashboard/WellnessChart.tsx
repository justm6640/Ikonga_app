"use client"

import { useEffect, useState } from "react"
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AnalysisResult, WellnessTrend } from "@/lib/engines/wellness"
import { cn } from "@/lib/utils"
import { Activity, AlertTriangle, TrendingUp, TrendingDown, Minus } from "lucide-react"

interface WellnessChartProps {
    data: any[]
    analysis: AnalysisResult
}

const TrendBadge = ({ status, message }: { status: WellnessTrend, message: string }) => {
    const styles = {
        [WellnessTrend.CRITICAL]: "bg-red-50 text-red-600 border-red-100",
        [WellnessTrend.DECLINING]: "bg-orange-50 text-orange-600 border-orange-100",
        [WellnessTrend.IMPROVING]: "bg-emerald-50 text-emerald-600 border-emerald-100",
        [WellnessTrend.STABLE]: "bg-blue-50 text-blue-600 border-blue-100",
    }

    const icons = {
        [WellnessTrend.CRITICAL]: AlertTriangle,
        [WellnessTrend.DECLINING]: TrendingDown,
        [WellnessTrend.IMPROVING]: TrendingUp,
        [WellnessTrend.STABLE]: Minus,
    }

    const Icon = icons[status]

    return (
        <div className={cn("flex items-center gap-2 p-3 rounded-2xl border text-xs font-bold", styles[status])}>
            <Icon size={16} />
            <span>{message}</span>
        </div>
    )
}

export function WellnessChart({ data, analysis }: WellnessChartProps) {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) {
        return (
            <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] bg-white overflow-hidden">
                <div className="h-[430px] flex items-center justify-center text-slate-300">
                    <Activity className="animate-pulse" size={40} />
                </div>
            </Card>
        )
    }

    return (
        <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] bg-white overflow-hidden">
            <CardHeader className="p-8 pb-0">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <CardTitle className="text-xl font-serif font-bold text-slate-900 flex items-center gap-2">
                            <Activity className="text-ikonga-coral" size={20} /> Équilibre Life
                        </CardTitle>
                        <p className="text-sm text-slate-400 font-medium">Évolution Bien-être (7j)</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Score Moyen</p>
                        <p className="text-2xl font-black text-slate-900">{analysis.averageScore}<span className="text-xs text-slate-300">/10</span></p>
                    </div>
                </div>
                <TrendBadge status={analysis.status} message={analysis.message} />
            </CardHeader>

            <CardContent className="p-0 mt-4">
                <div className="h-[240px] px-8 pb-8">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorWellness" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.15} />
                                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                            />
                            <YAxis
                                domain={[0, 10]}
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                                ticks={[0, 5, 10]}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                labelStyle={{ fontWeight: 'bold', color: '#64748b' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="score"
                                stroke="#ec4899"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorWellness)"
                                dot={{ r: 4, fill: '#ec4899', strokeWidth: 2, stroke: '#fff' }}
                                activeDot={{ r: 6, strokeWidth: 0 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
