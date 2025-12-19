import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"
import { WeighInModal } from "@/components/weigh-in/WeighInModal"
import { WeightChartFull } from "@/components/weigh-in/WeightChartFull"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Card } from "@/components/ui/card"
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
                orderBy: { date: 'asc' },
            }
        }
    });

    if (!dbUser) return <div>Utilisateur introuvable</div>

    // Recent History (Reverse order for list)
    const recentLogs = [...dbUser.dailyLogs].reverse().slice(0, 6);

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
            <div className="bg-white/60 backdrop-blur-md rounded-[2.5rem] p-6 md:p-10 shadow-xl shadow-slate-200/50 border border-slate-100/50 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Scale size={120} className="text-slate-900 rotate-12" />
                </div>
                <WeightChartFull
                    data={dbUser.dailyLogs as any[]}
                    targetWeight={dbUser.targetWeight || undefined}
                />
            </div>

            {/* Action Modal Trigger */}
            <div className="flex justify-center transform transition-transform hover:scale-105 active:scale-95 duration-200">
                <WeighInModal />
            </div>

            {/* Recent History List */}
            <div className="space-y-8">
                <div className="flex items-center justify-between px-2">
                    <h3 className="text-2xl font-serif text-slate-900 tracking-tight">Historique récent</h3>
                    {recentLogs.length > 0 && (
                        <span className="text-sm font-medium text-slate-400">Dernières pesées</span>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recentLogs.map((log) => (
                        <Card key={log.id} className="group overflow-hidden rounded-[2rem] border-none shadow-premium bg-white/50 backdrop-blur-sm hover:bg-white transition-all hover:-translate-y-1 duration-300">
                            <div className="p-6 flex justify-between items-center">
                                <div className="flex flex-col">
                                    <span className="font-serif text-lg text-slate-900 capitalize">
                                        {format(log.date, "EEEE d MMMM", { locale: fr })}
                                    </span>
                                    <span className="text-sm text-slate-400 font-light">
                                        Enregistré à {format(log.date, "HH:mm")}
                                    </span>
                                </div>
                                <div className="flex flex-col items-end">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-ikonga-gradient">
                                            {log.weight}
                                        </span>
                                        <span className="text-sm font-medium text-slate-400">kg</span>
                                    </div>
                                    <div className="h-1.5 w-8 rounded-full bg-slate-100 mt-2 block sm:hidden md:block" />
                                </div>
                            </div>
                        </Card>
                    ))}
                    {recentLogs.length === 0 && (
                        <p className="col-span-full text-center text-slate-400 py-12 bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-100">
                            Aucune pesée enregistrée pour le moment.
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}
