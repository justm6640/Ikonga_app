import { getWeightAnalytics } from "@/lib/actions/analytics"
import { ProgressChart } from "./ProgressChart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, Calendar, TrendingDown } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

export async function AnalyticsWidget() {
    const data = await getWeightAnalytics()

    if (!data) return null

    const { projection, chartData, currentWeight, targetWeight, startWeight } = data

    return (
        <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] bg-white overflow-hidden col-span-1 md:col-span-2">
            <CardHeader className="p-8 pb-0 flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-xl font-serif font-bold text-slate-900">
                        Ma Progression
                    </CardTitle>
                    <p className="text-sm text-slate-400 font-medium">Projection vs Réalité</p>
                </div>
                <div className="flex gap-4">
                    <div className="text-right">
                        <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Projection</p>
                        <p className="text-sm font-black text-emerald-500">
                            {format(projection.estimatedEndDate, "d MMMM yyyy", { locale: fr })}
                        </p>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-8">
                {/* KPI Bar */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="p-4 rounded-3xl bg-slate-50 border border-slate-100">
                        <div className="flex items-center gap-2 text-slate-400 mb-1">
                            <TrendingDown size={14} />
                            <span className="text-[10px] uppercase font-bold tracking-tight">Perdu</span>
                        </div>
                        <p className="text-xl font-black text-slate-900">{projection.lostSoFar} <span className="text-xs">kg</span></p>
                    </div>
                    <div className="p-4 rounded-3xl bg-slate-50 border border-slate-100">
                        <div className="flex items-center gap-2 text-slate-400 mb-1">
                            <Target size={14} />
                            <span className="text-[10px] uppercase font-bold tracking-tight">Objectif</span>
                        </div>
                        <p className="text-xl font-black text-slate-900">{targetWeight} <span className="text-xs">kg</span></p>
                    </div>
                    <div className="p-4 rounded-3xl bg-ikonga-gradient text-white shadow-lg shadow-pink-500/20">
                        <div className="flex items-center gap-2 opacity-80 mb-1">
                            <Activity size={14} className="" />
                            <span className="text-[10px] uppercase font-bold tracking-tight">Avancement</span>
                        </div>
                        <p className="text-xl font-black">{projection.percentageDone}%</p>
                    </div>
                </div>

                <ProgressChart
                    data={chartData}
                    minWeight={targetWeight}
                    maxWeight={startWeight}
                />
            </CardContent>
        </Card>
    )
}

function Activity({ size, className }: { size: number, className: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
    )
}
