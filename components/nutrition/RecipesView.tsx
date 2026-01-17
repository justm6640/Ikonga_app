"use client"

import { useState, useTransition } from "react"
import { Search, ChevronDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { getRecipes } from "@/lib/actions/nutrition"

interface RecipesViewProps {
    initialRecipes: any[]
    currentPhase: string
    onRecipeClick: (recipe: any) => void
}

export function RecipesView({ initialRecipes, currentPhase, onRecipeClick }: RecipesViewProps) {
    const [recipes, setRecipes] = useState(initialRecipes)
    const [search, setSearch] = useState("")
    const [selectedPhase, setSelectedPhase] = useState("Toutes")
    const [selectedMoment, setSelectedMoment] = useState("Tous")
    const [isPending, startTransition] = useTransition()

    const phases = ["Toutes", "DETOX", "EQUILIBRE", "CONSOLIDATION", "ENTRETIEN"]
    const moments = ["Tous", "BREAKFAST", "SNACK", "LUNCH", "DINNER"]

    const handleFilterChange = () => {
        startTransition(async () => {
            const filters: any = {}

            if (selectedPhase !== "Toutes") {
                filters.phase = selectedPhase
            }

            if (selectedMoment !== "Tous") {
                filters.mealType = selectedMoment
            }

            if (search) {
                filters.search = search
            }

            const results = await getRecipes(filters)
            setRecipes(results)
        })
    }

    const handleSearchChange = (value: string) => {
        setSearch(value)
        startTransition(async () => {
            const filters: any = {}

            if (selectedPhase !== "Toutes") {
                filters.phase = selectedPhase
            }

            if (selectedMoment !== "Tous") {
                filters.mealType = selectedMoment
            }

            if (value) {
                filters.search = value
            }

            const results = await getRecipes(filters)
            setRecipes(results)
        })
    }

    const handlePhaseChange = (phase: string) => {
        setSelectedPhase(phase)
        startTransition(async () => {
            const filters: any = {}

            if (phase !== "Toutes") {
                filters.phase = phase
            }

            if (selectedMoment !== "Tous") {
                filters.mealType = selectedMoment
            }

            if (search) {
                filters.search = search
            }

            const results = await getRecipes(filters)
            setRecipes(results)
        })
    }

    const handleMomentChange = (moment: string) => {
        setSelectedMoment(moment)
        startTransition(async () => {
            const filters: any = {}

            if (selectedPhase !== "Toutes") {
                filters.phase = selectedPhase
            }

            if (moment !== "Tous") {
                filters.mealType = moment
            }

            if (search) {
                filters.search = search
            }

            const results = await getRecipes(filters)
            setRecipes(results)
        })
    }

    const getMomentLabel = (moment: string) => {
        const labels: Record<string, string> = {
            "BREAKFAST": "Petit-déjeuner",
            "SNACK": "Snack",
            "LUNCH": "Déjeuner",
            "DINNER": "Dîner"
        }
        return labels[moment] || moment
    }

    return (
        <div className="space-y-6">
            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <Input
                    placeholder="Rechercher une recette..."
                    value={search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10 h-12 rounded-xl border-slate-200 bg-white"
                />
            </div>

            {/* Filters */}
            <div className="flex gap-3">
                <div className="flex-1">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="w-full h-10 px-4 rounded-xl border border-slate-200 bg-white flex items-center justify-between hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">PHASE</span>
                                    <span className="text-sm font-bold text-slate-900">{selectedPhase}</span>
                                </div>
                                <ChevronDown size={16} className="text-slate-400" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-48">
                            {phases.map((phase) => (
                                <DropdownMenuItem
                                    key={phase}
                                    onClick={() => handlePhaseChange(phase)}
                                    className="cursor-pointer font-bold text-sm"
                                >
                                    {phase}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="flex-1">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="w-full h-10 px-4 rounded-xl border border-slate-200 bg-white flex items-center justify-between hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">MOMENT</span>
                                    <span className="text-sm font-bold text-slate-900">{selectedMoment}</span>
                                </div>
                                <ChevronDown size={16} className="text-slate-400" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-48">
                            {moments.map((moment) => (
                                <DropdownMenuItem
                                    key={moment}
                                    onClick={() => handleMomentChange(moment)}
                                    className="cursor-pointer font-bold text-sm"
                                >
                                    {getMomentLabel(moment)}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Recipes Grid */}
            {isPending ? (
                <div className="text-center py-20 text-slate-400">
                    <p className="text-sm italic">Chargement des recettes...</p>
                </div>
            ) : recipes.length === 0 ? (
                <div className="text-center py-20">
                    <div className="mb-4 text-5xl">🍽️</div>
                    <h3 className="text-xl font-serif font-black text-slate-900 mb-2">
                        Aucune recette trouvée
                    </h3>
                    <p className="text-sm text-slate-500 mb-4">
                        Essaie de changer la phase, le moment<br />
                        de la journée ou ta recherche.
                    </p>
                    <button
                        onClick={() => {
                            setSearch("")
                            setSelectedPhase("Toutes")
                            setSelectedMoment("Tous")
                            handleFilterChange()
                        }}
                        className="text-sm font-bold text-[#FF7F50] hover:text-[#FF6347] underline"
                    >
                        Réinitialiser les filtres
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recipes.map((recipe) => (
                        <div
                            key={recipe.id}
                            onClick={() => onRecipeClick(recipe)}
                            className="bg-white rounded-2xl border border-slate-100 overflow-hidden cursor-pointer hover:shadow-lg transition-all group"
                        >
                            {recipe.imageUrl ? (
                                <div className="w-full h-40 bg-slate-100 overflow-hidden">
                                    <img
                                        src={recipe.imageUrl}
                                        alt={recipe.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                    />
                                </div>
                            ) : (
                                <div className="w-full h-40 bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center">
                                    <span className="text-5xl">🍽️</span>
                                </div>
                            )}
                            <div className="p-4">
                                <h3 className="font-serif font-black text-lg text-slate-900 mb-2 line-clamp-2">
                                    {recipe.name}
                                </h3>
                                {recipe.mealType && (
                                    <span className="inline-block px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-bold uppercase tracking-wider">
                                        {getMomentLabel(recipe.mealType)}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
