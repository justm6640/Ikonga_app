import { getNutritionData } from "@/lib/actions/nutrition"
import { getOrCreateUser } from "@/lib/actions/user"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShoppingBasket, Calendar, Info, Lock } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MenuVisualizer } from "@/components/nutrition/MenuVisualizer"
import { PhaseGuidelines } from "@/components/nutrition/PhaseGuidelines"
import { WeeklyMenuGrid } from "@/components/dashboard/WeeklyMenuGrid"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { format, addWeeks, startOfWeek, isAfter, isBefore } from "date-fns"
import { fr } from "date-fns/locale"
import Link from "next/link"

export default async function NutritionPage() {
    const user = await getOrCreateUser()
    if (!user) redirect("/login")

    const nutritionData = await getNutritionData()

    // 1. Loading/Empty State (Simplified like FitnessPage)
    if (!nutritionData) {
        const activePhase = user.phases[0]?.type || "DETOX"
        return (
            <div className="max-w-4xl mx-auto p-6 text-center py-20 animate-in fade-in duration-700">
                <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6">
                    <ShoppingBasket className="text-slate-300" size={40} />
                </div>
                <h1 className="text-3xl font-serif font-black text-slate-900 mb-4 uppercase tracking-tighter">Nutrition à venir</h1>
                <p className="text-slate-500 max-w-md mx-auto italic font-medium">
                    Ton menu personnalisé pour la phase {activePhase} est en cours de préparation par Rosy.
                </p>
                <div className="mt-8">
                    <Link href="/dashboard">
                        <Button variant="outline" className="rounded-full px-8 border-slate-200 text-slate-500 font-bold uppercase tracking-widest text-xs">
                            Retour au Dashboard
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    // 2. Fetch Weekly Plan for the Week Tab
    const weeklyPlan = await prisma.weeklyPlan.findFirst({
        where: { userId: user.id },
        orderBy: { weekStart: 'desc' }
    })

    // 3. Prepare Phase Timeline
    const activePhase = user.phases[0]
    const phaseWeeks = []
    if (activePhase?.startDate) {
        const start = startOfWeek(activePhase.startDate, { weekStartsOn: 1 })
        for (let i = 0; i < 4; i++) { // Show 4 weeks of the phase
            const weekStart = addWeeks(start, i)
            const isLocked = isAfter(weekStart, addWeeks(new Date(), 1)) // Lock more than 1 week ahead
            phaseWeeks.push({
                weekStart,
                label: `Semaine ${i + 1}`,
                isLocked,
                date: weekStart
            })
        }
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700 px-4 sm:px-6">

            {/* Hero Header */}
            <header className="pt-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <Badge className="bg-pillar-nutrition/10 text-pillar-nutrition border-none font-black uppercase tracking-widest px-4 py-1 rounded-full text-[10px]">
                            Module Nutrition
                        </Badge>
                        <Badge variant="outline" className="border-slate-200 text-slate-400 font-bold bg-slate-50/50 uppercase tracking-widest px-3 py-1 rounded-full text-[10px]">
                            Phase {nutritionData.phase}
                        </Badge>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif font-black text-slate-900 leading-none tracking-tighter">
                        Ma Nutrition
                    </h1>
                    <p className="text-slate-400 font-medium italic text-sm md:text-base">
                        "Que ton aliment soit ta seule médecine."
                    </p>
                </div>

                <Link href="/shopping-list">
                    <Button className="rounded-full h-14 px-8 bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-slate-200 group">
                        <ShoppingBasket className="mr-3 group-hover:scale-110 transition-transform" size={18} />
                        Liste de courses
                    </Button>
                </Link>
            </header>

            {/* Navigation Tabs */}
            <Tabs defaultValue="today" className="w-full">
                <TabsList className="bg-slate-100/50 p-1 rounded-full h-auto mb-10 overflow-x-auto justify-start no-scrollbar">
                    <TabsTrigger value="today" className="rounded-full px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold uppercase tracking-widest text-[10px]">Aujourd'hui</TabsTrigger>
                    <TabsTrigger value="week" className="rounded-full px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold uppercase tracking-widest text-[10px]">Ma Semaine</TabsTrigger>
                    <TabsTrigger value="phase" className="rounded-full px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold uppercase tracking-widest text-[10px]">Ma Phase</TabsTrigger>
                    <TabsTrigger value="create" className="rounded-full px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold uppercase tracking-widest text-[10px]">Créer</TabsTrigger>
                </TabsList>

                {/* Tab: Today */}
                <TabsContent value="today" className="mt-0 space-y-8 animate-in fade-in duration-500">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="flex items-center justify-between px-2">
                                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Le Menu du Jour</h2>
                                <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full">
                                    {format(new Date(), "EEEE d MMMM", { locale: fr })}
                                </span>
                            </div>
                            <MenuVisualizer
                                menu={nutritionData.menu}
                                isCompleted={nutritionData.isCompleted}
                                date={new Date()}
                            />
                        </div>
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 px-2">
                                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 whitespace-nowrap">Directives Phase</h2>
                                <div className="h-px w-full bg-slate-100" />
                            </div>
                            <PhaseGuidelines
                                allowed={nutritionData.guidelines.allowed}
                                forbidden={nutritionData.guidelines.forbidden}
                            />
                        </div>
                    </div>
                </TabsContent>

                {/* Tab: Week */}
                <TabsContent value="week" className="mt-0 animate-in fade-in duration-500">
                    <WeeklyMenuGrid weeklyPlan={weeklyPlan} phase={nutritionData.phase} />
                </TabsContent>

                {/* Tab: Phase Timeline */}
                <TabsContent value="phase" className="mt-0 animate-in fade-in duration-500">
                    <div className="space-y-6">
                        <div className="px-2">
                            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Progression de la Phase</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                            {phaseWeeks.map((week, idx) => (
                                <TooltipProvider key={idx}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Card className={cn(
                                                "rounded-3xl border-none shadow-sm transition-all relative overflow-hidden h-40 flex flex-col justify-center items-center text-center",
                                                week.isLocked ? "bg-slate-50 opacity-60" : "bg-white hover:shadow-lg hover:shadow-slate-200/50 cursor-pointer"
                                            )}>
                                                <CardContent className="p-0">
                                                    {week.isLocked ? (
                                                        <>
                                                            <div className="p-3 rounded-2xl bg-slate-100 text-slate-400 mb-3">
                                                                <Lock size={20} />
                                                            </div>
                                                            <span className="text-xs font-black uppercase tracking-widest text-slate-400">{week.label}</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className="p-3 rounded-2xl bg-ikonga-pink/10 text-ikonga-pink mb-3">
                                                                <Calendar size={20} />
                                                            </div>
                                                            <span className="text-xs font-black uppercase tracking-widest text-slate-900">{week.label}</span>
                                                            <span className="text-[10px] font-bold text-slate-400 block mt-1">Du {format(week.weekStart, "d MMM", { locale: fr })}</span>
                                                        </>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p className="font-bold text-xs uppercase tracking-widest">
                                                {week.isLocked ? `Disponible le ${format(week.weekStart, "d MMMM", { locale: fr })}` : "Voir le détail"}
                                            </p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            ))}
                        </div>
                    </div>
                </TabsContent>

                {/* Tab: Create (Coming Soon) */}
                <TabsContent value="create" className="mt-0 animate-in fade-in duration-500">
                    <Card className="rounded-[3rem] border-dashed border-ikonga-pink/30 bg-ikonga-pink/[0.02] py-20 text-center">
                        <CardContent className="space-y-6">
                            <div className="w-16 h-16 rounded-full bg-ikonga-pink/10 flex items-center justify-center mx-auto">
                                <Info className="text-ikonga-pink" size={32} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-serif font-black text-slate-900 uppercase tracking-tighter">Menu Creator</h3>
                                <p className="text-slate-500 max-w-sm mx-auto italic text-sm">
                                    Une fonctionnalité premium arrive bientôt ! Vous pourrez personnaliser entièrement vos menus en fonction de vos préférences et de vos stocks.
                                </p>
                            </div>
                            <Badge className="bg-ikonga-pink text-white border-none font-black uppercase tracking-widest px-6 py-2 rounded-full text-[10px] animate-pulse">
                                Coming Soon
                            </Badge>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
