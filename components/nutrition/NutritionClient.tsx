"use client"

import { useState } from "react"
import { NutritionHeader } from "./NutritionHeader"
import { MealCard } from "./MealCard"
import { RecipeModal } from "@/components/dashboard/RecipeModal"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ChevronDown, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"

interface NutritionClientProps {
    initialData: any
    subscriptionTier: string
}

export function NutritionClient({ initialData, subscriptionTier }: NutritionClientProps) {
    const [selectedTab, setSelectedTab] = useState("day")
    const [selectedRecipe, setSelectedRecipe] = useState<any>(null)
    const [isMenuOpen, setIsMenuOpen] = useState(true)

    const handleRecipeClick = (recipe: any) => {
        setSelectedRecipe(recipe)
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
            <NutritionHeader
                subscriptionTier={subscriptionTier}
                phase={initialData.phase}
            />

            {/* Accordion Menu */}
            <div className="w-full bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <BookOpen size={20} className="text-slate-400" />
                        <span className="font-serif font-black text-slate-900">Menus</span>
                    </div>
                    <ChevronDown
                        size={20}
                        className={cn("text-slate-400 transition-transform", isMenuOpen && "rotate-180")}
                    />
                </button>

                {isMenuOpen && (
                    <div className="p-4 pt-0 border-t border-slate-50 animate-in slide-in-from-top-2">
                        {/* Segmented Control / Tabs */}
                        <Tabs defaultValue="day" onValueChange={setSelectedTab} className="w-full">
                            <TabsList className="w-full bg-slate-100/50 p-1 rounded-xl h-auto flex mb-8">
                                <TabsTrigger
                                    value="day"
                                    className="flex-1 rounded-lg py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold text-[11px] uppercase tracking-wider text-slate-500 data-[state=active]:text-slate-900 transition-all"
                                >
                                    Par jour
                                </TabsTrigger>
                                <TabsTrigger
                                    value="week"
                                    className="flex-1 rounded-lg py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold text-[11px] uppercase tracking-wider text-slate-500 data-[state=active]:text-slate-900 transition-all"
                                >
                                    Par semaine
                                </TabsTrigger>
                                <TabsTrigger
                                    value="phase"
                                    className="flex-1 rounded-lg py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold text-[11px] uppercase tracking-wider text-slate-500 data-[state=active]:text-slate-900 transition-all"
                                >
                                    Par phase
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="day" className="space-y-6 mt-0">
                                {/* Day Selection Row */}
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                            PHASE {initialData.phase}
                                        </span>
                                        <h2 className="text-2xl font-serif font-black text-slate-900 italic">
                                            Jour 1
                                        </h2>
                                    </div>

                                    {/* Jour Selector Dropdown Simulation */}
                                    <div className="bg-orange-50 border border-orange-100 px-4 py-2 rounded-xl flex items-center gap-2 cursor-pointer hover:bg-orange-100 transition-colors">
                                        <span className="text-orange-600 font-bold text-xs uppercase">Jour 1</span>
                                        <ChevronDown size={14} className="text-orange-400" />
                                    </div>
                                </div>

                                {/* Meal Cards Grid */}
                                <div className="space-y-4">
                                    <MealCard
                                        category="PETIT-DÉJEUNER"
                                        recipe={initialData.menu?.breakfast}
                                        onClick={() => handleRecipeClick(initialData.menu?.breakfast)}
                                    />
                                    <MealCard
                                        category="SNACK MATIN"
                                        recipe={initialData.menu?.snack}
                                        onClick={() => handleRecipeClick(initialData.menu?.snack)}
                                    />
                                    <MealCard
                                        category="DÉJEUNER"
                                        recipe={initialData.menu?.lunch}
                                        onClick={() => handleRecipeClick(initialData.menu?.lunch)}
                                    />
                                    <MealCard
                                        category="DÎNER"
                                        recipe={initialData.menu?.dinner}
                                        onClick={() => handleRecipeClick(initialData.menu?.dinner)}
                                    />
                                </div>
                            </TabsContent>

                            <TabsContent value="week">
                                <p className="text-center py-10 text-slate-400 italic text-sm">Vue hebdomadaire en cours de développement...</p>
                            </TabsContent>

                            <TabsContent value="phase">
                                <p className="text-center py-10 text-slate-400 italic text-sm">Vue par phase en cours de développement...</p>
                            </TabsContent>
                        </Tabs>
                    </div>
                )}
            </div>

            <RecipeModal
                isOpen={!!selectedRecipe}
                onClose={() => setSelectedRecipe(null)}
                recipe={selectedRecipe}
            />
        </div>
    )
}
