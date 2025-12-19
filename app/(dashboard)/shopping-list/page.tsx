import { getShoppingList } from "@/lib/actions/shopping"
import { ShoppingListView } from "@/components/dashboard/ShoppingListView"
import { DailyMenuCard } from "@/components/dashboard/DailyMenuCard"
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
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Left Column: Menu Inspiration (5 cols) */}
                    <div className="lg:col-span-5 space-y-6">
                        {/* Menu Card with Premium Shadow */}
                        <div className="transform transition-all duration-300 hover:scale-[1.01]">
                            <div className="rounded-[2rem] overflow-hidden shadow-xl shadow-slate-200/60 border border-slate-100/40">
                                <DailyMenuCard menu={data.menu} />
                            </div>
                        </div>

                        {/* Coach Tip Card - Premium Sport Style */}
                        <div className="group rounded-[2rem] bg-white/60 backdrop-blur-sm border-2 border-ikonga-pink/20 p-8 shadow-lg shadow-ikonga-pink/5 hover:shadow-xl hover:shadow-ikonga-pink/10 transition-all duration-300">
                            <div className="flex items-start gap-5">
                                {/* Icon with Glow */}
                                <div className="shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-ikonga-pink to-ikonga-orange flex items-center justify-center shadow-lg shadow-ikonga-pink/30 group-hover:shadow-ikonga-pink/50 transition-shadow">
                                    <Lightbulb size={26} className="text-white" strokeWidth={2} />
                                </div>

                                <div className="flex-1">
                                    <h3 className="text-lg font-serif font-normal text-slate-900 mb-2 tracking-tight">
                                        Conseil Expert
                                    </h3>
                                    <p className="text-sm text-slate-600 leading-relaxed font-light">
                                        Vérifiez votre menu avant de faire les courses. Supprimez de la liste ce que vous avez déjà en stock pour optimiser vos achats.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Action Zone (7 cols) */}
                    <div className="lg:col-span-7">
                        <div className="rounded-[2rem] overflow-hidden shadow-xl shadow-slate-200/60 border border-slate-100/40 transform transition-all duration-300 hover:shadow-2xl hover:shadow-slate-200/70">
                            <ShoppingListView
                                initialIngredients={data.ingredients as any}
                                phaseName={data.phaseName}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
