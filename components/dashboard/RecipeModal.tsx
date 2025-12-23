"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Clock, Flame, Beef, Wheat, Droplets, UtensilsCrossed } from "lucide-react"

interface RecipeModalProps {
    isOpen: boolean
    onClose: () => void
    recipe: any // Recipe from Prisma
}

export function RecipeModal({ isOpen, onClose, recipe }: RecipeModalProps) {
    if (!recipe) return null

    const macros = [
        { label: "Calories", value: `${recipe.calories || 0} kcal`, icon: Flame, color: "text-orange-500", bg: "bg-orange-50" },
        { label: "Protéines", value: `${recipe.protein || 0}g`, icon: Beef, color: "text-rose-500", bg: "bg-rose-50" },
        { label: "Glucides", value: `${recipe.carbs || 0}g`, icon: Wheat, color: "text-amber-500", bg: "bg-amber-50" },
        { label: "Lipides", value: `${recipe.fat || 0}g`, icon: Droplets, color: "text-blue-500", bg: "bg-blue-50" },
    ]

    // Parse JSON if needed (Prisma returns it as object usually, but safety first)
    const ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients : []
    const instructions = Array.isArray(recipe.instructions) ? recipe.instructions : []

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl p-0 border-none rounded-[2.5rem] overflow-hidden bg-white max-h-[90vh]">
                <ScrollArea className="h-full max-h-[90vh]">
                    {/* Header Section */}
                    <div className="p-8 pb-4">
                        <div className="flex items-center gap-2 mb-4">
                            <Badge variant="outline" className="rounded-full px-4 py-1 border-ikonga-pink text-ikonga-pink font-bold bg-ikonga-pink/5 uppercase tracking-widest text-[10px]">
                                {recipe.phase}
                            </Badge>
                            <Badge variant="outline" className="rounded-full px-4 py-1 border-slate-200 text-slate-500 font-bold bg-slate-50 uppercase tracking-widest text-[10px]">
                                <Clock size={12} className="mr-1" />
                                {recipe.prepTime || 15} min
                            </Badge>
                        </div>

                        <DialogTitle className="text-3xl font-serif font-black text-slate-900 leading-tight mb-6">
                            {recipe.name}
                        </DialogTitle>

                        {/* Macros Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                            {macros.map((macro) => (
                                <div key={macro.label} className={`p-4 rounded-[2rem] ${macro.bg} flex flex-col items-center justify-center text-center border border-white/50 shadow-sm`}>
                                    <macro.icon size={18} className={`${macro.color} mb-2`} />
                                    <span className="text-[10px] uppercase font-black text-slate-400 leading-none mb-1">{macro.label}</span>
                                    <span className={`font-black text-sm ${macro.color}`}>{macro.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="px-8 pb-12 space-y-10">
                        {/* Ingredients Section */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-2xl bg-ikonga-pink/10 flex items-center justify-center text-ikonga-pink">
                                    <UtensilsCrossed size={20} />
                                </div>
                                <h3 className="text-xl font-serif font-black text-slate-900 uppercase tracking-tighter">Ingrédients</h3>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {ingredients.map((ing: string, i: number) => (
                                    <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-3xl border border-slate-100 transition-hover hover:bg-white hover:shadow-md transition-all">
                                        <div className="w-2 h-2 rounded-full bg-ikonga-pink" />
                                        <span className="text-sm font-bold text-slate-700">{ing}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Instructions Section */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center text-white">
                                    <span className="font-serif font-black">!</span>
                                </div>
                                <h3 className="text-xl font-serif font-black text-slate-900 uppercase tracking-tighter">Préparation</h3>
                            </div>

                            <div className="space-y-6">
                                {instructions.map((step: string, i: number) => (
                                    <div key={i} className="flex gap-6 relative group">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-white border-2 border-slate-100 text-slate-900 flex items-center justify-center font-black text-sm shadow-sm group-hover:border-ikonga-pink transition-colors">
                                            {i + 1}
                                        </div>
                                        <p className="text-slate-600 font-medium leading-relaxed pt-2">
                                            {step}
                                        </p>
                                        {i < instructions.length - 1 && (
                                            <div className="absolute left-5 top-12 bottom-[-24px] w-0.5 bg-slate-100" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}
