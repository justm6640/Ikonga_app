import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"
import { WeighInModal } from "@/components/weigh-in/WeighInModal"
import { WeightChartFull } from "@/components/weigh-in/WeightChartFull"
import { WeightHistory } from "@/components/weigh-in/WeightHistory"
import { getWeightHistory } from "@/lib/actions/weight"
import { Scale, TrendingDown, Target, Award, ArrowLeft } from "lucide-react"
import Link from "next/link"

import { redirect } from "next/navigation"
import { startOfDay, isBefore } from "date-fns"

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

    // 🔒 Pre-Cure Access Control: Redirect if before cure start date
    const { isBeforeCureStart } = await import('@/lib/utils/access-control')
    if (dbUser.role !== 'ADMIN' && isBeforeCureStart(dbUser.planStartDate)) {
        redirect("/dashboard")
    }

    // BLOCAGE: Si le programme n'a pas commencé, on redirige vers le dashboard
    const today = startOfDay(new Date());
    const programStart = startOfDay(new Date(dbUser.startDate));

    if (isBefore(today, programStart)) {
        redirect('/dashboard');
    }

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
            <div className="pt-6 sm:pt-8 pb-4 md:pb-8 animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="flex items-center gap-3 md:gap-4 mb-4 sm:mb-6">
                    <Link href="/dashboard">
                        <button className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors shrink-0">
                            <ArrowLeft size={16} className="text-slate-600 sm:w-[18px]" />
                        </button>
                    </Link>
                    <div className="flex flex-col">
                        <h1 className="text-xl sm:text-2xl font-serif font-black text-slate-900 tracking-tight leading-none uppercase">
                            MA PESÉE
                        </h1>
                        <p className="text-[10px] sm:text-xs text-slate-500 font-medium mt-0.5">
                            Suis ta progression en toute bienveillance 💛
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            {currentWeight && (
                <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 mb-8 animate-in fade-in slide-in-from-top-6 duration-700 delay-150">
                    {/* Current Weight */}
                    <div className="group relative bg-gradient-to-br from-white to-slate-50/50 backdrop-blur-sm rounded-xl sm:rounded-3xl p-2.5 sm:p-6 border border-slate-100/50 shadow-lg shadow-slate-200/30 hover:shadow-xl transition-all duration-300">
                        <div className="absolute top-4 right-4 p-2 rounded-2xl bg-ikonga-coral/10 hidden lg:block">
                            <Scale size={20} className="text-ikonga-coral" strokeWidth={2.5} />
                        </div>
                        <div className="space-y-0.5 sm:space-y-1">
                            <p className="text-[8px] sm:text-xs uppercase tracking-wider font-black text-slate-400">Poids</p>
                            <div className="flex items-baseline gap-0.5 sm:gap-2">
                                <span className="text-lg sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                                    {currentWeight.toFixed(1)}
                                </span>
                                <span className="text-[9px] sm:text-lg font-bold text-slate-400">kg</span>
                            </div>
                        </div>
                    </div>

                    {/* Progress */}
                    <div className="group relative bg-gradient-to-br from-white to-emerald-50/30 backdrop-blur-sm rounded-xl sm:rounded-3xl p-2.5 sm:p-6 border border-emerald-100/50 shadow-lg shadow-emerald-200/20 hover:shadow-xl transition-all duration-300">
                        <div className="absolute top-4 right-4 p-2 rounded-2xl bg-emerald-500/10 hidden lg:block">
                            <TrendingDown size={20} className="text-emerald-500" strokeWidth={2.5} />
                        </div>
                        <div className="space-y-0.5 sm:space-y-1">
                            <p className="text-[8px] sm:text-xs uppercase tracking-wider font-black text-slate-400">Progrès</p>
                            <div className="flex items-baseline gap-0.5 sm:gap-2">
                                <span className={`text-lg sm:text-3xl md:text-4xl font-black tracking-tight ${totalProgress > 0 ? 'text-emerald-500' : 'text-slate-400'}`}>
                                    {totalProgress > 0 ? '-' : ''}{Math.abs(totalProgress).toFixed(1)}
                                </span>
                                <span className="text-[9px] sm:text-lg font-bold text-slate-400">kg</span>
                            </div>
                        </div>
                    </div>

                    {/* Remaining */}
                    <div className="group relative bg-gradient-to-br from-white to-purple-50/30 backdrop-blur-sm rounded-xl sm:rounded-3xl p-2.5 sm:p-6 border border-purple-100/50 shadow-lg shadow-purple-200/20 hover:shadow-xl transition-all duration-300">
                        <div className="absolute top-4 right-4 p-2 rounded-2xl bg-purple-500/10 hidden lg:block">
                            <Target size={20} className="text-purple-500" strokeWidth={2.5} />
                        </div>
                        <div className="space-y-0.5 sm:space-y-1">
                            <p className="text-[8px] sm:text-xs uppercase tracking-wider font-black text-slate-400">Objectif</p>
                            <div className="flex items-baseline gap-0.5 sm:gap-2">
                                <span className="text-lg sm:text-3xl md:text-4xl font-black text-purple-500 tracking-tight">
                                    {targetWeight ? (remainingWeight > 0 ? remainingWeight.toFixed(1) : 'OK') : '--'}
                                </span>
                                <span className="text-[9px] sm:text-lg font-bold text-slate-400">kg</span>
                            </div>
                        </div>
                    </div>

                    {/* Achievement Badge (if goal reached) */}
                    {targetWeight && currentWeight <= targetWeight && (
                        <div className="col-span-3 group relative bg-gradient-to-br from-amber-50 to-orange-50 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-3 sm:p-6 border border-amber-200/50 shadow-lg shadow-amber-200/30 hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center justify-center gap-2 md:gap-4">
                                <div className="p-2 rounded-xl sm:rounded-2xl bg-amber-400/20">
                                    <Award size={20} className="text-amber-500 sm:w-6 sm:h-6" strokeWidth={2.5} />
                                </div>
                                <div className="text-center">
                                    <p className="text-base sm:text-2xl font-black text-amber-700">Objectif Atteint ! 🎉</p>
                                    <p className="text-[9px] sm:text-sm text-amber-600 font-medium hidden xs:block">Félicitations pour cette réussite !</p>
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
