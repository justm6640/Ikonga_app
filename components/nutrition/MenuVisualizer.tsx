"use client"

import { useState, useTransition } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Coffee, Salad, Apple, Soup, ChefHat, CheckCircle2, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { RecipeModal } from "@/components/dashboard/RecipeModal"
import { validateDailyNutrition } from "@/lib/actions/nutrition"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

interface MenuVisualizerProps {
    menu: {
        breakfast: any
        lunch: any
        dinner: any
        snack: any
    }
    isCompleted: boolean
    date: Date
}

export function MenuVisualizer({ menu, isCompleted, date }: MenuVisualizerProps) {
    const [selectedRecipe, setSelectedRecipe] = useState<any>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isPending, startTransition] = useTransition()

    const meals = [
        { id: "breakfast", label: "Petit-Déjeuner", icon: Coffee, recipe: menu.breakfast, color: "text-orange-500", bg: "bg-orange-50" },
        { id: "lunch", label: "Déjeuner", icon: Salad, recipe: menu.lunch, color: "text-emerald-500", bg: "bg-emerald-50" },
        { id: "snack", label: "Collation", icon: Apple, recipe: menu.snack, color: "text-amber-500", bg: "bg-amber-50" },
        { id: "dinner", label: "Dîner", icon: Soup, recipe: menu.dinner, color: "text-indigo-500", bg: "bg-indigo-50" },
    ].filter(meal => meal.recipe)

    const handleValidate = () => {
        startTransition(async () => {
            try {
                const result = await validateDailyNutrition(date)
                if (result.success) {
                    toast.success("Bravo ! Votre nutrition est validée pour aujourd'hui.")
                }
            } catch (error) {
                toast.error("Impossible de valider votre nutrition pour le moment.")
            }
        })
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {meals.map((meal) => (
                    <Card
                        key={meal.id}
                        onClick={() => {
                            setSelectedRecipe(meal.recipe)
                            setIsModalOpen(true)
                        }}
                        className={cn(
                            "rounded-[2rem] border-none bg-white shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 cursor-pointer group relative overflow-hidden",
                            isCompleted && "opacity-80"
                        )}
                    >
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className={cn("p-4 rounded-2xl transition-all group-hover:scale-110", meal.bg, meal.color)}>
                                    <meal.icon size={24} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-1 block">
                                        {meal.label}
                                    </span>
                                    <h3 className="text-lg font-serif font-black text-slate-900 leading-tight truncate">
                                        {meal.recipe.name}
                                    </h3>
                                    <div className="flex items-center gap-3 mt-2">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter bg-slate-100 px-2 py-0.5 rounded-full">
                                            {meal.recipe.calories} kcal
                                        </span>
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter bg-slate-100 px-2 py-0.5 rounded-full">
                                            {meal.recipe.prepTime} min
                                        </span>
                                    </div>
                                </div>
                                <div className="hidden group-hover:block transition-all">
                                    <ChefHat className="text-ikonga-pink/20" size={24} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Validation Button */}
            {!isCompleted ? (
                <Button
                    onClick={handleValidate}
                    disabled={isPending}
                    className="w-full py-8 rounded-[2rem] bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-slate-200 group relative overflow-hidden"
                >
                    {isPending ? (
                        <Loader2 className="animate-spin" />
                    ) : (
                        <>
                            <CheckCircle2 className="mr-2 group-hover:scale-125 transition-transform" size={18} />
                            J'ai bien mangé !
                        </>
                    )}
                </Button>
            ) : (
                <div className="w-full py-6 rounded-[2rem] bg-emerald-500 text-white flex items-center justify-center gap-3 font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-emerald-500/20">
                    <CheckCircle2 size={18} />
                    Nutrition Complétée
                </div>
            )}

            <RecipeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                recipe={selectedRecipe}
            />
        </div>
    )
}
