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
import { ChevronDown, BookOpen, CheckCircle2, ArrowLeft } from "lucide-react"
import { DoDontView } from "./DoDontView"
import { AlternativesView } from "./AlternativesView"
import { cn } from "@/lib/utils"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { getNutritionData, getWeekData, getPhaseData, getRecipes, getShoppingList, getPhaseDays } from "@/lib/actions/nutrition"
import { getGlobalMenus } from "@/lib/actions/admin-menu"
import { format, addDays, startOfDay } from "date-fns"
import { fr } from "date-fns/locale"
import { LoadingOverlay } from "@/components/ui/LoadingOverlay"
import { DailyMenuModal } from "./DailyMenuModal"
import { WeekMenuModal } from "./WeekMenuModal"
import { DaySelectorStrip } from "./DaySelectorStrip"


interface NutritionClientProps {
    initialData: any
    subscriptionTier: string
    phaseDays: Array<{ dayNumber: number; date: Date; label: string; isCompleted?: boolean }>
}

export function NutritionClient({ initialData, subscriptionTier, phaseDays }: NutritionClientProps) {
    // Convert serialized date strings to Date objects and make stateful
    const [normalizedPhaseDays, setNormalizedPhaseDays] = useState(
        phaseDays.map(day => ({
            ...day,
            date: new Date(day.date)
        }))
    )

    const [selectedTab, setSelectedTab] = useState("day")
    const [selectedRecipe, setSelectedRecipe] = useState<any>(null)
    const [isMenuOpen, setIsMenuOpen] = useState(true)
    const [selectedDay, setSelectedDay] = useState(() => {
        const today = startOfDay(new Date()).getTime()
        const foundToday = normalizedPhaseDays.find(d => startOfDay(d.date).getTime() === today)
        return foundToday || normalizedPhaseDays[0] || { dayNumber: 1, label: "Jour 1", date: new Date() }
    })
    const [currentData, setCurrentData] = useState(initialData)
    const [weekData, setWeekData] = useState<any>(null)
    const [phaseData, setPhaseData] = useState<any>(null)
    const [recipes, setRecipes] = useState<any[]>([])
    const [globalMenus, setGlobalMenus] = useState<any[]>([]) // New state
    const [shoppingData, setShoppingData] = useState<any>(null)
    const [currentView, setCurrentView] = useState<"home" | "menus" | "recipes" | "alternatives" | "shopping" | "composer" | "templates" | "dodont">("home")
    const [isPending, startTransition] = useTransition()
    const [selectedDailyMenu, setSelectedDailyMenu] = useState<any>(null)
    const [isDailyMenuModalOpen, setIsDailyMenuModalOpen] = useState(false)
    const [isWeekModalOpen, setIsWeekModalOpen] = useState(false)

    // Calculate number of weeks in phase
    const totalWeeks = Math.ceil(normalizedPhaseDays.length / 7)

    const handleRecipeClick = (recipe: any) => {
        setSelectedRecipe(recipe)
    }

    const [lockedState, setLockedState] = useState<{ locked: boolean; unlockDate?: any; reason?: string } | null>(null)

    const handleDayChange = (day: any) => {
        setSelectedDay(day)
        startTransition(async () => {
            const dateString = day.date.toISOString()
            const data = await getNutritionData(dateString)
            if (data && data.locked) {
                setLockedState(data)
                setCurrentData({ ...currentData, menu: null })
            } else if (data) {
                setLockedState(null)
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
        // Find day data in the current weekData
        if (weekData && weekData.days) {
            const dayData = weekData.days.find((d: any) => d.dayNumber === dayNum)
            if (dayData) {
                setSelectedDailyMenu(dayData)
                setIsDailyMenuModalOpen(true)
            }
        } else {
            // Fallback if weekData not fully loaded but we have phaseDays (might not have menu data though)
            const targetDay = normalizedPhaseDays.find(d => d.dayNumber === dayNum)
            if (targetDay) {
                // If we don't have menu details, better to just switch view or fetch
                // But user asked for floating window.
                // For now, let's assume weekData is present as we are in WeeklyView
                setSelectedTab("day")
                handleDayChange(targetDay)
            }
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
                        onClick={() => {
                            setCurrentView("menus")
                            // Trigger initial load/generation if not already loaded or if menu is null
                            if (!currentData.menu) {
                                handleDayChange(selectedDay)
                            }
                        }}
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

                    {/* 5. À faire / À éviter */}
                    <BentoCard
                        title="À faire / À éviter"
                        description="Les clés de la réussite."
                        icon={CheckCircle2}
                        colorClass="bg-emerald-50"
                        onClick={() => setCurrentView("dodont")}
                    />

                    {/* 6. Alternatives */}
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
        <div className="max-w-full mx-auto space-y-6 animate-in fade-in duration-500 px-4 sm:px-6 lg:px-8 relative min-h-[80vh]">
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
                                {/* Day Selection Strip */}
                                <div className="space-y-4">
                                    <div className="flex flex-col px-4 sm:px-0">
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

                                        {/* Source Badge */}
                                        {(currentData.source === 'COACH' || !currentData.source) && (
                                            <div className="inline-flex items-center gap-1.5 bg-purple-50 px-3 py-1 rounded-full border border-purple-100 w-fit mt-1">
                                                <span className="text-sm">✨</span>
                                                <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wide">
                                                    Menu conseillé par ta coach
                                                </span>
                                            </div>
                                        )}
                                        {currentData.source === 'USER' && (
                                            <div className="inline-flex items-center gap-1.5 bg-orange-50 px-3 py-1 rounded-full border border-orange-100 w-fit mt-1">
                                                <span className="text-sm">👤</span>
                                                <span className="text-[10px] font-bold text-orange-700 uppercase tracking-wide">
                                                    Ton menu personnalisé
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <DaySelectorStrip
                                        days={normalizedPhaseDays}
                                        selectedDayNumber={selectedDay.dayNumber}
                                        onDaySelect={handleDayChange}
                                    />
                                </div>

                                {/* Meal Cards Grid */}
                                <div className="space-y-4">
                                    {lockedState?.locked ? (
                                        <div className="bg-slate-50 border border-dashed border-slate-200 rounded-3xl p-12 flex flex-col items-center text-center gap-4 animate-in zoom-in-95 duration-500">
                                            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm">
                                                <span className="text-2xl">🔒</span>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-serif font-black text-slate-900 mb-1">
                                                    Bientôt disponible !
                                                </h3>
                                                <p className="text-slate-500 text-sm max-w-[280px] leading-relaxed">
                                                    Tes futurs menus seront débloqués <b>48h avant</b> le début de ta prochaine phase.
                                                </p>
                                            </div>
                                            {lockedState.unlockDate && (
                                                <div className="bg-orange-100 text-orange-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                                                    Déblocage le {format(new Date(lockedState.unlockDate), "d MMMM à HH:mm", { locale: fr })}
                                                </div>
                                            )}
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
                                            {/* Support for 5th meal slot if available */}
                                            {currentData.menu?.snack_afternoon && (
                                                <MealCard
                                                    category="SNACK APRÈS-MIDI"
                                                    recipe={currentData.menu?.snack_afternoon}
                                                    onClick={() => handleRecipeClick(currentData.menu?.snack_afternoon)}
                                                />
                                            )}
                                            <MealCard
                                                category="DÎNER"
                                                recipe={currentData.menu?.dinner}
                                                onClick={() => handleRecipeClick(currentData.menu?.dinner)}
                                            />
                                        </>
                                    )}

                                    {/* Validation Button */}
                                    {!lockedState?.locked && (
                                        <div className="pt-6 border-t border-slate-100 flex flex-col items-center gap-4">
                                            <button
                                                onClick={async () => {
                                                    const { validateDailyNutrition } = await import("@/lib/actions/nutrition")
                                                    startTransition(async () => {
                                                        const res = await validateDailyNutrition(selectedDay.date)
                                                        if (res.success) {
                                                            const updatedDays = await getPhaseDays()
                                                            setNormalizedPhaseDays(updatedDays.map(d => ({
                                                                ...d,
                                                                date: new Date(d.date)
                                                            })))
                                                            setCurrentData({ ...currentData, isCompleted: true })
                                                        }
                                                    })
                                                }}
                                                disabled={currentData.isCompleted || isPending}
                                                className={cn(
                                                    "w-full sm:w-64 h-14 rounded-2xl font-serif font-black text-lg transition-all shadow-md active:scale-95 flex items-center justify-center gap-2",
                                                    currentData.isCompleted
                                                        ? "bg-green-50 text-green-600 border border-green-100 cursor-default"
                                                        : "bg-[#241919] text-white hover:bg-black shadow-black/10"
                                                )}
                                            >
                                                {currentData.isCompleted ? (
                                                    <>
                                                        <span className="text-xl">✅</span>
                                                        C'est mangé !
                                                    </>
                                                ) : (
                                                    "J'ai fini mes repas"
                                                )}
                                            </button>
                                            {!currentData.isCompleted && (
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center">
                                                    Clique ici pour valider ta journée
                                                </p>
                                            )}
                                        </div>
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
                                    onWeekClick={(weekNum) => {
                                        handleWeekChange(weekNum)
                                        setIsWeekModalOpen(true)
                                    }}
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
                <div className="space-y-6">
                    <button
                        onClick={() => setCurrentView("home")}
                        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors group mb-4"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-bold uppercase tracking-widest">Retour</span>
                    </button>
                    <AlternativesView currentPhase={currentData.phase} />
                </div>
            )}

            {currentView === "dodont" && (
                <div className="space-y-6">
                    <button
                        onClick={() => setCurrentView("home")}
                        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors group mb-4"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-bold uppercase tracking-widest">Retour</span>
                    </button>
                    <DoDontView currentPhase={currentData.phase} />
                </div>
            )}

            <RecipeModal
                isOpen={!!selectedRecipe}
                onClose={() => setSelectedRecipe(null)}
                recipe={selectedRecipe}
            />

            <DailyMenuModal
                isOpen={isDailyMenuModalOpen}
                onClose={() => setIsDailyMenuModalOpen(false)}
                dayData={selectedDailyMenu}
            />

            <WeekMenuModal
                isOpen={isWeekModalOpen}
                onClose={() => setIsWeekModalOpen(false)}
                weekData={weekData}
                availableWeeks={totalWeeks}
                onWeekChange={handleWeekChange}
                onDayClick={handleWeekDayClick}
            />
        </div>
    )
}
