"use client"

import { useState } from "react"
import { WorkoutHero } from "./WorkoutHero"
import { WorkoutList } from "./WorkoutList"
import { WeeklyView } from "./WeeklyView"
import { LibraryView } from "./LibraryView"
import { ComposerView } from "./ComposerView"
import { Badge } from "@/components/ui/badge"
import {
    Sparkles,
    Trophy,
    Flame,
    Target,
    ChevronDown,
    ChevronLeft,
    Calendar,
    CalendarDays,
    BookOpen,
    Wrench,
    LayoutGrid
} from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const PLACEHOLDER_WORKOUT = {
    id: "placeholder",
    title: "Cardio Doux & Détox",
    description: "Séance idéale pour relancer la circulation sans brusquer le corps en phase Détox.",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    duration: 15,
    intensity: "LOW", // mapped to DOUCE
    type: "CARDIO",
    metValue: 3,
    thumbnailUrl: null // Using placeholder gradient
}

interface FitnessClientProps {
    initialData: {
        user: any
        recommendedWorkout: any
        alternatives: any[]
        todayLog: any
    }
}

export function FitnessClient({ initialData }: FitnessClientProps) {
    const { user, recommendedWorkout, alternatives, todayLog } = initialData
    const router = useRouter()

    // Use recommended or placeholder
    const initialWorkout = recommendedWorkout || PLACEHOLDER_WORKOUT

    const [activeWorkout, setActiveWorkout] = useState(initialWorkout)
    const [log, setLog] = useState(todayLog)
    const [currentView, setCurrentView] = useState('DAILY') // DAILY, WEEKLY, LIBRARY, COMPOSER, CALENDAR

    const activePhase = user.phases[0]?.type || "DETOX"
    const isCompleted = log && log.workoutId === activeWorkout?.id

    const handleSelectWorkout = (workout: any) => {
        setActiveWorkout(workout)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    // Calcul approximatif des Kcal
    const estimatedCalories = Math.round((activeWorkout.metValue || 3) * 70 * (activeWorkout.duration / 60))

    return (
        <div className="min-h-screen bg-white p-4 sm:p-8 space-y-6 pb-32">

            {/* 1. Navbar specific to Fitness page */}
            <div className="flex items-center gap-4 mb-2">
                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full border border-slate-200 h-10 w-10"
                    onClick={() => router.back()}
                >
                    <ChevronLeft size={20} className="text-slate-900" />
                </Button>
                <div>
                    <h1 className="text-xl font-serif font-black text-slate-900 tracking-wide uppercase">
                        IKOFITNESS
                    </h1>
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">
                        Bouger pour mieux vivre
                    </p>
                </div>
            </div>

            {/* 2. Dropdown Menu for Navigation */}
            <div className="w-full">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full justify-between rounded-xl h-12 border-orange-200 bg-white hover:bg-orange-50 text-slate-900 border-2">
                            <div className="flex items-center gap-2">
                                {currentView === 'DAILY' && <><Flame className="text-orange-500 fill-orange-500" size={18} /> <span className="font-bold">Séance du jour</span></>}
                                {currentView === 'WEEKLY' && <><CalendarDays className="text-blue-500" size={18} /> <span className="font-bold">Ma semaine</span></>}
                                {currentView === 'LIBRARY' && <><LayoutGrid className="text-pink-500" size={18} /> <span className="font-bold">Bibliothèque</span></>}
                                {currentView === 'COMPOSER' && <><Wrench className="text-slate-500" size={18} /> <span className="font-bold">Composer séance</span></>}
                                {currentView === 'CALENDAR' && <><Calendar className="text-purple-500" size={18} /> <span className="font-bold">Calendrier</span></>}
                            </div>
                            <ChevronDown size={16} className="text-slate-400" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[calc(100vw-2rem)] sm:w-[320px] p-2 rounded-xl" align="start">
                        <DropdownMenuItem onClick={() => setCurrentView('DAILY')} className="gap-3 py-3 rounded-lg focus:bg-orange-50 cursor-pointer">
                            <Flame className="text-orange-500 fill-orange-500" size={18} />
                            <span className="font-medium text-slate-700">Séance du jour</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setCurrentView('WEEKLY')} className="gap-3 py-3 rounded-lg focus:bg-blue-50 cursor-pointer">
                            <CalendarDays className="text-blue-500" size={18} />
                            <span className="font-medium text-slate-700">Ma semaine</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setCurrentView('LIBRARY')} className="gap-3 py-3 rounded-lg focus:bg-pink-50 cursor-pointer">
                            <LayoutGrid className="text-pink-500" size={18} />
                            <span className="font-medium text-slate-700">Bibliothèque</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setCurrentView('COMPOSER')} className="gap-3 py-3 rounded-lg focus:bg-slate-50 cursor-pointer">
                            <Wrench className="text-slate-500" size={18} />
                            <span className="font-medium text-slate-700">Composer séance</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setCurrentView('CALENDAR')} className="gap-3 py-3 rounded-lg focus:bg-purple-50 cursor-pointer">
                            <Calendar className="text-purple-500" size={18} />
                            <span className="font-medium text-slate-700">Calendrier</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* 3. Main Content based on View */}
            {currentView === 'DAILY' ? (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-4">

                    {/* Titles */}
                    <div className="space-y-1">
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            Ta séance du jour <span className="text-red-500">❤️</span>
                        </h2>
                        <p className="text-xs text-slate-500 font-medium">
                            Phase {activePhase} : On active le métabolisme en douceur.
                        </p>
                    </div>

                    {/* Main Card */}
                    <WorkoutHero
                        workout={activeWorkout}
                        isCompletedToday={!!isCompleted}
                    />

                    {/* 4. Stats Cards Row */}
                    <div className="flex flex-col sm:flex-row gap-4 mt-6">
                        {/* Calories Card */}
                        <div className="flex-1 bg-[#FFF8F3] rounded-2xl p-4 flex items-center gap-4 border border-orange-100">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                                <Flame size={20} className="fill-orange-500 text-orange-500" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-orange-900 uppercase tracking-widest mb-0.5">OBJECTIF</p>
                                <p className="text-sm font-bold text-slate-900">~{estimatedCalories} kcal</p>
                            </div>
                        </div>

                        {/* Target Card */}
                        <div className="flex-1 bg-[#F0F7FF] rounded-2xl p-4 flex items-center gap-4 border border-blue-100">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                                <Target size={20} className="text-blue-500" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-blue-900 uppercase tracking-widest mb-0.5">CIBLE</p>
                                <p className="text-sm font-bold text-slate-900">Corps entier</p>
                            </div>
                        </div>
                    </div>

                    {/* Validation Banner if done */}
                    {log && (
                        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-center gap-4 mt-4">
                            <div className="p-2 bg-emerald-100 rounded-full text-emerald-600">
                                <Trophy size={20} />
                            </div>
                            <div>
                                <p className="font-bold text-emerald-900 text-sm">Séance validée !</p>
                                <p className="text-xs text-emerald-700">Continue comme ça, championne.</p>
                            </div>
                        </div>
                    )}
                </div>
            ) : currentView === 'WEEKLY' ? (
                <WeeklyView />
            ) : currentView === 'LIBRARY' ? (
                <LibraryView />
            ) : currentView === 'COMPOSER' ? (
                <ComposerView />
            ) : (
                <div className="py-20 text-center">
                    <p className="text-slate-400 font-medium">Vue {currentView} en cours de développement...</p>
                </div>
            )}

            {/* Alternatives (only show in DAILY for now, or maybe everywhere?) */}
            {currentView === 'DAILY' && alternatives.length > 0 && (
                <div className="mt-8 pt-8 border-t border-slate-100">
                    <WorkoutList
                        title="Autres séances compatibles"
                        workouts={alternatives.filter((w: any) => w.id !== activeWorkout?.id)}
                        onSelectWorkout={handleSelectWorkout}
                    />
                </div>
            )}
        </div>
    )
}
