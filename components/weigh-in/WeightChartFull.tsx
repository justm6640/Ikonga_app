"use client"

import { useState, useMemo, useEffect } from "react"
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    ReferenceLine,
    TooltipProps
} from "recharts"
import { format, subDays, startOfDay, parseISO, isSameDay, isAfter, isBefore } from "date-fns"
import { fr } from "date-fns/locale"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar as CalendarIcon, Scale } from "lucide-react"
import { cn } from "@/lib/utils"

// Types
interface WeightLog {
    date: Date | string;
    weight: number;
}

interface WeightChartFullProps {
    data: WeightLog[];
    targetWeight?: number;
}

type RangeType = "ALL" | "3D" | "7D" | "1M" | "CUSTOM"

// Composant Tooltip séparé pour plus de propreté et typage
const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
        // On récupère les données étendues passées au graphique
        const data = payload[0].payload;
        return (
            <div className="bg-white/95 backdrop-blur-lg p-4 rounded-2xl border border-slate-100 shadow-2xl shadow-pink-500/10 scale-105 transition-transform">
                <p className="text-[10px] uppercase font-black text-slate-400 mb-1 tracking-widest">
                    {data.fullDate}
                </p>
                <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-orange-400">
                        {Number(payload[0].value).toFixed(1)}
                    </span>
                    <span className="text-xs font-bold text-slate-400">kg</span>
                </div>
            </div>
        );
    }
    return null;
};

export function WeightChartFull({ data, targetWeight }: WeightChartFullProps) {
    const [range, setRange] = useState<RangeType>("ALL")
    const [customStart, setCustomStart] = useState<string>("")
    const [customEnd, setCustomEnd] = useState<string>("")
    const [showCustomDates, setShowCustomDates] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    // 1. Filtrage des données
    const filteredData = useMemo(() => {
        // Normalisation des dates pour le tri
        const sorted = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

        if (range === "ALL") return sorted;

        const today = startOfDay(new Date())

        if (range === "3D") {
            const cutoff = subDays(today, 2); // 2 jours avant + aujourd'hui = 3 jours
            return sorted.filter(log => {
                const logDate = startOfDay(new Date(log.date));
                return isAfter(logDate, cutoff) || isSameDay(logDate, cutoff);
            });
        }

        if (range === "7D") {
            const cutoff = subDays(today, 6); // 6 jours avant + aujourd'hui = 7 jours
            return sorted.filter(log => {
                const logDate = startOfDay(new Date(log.date));
                return isAfter(logDate, cutoff) || isSameDay(logDate, cutoff);
            });
        }

        if (range === "1M") {
            const cutoff = subDays(today, 29);
            return sorted.filter(log => {
                const logDate = startOfDay(new Date(log.date));
                return isAfter(logDate, cutoff) || isSameDay(logDate, cutoff);
            });
        }

        if (range === "CUSTOM") {
            if (!customStart && !customEnd) return sorted;

            const start = customStart ? startOfDay(parseISO(customStart)) : new Date(0);
            const end = customEnd ? startOfDay(parseISO(customEnd)) : new Date(8640000000000000);

            return sorted.filter(log => {
                const logDate = startOfDay(new Date(log.date));
                // Inclusive check
                return (isAfter(logDate, start) || isSameDay(logDate, start)) &&
                    (isBefore(logDate, end) || isSameDay(logDate, end));
            });
        }

        return sorted;
    }, [data, range, customStart, customEnd]);

    // Initialisation des dates custom lors de l'activation
    const handleCustomRangeEnable = () => {
        // 1. On force l'affichage du mode Custom
        setRange("CUSTOM");

        // 2. Si on était déjà en custom, on toggle juste l'affichage des inputs
        if (range === "CUSTOM") {
            setShowCustomDates(prev => !prev);
            return;
        }

        // 3. Si on vient d'un autre mode, on ouvre et on initialise
        setShowCustomDates(true);

        // Initialisation des dates par défaut si vides
        if (!customStart || !customEnd) {
            if (data && data.length > 0) {
                const sorted = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                setCustomStart(format(new Date(sorted[0].date), "yyyy-MM-dd"));
                setCustomEnd(format(new Date(sorted[sorted.length - 1].date), "yyyy-MM-dd"));
            } else {
                const today = format(new Date(), "yyyy-MM-dd");
                setCustomStart(today);
                setCustomEnd(today);
            }
        }
    }

    // 2. Formatage pour Recharts
    const chartData = filteredData.map(log => ({
        ...log,
        // On formate ici pour éviter de le faire dans le render du Tooltip
        dateStr: format(new Date(log.date), "dd MMM", { locale: fr }),
        fullDate: format(new Date(log.date), "PPP", { locale: fr })
    }));

    // 3. Calcul du domaine Y (Min/Max)
    const weights = filteredData.map(d => d.weight);

    // Valeurs par défaut si pas de données
    const minDataWeight = weights.length > 0 ? Math.min(...weights) : 0;
    const maxDataWeight = weights.length > 0 ? Math.max(...weights) : 100;

    // On inclut le targetWeight dans le calcul du domaine pour qu'il soit toujours visible
    const minDomain = targetWeight
        ? Math.min(minDataWeight, targetWeight)
        : minDataWeight;

    const maxDomain = targetWeight
        ? Math.max(maxDataWeight, targetWeight)
        : maxDataWeight;

    // On ajoute une marge de +/- 2kg pour l'esthétique
    const yDomain = [
        Math.floor(minDomain - 2),
        Math.ceil(maxDomain + 2)
    ];

    return (
        <Card className="w-full border-none shadow-none bg-transparent">
            <CardHeader className="px-0 md:px-6 pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <CardTitle className="text-xl font-serif font-bold text-slate-900">Evolution</CardTitle>

                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    <div className="flex p-1 bg-slate-100 rounded-xl w-full sm:w-auto overflow-x-auto no-scrollbar">
                        {(["3D", "7D", "1M", "ALL"] as const).map((r) => (
                            <button
                                key={r}
                                onClick={() => { setRange(r); setShowCustomDates(false); }}
                                className={cn(
                                    "flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap",
                                    range === r ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                                )}
                            >
                                {r === "3D" ? "3 jours" : r === "7D" ? "7 jours" : r === "1M" ? "1 mois" : "Tout"}
                            </button>
                        ))}

                        <button
                            onClick={handleCustomRangeEnable}
                            className={cn(
                                "flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 whitespace-nowrap",
                                range === "CUSTOM" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                            )}
                        >
                            <CalendarIcon size={12} />
                            Personnalisé
                        </button>
                    </div>
                </div>
            </CardHeader>

            {showCustomDates && (
                <div className="mb-6 mx-0 md:mx-6 p-4 bg-slate-50/80 backdrop-blur-sm rounded-3xl flex flex-wrap items-center gap-4 animate-in zoom-in-95 duration-300 border border-slate-100">
                    <div className="flex flex-col gap-1.5 flex-1 min-w-[120px]">
                        <label className="text-[10px] uppercase font-black text-slate-400 ml-1 tracking-widest">Du</label>
                        <input
                            type="date"
                            value={customStart}
                            onChange={(e) => setCustomStart(e.target.value)}
                            className="bg-white border-none rounded-2xl px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm focus:ring-2 focus:ring-pink-500 outline-none transition-all"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5 flex-1 min-w-[120px]">
                        <label className="text-[10px] uppercase font-black text-slate-400 ml-1 tracking-widest">Au</label>
                        <input
                            type="date"
                            value={customEnd}
                            onChange={(e) => setCustomEnd(e.target.value)}
                            className="bg-white border-none rounded-2xl px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm focus:ring-2 focus:ring-pink-500 outline-none transition-all"
                        />
                    </div>
                </div>
            )}

            <CardContent className="px-0 relative">
                {!mounted ? (
                    <div className="h-[300px] md:h-[400px] flex flex-col items-center justify-center text-slate-400 gap-2">
                        <Scale size={32} className="opacity-20" />
                        <p className="text-sm font-medium">Chargement...</p>
                    </div>
                ) : filteredData.length === 0 ? (
                    <div className="h-[300px] md:h-[400px] flex flex-col items-center justify-center text-slate-400 gap-2">
                        <Scale size={32} className="opacity-20" />
                        <p className="text-sm font-medium">Aucune donnée sur cette période</p>
                    </div>
                ) : (
                    <div className="h-[300px] md:h-[400px] w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={chartData}
                                margin={{ top: 10, right: 0, left: -25, bottom: 0 }}
                            >
                                <defs>
                                    <linearGradient id="colorWeightMain" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#E5488A" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="#E5488A" stopOpacity={0.01} />
                                    </linearGradient>
                                    <linearGradient id="ikonga-gradient-stroke" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="#E5488A" />
                                        <stop offset="100%" stopColor="#FB923C" />
                                    </linearGradient>
                                </defs>

                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" opacity={0.6} />

                                <XAxis
                                    dataKey="dateStr"
                                    tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 800 }}
                                    axisLine={false}
                                    tickLine={false}
                                    tickMargin={15}
                                    minTickGap={15}
                                />

                                <YAxis
                                    domain={yDomain}
                                    tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 800 }}
                                    axisLine={false}
                                    tickLine={false}
                                    tickMargin={10}
                                    hide={false}
                                />

                                <Tooltip content={<CustomTooltip />} />

                                {targetWeight && (
                                    <ReferenceLine
                                        y={targetWeight}
                                        stroke="#10b981"
                                        strokeDasharray="6 4"
                                        strokeWidth={2}
                                        label={{
                                            position: 'insideTopRight',
                                            value: `Objectif: ${targetWeight}kg`,
                                            fill: '#10b981',
                                            fontSize: 10,
                                            fontWeight: 900,
                                            offset: 10,
                                            className: "uppercase tracking-tighter"
                                        }}
                                    />
                                )}

                                <Area
                                    type="monotone"
                                    dataKey="weight"
                                    stroke="url(#ikonga-gradient-stroke)"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorWeightMain)"
                                    activeDot={{ r: 8, fill: '#E5488A', strokeWidth: 4, stroke: '#fff' }}
                                    animationDuration={1500}
                                    connectNulls
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}