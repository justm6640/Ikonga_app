"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
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
    CheckCircle2
} from "lucide-react"
import { cn } from "@/lib/utils"

interface RecipeModalProps {
    isOpen: boolean
    onClose: () => void
    recipe: any // Recipe from Prisma
}

export function RecipeModal({ isOpen, onClose, recipe }: RecipeModalProps) {
    const [checkedIngredients, setCheckedIngredients] = useState<Record<number, boolean>>({})

    if (!recipe) return null

    // Safe parsing of ingredients and instructions (handles JSON or Array)
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
        { label: "Protéines", value: `${recipe.protein || 0}g`, icon: Beef, color: "text-rose-500", bg: "bg-rose-50" },
        { label: "Glucides", value: `${recipe.carbs || 0}g`, icon: Wheat, color: "text-amber-500", bg: "bg-amber-50" },
        { label: "Lipides", value: `${recipe.fat || 0}g`, icon: Droplets, color: "text-blue-500", bg: "bg-blue-50" },
    ]

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl p-0 border-none sm:rounded-[3rem] overflow-hidden bg-white shadow-2xl h-[90vh] sm:h-auto sm:max-h-[90vh]">
                {/* Header Image/Placeholder */}
                <div className="relative h-48 sm:h-64 w-full bg-slate-100 overflow-hidden">
                    {recipe.imageUrl ? (
                        <img
                            src={recipe.imageUrl}
                            alt={recipe.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                            <ChefHat size={80} className="text-white/10" />
                        </div>
                    )}

                    {/* Floating Badges */}
                    <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                        <Badge className="bg-white/90 backdrop-blur-md text-slate-900 border-none px-4 py-1.5 rounded-full font-black uppercase tracking-widest text-[10px] shadow-lg">
                            {recipe.phase || "DETOX"}
                        </Badge>
                        <Badge className="bg-ikonga-pink text-white border-none px-4 py-1.5 rounded-full font-black uppercase tracking-widest text-[10px] shadow-lg shadow-pink-500/20">
                            <Flame size={12} className="mr-1" />
                            {recipe.calories || 0} kcal
                        </Badge>
                    </div>

                    <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent" />
                </div>

                <div className="px-6 sm:px-10 -mt-6 relative z-10 flex flex-col h-[calc(90vh-12rem)] sm:h-[500px]">
                    <DialogHeader className="mb-6 space-y-2">
                        <div className="flex items-center gap-4 text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                            <div className="flex items-center gap-1.5">
                                <Clock size={14} className="text-ikonga-pink" />
                                {recipe.prepTime || 15} MIN
                            </div>
                            <div className="flex items-center gap-1.5">
                                <BarChart3 size={14} className="text-ikonga-pink" />
                                {recipe.difficulty || "MODÉRÉ"}
                            </div>
                        </div>
                        <DialogTitle className="text-3xl sm:text-4xl font-serif font-black text-slate-900 leading-tight uppercase tracking-tighter">
                            {recipe.name}
                        </DialogTitle>
                    </DialogHeader>

                    {/* Tabs Navigation */}
                    <Tabs defaultValue="instructions" className="flex-1 flex flex-col min-h-0">
                        <TabsList className="bg-slate-100/50 p-1 rounded-full w-fit mb-8">
                            <TabsTrigger value="ingredients" className="rounded-full px-8 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold uppercase tracking-widest text-[10px]">
                                Ingrédients
                            </TabsTrigger>
                            <TabsTrigger value="instructions" className="rounded-full px-8 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold uppercase tracking-widest text-[10px]">
                                Préparation
                            </TabsTrigger>
                        </TabsList>

                        <div className="flex-1 min-h-0">
                            <ScrollArea className="h-full pr-4">
                                {/* Tab Contents: Ingredients */}
                                <TabsContent value="ingredients" className="mt-0 space-y-4 pb-8 focus-visible:outline-none">
                                    <div className="grid grid-cols-1 gap-3">
                                        {ingredients.map((ing: string, i: number) => (
                                            <div
                                                key={i}
                                                onClick={() => toggleIngredient(i)}
                                                className={cn(
                                                    "flex items-center gap-4 p-4 rounded-3xl border transition-all cursor-pointer group",
                                                    checkedIngredients[i]
                                                        ? "bg-slate-50 border-slate-100 opacity-60"
                                                        : "bg-white border-slate-100 hover:border-ikonga-pink/20 hover:shadow-lg hover:shadow-slate-200/50"
                                                )}
                                            >
                                                <Checkbox
                                                    checked={checkedIngredients[i]}
                                                    onCheckedChange={() => toggleIngredient(i)}
                                                    className="rounded-lg border-slate-200 data-[state=checked]:bg-ikonga-pink data-[state=checked]:border-ikonga-pink w-6 h-6"
                                                />
                                                <span className={cn(
                                                    "text-sm font-bold text-slate-700 transition-all",
                                                    checkedIngredients[i] && "line-through text-slate-400"
                                                )}>
                                                    {ing}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </TabsContent>

                                {/* Tab Contents: Instructions */}
                                <TabsContent value="instructions" className="mt-0 space-y-8 pb-8 focus-visible:outline-none">
                                    {instructions.map((step: string, i: number) => (
                                        <div key={i} className="flex gap-6 relative group">
                                            <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white border-2 border-slate-100 text-slate-900 flex items-center justify-center font-black text-sm shadow-sm group-hover:border-ikonga-pink group-hover:text-ikonga-pink transition-all">
                                                {i + 1}
                                            </div>
                                            <div className="pt-2.5 space-y-2">
                                                <p className="text-slate-600 font-medium leading-relaxed">
                                                    {step}
                                                </p>
                                            </div>
                                            {i < instructions.length - 1 && (
                                                <div className="absolute left-6 top-14 bottom-[-32px] w-0.5 bg-slate-100" />
                                            )}
                                        </div>
                                    ))}
                                </TabsContent>
                            </ScrollArea>
                        </div>
                    </Tabs>

                    {/* Footer Macros */}
                    <div className="py-8 border-t border-slate-100 mt-auto bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                                <BarChart3 size={16} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-tighter text-slate-400">Valeurs nutritionnelles</span>
                        </div>
                        <div className="flex items-center gap-4 sm:gap-6">
                            {macros.map((macro) => (
                                <div key={macro.label} className="flex flex-col items-center">
                                    <span className="text-[9px] uppercase font-black text-slate-300 leading-none mb-1">{macro.label}</span>
                                    <div className="flex items-center gap-1.5">
                                        <div className={cn("w-1.5 h-1.5 rounded-full", macro.color.replace('text', 'bg'))} />
                                        <span className="font-black text-xs sm:text-sm text-slate-800">{macro.value}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
