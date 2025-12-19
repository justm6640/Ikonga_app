"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Coffee, Salad, Apple, Soup, ChefHat } from "lucide-react"
import { cn } from "@/lib/utils"
import { getRecipeByTitle } from "@/lib/actions/recipes"
import { RecipeSheet } from "./RecipeSheet"
import { toast } from "sonner"

interface DailyMenuCardProps {
    menu: {
        title: string
        content: any
    } | null
}

export function DailyMenuCard({ menu }: DailyMenuCardProps) {
    const [selectedRecipe, setSelectedRecipe] = useState<any>(null)
    const [isSheetOpen, setIsSheetOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    if (!menu) {
        return (
            <Card className="rounded-[2.5rem] border-dashed border-slate-200 bg-slate-50/50 shadow-none h-full flex flex-col items-center justify-center p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                    <ChefHat className="text-slate-400" size={32} />
                </div>
                <h3 className="text-lg font-serif font-bold text-slate-400 uppercase tracking-widest">Repos aujourd'hui</h3>
                <p className="text-sm text-slate-400 mt-2 italic">Suivez vos propres envies saines...</p>
            </Card>
        )
    }

    const { content } = menu

    const meals = [
        { id: "breakfast", label: "Matin", icon: Coffee, text: content.breakfast, color: "text-ikonga-pink", bg: "bg-ikonga-pink/5" },
        { id: "lunch", label: "Midi", icon: Salad, text: content.lunch, color: "text-pillar-nutrition", bg: "bg-pillar-nutrition/5" },
        { id: "snack", label: "Goûter", icon: Apple, text: content.snack, color: "text-pillar-fitness", bg: "bg-pillar-fitness/5" },
        { id: "dinner", label: "Soir", icon: Soup, text: content.dinner, color: "text-pillar-wellness", bg: "bg-pillar-wellness/5" },
    ].filter(meal => meal.text) // Only show meals with content

    async function handleMealClick(mealText: string) {
        if (!mealText) return

        setIsLoading(true)
        try {
            const recipe = await getRecipeByTitle(mealText)
            if (recipe) {
                setSelectedRecipe(recipe)
                setIsSheetOpen(true)
            } else {
                toast.info("Aucune fiche recette détaillée pour ce repas.")
            }
        } catch (error) {
            toast.error("Erreur lors de la récupération de la recette.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="rounded-[2.5rem] border-none bg-white shadow-xl shadow-slate-200/50 overflow-hidden h-full">
            <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="font-serif font-bold text-slate-900 uppercase tracking-tighter text-lg">
                        {menu.title}
                    </h3>
                    <ChefHat className="text-ikonga-pink opacity-20" size={24} />
                </div>

                <div className="space-y-3">
                    {meals.map((meal) => (
                        <div
                            key={meal.id}
                            onClick={() => handleMealClick(meal.text)}
                            className={cn(
                                "group p-4 rounded-3xl border border-slate-100 bg-white hover:border-ikonga-pink/30 hover:shadow-lg hover:shadow-pink-500/5 transition-all duration-300 cursor-pointer relative overflow-hidden",
                                isLoading && "opacity-50 pointer-events-none"
                            )}
                        >
                            <div className="flex items-start gap-4">
                                <div className={cn("p-3 rounded-2xl bg-slate-50 group-hover:bg-white group-hover:shadow-sm transition-all", meal.color)}>
                                    <meal.icon size={18} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 leading-none mb-1">
                                        {meal.label}
                                    </span>
                                    <p className="text-sm font-bold text-slate-800 line-clamp-2 leading-tight">
                                        {meal.text}
                                    </p>
                                </div>
                            </div>

                            {/* Subtle indicator that it's clickable */}
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <ChefHat size={16} className="text-ikonga-pink" />
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>

            <RecipeSheet
                isOpen={isSheetOpen}
                onClose={() => setIsSheetOpen(false)}
                recipe={selectedRecipe}
            />
        </Card>
    )
}
