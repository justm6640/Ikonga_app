"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Coffee, Salad, Apple, Soup, ChefHat, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import { RecipeModal } from "./RecipeModal"
import { getRecipeAction } from "@/lib/actions/recipe"
import { toast } from "sonner"
import Link from "next/link"
import { motion } from "framer-motion"

interface WeeklyMenuGridProps {
    weeklyPlan: any
    phase?: string
}

const DAYS = [
    { id: "monday", label: "Lundi" },
    { id: "tuesday", label: "Mardi" },
    { id: "wednesday", label: "Mercredi" },
    { id: "thursday", label: "Jeudi" },
    { id: "friday", label: "Vendredi" },
    { id: "saturday", label: "Samedi" },
    { id: "sunday", label: "Dimanche" },
]

export function WeeklyMenuGrid({ weeklyPlan, phase = "DETOX" }: WeeklyMenuGridProps) {
    const [selectedRecipe, setSelectedRecipe] = useState<any>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    if (!weeklyPlan || !weeklyPlan.content) {
        return (
            <Card className="rounded-[2.5rem] border-dashed border-ikonga-coral/20 bg-ikonga-coral/[0.02] shadow-none h-64 flex flex-col items-center justify-center p-8 text-center group hover:bg-ikonga-coral/[0.04] transition-colors">
                <div className="w-16 h-16 rounded-full bg-ikonga-coral/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <ChefHat className="text-ikonga-coral" size={32} />
                </div>
                <h3 className="text-lg font-serif font-bold text-slate-900 uppercase tracking-widest">Menu à venir</h3>
                <p className="text-sm text-slate-500 mt-2 italic max-w-[200px]">Votre menu personnalisé est en cours de préparation...</p>
            </Card>
        )
    }

    const content = weeklyPlan.content

    async function handleMealClick(mealText: string) {
        if (!mealText) return

        setIsLoading(true)
        try {
            const result = await getRecipeAction(mealText, phase)
            if (result.success && result.data) {
                setSelectedRecipe(result.data)
                setIsModalOpen(true)
            } else {
                toast.error("Rosy se repose un petit peu. Réessayez plus tard !")
            }
        } catch (error) {
            toast.error("Oups ! Impossible de charger la recette.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-3 mb-2 px-2">
                <div className="w-10 h-10 rounded-2xl bg-ikonga-coral/10 flex items-center justify-center">
                    <Calendar className="text-ikonga-coral" size={20} />
                </div>
                <div>
                    <h3 className="font-serif font-black text-slate-900 uppercase tracking-tighter text-xl leading-none">
                        Ma Semaine
                    </h3>
                    <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 mt-1">
                        7 jours de nutrition optimisée
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-6">
                {DAYS.map((day, index) => {
                    const dayMenu = content[day.id] || {}
                    const meals = [
                        { id: "breakfast", label: "Matin", icon: Coffee, text: dayMenu.breakfast, color: "text-ikonga-coral" },
                        { id: "lunch", label: "Midi", icon: Salad, text: dayMenu.lunch, color: "text-pillar-nutrition" },
                        { id: "snack", label: "Goûter", icon: Apple, text: dayMenu.snack, color: "text-pillar-fitness" },
                        { id: "dinner", label: "Soir", icon: Soup, text: dayMenu.dinner, color: "text-pillar-wellness" },
                    ].filter(m => m.text)

                    return (
                        <motion.div
                            key={day.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Card className="rounded-[2rem] border-none bg-white shadow-xl shadow-slate-200/50 overflow-hidden hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-300">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <BadgeDay label={day.label} isToday={day.id === new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()} />
                                        <ChefHat className="text-ikonga-coral opacity-10" size={20} />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {meals.map((meal) => (
                                            <div
                                                key={meal.id}
                                                onClick={() => handleMealClick(meal.text)}
                                                className={cn(
                                                    "group p-3 rounded-2xl border border-slate-50 bg-slate-50/30 hover:bg-white hover:border-ikonga-coral/20 hover:shadow-md transition-all duration-300 cursor-pointer relative",
                                                    isLoading && "opacity-50 pointer-events-none"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={cn("p-2 rounded-xl bg-white shadow-sm transition-all", meal.color)}>
                                                        <meal.icon size={14} />
                                                    </div>
                                                    <div className="flex flex-col min-w-0">
                                                        <span className="text-[8px] uppercase font-black tracking-widest text-slate-400 leading-none mb-1">
                                                            {meal.label}
                                                        </span>
                                                        <p className="text-xs font-bold text-slate-800 truncate">
                                                            {meal.text}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )
                })}
            </div>

            <RecipeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                recipe={selectedRecipe}
            />
        </div>
    )
}

function BadgeDay({ label, isToday }: { label: string, isToday: boolean }) {
    return (
        <div className={cn(
            "px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all",
            isToday
                ? "bg-ikonga-coral text-white border-ikonga-coral shadow-lg shadow-pink-500/20"
                : "bg-slate-50 text-slate-400 border-slate-100"
        )}>
            {label} {isToday && "• Aujourd'hui"}
        </div>
    )
}
