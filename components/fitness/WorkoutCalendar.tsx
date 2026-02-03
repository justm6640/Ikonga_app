"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Plus, Dumbbell, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addMonths, subMonths } from "date-fns"
import { fr } from "date-fns/locale"
import { getWorkoutCalendar } from "@/lib/actions/fitness"

interface WorkoutCalendarProps {
    onDayClick?: (date: Date) => void
    onScheduleClick?: (date: Date) => void
}

interface CalendarData {
    logs: Array<{
        id: string
        date: Date
        workout: { title: string; duration: number }
        calories?: number | null
    }>
    planned: Array<{
        id: string
        scheduledAt: Date
        completed: boolean
        workout: { title: string; duration: number }
    }>
}

export function WorkoutCalendar({ onDayClick, onScheduleClick }: WorkoutCalendarProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const [calendarData, setCalendarData] = useState<CalendarData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadCalendarData()
    }, [currentMonth])

    const loadCalendarData = async () => {
        setLoading(true)
        const year = currentMonth.getFullYear()
        const month = currentMonth.getMonth() + 1
        const data = await getWorkoutCalendar(year, month)
        setCalendarData(data)
        setLoading(false)
    }

    const days = eachDayOfInterval({
        start: startOfMonth(currentMonth),
        end: endOfMonth(currentMonth)
    })

    const getFirstDayOfWeek = () => {
        const firstDay = startOfMonth(currentMonth).getDay()
        return firstDay === 0 ? 6 : firstDay - 1 // Adjust for Monday start
    }

    const getDayData = (date: Date) => {
        if (!calendarData) return { logs: [], planned: [] }

        const logs = calendarData.logs.filter(log =>
            isSameDay(new Date(log.date), date)
        )
        const planned = calendarData.planned.filter(p =>
            isSameDay(new Date(p.scheduledAt), date)
        )

        return { logs, planned }
    }

    const weekDays = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]

    return (
        <div className="bg-black/30 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                    className="text-white/60 hover:text-white hover:bg-white/10"
                >
                    <ChevronLeft className="w-5 h-5" />
                </Button>

                <h3 className="text-lg font-semibold text-white capitalize">
                    {format(currentMonth, "MMMM yyyy", { locale: fr })}
                </h3>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                    className="text-white/60 hover:text-white hover:bg-white/10"
                >
                    <ChevronRight className="w-5 h-5" />
                </Button>
            </div>

            {/* Week days header */}
            <div className="grid grid-cols-7 gap-1 mb-2">
                {weekDays.map(day => (
                    <div key={day} className="text-center text-xs text-white/40 font-medium py-2">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
                {/* Empty cells for days before month start */}
                {Array.from({ length: getFirstDayOfWeek() }).map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square" />
                ))}

                {/* Day cells */}
                {days.map(day => {
                    const { logs, planned } = getDayData(day)
                    const hasWorkout = logs.length > 0
                    const hasPlanned = planned.filter(p => !p.completed).length > 0
                    const workoutCount = logs.length + planned.filter(p => p.completed).length

                    return (
                        <button
                            key={day.toISOString()}
                            onClick={() => onDayClick?.(day)}
                            className={cn(
                                "aspect-square rounded-lg flex flex-col items-center justify-center relative transition-all",
                                isToday(day) && "ring-2 ring-orange-500",
                                hasWorkout && "bg-gradient-to-br from-orange-500/30 to-pink-500/30",
                                hasPlanned && !hasWorkout && "bg-white/5 border border-dashed border-orange-500/50",
                                !hasWorkout && !hasPlanned && "hover:bg-white/5"
                            )}
                        >
                            <span className={cn(
                                "text-sm font-medium",
                                isToday(day) ? "text-orange-400" : "text-white/80",
                                hasWorkout && "text-white"
                            )}>
                                {format(day, "d")}
                            </span>

                            {/* Workout indicators */}
                            {workoutCount > 0 && (
                                <div className="flex gap-0.5 mt-1">
                                    {Array.from({ length: Math.min(workoutCount, 3) }).map((_, i) => (
                                        <div
                                            key={i}
                                            className="w-1.5 h-1.5 rounded-full bg-orange-400"
                                        />
                                    ))}
                                </div>
                            )}

                            {/* Planned indicator */}
                            {hasPlanned && !hasWorkout && (
                                <Dumbbell className="w-3 h-3 text-orange-400/60 mt-1" />
                            )}
                        </button>
                    )
                })}
            </div>

            {/* Legend */}
            <div className="flex gap-4 mt-4 pt-4 border-t border-white/10 text-xs text-white/40">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-br from-orange-500/50 to-pink-500/50" />
                    <span>Séance effectuée</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded border border-dashed border-orange-500/50" />
                    <span>Séance planifiée</span>
                </div>
            </div>

            {/* Add workout button */}
            {onScheduleClick && (
                <Button
                    onClick={() => onScheduleClick(new Date())}
                    className="w-full mt-4 bg-gradient-to-r from-orange-500/20 to-pink-500/20 hover:from-orange-500/30 hover:to-pink-500/30 text-white border border-orange-500/30"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Planifier une séance
                </Button>
            )}
        </div>
    )
}
