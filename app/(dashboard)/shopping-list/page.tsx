import { getShoppingList } from "@/lib/actions/shopping"
import { ShoppingListView } from "@/components/dashboard/ShoppingListView"
import { WeeklyMenuGrid } from "@/components/dashboard/WeeklyMenuGrid"
import { Lightbulb, Sparkles } from "lucide-react"

export const metadata = {
    title: "Menus & Liste | IKONGA",
    description: "Retrouvez vos menus de la semaine et la liste de courses associée.",
}

import { protectFeature } from "@/lib/security/permissions"

export default async function ShoppingListPage() {
    await protectFeature("SHOPPING_LIST")
    const data = await getShoppingList()

    if (data.error) {
        console.error(data.error)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50/30">
            {/* Premium Header with Glassmorphism */}
            <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100/60 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-serif font-normal text-slate-900 tracking-tight">
                                Menus & Liste
                            </h1>
                            <p className="text-base text-slate-600 font-light mt-2">
                                Votre plan nutritionnel personnalisé
                            </p>
                        </div>

                        {/* Phase Badge */}
                        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-50 to-orange-50 border border-pink-100 rounded-full shadow-sm shadow-pink-200/50">
                            <Sparkles size={16} className="text-ikonga-pink" />
                            <span className="text-sm font-semibold text-pink-700 uppercase tracking-wider">
                                Phase {data.phaseName}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="flex flex-col gap-12">

                    {/* Top Section: Weekly Menu (Full Width) */}
                    <section className="space-y-6">
                        <WeeklyMenuGrid
                            weeklyPlan={data.weeklyPlan}
                            phase={data.phaseName}
                        />
                    </section>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mt-8 pt-12 border-t border-slate-100">
                        {/* Left Column: Action Zone / Shopping List (7 cols) */}
                        <div className="lg:col-span-8">
                            <div className="rounded-[2.5rem] overflow-hidden shadow-xl shadow-slate-200/60 border border-slate-100/40 transform transition-all duration-300 hover:shadow-2xl hover:shadow-slate-200/70">
                                <ShoppingListView
                                    initialIngredients={data.ingredients as any}
                                    phaseName={data.phaseName}
                                />
                            </div>
                        </div>

                        {/* Right Column: Coach Tip (4 cols) */}
                        <div className="lg:col-span-4 space-y-6">
                            <div className="group rounded-[2rem] bg-white/60 backdrop-blur-sm border-2 border-ikonga-pink/20 p-8 shadow-lg shadow-ikonga-pink/5 hover:shadow-xl hover:shadow-ikonga-pink/10 transition-all duration-300">
                                <div className="flex flex-col items-start gap-5">
                                    <div className="shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-ikonga-pink to-ikonga-orange flex items-center justify-center shadow-lg shadow-ikonga-pink/30 group-hover:shadow-ikonga-pink/50 transition-shadow">
                                        <Lightbulb size={26} className="text-white" strokeWidth={2} />
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-serif font-black text-slate-900 mb-2 tracking-tight uppercase">
                                            Conseil de Rosy
                                        </h3>
                                        <p className="text-sm text-slate-600 leading-relaxed font-light">
                                            Vérifiez votre menu hebdomadaire avant de partir en courses. Cochez ce que vous possédez déjà pour ne rien acheter en trop et rester focalisée sur votre objectif !
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
