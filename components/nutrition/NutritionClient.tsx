"use client"

import { useState, useTransition } from "react"
import { NutritionHeader } from "./NutritionHeader"
import { MealCard } from "./MealCard"
import { WeeklyView } from "./WeeklyView"
import { PhaseView } from "./PhaseView"
import { RecipesView } from "./RecipesView"
import { ShoppingListView } from "./ShoppingListView"
import { ComposerView } from "./ComposerView"
import { GlobalMenusView } from "./GlobalMenusView"
import { RecipeModal } from "@/components/dashboard/RecipeModal"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ChevronDown, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { getNutritionData, getWeekData, getPhaseData, getRecipes, getShoppingList } from "@/lib/actions/nutrition"
import { getGlobalMenus } from "@/lib/actions/admin-menu" // Import action
import { format, addDays } from "date-fns"
import { fr } from "date-fns/locale"

interface NutritionClientProps {
    initialData: any
    subscriptionTier: string
    phaseDays: Array<{ dayNumber: number; date: Date; label: string }>
}

export function NutritionClient({ initialData, subscriptionTier, phaseDays }: NutritionClientProps) {
    const [selectedTab, setSelectedTab] = useState("day")
    const [selectedRecipe, setSelectedRecipe] = useState<any>(null)
    const [isMenuOpen, setIsMenuOpen] = useState(true)
    const [selectedDay, setSelectedDay] = useState(phaseDays[0] || { dayNumber: 1, label: "Jour 1", date: new Date() }) // Fixed missing date prop
    const [currentData, setCurrentData] = useState(initialData)
    const [weekData, setWeekData] = useState<any>(null)
    const [phaseData, setPhaseData] = useState<any>(null)
    const [recipes, setRecipes] = useState<any[]>([])
    const [globalMenus, setGlobalMenus] = useState<any[]>([]) // New state
    const [shoppingData, setShoppingData] = useState<any>(null)
    const [currentView, setCurrentView] = useState<"menus" | "recipes" | "alternatives" | "shopping" | "composer" | "templates">("menus")
    const [isPending, startTransition] = useTransition()

    // Calculate number of weeks in phase
    const totalWeeks = Math.ceil(phaseDays.length / 7)

    const handleRecipeClick = (recipe: any) => {
        setSelectedRecipe(recipe)
    }

    const handleDayChange = (day: any) => {
        setSelectedDay(day)
        startTransition(async () => {
            const data = await getNutritionData(day.date)
            if (data) {
                setCurrentData(data)
            }
        })
    }

    const handleWeekChange = (weekNum: number) => {
        startTransition(async () => {
            const data = await getWeekData(weekNum)
            setWeekData(data)
        })
    }

    const handleShoppingWeekChange = (weekNum: number) => {
        startTransition(async () => {
            const data = await getShoppingList(weekNum)
            setShoppingData(data)
        })
    }

    const handleWeekDayClick = (dayNum: number) => {
        setSelectedTab("day")
        const targetDay = phaseDays.find(d => d.dayNumber === dayNum)
        if (targetDay) {
            handleDayChange(targetDay)
        }
    }

    const handleTabChange = (tab: string) => {
        setSelectedTab(tab)
        if (tab === "week" && !weekData) {
            handleWeekChange(1)
        }
        if (tab === "phase" && !phaseData) {
            startTransition(async () => {
                const data = await getPhaseData()
                setPhaseData(data)
            })
        }
    }

    const handlePhaseWeekClick = (weekNum: number) => {
        setSelectedTab("week")
        handleWeekChange(weekNum)
    }

    return (
        <div className="max-w-full mx-auto space-y-8 animate-in fade-in duration-700 px-0 sm:px-6 lg:px-8">
            <NutritionHeader
                subscriptionTier={subscriptionTier}
                phase={currentData.phase}
            />

            {/* Menu Dropdown */}
            <div className="w-full bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-3">
                                {currentView === "menus" && <BookOpen size={20} className="text-slate-400" />}
                                {currentView === "recipes" && <span className="text-lg">🍽️</span>}
                                {currentView === "alternatives" && <span className="text-lg">🔄</span>}
                                {currentView === "shopping" && <span className="text-lg">🛒</span>}
                                {currentView === "composer" && <span className="text-lg">✏️</span>}
                                {currentView === "templates" && <span className="text-lg">📚</span>}
                                <span className="font-serif font-black text-slate-900">
                                    {currentView === "menus" && "Menus"}
                                    {currentView === "recipes" && "Recettes"}
                                    {currentView === "alternatives" && "Alternatives"}
                                    {currentView === "shopping" && "Liste courses"}
                                    {currentView === "composer" && "Composer"}
                                    {currentView === "templates" && "Bibliothèque"}
                                </span>
                            </div>
                            <ChevronDown size={20} className="text-slate-400" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-[250px]">
                        <DropdownMenuItem onClick={() => setCurrentView("menus")} className="cursor-pointer py-3 px-4 bg-blue-50">
                            <BookOpen size={18} className="mr-3 text-purple-500" />
                            <span className="font-bold">Menus</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => {
                                setCurrentView("recipes")
                                startTransition(async () => {
                                    const allRecipes = await getRecipes()
                                    setRecipes(allRecipes)
                                })
                            }}
                            className="cursor-pointer py-3 px-4"
                        >
                            <span className="mr-3 text-lg">🍽️</span>
                            <span className="font-bold">Recettes</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => {
                                setCurrentView("templates")
                                startTransition(async () => {
                                    const menus = await getGlobalMenus(currentData.phase as any)
                                    setGlobalMenus(menus)
                                })
                            }}
                            className="cursor-pointer py-3 px-4"
                        >
                            <span className="mr-3 text-lg">📚</span>
                            <span className="font-bold">Bibliothèque</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setCurrentView("alternatives")} className="cursor-pointer py-3 px-4">
                            <span className="mr-3 text-lg">🔄</span>
                            <span className="font-bold">Alternatives</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => {
                                setCurrentView("shopping")
                                startTransition(async () => {
                                    const data = await getShoppingList(1)
                                    setShoppingData(data)
                                })
                            }}
                            className="cursor-pointer py-3 px-4"
                        >
                            <span className="mr-3 text-lg">🛒</span>
                            <span className="font-bold">Liste courses</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setCurrentView("composer")} className="cursor-pointer py-3 px-4">
                            <span className="mr-3 text-lg">✏️</span>
                            <span className="font-bold">Composer</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {currentView === "recipes" ? (
                    <div className="p-4 border-t border-slate-50">
                        <RecipesView
                            initialRecipes={recipes}
                            currentPhase={currentData.phase}
                            onRecipeClick={handleRecipeClick}
                        />
                    </div>
                ) : currentView === "shopping" ? (
                    <div className="p-4 border-t border-slate-50">
                        <ShoppingListView
                            shoppingData={shoppingData}
                            availableWeeks={totalWeeks}
                            onWeekChange={handleShoppingWeekChange}
                        />
                    </div>
                ) : currentView === "composer" ? (
                    <div className="p-4 border-t border-slate-50">
                        <ComposerView
                            phaseDays={phaseDays}
                            currentPhase={currentData.phase}
                            initialData={currentData}
                        />
                    </div>
                ) : currentView === "templates" ? (
                    <div className="p-4 border-t border-slate-50">
                        <GlobalMenusView
                            menus={globalMenus}
                            currentPhase={currentData.phase}
                        />
                    </div>
                ) : isMenuOpen && (
                    <div className="p-4 pt-0 border-t border-slate-50 animate-in slide-in-from-top-2">
                        {/* Segmented Control / Tabs */}
                        <Tabs defaultValue="day" onValueChange={handleTabChange} className="w-full">
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
                                            PHASE {currentData.phase}
                                        </span>
                                        <h2 className="text-2xl font-serif font-black text-slate-900 italic">
                                            {selectedDay.label}
                                        </h2>
                                        {selectedDay.date && (
                                            <span className="text-xs text-slate-500 font-medium">
                                                {format(new Date(selectedDay.date), "EEEE d MMMM", { locale: fr })}
                                            </span>
                                        )}
                                    </div>

                                    {/* Jour Selector Dropdown */}
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <div className="bg-orange-50 border border-orange-100 px-4 py-2 rounded-xl flex items-center gap-2 cursor-pointer hover:bg-orange-100 transition-colors">
                                                <span className="text-orange-600 font-bold text-xs uppercase">
                                                    {selectedDay.label}
                                                </span>
                                                <ChevronDown size={14} className="text-orange-400" />
                                            </div>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-48">
                                            {phaseDays.map((day) => (
                                                <DropdownMenuItem
                                                    key={day.dayNumber}
                                                    onClick={() => handleDayChange(day)}
                                                    className="cursor-pointer font-bold text-xs uppercase tracking-wider"
                                                >
                                                    {day.label}
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                {/* Meal Cards Grid */}
                                <div className="space-y-4">
                                    {isPending ? (
                                        <div className="text-center py-10 text-slate-400">
                                            <p className="text-sm italic">Chargement du menu...</p>
                                        </div>
                                    ) : (
                                        <>
                                            <MealCard
                                                category="PETIT-DÉJEUNER"
                                                recipe={currentData.menu?.breakfast}
                                                onClick={() => handleRecipeClick(currentData.menu?.breakfast)}
                                            />
                                            <MealCard
                                                category="SNACK MATIN"
                                                recipe={currentData.menu?.snack}
                                                onClick={() => handleRecipeClick(currentData.menu?.snack)}
                                            />
                                            <MealCard
                                                category="DÉJEUNER"
                                                recipe={currentData.menu?.lunch}
                                                onClick={() => handleRecipeClick(currentData.menu?.lunch)}
                                            />
                                            <MealCard
                                                category="DÎNER"
                                                recipe={currentData.menu?.dinner}
                                                onClick={() => handleRecipeClick(currentData.menu?.dinner)}
                                            />
                                        </>
                                    )}
                                </div>
                            </TabsContent>

                            <TabsContent value="week">
                                <WeeklyView
                                    weekData={weekData}
                                    availableWeeks={totalWeeks}
                                    onWeekChange={handleWeekChange}
                                    onDayClick={handleWeekDayClick}
                                />
                            </TabsContent>

                            <TabsContent value="phase">
                                <PhaseView
                                    phaseData={phaseData}
                                    onWeekClick={handlePhaseWeekClick}
                                />
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
