"use client"

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Clock, Flame, Beef, Wheat, Droplets, CheckCircle2 } from "lucide-react"
import Image from "next/image"

interface RecipeSheetProps {
    isOpen: boolean
    onClose: () => void
    recipe: any // Ideally typed Recipe
}

export function RecipeSheet({ isOpen, onClose, recipe }: RecipeSheetProps) {
    if (!recipe) return null

    const macros = [
        { label: "Calories", value: `${recipe.calories} kcal`, icon: Flame, color: "text-orange-500", bg: "bg-orange-50" },
        { label: "Protéines", value: `${recipe.protein}g`, icon: Beef, color: "text-rose-500", bg: "bg-rose-50" },
        { label: "Glucides", value: `${recipe.carbs}g`, icon: Wheat, color: "text-amber-500", bg: "bg-amber-50" },
        { label: "Lipides", value: `${recipe.fat}g`, icon: Droplets, color: "text-blue-500", bg: "bg-blue-50" },
    ]

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="w-full sm:max-w-xl p-0 border-none rounded-l-[3rem] overflow-hidden bg-slate-50">
                <ScrollArea className="h-full">
                    {/* Header Image */}
                    <div className="relative h-64 w-full">
                        {recipe.imageUrl ? (
                            <Image
                                src={recipe.imageUrl}
                                alt={recipe.title}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-ikonga-gradient" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                        <div className="absolute bottom-6 left-6 right-6">
                            <Badge className="mb-2 bg-white/20 backdrop-blur-md text-white border-none hover:bg-white/30">
                                <Clock size={14} className="mr-1" />
                                {recipe.prepTime} min
                            </Badge>
                            <SheetTitle className="text-2xl font-serif font-bold text-white uppercase tracking-tight">
                                {recipe.title}
                            </SheetTitle>
                        </div>
                    </div>

                    <div className="p-6 space-y-8">
                        <SheetDescription className="text-slate-600 text-lg italic leading-relaxed">
                            "{recipe.description}"
                        </SheetDescription>

                        {/* Macros Grid */}
                        <div className="grid grid-cols-2 gap-3">
                            {macros.map((macro) => (
                                <div key={macro.label} className={`p-4 rounded-3xl ${macro.bg} flex items-center gap-3 border border-white/50 shadow-sm`}>
                                    <div className={`p-2 rounded-xl bg-white shadow-sm ${macro.color}`}>
                                        <macro.icon size={20} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] uppercase font-bold text-slate-400 leading-none mb-1">{macro.label}</span>
                                        <span className={`font-bold text-sm ${macro.color}`}>{macro.value}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Ingredients */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-serif font-bold text-slate-900 flex items-center gap-2">
                                <span className="w-8 h-1 bg-ikonga-coral rounded-full" />
                                Ingrédients
                            </h3>
                            <div className="grid gap-2">
                                {recipe.ingredients.map((ing: string, i: number) => (
                                    <div key={i} className="flex items-start gap-3 p-3 bg-white rounded-2xl border border-slate-100 shadow-sm group">
                                        <div className="mt-1">
                                            <CheckCircle2 size={18} className="text-slate-300 group-hover:text-ikonga-coral transition-colors" />
                                        </div>
                                        <span className="text-slate-700 font-medium">{ing}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Instructions */}
                        <div className="space-y-4 pb-10">
                            <h3 className="text-xl font-serif font-bold text-slate-900 flex items-center gap-2">
                                <span className="w-8 h-1 bg-ikonga-coral rounded-full" />
                                Préparation
                            </h3>
                            <div className="space-y-4">
                                {recipe.instructions.map((step: string, i: number) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
                                            {i + 1}
                                        </div>
                                        <p className="text-slate-700 leading-relaxed pt-1">
                                            {step}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    )
}
