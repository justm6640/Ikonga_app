import { getShoppingList } from "@/lib/actions/shopping"
import { ShoppingListView } from "@/components/dashboard/ShoppingListView"
import { WeeklyMenuGrid } from "@/components/dashboard/WeeklyMenuGrid"
import { Lightbulb, Sparkles } from "lucide-react"

export const metadata = {
    title: "Mes Menus | IKONGA",
    description: "Retrouvez vos menus de la semaine personnalisés.",
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
                                Mes Menus
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

                </div>
            </div>
        </div>
    )
}
