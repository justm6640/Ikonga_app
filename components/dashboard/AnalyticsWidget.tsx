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
        <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-3xl md:rounded-[2.5rem] bg-white overflow-hidden col-span-1 md:col-span-2">
            <CardHeader className="p-4 md:p-8 pb-0 flex flex-row items-center justify-between">
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

            <CardContent className="p-4 md:p-8">
                {/* KPI Bar */}
                <div className="grid grid-cols-3 gap-2 md:gap-4 mb-8">
                    <div className="p-2 md:p-4 rounded-2xl md:rounded-3xl bg-slate-50 border border-slate-100 flex flex-col justify-center">
                        <div className="flex items-center gap-1 md:gap-2 text-slate-400 mb-1">
                            <TrendingDown size={12} className="md:w-[14px] md:h-[14px]" />
                            <span className="text-[8px] md:text-[10px] uppercase font-bold tracking-tight">Perdu</span>
                        </div>
                        <p className="text-sm md:text-xl font-black text-slate-900 leading-tight">{projection.lostSoFar} <span className="text-[8px] md:text-xs">kg</span></p>
                    </div>
                    <div className="p-2 md:p-4 rounded-2xl md:rounded-3xl bg-slate-50 border border-slate-100 flex flex-col justify-center">
                        <div className="flex items-center gap-1 md:gap-2 text-slate-400 mb-1">
                            <Target size={12} className="md:w-[14px] md:h-[14px]" />
                            <span className="text-[8px] md:text-[10px] uppercase font-bold tracking-tight">Objectif</span>
                        </div>
                        <p className="text-sm md:text-xl font-black text-slate-900 leading-tight">{targetWeight} <span className="text-[8px] md:text-xs">kg</span></p>
                    </div>
                    <div className="p-2 md:p-4 rounded-2xl md:rounded-3xl bg-ikonga-gradient text-white shadow-lg shadow-pink-500/20 flex flex-col justify-center">
                        <div className="flex items-center gap-1 md:gap-2 opacity-80 mb-1">
                            <Activity size={12} className="md:w-[14px] md:h-[14px]" />
                            <span className="text-[8px] md:text-[10px] uppercase font-bold tracking-tight">Avancement</span>
                        </div>
                        <p className="text-sm md:text-xl font-black leading-tight">{projection.percentageDone}%</p>
                    </div>
                </div>

                <div className="w-[calc(100%+2rem)] -ml-4 md:ml-0 md:w-full overflow-hidden">
                    <ProgressChart
                        data={chartData}
                        minWeight={targetWeight}
                        maxWeight={startWeight}
                    />
                </div>
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
