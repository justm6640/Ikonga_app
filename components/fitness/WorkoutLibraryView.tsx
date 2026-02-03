"use client"

import { useState, useEffect, useTransition } from "react"
import { Search, Filter, Clock, Flame, Dumbbell, Play, Calendar, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { getWorkoutLibrary, scheduleWorkout } from "@/lib/actions/fitness"

interface WorkoutLibraryViewProps {
    onSelectWorkout: (workout: any) => void
    onScheduleWorkout?: (workout: any, date: Date) => void
}

const WORKOUT_TYPES = [
    { value: "ALL", label: "Tous" },
    { value: "CARDIO", label: "Cardio" },
    { value: "HIIT", label: "HIIT" },
    { value: "STRENGTH", label: "Renforcement" },
    { value: "YOGA", label: "Yoga" },
    { value: "DANCE", label: "Danse" },
    { value: "COMBAT", label: "Combat" },
    { value: "BOOTCAMP", label: "Bootcamp" },
    { value: "RECOVERY", label: "Récupération" },
    { value: "MIXED", label: "Mixte" }
]

const INTENSITY_LEVELS = [
    { value: "ALL", label: "Toutes" },
    { value: "LOW", label: "Douce", color: "text-green-400" },
    { value: "MODERATE", label: "Modérée", color: "text-yellow-400" },
    { value: "HIGH", label: "Intense", color: "text-red-400" }
]

const DURATION_FILTERS = [
    { value: "ALL", label: "Toute durée" },
    { value: "SHORT", label: "< 20 min", min: 0, max: 20 },
    { value: "MEDIUM", label: "20-40 min", min: 20, max: 40 },
    { value: "LONG", label: "> 40 min", min: 40, max: 120 }
]

export function WorkoutLibraryView({ onSelectWorkout, onScheduleWorkout }: WorkoutLibraryViewProps) {
    const [workouts, setWorkouts] = useState<any[]>([])
    const [isPending, startTransition] = useTransition()
    const [search, setSearch] = useState("")
    const [typeFilter, setTypeFilter] = useState("ALL")
    const [intensityFilter, setIntensityFilter] = useState("ALL")
    const [durationFilter, setDurationFilter] = useState("ALL")
    const [showFilters, setShowFilters] = useState(false)

    useEffect(() => {
        loadWorkouts()
    }, [])

    const loadWorkouts = async (filters?: any) => {
        startTransition(async () => {
            const data = await getWorkoutLibrary(filters)
            setWorkouts(Array.isArray(data) ? data : [])
        })
    }

    const applyFilters = () => {
        const filters: any = {}

        if (typeFilter !== "ALL") {
            filters.type = typeFilter
        }

        if (intensityFilter !== "ALL") {
            filters.intensity = intensityFilter
        }

        if (durationFilter !== "ALL") {
            const durationConfig = DURATION_FILTERS.find(d => d.value === durationFilter)
            if (durationConfig && durationConfig.min !== undefined) {
                filters.minDuration = durationConfig.min
                filters.maxDuration = durationConfig.max
            }
        }

        if (search) {
            filters.search = search
        }

        loadWorkouts(filters)
    }

    useEffect(() => {
        const timeout = setTimeout(() => {
            applyFilters()
        }, 300)
        return () => clearTimeout(timeout)
    }, [search, typeFilter, intensityFilter, durationFilter])

    const getIntensityColor = (intensity: string) => {
        switch (intensity) {
            case "LOW": return "text-green-400 bg-green-400/20"
            case "MODERATE": return "text-yellow-400 bg-yellow-400/20"
            case "HIGH": return "text-red-400 bg-red-400/20"
            default: return "text-white/60 bg-white/10"
        }
    }

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "CARDIO": return "🏃"
            case "HIIT": return "⚡"
            case "STRENGTH": return "💪"
            case "YOGA": return "🧘"
            case "DANCE": return "💃"
            case "COMBAT": return "🥊"
            case "BOOTCAMP": return "🔥"
            case "RECOVERY": return "🧘‍♀️"
            case "MIXED": return "🔄"
            default: return "🏋️"
        }
    }

    return (
        <div className="space-y-4">
            {/* Search & Filter Toggle */}
            <div className="flex gap-2">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Rechercher une séance..."
                        className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                    />
                </div>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowFilters(!showFilters)}
                    className={cn(
                        "border-white/10",
                        showFilters && "bg-orange-500/20 border-orange-500/50"
                    )}
                >
                    <Filter className="w-4 h-4" />
                </Button>
            </div>

            {/* Filters Panel */}
            {showFilters && (
                <div className="bg-black/30 backdrop-blur-xl rounded-xl border border-white/10 p-4 space-y-4">
                    {/* Type filter */}
                    <div>
                        <p className="text-xs text-white/40 mb-2">Type de séance</p>
                        <div className="flex flex-wrap gap-2">
                            {WORKOUT_TYPES.map(type => (
                                <Button
                                    key={type.value}
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setTypeFilter(type.value)}
                                    className={cn(
                                        "text-xs h-8",
                                        typeFilter === type.value
                                            ? "bg-orange-500/30 text-orange-300"
                                            : "text-white/60 hover:text-white"
                                    )}
                                >
                                    {type.label}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Intensity filter */}
                    <div>
                        <p className="text-xs text-white/40 mb-2">Intensité</p>
                        <div className="flex gap-2">
                            {INTENSITY_LEVELS.map(level => (
                                <Button
                                    key={level.value}
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setIntensityFilter(level.value)}
                                    className={cn(
                                        "text-xs h-8",
                                        intensityFilter === level.value
                                            ? "bg-orange-500/30 text-orange-300"
                                            : "text-white/60 hover:text-white"
                                    )}
                                >
                                    {level.label}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Duration filter */}
                    <div>
                        <p className="text-xs text-white/40 mb-2">Durée</p>
                        <div className="flex gap-2">
                            {DURATION_FILTERS.map(dur => (
                                <Button
                                    key={dur.value}
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setDurationFilter(dur.value)}
                                    className={cn(
                                        "text-xs h-8",
                                        durationFilter === dur.value
                                            ? "bg-orange-500/30 text-orange-300"
                                            : "text-white/60 hover:text-white"
                                    )}
                                >
                                    {dur.label}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Clear filters */}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            setTypeFilter("ALL")
                            setIntensityFilter("ALL")
                            setDurationFilter("ALL")
                            setSearch("")
                        }}
                        className="text-white/40 hover:text-white"
                    >
                        <X className="w-4 h-4 mr-2" />
                        Réinitialiser les filtres
                    </Button>
                </div>
            )}

            {/* Results count */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-white/40">
                    {workouts.length} séance{workouts.length > 1 ? "s" : ""} disponible{workouts.length > 1 ? "s" : ""}
                </p>
            </div>

            {/* Workout cards */}
            <div className="grid gap-3">
                {isPending ? (
                    <div className="text-center py-8 text-white/40">
                        Chargement...
                    </div>
                ) : workouts.length === 0 ? (
                    <div className="text-center py-8 text-white/40">
                        Aucune séance trouvée
                    </div>
                ) : (
                    workouts.map(workout => (
                        <div
                            key={workout.id}
                            className="bg-black/30 backdrop-blur-xl rounded-xl border border-white/10 p-4 hover:border-orange-500/30 transition-all"
                        >
                            <div className="flex items-start gap-4">
                                {/* Icon */}
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/30 to-pink-500/30 flex items-center justify-center text-2xl">
                                    {getTypeIcon(workout.type)}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-white truncate">
                                        {workout.title}
                                    </h3>
                                    <p className="text-sm text-white/40 line-clamp-1">
                                        {workout.description}
                                    </p>

                                    {/* Meta */}
                                    <div className="flex items-center gap-3 mt-2 text-xs">
                                        <span className="flex items-center gap-1 text-white/60">
                                            <Clock className="w-3 h-3" />
                                            {workout.duration} min
                                        </span>
                                        <span className="flex items-center gap-1 text-orange-400">
                                            <Flame className="w-3 h-3" />
                                            ~{workout.estimatedCalories} kcal
                                        </span>
                                        <span className={cn(
                                            "px-2 py-0.5 rounded-full text-xs",
                                            getIntensityColor(workout.intensity)
                                        )}>
                                            {INTENSITY_LEVELS.find(l => l.value === workout.intensity)?.label}
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    {onScheduleWorkout && (
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => onScheduleWorkout(workout, new Date())}
                                            className="text-white/40 hover:text-orange-400"
                                        >
                                            <Calendar className="w-4 h-4" />
                                        </Button>
                                    )}
                                    <Button
                                        size="icon"
                                        onClick={() => onSelectWorkout(workout)}
                                        className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                                    >
                                        <Play className="w-4 h-4 text-white" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
