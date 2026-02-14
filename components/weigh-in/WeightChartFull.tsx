"use client"

import { useMemo, useState, useEffect } from "react"
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    ReferenceLine,
} from "recharts"
import { format, subDays, isAfter } from "date-fns"
import { fr } from "date-fns/locale"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar as CalendarIcon, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface WeightChartFullProps {
    data: { date: string | Date; weight: number }[];
    startWeight: number;
    targetWeight: number;
}

type TimeRange = "3D" | "7D" | "30D" | "ALL" | "CUSTOM";

export function WeightChartFull({ data, startWeight, targetWeight }: WeightChartFullProps) {
    const [range, setRange] = useState<TimeRange>("7D")
    const [showCustomDates, setShowCustomDates] = useState(false)
    const [customStart, setCustomStart] = useState<string>("")
    const [customEnd, setCustomEnd] = useState<string>("")
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    // Filter and sort data
    const filteredData = useMemo(() => {
        let result = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

        if (range === "ALL") return result

        if (range === "CUSTOM") {
            if (!customStart || !customEnd) return result
            const startStr = new Date(customStart).getTime()
            const endStr = new Date(customEnd).getTime()
            return result.filter(item => {
                const time = new Date(item.date).getTime()
                return time >= startStr && time <= (endStr + 86400000)
            })
        }

        const days = range === "3D" ? 3 : range === "7D" ? 7 : 30
        const cutoff = subDays(new Date(), days)
        return result.filter(item => isAfter(new Date(item.date), cutoff))
    }, [data, range, customStart, customEnd])

    const latestWeight = data.length > 0 ? data[data.length - 1].weight : 0
    const totalLoss = startWeight > 0 ? (startWeight - latestWeight).toFixed(1) : "0"

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload
            return (
                <div className="bg-white/95 backdrop-blur-xl p-4 rounded-[1.5rem] shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-300">
                    <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-1">
                        {format(new Date(data.date), "EEE. d MMMM", { locale: fr })}
                    </p>
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black bg-gradient-to-br from-pink-500 to-orange-400 bg-clip-text text-transparent">
                            {data.weight.toFixed(1)}
                        </span>
                        <span className="text-sm font-bold text-slate-400">kg</span>
                    </div>
                </div>
            )
        }
        return null
    }

    if (!isMounted) {
        return (
            <Card className="rounded-[2.5rem] border-none shadow-xl bg-white/70 backdrop-blur-xl overflow-hidden">
                <CardHeader className="p-8 pb-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-orange-400 flex items-center justify-center text-white shadow-lg shadow-pink-200 animate-pulse">
                            <TrendingDown size={24} />
                        </div>
                        <div>
                            <CardTitle className="text-2xl font-black text-slate-900 tracking-tight">Courbe de Poids</CardTitle>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-8">
                    <div className="h-[300px] md:h-[400px] w-full bg-slate-50/50 animate-pulse rounded-3xl" />
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="rounded-[2.5rem] border-none shadow-xl bg-white/70 backdrop-blur-xl overflow-hidden">
            <CardHeader className="p-4 sm:p-8 pb-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-pink-500 to-orange-400 flex items-center justify-center text-white shadow-lg shadow-pink-200 shrink-0">
                            <TrendingDown size={20} className="sm:w-6 sm:h-6" />
                        </div>
                        <div>
                            <CardTitle className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Courbe de Poids</CardTitle>
                            <p className="text-[10px] sm:text-sm font-bold text-emerald-500 mt-0.5">-{totalLoss} kg au total ✨</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-1 p-1 bg-slate-100/80 rounded-xl sm:rounded-2xl border border-slate-200/50 self-start md:self-auto overflow-x-auto max-w-full scrollbar-none">
                        {(["3D", "7D", "30D", "ALL"] as const).map((r) => (
                            <button
                                key={r}
                                onClick={() => { setRange(r); setShowCustomDates(false); }}
                                className={cn(
                                    "px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black transition-all duration-300 shrink-0",
                                    range === r
                                        ? "bg-white text-slate-900 shadow-sm scale-105"
                                        : "text-slate-400 hover:text-slate-600"
                                )}
                            >
                                {r === "3D" ? "3J" : r === "7D" ? "7J" : r === "30D" ? "30J" : "TOUT"}
                            </button>
                        ))}
                        <button
                            onClick={() => { setRange("CUSTOM"); setShowCustomDates(!showCustomDates); }}
                            className={cn(
                                "flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black transition-all duration-300 shrink-0",
                                range === "CUSTOM"
                                    ? "bg-white text-slate-900 shadow-sm scale-105"
                                    : "text-slate-400 hover:text-slate-600"
                            )}
                        >
                            <CalendarIcon size={12} className="sm:w-3.5 sm:h-3.5" />
                            <span>PERSO</span>
                        </button>
                    </div>
                </div>

                {showCustomDates && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        className="mt-6 p-6 bg-slate-50/80 rounded-[2rem] border border-slate-200/50 flex flex-col sm:flex-row items-center gap-4"
                    >
                        <div className="flex-1 w-full space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">Du</label>
                            <input
                                type="date"
                                value={customStart}
                                onChange={(e) => setCustomStart(e.target.value)}
                                className="w-full bg-white rounded-xl p-3 text-sm font-bold border-none shadow-sm focus:ring-2 focus:ring-pink-200"
                            />
                        </div>
                        <div className="flex-1 w-full space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">Au</label>
                            <input
                                type="date"
                                value={customEnd}
                                onChange={(e) => setCustomEnd(e.target.value)}
                                className="w-full bg-white rounded-xl p-3 text-sm font-bold border-none shadow-sm focus:ring-2 focus:ring-pink-200"
                            />
                        </div>
                    </motion.div>
                )}
            </CardHeader>

            <CardContent className="p-0 sm:p-4">
                <div className="h-[280px] sm:h-[300px] md:h-[400px] w-full pt-8">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={filteredData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#E5488A" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#FB923C" stopOpacity={0.01} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid vertical={false} stroke="#f1f5f9" strokeDasharray="8 8" />
                            <XAxis
                                dataKey="date"
                                hide={range === "3D" || range === "7D"}
                                tickFormatter={(str) => format(new Date(str), "d MMM", { locale: fr })}
                                tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 800 }}
                                axisLine={false}
                                tickLine={false}
                                dy={10}
                            />
                            <YAxis
                                domain={['dataMin - 2', 'dataMax + 2']}
                                tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 800 }}
                                axisLine={false}
                                tickLine={false}
                                dx={-10}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#f1f5f9', strokeWidth: 2 }} />

                            {targetWeight > 0 && (
                                <ReferenceLine
                                    y={targetWeight}
                                    stroke="#10b981"
                                    strokeDasharray="12 8"
                                    strokeWidth={2}
                                    label={{
                                        position: 'right',
                                        value: `Objectif ${targetWeight}kg`,
                                        fill: '#10b981',
                                        fontSize: 10,
                                        fontWeight: 900,
                                        className: "tracking-widest uppercase"
                                    }}
                                />
                            )}

                            <Area
                                type="monotone"
                                dataKey="weight"
                                stroke="url(#colorWeight)"
                                strokeWidth={5}
                                fillOpacity={1}
                                fill="url(#colorWeight)"
                                animationDuration={2000}
                                activeDot={{ r: 8, strokeWidth: 4, stroke: '#fff', fill: '#E5488A' }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}