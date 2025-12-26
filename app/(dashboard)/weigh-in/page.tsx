import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"
import { WeighInModal } from "@/components/weigh-in/WeighInModal"
import { WeightChartFull } from "@/components/weigh-in/WeightChartFull"
import { WeightHistoryList } from "@/components/weigh-in/WeightHistoryList"
import { Scale } from "lucide-react"

export default async function WeighInPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || !user.email) return <div>Accès non autorisé</div>

    // Fetch User & Logs
    const dbUser = await prisma.user.findUnique({
        where: { email: user.email },
        include: {
            dailyLogs: {
                where: { weight: { not: null } },
                orderBy: { date: 'desc' }, // Order by date desc for newest first
                take: 20 // Take up to 20 for the history list
            }
        }
    });

    if (!dbUser) return <div>Utilisateur introuvable</div>

    // Sort for chart (ascending)
    const chartLogs = [...dbUser.dailyLogs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return (
        <div className="max-w-5xl mx-auto space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="text-center space-y-3 pt-6">
                <div className="inline-flex p-3 rounded-2xl bg-ikonga-pink/10 mb-2">
                    <Scale className="text-ikonga-pink" size={32} />
                </div>
                <h1 className="text-4xl md:text-5xl font-serif text-slate-900 tracking-tight">Ma Pesée</h1>
                <p className="text-slate-500 font-light max-w-md mx-auto text-lg">
                    Suis ta progression en toute bienveillance et célèbre chaque étape de ton parcours.
                </p>
            </div>

            {/* Main Chart Area (Emphasis) */}
            <div className="bg-white/60 backdrop-blur-md rounded-[2.5rem] p-4 md:p-10 shadow-xl shadow-slate-200/50 border border-slate-100/50 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Scale size={120} className="text-slate-900 rotate-12" />
                </div>
                <WeightChartFull
                    data={chartLogs as any[]}
                    targetWeight={dbUser.targetWeight || undefined}
                />
            </div>

            {/* Action Modal Trigger */}
            <div className="flex justify-center transform transition-transform hover:scale-105 active:scale-95 duration-200">
                <WeighInModal />
            </div>

            {/* Recent History List */}
            <WeightHistoryList logs={dbUser.dailyLogs as any[]} />
        </div>
    )
}
