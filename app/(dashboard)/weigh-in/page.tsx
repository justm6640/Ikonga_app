import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"
import { WeighInModal } from "@/components/weigh-in/WeighInModal"
import { WeightChartFull } from "@/components/weigh-in/WeightChartFull"
import { WeightHistory } from "@/components/weigh-in/WeightHistory"
import { getWeightHistory } from "@/lib/actions/weight"
import { Scale, TrendingDown, Target, Award, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function WeighInPage(props: {
    searchParams: Promise<{ page?: string; limit?: string }>;
}) {
    const searchParams = await props.searchParams;
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
            <div className="pt-8 pb-6 md:pb-8 animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="flex items-center gap-3 md:gap-4 mb-6">
                    <Link href="/dashboard">
                        <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors">
                            <ArrowLeft size={18} className="text-slate-600" />
                        </button>
                    </Link>
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-serif font-black text-slate-900 tracking-tight leading-none uppercase">
                            MA PESÉE
                        </h1>
                        <p className="text-xs text-slate-500 font-medium">
                            Suis ta progression en toute bienveillance et célèbre chaque étape 💛
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            {currentWeight && (
                <div className="grid grid-cols-3 gap-3 md:gap-6 mb-8 animate-in fade-in slide-in-from-top-6 duration-700 delay-150">
                    {/* Current Weight */}
                    <div className="group relative bg-gradient-to-br from-white to-slate-50/50 backdrop-blur-sm rounded-2xl md:rounded-3xl p-4 md:p-6 border border-slate-100/50 shadow-lg shadow-slate-200/30 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                        <div className="absolute top-3 right-3 md:top-4 md:right-4 p-2 rounded-2xl bg-ikonga-coral/10 hidden md:block">
                            <Scale size={20} className="text-ikonga-coral" strokeWidth={2.5} />
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] md:text-xs uppercase tracking-wider font-black text-slate-400">Poids</p>
                            <div className="flex items-baseline gap-1 md:gap-2">
                                <span className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">
                                    {currentWeight.toFixed(1)}
                                </span>
                                <span className="text-sm md:text-lg font-bold text-slate-400">kg</span>
                            </div>
                        </div>
                    </div>

                    {/* Progress */}
                    <div className="group relative bg-gradient-to-br from-white to-emerald-50/30 backdrop-blur-sm rounded-2xl md:rounded-3xl p-4 md:p-6 border border-emerald-100/50 shadow-lg shadow-emerald-200/20 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                        <div className="absolute top-3 right-3 md:top-4 md:right-4 p-2 rounded-2xl bg-emerald-500/10 hidden md:block">
                            <TrendingDown size={20} className="text-emerald-500" strokeWidth={2.5} />
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] md:text-xs uppercase tracking-wider font-black text-slate-400">Progrès</p>
                            <div className="flex items-baseline gap-1 md:gap-2">
                                <span className={`text-2xl md:text-4xl font-black tracking-tight ${totalProgress > 0 ? 'text-emerald-500' : 'text-slate-400'}`}>
                                    {totalProgress > 0 ? '-' : ''}{Math.abs(totalProgress).toFixed(1)}
                                </span>
                                <span className="text-sm md:text-lg font-bold text-slate-400">kg</span>
                            </div>
                        </div>
                    </div>

                    {/* Remaining */}
                    <div className="group relative bg-gradient-to-br from-white to-purple-50/30 backdrop-blur-sm rounded-2xl md:rounded-3xl p-4 md:p-6 border border-purple-100/50 shadow-lg shadow-purple-200/20 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                        <div className="absolute top-3 right-3 md:top-4 md:right-4 p-2 rounded-2xl bg-purple-500/10 hidden md:block">
                            <Target size={20} className="text-purple-500" strokeWidth={2.5} />
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] md:text-xs uppercase tracking-wider font-black text-slate-400">Objectif</p>
                            <div className="flex items-baseline gap-1 md:gap-2">
                                <span className="text-2xl md:text-4xl font-black text-purple-500 tracking-tight">
                                    {targetWeight ? (remainingWeight > 0 ? remainingWeight.toFixed(1) : 'OK') : '--'}
                                </span>
                                <span className="text-sm md:text-lg font-bold text-slate-400">kg</span>
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
            <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                <WeightChartFull
                    data={chartLogs as any[]}
                    startWeight={dbUser.startWeight || (dbUser.weighIns[0]?.weight || 0)}
                    targetWeight={dbUser.targetWeight || 0}
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
            <div className="fixed bottom-24 md:bottom-8 right-4 sm:right-6 md:right-8 z-40">
                <WeighInModal />
            </div>

            {/* Bottom Gradient Fade (for mobile nav) */}
            <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none md:hidden -z-10" />
        </div>
    )
}
