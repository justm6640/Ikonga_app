import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"
import { WeighInModal } from "@/components/weigh-in/WeighInModal"
import { WeightChartFull } from "@/components/weigh-in/WeightChartFull"
import { WeightHistory } from "@/components/weigh-in/WeightHistory"
import { getWeightHistory } from "@/lib/actions/weight"
import { Scale, TrendingDown, Target, Award } from "lucide-react"

export default async function WeighInPage({
    searchParams,
}: {
    searchParams: { page?: string; limit?: string };
}) {
    const page = Number(searchParams.page) || 1;
    const limit = Number(searchParams.limit) || 20;

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || !user.email) return <div>Accès non autorisé</div>

    // Fetch User & All Logs (for chart/stats)
    const dbUser = await prisma.user.findUnique({
        where: { email: user.email },
        include: {
            weighIns: {
                orderBy: { date: 'asc' },
            }
        }
    });

    if (!dbUser) return <div>Utilisateur introuvable</div>

    // Fetch Paginated History using server action
    const historyData = await getWeightHistory(page, limit);

    // All weighIns for the chart (already sorted asc)
    const chartLogs = dbUser.weighIns;

    // Calculate stats based on ALL data
    const currentWeight = dbUser.weighIns[dbUser.weighIns.length - 1]?.weight;
    const startWeight = dbUser.startWeight || (dbUser.weighIns[0]?.weight);
    const targetWeight = dbUser.targetWeight;
    const totalProgress = startWeight && currentWeight ? startWeight - currentWeight : 0;
    const remainingWeight = currentWeight && targetWeight ? currentWeight - targetWeight : 0;

    return (
        <div className="relative max-w-6xl mx-auto pb-32 px-4 sm:px-6 lg:px-8">
            {/* Decorative Background Elements */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-20 right-10 w-96 h-96 bg-gradient-to-br from-pink-200/20 to-orange-200/20 rounded-full blur-3xl" />
                <div className="absolute bottom-40 left-10 w-80 h-80 bg-gradient-to-tr from-purple-200/15 to-pink-200/15 rounded-full blur-3xl" />
            </div>

            {/* Header */}
            <div className="text-center space-y-4 pt-8 pb-8 animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="inline-flex p-4 rounded-3xl bg-gradient-to-br from-ikonga-pink/10 to-orange-400/10 mb-3 shadow-lg shadow-pink-500/10">
                    <Scale className="text-ikonga-pink" size={40} strokeWidth={2.5} />
                </div>
                <h1 className="text-5xl md:text-6xl font-serif font-bold text-slate-900 tracking-tight">
                    Ma Pesée
                </h1>
                <p className="text-slate-500 font-medium max-w-xl mx-auto text-lg">
                    Suis ta progression en toute bienveillance et célèbre chaque étape 💛
                </p>
            </div>

            {/* Stats Cards */}
            {currentWeight && (
                <div className="grid grid-cols-3 gap-2 md:gap-6 mb-8 animate-in fade-in slide-in-from-top-6 duration-700 delay-150">
                    {/* Current Weight */}
                    <div className="group relative bg-gradient-to-br from-white to-slate-50/50 backdrop-blur-sm rounded-2xl md:rounded-3xl p-3 md:p-6 border border-slate-100/50 shadow-lg shadow-slate-200/30 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                        <div className="absolute top-4 right-4 p-2 rounded-2xl bg-ikonga-pink/10 hidden md:block">
                            <Scale size={20} className="text-ikonga-pink" strokeWidth={2.5} />
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] md:text-xs uppercase tracking-wider font-black text-slate-400">Poids</p>
                            <div className="flex items-baseline gap-1 md:gap-2">
                                <span className="text-xl md:text-4xl font-black text-slate-900 tracking-tight">
                                    {currentWeight.toFixed(1)}
                                </span>
                                <span className="text-xs md:text-lg font-bold text-slate-400">kg</span>
                            </div>
                        </div>
                    </div>

                    {/* Progress */}
                    <div className="group relative bg-gradient-to-br from-white to-emerald-50/30 backdrop-blur-sm rounded-2xl md:rounded-3xl p-3 md:p-6 border border-emerald-100/50 shadow-lg shadow-emerald-200/20 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                        <div className="absolute top-4 right-4 p-2 rounded-2xl bg-emerald-500/10 hidden md:block">
                            <TrendingDown size={20} className="text-emerald-500" strokeWidth={2.5} />
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] md:text-xs uppercase tracking-wider font-black text-slate-400">Progrès</p>
                            <div className="flex items-baseline gap-1 md:gap-2">
                                <span className={`text-xl md:text-4xl font-black tracking-tight ${totalProgress > 0 ? 'text-emerald-500' : 'text-slate-400'}`}>
                                    {totalProgress > 0 ? '-' : ''}{Math.abs(totalProgress).toFixed(1)}
                                </span>
                                <span className="text-xs md:text-lg font-bold text-slate-400">kg</span>
                            </div>
                        </div>
                    </div>

                    {/* Remaining */}
                    <div className="group relative bg-gradient-to-br from-white to-purple-50/30 backdrop-blur-sm rounded-2xl md:rounded-3xl p-3 md:p-6 border border-purple-100/50 shadow-lg shadow-purple-200/20 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                        <div className="absolute top-4 right-4 p-2 rounded-2xl bg-purple-500/10 hidden md:block">
                            <Target size={20} className="text-purple-500" strokeWidth={2.5} />
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] md:text-xs uppercase tracking-wider font-black text-slate-400">Objectif</p>
                            <div className="flex items-baseline gap-1 md:gap-2">
                                <span className="text-xl md:text-4xl font-black text-purple-500 tracking-tight">
                                    {targetWeight ? (remainingWeight > 0 ? remainingWeight.toFixed(1) : 'OK') : '--'}
                                </span>
                                <span className="text-xs md:text-lg font-bold text-slate-400">kg</span>
                            </div>
                        </div>
                    </div>

                    {/* Achievement Badge (if goal reached) */}
                    {targetWeight && currentWeight <= targetWeight && (
                        <div className="col-span-3 group relative bg-gradient-to-br from-amber-50 to-orange-50 backdrop-blur-sm rounded-3xl p-4 md:p-6 border border-amber-200/50 shadow-lg shadow-amber-200/30 hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center justify-center gap-2 md:gap-4">
                                <div className="p-2 md:p-3 rounded-2xl bg-amber-400/20">
                                    <Award size={24} className="text-amber-500" strokeWidth={2.5} />
                                </div>
                                <div className="text-center">
                                    <p className="text-lg md:text-2xl font-black text-amber-700">Objectif Atteint ! 🎉</p>
                                    <p className="text-[10px] md:text-sm text-amber-600 font-medium hidden sm:block">Félicitations pour cette magnifique réussite !</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Main Chart Area */}
            <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] p-6 md:p-10 shadow-2xl shadow-slate-300/40 border border-slate-100 relative overflow-hidden group mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                    <Scale size={160} className="text-slate-900 rotate-12" />
                </div>
                <WeightChartFull
                    data={chartLogs as any[]}
                    targetWeight={dbUser.targetWeight || undefined}
                />
            </div>

            {/* Recent History List */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
                <WeightHistory
                    logs={historyData?.logs || []}
                    totalPages={historyData?.totalPages || 1}
                    currentPage={page}
                    pageSize={limit}
                />
            </div>

            {/* Floating Action Button */}
            <div className="fixed bottom-24 md:bottom-8 right-6 md:right-8 z-40">
                <WeighInModal />
            </div>

            {/* Bottom Gradient Fade (for mobile nav) */}
            <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none md:hidden -z-10" />
        </div>
    )
}
