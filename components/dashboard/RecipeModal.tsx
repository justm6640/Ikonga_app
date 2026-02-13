"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Clock,
    Flame,
    Beef,
    Wheat,
    Droplets,
    UtensilsCrossed,
    ChefHat,
    BarChart3,
    CheckCircle2,
    X
} from "lucide-react"
import { cn } from "@/lib/utils"

interface RecipeModalProps {
    isOpen: boolean
    onClose: () => void
    recipe: any
}

export function RecipeModal({ isOpen, onClose, recipe }: RecipeModalProps) {
    const [checkedIngredients, setCheckedIngredients] = useState<Record<number, boolean>>({})

    if (!recipe) return null

    const ingredients = Array.isArray(recipe.ingredients)
        ? recipe.ingredients
        : (typeof recipe.ingredients === 'string' ? JSON.parse(recipe.ingredients) : [])

    const instructions = Array.isArray(recipe.instructions)
        ? recipe.instructions
        : (typeof recipe.instructions === 'string' ? JSON.parse(recipe.instructions) : [])

    const toggleIngredient = (index: number) => {
        setCheckedIngredients(prev => ({
            ...prev,
            [index]: !prev[index]
        }))
    }

    const macros = [
        { label: "Protéines", value: `${recipe.protein || 0}g`, icon: Beef, color: "text-rose-500", dotColor: "bg-rose-500" },
        { label: "Glucides", value: `${recipe.carbs || 0}g`, icon: Wheat, color: "text-amber-500", dotColor: "bg-amber-500" },
        { label: "Lipides", value: `${recipe.fat || 0}g`, icon: Droplets, color: "text-blue-500", dotColor: "bg-blue-500" },
    ]

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl p-0 border-none rounded-t-[2rem] sm:rounded-[2rem] overflow-hidden bg-white shadow-2xl max-h-[100dvh] sm:max-h-[92vh] w-full sm:w-[95vw] md:w-full gap-0 [&>button]:hidden">
                {/* Full scroll wrapper — everything scrolls together on mobile */}
                <div className="overflow-y-auto overscroll-contain max-h-[100dvh] sm:max-h-[92vh]">

                    {/* ─── Hero Image ─── */}
                    <div className="relative h-44 sm:h-56 md:h-64 w-full bg-slate-100 overflow-hidden shrink-0">
                        {recipe.imageUrl ? (
                            <img
                                src={recipe.imageUrl}
                                alt={recipe.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 flex items-center justify-center">
                                <ChefHat size={64} className="text-white/10 sm:w-20 sm:h-20" />
                            </div>
                        )}

                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/30 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/50 transition-colors z-20"
                        >
                            <X size={16} className="sm:w-[18px] sm:h-[18px]" />
                        </button>

                        {/* Floating Badges */}
                        <div className="absolute top-3 left-3 sm:top-4 sm:left-5 flex flex-wrap gap-2">
                            <Badge className="bg-white/90 backdrop-blur-md text-slate-900 border-none px-3 py-1 sm:px-4 sm:py-1.5 rounded-full font-black uppercase tracking-widest text-[9px] sm:text-[10px] shadow-lg">
                                {recipe.phase || "DETOX"}
                            </Badge>
                            <Badge className="bg-ikonga-coral text-white border-none px-3 py-1 sm:px-4 sm:py-1.5 rounded-full font-black uppercase tracking-widest text-[9px] sm:text-[10px] shadow-lg shadow-pink-500/20">
                                <Flame size={10} className="mr-1" />
                                {recipe.calories || 0} kcal
                            </Badge>
                        </div>

                        {/* Bottom gradient overlay → smooth transition to content */}
                        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white to-transparent" />
                    </div>

                    {/* ─── Content ─── */}
                    <div className="px-5 sm:px-8 md:px-10 -mt-4 relative z-10">

                        {/* Title + Meta */}
                        <DialogHeader className="mb-5 sm:mb-6 space-y-2">
                            <div className="flex items-center gap-3 text-slate-400 font-bold uppercase tracking-widest text-[9px] sm:text-[10px]">
                                <div className="flex items-center gap-1.5">
                                    <Clock size={12} className="text-ikonga-coral" />
                                    {recipe.prepTime || 15} MIN
                                </div>
                                <div className="w-1 h-1 rounded-full bg-slate-300" />
                                <div className="flex items-center gap-1.5">
                                    <BarChart3 size={12} className="text-ikonga-coral" />
                                    {recipe.difficulty || "MODÉRÉ"}
                                </div>
                            </div>
                            <DialogTitle className="text-xl sm:text-2xl md:text-3xl font-serif font-black text-slate-900 leading-tight uppercase tracking-tight">
                                {recipe.name}
                            </DialogTitle>
                        </DialogHeader>

                        {/* ─── Tabs ─── */}
                        <Tabs defaultValue="instructions" className="mb-0">
                            <TabsList className="bg-slate-100/60 p-1 rounded-full w-full sm:w-auto mb-5 sm:mb-6">
                                <TabsTrigger
                                    value="ingredients"
                                    className="rounded-full flex-1 sm:flex-initial px-5 sm:px-8 py-2 sm:py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold uppercase tracking-widest text-[9px] sm:text-[10px]"
                                >
                                    Ingrédients
                                </TabsTrigger>
                                <TabsTrigger
                                    value="instructions"
                                    className="rounded-full flex-1 sm:flex-initial px-5 sm:px-8 py-2 sm:py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold uppercase tracking-widest text-[9px] sm:text-[10px]"
                                >
                                    Préparation
                                </TabsTrigger>
                            </TabsList>

                            {/* ── Ingredients Tab ── */}
                            <TabsContent value="ingredients" className="mt-0 focus-visible:outline-none">
                                <div className="space-y-2.5 sm:space-y-3">
                                    {ingredients.map((ing: string, i: number) => (
                                        <div
                                            key={i}
                                            onClick={() => toggleIngredient(i)}
                                            className={cn(
                                                "flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl sm:rounded-3xl border transition-all cursor-pointer group",
                                                checkedIngredients[i]
                                                    ? "bg-slate-50 border-slate-100 opacity-60"
                                                    : "bg-white border-slate-100 hover:border-ikonga-coral/20 hover:shadow-lg hover:shadow-slate-200/50"
                                            )}
                                        >
                                            <Checkbox
                                                checked={checkedIngredients[i]}
                                                onCheckedChange={() => toggleIngredient(i)}
                                                className="rounded-lg border-slate-200 data-[state=checked]:bg-ikonga-coral data-[state=checked]:border-ikonga-coral w-5 h-5 sm:w-6 sm:h-6 shrink-0"
                                            />
                                            <span className={cn(
                                                "text-sm font-bold text-slate-700 transition-all leading-snug",
                                                checkedIngredients[i] && "line-through text-slate-400"
                                            )}>
                                                {ing}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>

                            {/* ── Instructions Tab ── */}
                            <TabsContent value="instructions" className="mt-0 focus-visible:outline-none">
                                <div className="space-y-5 sm:space-y-6">
                                    {instructions.map((step: string, i: number) => (
                                        <div key={i} className="flex gap-3 sm:gap-5 relative group">
                                            {/* Step Number */}
                                            <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white border-2 border-slate-100 text-slate-900 flex items-center justify-center font-black text-xs sm:text-sm shadow-sm group-hover:border-ikonga-coral group-hover:text-ikonga-coral transition-all">
                                                {i + 1}
                                            </div>
                                            {/* Step Text */}
                                            <div className="pt-2 sm:pt-2.5 flex-1 min-w-0">
                                                <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
                                                    {step}
                                                </p>
                                            </div>
                                            {/* Connector line */}
                                            {i < instructions.length - 1 && (
                                                <div className="absolute left-5 sm:left-6 top-12 sm:top-14 bottom-[-20px] sm:bottom-[-24px] w-0.5 bg-slate-100" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* ─── Footer Macros ─── */}
                    <div className="sticky bottom-0 bg-white/95 backdrop-blur-md border-t border-slate-100 mt-6 sm:mt-8">
                        <div className="px-5 sm:px-8 md:px-10 py-4 sm:py-5">
                            <div className="flex items-center justify-between gap-3">
                                {/* Label */}
                                <div className="flex items-center gap-2 shrink-0">
                                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                                        <BarChart3 size={13} className="sm:w-4 sm:h-4" />
                                    </div>
                                    <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-tight text-slate-400 leading-tight hidden sm:block">
                                        Valeurs<br />nutritionnelles
                                    </span>
                                </div>

                                {/* Macro Values */}
                                <div className="flex items-center gap-5 sm:gap-8">
                                    {macros.map((macro) => (
                                        <div key={macro.label} className="flex flex-col items-center gap-0.5">
                                            <span className="text-[7px] sm:text-[8px] uppercase font-black text-slate-300 tracking-wider">
                                                {macro.label}
                                            </span>
                                            <div className="flex items-center gap-1">
                                                <div className={cn("w-1.5 h-1.5 rounded-full", macro.dotColor)} />
                                                <span className="font-black text-sm sm:text-base text-slate-800">
                                                    {macro.value}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
