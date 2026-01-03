import { redirect } from "next/navigation"
import { getOrCreateUser } from "@/lib/actions/user"
import { getRecentDailyWellnessLogs } from "@/lib/actions/wellness"
import { WellnessCheckin } from "@/components/wellness/WellnessCheckin"
import prisma from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { WellnessChart } from "@/components/dashboard/WellnessChart"
import { Moon, Sparkles, Zap, AlertCircle, Heart } from "lucide-react"
import { format, startOfDay } from "date-fns"
import { fr } from "date-fns/locale"
import { analyzeTrend } from "@/lib/engines/wellness"
import { cn } from "@/lib/utils"

export default async function WellnessPage() {
    // 1. Authentication & User Fetch
    const user = await getOrCreateUser()
    if (!user) redirect("/login")

    // 2. Fetch today's DailyLog
    const today = startOfDay(new Date())
    const todaysLog = await prisma.dailyLog.findUnique({
        where: {
            userId_date: {
                userId: user.id,
                date: today
            }
        }
    })

    // 3. If no wellness check-in done today, show the form
    if (!todaysLog || todaysLog.wellnessScore === null) {
        return (
            <div className="max-w-4xl mx-auto space-y-8 pb-20 pt-10">
                <div className="text-center space-y-2 mb-10">
                    <h1 className="text-4xl md:text-5xl font-serif font-black text-slate-900 tracking-tight">
                        Douceur & Sérénité
                    </h1>
                    <p className="text-slate-500 font-medium italic">
                        Prends un instant pour toi avant de commencer la journée...
                    </p>
                </div>
                <WellnessCheckin />
            </div>
        )
    }

    // 4. If log exists, show the summary dashboard
    const logs = await getRecentDailyWellnessLogs(user.id, 7)
    const analysis = analyzeTrend(logs as any)

    const chartData = logs.map(l => ({
        date: format(l.date, "dd/MM"),
        score: l.wellnessScore || 0
    })).reverse() // Recharts expects chronological order

    // 5. Get Recommendation based on worst score
    const getRecommendation = () => {
        const { stressLevel = 0, energyLevel = 0, sleepHours = 0 } = todaysLog

        if (stressLevel >= 7) {
            return {
                title: "Priorité Zen",
                content: "Ton niveau de stress est élevé. Prends 5 minutes pour une respiration ventrale profonde ou une courte méditation. Le monde peut attendre.",
                icon: AlertCircle,
                color: "text-rose-500",
                bg: "bg-rose-50"
            }
        }
        if (sleepHours < 6) {
            return {
                title: "Besoin de Repos",
                content: "Ton sommeil a été court cette nuit. Essaie de faire une micro-sieste de 20 min aujourd'hui et privilégie un coucher tôt ce soir.",
                icon: Moon,
                color: "text-indigo-500",
                bg: "bg-indigo-50"
            }
        }
        if (energyLevel < 4) {
            return {
                title: "Boost d'Énergie",
                content: "Ton énergie est basse. Hydrate-toi bien et privilégie des aliments légers et vitalisants aujourd'hui. Ne force pas sur le cardio.",
                icon: Zap,
                color: "text-amber-500",
                bg: "bg-amber-50"
            }
        }
        return {
            title: "Maintien de l'Équilibre",
            content: "Tes indicateurs sont au vert ! Profite de cette belle énergie pour accomplir tes objectifs avec sérénité.",
            icon: Heart,
            color: "text-emerald-500",
            bg: "bg-emerald-50"
        }
    }

    const rec = getRecommendation()

    return (
        <div className="max-w-4xl mx-auto space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2 pt-10 text-center">
                <h1 className="text-4xl md:text-5xl font-serif font-black text-slate-900 tracking-tight">
                    Ton Bilan Bien-être
                </h1>
                <p className="text-slate-500 font-medium italic">
                    {format(new Date(), "EEEE d MMMM", { locale: fr })}
                </p>
            </div>

            {/* Daily Score Hero */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-1 border-none shadow-2xl shadow-indigo-100 rounded-[2.5rem] bg-white overflow-hidden flex flex-col items-center justify-center p-8">
                    <p className="text-[10px] uppercase font-black text-slate-400 tracking-[0.2em] mb-2">Score du jour</p>
                    <div className="relative">
                        <span className="text-7xl font-black text-slate-900">{todaysLog.wellnessScore}</span>
                        <span className="text-xl font-bold text-slate-300 absolute -right-8 bottom-4">/10</span>
                    </div>
                </Card>

                <div className="md:col-span-2 space-y-6">
                    <Card className={cn("border-none shadow-xl rounded-[2.5rem] p-6 flex flex-col justify-center", rec.bg)}>
                        <div className="flex items-start gap-4">
                            <div className={cn("p-3 rounded-2xl bg-white shadow-sm", rec.color)}>
                                <rec.icon size={24} />
                            </div>
                            <div className="space-y-1">
                                <h3 className={cn("text-lg font-black uppercase tracking-tight", rec.color)}>
                                    {rec.title}
                                </h3>
                                <p className="text-slate-700 text-sm leading-relaxed">
                                    {rec.content}
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Wellness Chart */}
            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <div className="h-px flex-1 bg-slate-100" />
                    <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Tendances Récentes</h2>
                    <div className="h-px flex-1 bg-slate-100" />
                </div>
                <WellnessChart data={chartData} analysis={analysis} />
            </div>

            {/* Detailed Recap */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: "Sommeil", value: `${todaysLog.sleepHours}h`, icon: Moon, color: "text-indigo-500" },
                    { label: "Stress", value: `${todaysLog.stressLevel}/10`, icon: AlertCircle, color: "text-purple-500" },
                    { label: "Énergie", value: `${todaysLog.energyLevel}/10`, icon: Zap, color: "text-pink-500" },
                ].map((item) => (
                    <div key={item.label} className="bg-white rounded-3xl p-4 shadow-sm border border-slate-50 flex flex-col items-center gap-2">
                        <item.icon size={16} className={item.color} />
                        <span className="text-sm font-black text-slate-900">{item.value}</span>
                        <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
