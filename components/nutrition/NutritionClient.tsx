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
import { getGlobalMenus } from "@/lib/actions/admin-menu"
import { format, addDays } from "date-fns"
import { fr } from "date-fns/locale"
import { LoadingOverlay } from "@/components/ui/LoadingOverlay"


interface NutritionClientProps {
    initialData: any
    subscriptionTier: string
    phaseDays: Array<{ dayNumber: number; date: Date; label: string }>
}

export function NutritionClient({ initialData, subscriptionTier, phaseDays }: NutritionClientProps) {
    // Convert serialized date strings to Date objects
    const normalizedPhaseDays = phaseDays.map(day => ({
        ...day,
        date: new Date(day.date)
    }))

    console.log('[CLIENT DEBUG] normalizedPhaseDays:', normalizedPhaseDays.map(d => ({
        dayNumber: d.dayNumber,
        date: d.date.toISOString(),
        label: d.label
    })))

    const [selectedTab, setSelectedTab] = useState("day")
    const [selectedRecipe, setSelectedRecipe] = useState<any>(null)
    const [isMenuOpen, setIsMenuOpen] = useState(true)
    const [selectedDay, setSelectedDay] = useState(normalizedPhaseDays[0] || { dayNumber: 1, label: "Jour 1", date: new Date() })
    const [currentData, setCurrentData] = useState(initialData)
    const [weekData, setWeekData] = useState<any>(null)
    const [phaseData, setPhaseData] = useState<any>(null)
    const [recipes, setRecipes] = useState<any[]>([])
    const [globalMenus, setGlobalMenus] = useState<any[]>([]) // New state
    const [shoppingData, setShoppingData] = useState<any>(null)
    const [currentView, setCurrentView] = useState<"home" | "menus" | "recipes" | "alternatives" | "shopping" | "composer" | "templates">("home")
    const [isPending, startTransition] = useTransition()

    // Calculate number of weeks in phase
    const totalWeeks = Math.ceil(normalizedPhaseDays.length / 7)

    const handleRecipeClick = (recipe: any) => {
        setSelectedRecipe(recipe)
    }

    const handleDayChange = (day: any) => {
        console.log('[CLIENT DEBUG] handleDayChange called with:', day)
        console.log('[CLIENT DEBUG] day.date type:', typeof day.date, 'value:', day.date)
        setSelectedDay(day)
        startTransition(async () => {
            // Pass ISO string directly to avoid Next.js Date serialization bug
            const dateString = day.date.toISOString()
            console.log('[CLIENT DEBUG] Sending to server as ISO string:', dateString)
            const data = await getNutritionData(dateString)
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
        const targetDay = normalizedPhaseDays.find(d => d.dayNumber === dayNum)
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

    const handleBack = () => {
        setCurrentView("home")
    }

    const BentoCard = ({ title, icon: Icon, onClick, colorClass, description, size = "standard" }: any) => (
        <button
            onClick={onClick}
            className={cn(
                "relative overflow-hidden rounded-3xl p-6 text-left transition-all hover:scale-[1.02] hover:shadow-lg border border-slate-100",
                colorClass,
                size === "large" ? "col-span-2 row-span-2 min-h-[240px]" : "col-span-1 min-h-[160px]"
            )}
        >
            <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="bg-white/90 w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm">
                    <Icon size={24} className="text-slate-800" />
                </div>
                <div>
                    <h3 className="font-serif font-black text-xl text-slate-900 leading-tight mb-1">
                        {title}
                    </h3>
                    <p className="text-xs font-medium text-slate-600/90 line-clamp-2">
                        {description}
                    </p>
                </div>
            </div>
            {/* Decoratiive background element */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-white/20 blur-2xl" />
        </button>
    )

    if (currentView === "home") {
        return (
            <div className="max-w-full mx-auto space-y-8 animate-in fade-in duration-700 px-4 sm:px-6 lg:px-8 relative min-h-[80vh]">
                <LoadingOverlay isVisible={isPending} message="Chargement..." />
                <NutritionHeader
                    subscriptionTier={subscriptionTier}
                    phase={currentData.phase}
                />

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* 1. Main Card: Mes Menus */}
                    <BentoCard
                        title="Mes Menus"
                        description="Accède à ton plan alimentaire de la semaine et suis tes progrès."
                        icon={BookOpen}
                        colorClass="bg-[#F2F0E9]" // Light beige/warm
                        size="large"
                        onClick={() => setCurrentView("menus")}
                    />

                    {/* 2. Recettes */}
                    <BentoCard
                        title="Recettes"
                        description="Explore la base de recettes Ikonga."
                        icon={(props: any) => <span {...props} className="text-2xl">🍽️</span>}
                        colorClass="bg-blue-50"
                        onClick={() => {
                            setCurrentView("recipes")
                            startTransition(async () => {
                                const allRecipes = await getRecipes()
                                setRecipes(allRecipes)
                            })
                        }}
                    />

                    {/* 3. Bibliothèque */}
                    <BentoCard
                        title="Bibliothèque"
                        description="Menus types par phase."
                        icon={(props: any) => <span {...props} className="text-2xl">📚</span>}
                        colorClass="bg-purple-50"
                        onClick={() => {
                            setCurrentView("templates")
                            startTransition(async () => {
                                const menus = await getGlobalMenus(currentData.phase as any)
                                setGlobalMenus(menus)
                            })
                        }}
                    />

                    {/* 4. Liste Courses */}
                    <BentoCard
                        title="Mes Courses"
                        description="Ta liste d'achats générée."
                        icon={(props: any) => <span {...props} className="text-2xl">🛒</span>}
                        colorClass="bg-green-50"
                        onClick={() => {
                            setCurrentView("shopping")
                            startTransition(async () => {
                                const data = await getShoppingList(1)
                                setShoppingData(data)
                            })
                        }}
                    />

                    {/* 5. Alternatives */}
                    <BentoCard
                        title="Alternatives"
                        description="Par quoi remplacer..."
                        icon={(props: any) => <span {...props} className="text-2xl">🔄</span>}
                        colorClass="bg-orange-50"
                        onClick={() => setCurrentView("alternatives")}
                    />

                    {/* 6. Composer */}
                    <BentoCard
                        title="Composer"
                        description="Crée ton propre menu."
                        icon={(props: any) => <span {...props} className="text-2xl">✏️</span>}
                        colorClass="bg-pink-50"
                        onClick={() => setCurrentView("composer")}
                    />
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-full mx-auto space-y-6 animate-in fade-in duration-500 px-0 sm:px-6 lg:px-8 relative min-h-[80vh]">
            <LoadingOverlay isVisible={isPending} message="Chargement en cours..." />
            {/* Header with Back Button */}
            <div className="flex items-center gap-4 px-4 sm:px-0">
                <button
                    onClick={handleBack}
                    className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors shadow-sm"
                >
                    <ChevronDown className="rotate-90 text-slate-600" size={20} />
                </button>
                <h2 className="text-xl font-serif font-black text-slate-900">
                    {currentView === "menus" && "Mes Menus"}
                    {currentView === "recipes" && "Recettes"}
                    {currentView === "alternatives" && "Alternatives"}
                    {currentView === "shopping" && "Liste de Courses"}
                    {currentView === "composer" && "Compositeur de Menu"}
                    {currentView === "templates" && "Bibliothèque de Menus"}
                </h2>
            </div>

            {/* Content Area */}
            {currentView === "menus" && (
                <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                    <NutritionHeader
                        subscriptionTier={subscriptionTier}
                        phase={currentData.phase}
                        showTitle={false}
                    />

                    {/* Existing Tabs Logic */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
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
                                            {normalizedPhaseDays.map((day) => (
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
                                    {/* Removed local loader */}
                                    {true && (
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
                </div>
            )}

            {currentView === "recipes" && (
                <RecipesView
                    initialRecipes={recipes}
                    currentPhase={currentData.phase}
                    onRecipeClick={handleRecipeClick}
                />
            )}

            {currentView === "shopping" && (
                <ShoppingListView
                    shoppingData={shoppingData}
                    availableWeeks={totalWeeks}
                    onWeekChange={handleShoppingWeekChange}
                />
            )}

            {currentView === "composer" && (
                <ComposerView
                    phaseDays={phaseDays}
                    currentPhase={currentData.phase}
                    initialData={currentData}
                />
            )}

            {currentView === "templates" && (
                <GlobalMenusView
                    menus={globalMenus}
                    currentPhase={currentData.phase}
                />
            )}

            {/* Alternatives Placeholder */}
            {currentView === "alternatives" && (
                <div className="p-8 text-center bg-white rounded-3xl border border-slate-100">
                    <p className="text-slate-500 italic">Section Alternatives en construction 🚧</p>
                </div>
            )}

            <RecipeModal
                isOpen={!!selectedRecipe}
                onClose={() => setSelectedRecipe(null)}
                recipe={selectedRecipe}
            />
        </div>
    )
}
