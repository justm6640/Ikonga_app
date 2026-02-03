"use client"

import { useState, useTransition } from "react"
import { WorkoutHero } from "./WorkoutHero"
import { WorkoutList } from "./WorkoutList"
import { WorkoutTimer } from "./WorkoutTimer"
import { WorkoutCalendar } from "./WorkoutCalendar"
import { WorkoutLibraryView } from "./WorkoutLibraryView"
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
    LayoutGrid,
    Play,
    History,
    Clock
} from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { logWorkout, getWorkoutHistory } from "@/lib/actions/fitness"
import { cn } from "@/lib/utils"

const PLACEHOLDER_WORKOUT = {
    id: "placeholder",
    title: "Cardio Doux & Détox",
    description: "Séance idéale pour relancer la circulation sans brusquer le corps en phase Détox.",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    duration: 15,
    intensity: "LOW",
    type: "CARDIO",
    metValue: 3,
    thumbnailUrl: null
}

interface FitnessClientProps {
    initialData: {
        user: any
        recommendedWorkout: any
        alternatives: any[]
        todayLog: any
        phaseMessage?: string
    }
}

type ViewType = 'DAILY' | 'CALENDAR' | 'LIBRARY' | 'HISTORY'

export function FitnessClient({ initialData }: FitnessClientProps) {
    const { user, recommendedWorkout, alternatives, todayLog, phaseMessage } = initialData
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    const initialWorkout = recommendedWorkout || PLACEHOLDER_WORKOUT

    const [activeWorkout, setActiveWorkout] = useState(initialWorkout)
    const [log, setLog] = useState(todayLog)
    const [currentView, setCurrentView] = useState<ViewType>('DAILY')
    const [showTimer, setShowTimer] = useState(false)
    const [historyData, setHistoryData] = useState<any>(null)

    const activePhase = user.phases[0]?.type || "DETOX"
    const isCompleted = log && log.workoutId === activeWorkout?.id

    const handleSelectWorkout = (workout: any) => {
        setActiveWorkout(workout)
        setCurrentView('DAILY')
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleStartWorkout = () => {
        setShowTimer(true)
    }

    const handleCompleteWorkout = async (duration: number) => {
        startTransition(async () => {
            const result = await logWorkout(activeWorkout.id, duration)
            if (result.success) {
                setLog({ workoutId: activeWorkout.id, calories: result.calories })
                setShowTimer(false)
            }
        })
    }

    const handleCancelTimer = () => {
        setShowTimer(false)
    }

    const loadHistory = async () => {
        const data = await getWorkoutHistory(30)
        setHistoryData(data)
    }

    const handleViewChange = (view: ViewType) => {
        setCurrentView(view)
        if (view === 'HISTORY' && !historyData) {
            loadHistory()
        }
    }

    // Calcul approximatif des Kcal
    const estimatedCalories = Math.round((activeWorkout.metValue || 3) * (user.startWeight || 70) * (activeWorkout.duration / 60))

    // Timer overlay
    if (showTimer) {
        return (
            <WorkoutTimer
                workout={{
                    ...activeWorkout,
                    estimatedCalories
                }}
                onComplete={handleCompleteWorkout}
                onCancel={handleCancelTimer}
            />
        )
    }

    const VIEW_OPTIONS = [
        { value: 'DAILY' as ViewType, label: 'Séance du jour', icon: Flame, color: 'text-orange-500', bgColor: 'focus:bg-orange-50', fillColor: 'fill-orange-500' },
        { value: 'CALENDAR' as ViewType, label: 'Calendrier', icon: Calendar, color: 'text-purple-500', bgColor: 'focus:bg-purple-50' },
        { value: 'LIBRARY' as ViewType, label: 'Bibliothèque', icon: LayoutGrid, color: 'text-pink-500', bgColor: 'focus:bg-pink-50' },
        { value: 'HISTORY' as ViewType, label: 'Historique', icon: History, color: 'text-emerald-500', bgColor: 'focus:bg-emerald-50' }
    ]

    const currentViewOption = VIEW_OPTIONS.find(v => v.value === currentView)

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-8 space-y-6 pb-32">

            {/* 1. Navbar */}
            <div className="flex items-center gap-4 mb-2">
                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full border border-white/10 h-10 w-10 text-white/60 hover:text-white hover:bg-white/10"
                    onClick={() => router.back()}
                >
                    <ChevronLeft size={20} />
                </Button>
                <div>
                    <h1 className="text-xl font-serif font-black text-white tracking-wide uppercase">
                        IKOFITNESS
                    </h1>
                    <p className="text-[10px] text-white/40 font-medium uppercase tracking-widest">
                        Sport & Combustion
                    </p>
                </div>
            </div>

            {/* 2. Phase Message */}
            {phaseMessage && (
                <div className="bg-gradient-to-r from-orange-500/20 to-pink-500/20 backdrop-blur-xl rounded-xl border border-orange-500/30 p-4">
                    <p className="text-white font-medium text-center">{phaseMessage}</p>
                </div>
            )}

            {/* 3. Navigation Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {VIEW_OPTIONS.map(option => {
                    const Icon = option.icon
                    const isActive = currentView === option.value
                    return (
                        <Button
                            key={option.value}
                            variant="ghost"
                            onClick={() => handleViewChange(option.value)}
                            className={cn(
                                "flex-shrink-0 rounded-full px-4 py-2 gap-2 transition-all",
                                isActive
                                    ? "bg-white/10 text-white border border-white/20"
                                    : "text-white/50 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <Icon size={16} className={isActive ? option.color : ''} />
                            <span className="text-sm font-medium">{option.label}</span>
                        </Button>
                    )
                })}
            </div>

            {/* 4. Main Content */}
            {currentView === 'DAILY' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4">

                    {/* Title */}
                    <div className="space-y-1">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            Ta séance du jour <span className="text-red-500">❤️</span>
                        </h2>
                        <p className="text-xs text-white/50 font-medium">
                            Phase {activePhase} : On active le métabolisme en douceur.
                        </p>
                    </div>

                    {/* Main Card */}
                    <div className="bg-black/30 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
                        <div className="aspect-video bg-gradient-to-br from-orange-500/30 to-pink-500/30 relative">
                            {activeWorkout.thumbnailUrl ? (
                                <img src={activeWorkout.thumbnailUrl} alt={activeWorkout.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-6xl">🏋️</div>
                                </div>
                            )}

                            {/* Play Button Overlay */}
                            {!isCompleted && (
                                <button
                                    onClick={handleStartWorkout}
                                    className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors group"
                                >
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                                        <Play size={32} className="text-white ml-1" />
                                    </div>
                                </button>
                            )}

                            {/* Completed Badge */}
                            {isCompleted && (
                                <div className="absolute inset-0 flex items-center justify-center bg-emerald-500/30">
                                    <div className="bg-emerald-500 text-white px-6 py-3 rounded-full flex items-center gap-2 font-bold">
                                        <Trophy size={20} />
                                        Terminée !
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-4">
                            <h3 className="text-xl font-bold text-white mb-1">{activeWorkout.title}</h3>
                            <p className="text-white/50 text-sm mb-4">{activeWorkout.description}</p>

                            {/* Meta */}
                            <div className="flex gap-4 text-sm">
                                <span className="flex items-center gap-2 text-white/60">
                                    <Clock size={16} />
                                    {activeWorkout.duration} min
                                </span>
                                <span className="flex items-center gap-2 text-orange-400">
                                    <Flame size={16} />
                                    ~{estimatedCalories} kcal
                                </span>
                                <Badge variant="secondary" className={cn(
                                    "text-xs",
                                    activeWorkout.intensity === 'LOW' && "bg-green-500/20 text-green-400",
                                    activeWorkout.intensity === 'MODERATE' && "bg-yellow-500/20 text-yellow-400",
                                    activeWorkout.intensity === 'HIGH' && "bg-red-500/20 text-red-400"
                                )}>
                                    {activeWorkout.intensity === 'LOW' ? 'Douce' :
                                        activeWorkout.intensity === 'MODERATE' ? 'Modérée' : 'Intense'}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* Start Button */}
                    {!isCompleted && (
                        <Button
                            onClick={handleStartWorkout}
                            className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white py-6 text-lg font-bold h-14"
                        >
                            <Play size={20} className="mr-2" />
                            Commencer la séance
                        </Button>
                    )}

                    {/* Validation Banner if done */}
                    {log && (
                        <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-2xl p-4 flex items-center gap-4">
                            <div className="p-2 bg-emerald-500/30 rounded-full text-emerald-400">
                                <Trophy size={20} />
                            </div>
                            <div>
                                <p className="font-bold text-emerald-300 text-sm">Séance validée !</p>
                                <p className="text-xs text-emerald-400/70">
                                    {log.calories ? `${log.calories} kcal brûlées` : 'Continue comme ça !'}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Alternatives */}
                    {alternatives.length > 0 && (
                        <div className="mt-8 pt-8 border-t border-white/10">
                            <h3 className="text-white font-bold mb-4">Autres séances compatibles</h3>
                            <div className="space-y-3">
                                {alternatives.filter((w: any) => w.id !== activeWorkout?.id).slice(0, 4).map((workout: any) => (
                                    <button
                                        key={workout.id}
                                        onClick={() => handleSelectWorkout(workout)}
                                        className="w-full bg-black/30 backdrop-blur-xl rounded-xl border border-white/10 p-4 flex items-center gap-4 hover:border-orange-500/30 transition-all text-left"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/30 to-pink-500/30 flex items-center justify-center text-xl">
                                            {workout.type === 'CARDIO' ? '🏃' :
                                                workout.type === 'YOGA' ? '🧘' :
                                                    workout.type === 'STRENGTH' ? '💪' : '🏋️'}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-white">{workout.title}</p>
                                            <p className="text-xs text-white/40">{workout.duration} min</p>
                                        </div>
                                        <ChevronDown size={16} className="text-white/30 rotate-[-90deg]" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {currentView === 'CALENDAR' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <WorkoutCalendar
                        onDayClick={(date) => {
                            console.log('Day clicked:', date)
                        }}
                        onScheduleClick={(date) => {
                            setCurrentView('LIBRARY')
                        }}
                    />
                </div>
            )}

            {currentView === 'LIBRARY' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <WorkoutLibraryView
                        onSelectWorkout={handleSelectWorkout}
                        onScheduleWorkout={(workout, date) => {
                            console.log('Schedule workout:', workout, date)
                        }}
                    />
                </div>
            )}

            {currentView === 'HISTORY' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4">
                    <h2 className="text-lg font-bold text-white">Historique des séances</h2>

                    {/* Stats */}
                    {historyData?.stats && (
                        <div className="grid grid-cols-3 gap-3">
                            <div className="bg-black/30 backdrop-blur-xl rounded-xl border border-white/10 p-4 text-center">
                                <p className="text-2xl font-bold text-orange-400">{historyData.stats.totalWorkouts}</p>
                                <p className="text-xs text-white/40">Séances</p>
                            </div>
                            <div className="bg-black/30 backdrop-blur-xl rounded-xl border border-white/10 p-4 text-center">
                                <p className="text-2xl font-bold text-orange-400">{historyData.stats.totalCalories}</p>
                                <p className="text-xs text-white/40">Calories</p>
                            </div>
                            <div className="bg-black/30 backdrop-blur-xl rounded-xl border border-white/10 p-4 text-center">
                                <p className="text-2xl font-bold text-orange-400">{historyData.stats.totalDuration}</p>
                                <p className="text-xs text-white/40">Minutes</p>
                            </div>
                        </div>
                    )}

                    {/* History list */}
                    <div className="space-y-3">
                        {historyData?.logs?.map((log: any) => (
                            <div key={log.id} className="bg-black/30 backdrop-blur-xl rounded-xl border border-white/10 p-4 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/30 to-teal-500/30 flex items-center justify-center">
                                    <Trophy size={20} className="text-emerald-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-white">{log.workout?.title || 'Séance'}</p>
                                    <p className="text-xs text-white/40">
                                        {new Date(log.date).toLocaleDateString('fr-FR', {
                                            day: 'numeric',
                                            month: 'short',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                                {log.calories && (
                                    <div className="text-right">
                                        <p className="text-orange-400 font-bold">{log.calories}</p>
                                        <p className="text-xs text-white/40">kcal</p>
                                    </div>
                                )}
                            </div>
                        ))}

                        {(!historyData?.logs || historyData.logs.length === 0) && (
                            <div className="text-center py-12">
                                <p className="text-white/40">Aucune séance enregistrée</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

