"use client"

import { ChefHat } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MealCardProps {
    category: string
    recipe: any
    onClick: () => void
}

export function MealCard({ category, recipe, onClick }: MealCardProps) {
    return (
        <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            {/* Thumbnail/Icon */}
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 overflow-hidden">
                {recipe?.imageUrl ? (
                    <img src={recipe.imageUrl} alt={recipe.name} className="w-full h-full object-cover" />
                ) : (
                    <ChefHat size={24} className="text-slate-300 sm:w-8 sm:h-8" />
                )}
            </div>

            {/* Content */}
            <div className="flex-1 space-y-1 min-w-0">
                <span className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                    {category}
                </span>
                <h3 className="text-base sm:text-lg font-serif font-black text-slate-900 leading-tight truncate">
                    {recipe?.name || "Menu en préparation"}
                </h3>
                {recipe ? (
                    <Button
                        onClick={onClick}
                        className="h-7 sm:h-8 px-3 sm:px-4 rounded-full bg-[#FF7F50] hover:bg-[#FF6347] text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-widest"
                    >
                        Voir la recette
                    </Button>
                ) : (
                    <p className="text-[10px] sm:text-xs text-slate-400 italic">Votre menu sera bientôt disponible</p>
                )}
            </div>
        </div>
    )
}
