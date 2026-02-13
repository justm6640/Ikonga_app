"use client"

import { useState } from "react"
import { FileText, ShoppingCart, ChevronDown, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface WeeklyViewProps {
    weekData: {
        weekNumber: number
        weekStartDate: Date
        days: Array<{
            dayNumber: number
            date: Date
            menu: any
            isCompleted: boolean
        }>
        phase: string
    } | null
    availableWeeks: number
    onWeekChange: (weekNum: number) => void
    onDayClick: (dayNum: number) => void
}

export function WeeklyView({ weekData, availableWeeks, onWeekChange, onDayClick }: WeeklyViewProps) {
    const [selectedWeek, setSelectedWeek] = useState(weekData?.weekNumber || 1)

    // Create default structure if no data
    const displayData = weekData || {
        weekNumber: 1,
        weekStartDate: new Date(),
        days: Array.from({ length: 7 }, (_, i) => ({
            dayNumber: i + 1,
            date: new Date(),
            menu: null,
            isCompleted: false
        })),
        phase: "DETOX"
    }

    const handleWeekChange = (weekNum: number) => {
        setSelectedWeek(weekNum)
        onWeekChange(weekNum)
    }

    const getMealName = (meal: any) => {
        if (!meal) return "-"
        if (typeof meal === 'object') return meal?.name || "-"
        return meal
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Week Selector and Actions */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <div className="flex items-center gap-3">
                    <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-500">
                        Semaine :
                    </span>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl flex items-center gap-2 cursor-pointer hover:border-slate-300 transition-colors">
                                <span className="text-slate-700 font-bold text-sm">
                                    Semaine {selectedWeek}
                                </span>
                                <ChevronDown size={16} className="text-slate-400" />
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-40">
                            {Array.from({ length: availableWeeks }, (_, i) => i + 1).map((weekNum) => (
                                <DropdownMenuItem
                                    key={weekNum}
                                    onClick={() => handleWeekChange(weekNum)}
                                    className="cursor-pointer font-bold text-sm"
                                >
                                    Semaine {weekNum}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="flex gap-2 sm:gap-3">
                    <Button
                        className="h-9 sm:h-10 px-4 sm:px-6 rounded-full bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white font-bold text-[10px] sm:text-xs uppercase tracking-wider shadow-lg flex-1 sm:flex-none"
                    >
                        <FileText size={14} className="mr-1.5 sm:mr-2" />
                        Menus (PDF)
                    </Button>
                    <Button
                        className="h-9 sm:h-10 px-4 sm:px-6 rounded-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-[10px] sm:text-xs uppercase tracking-wider flex-1 sm:flex-none"
                    >
                        <ShoppingCart size={14} className="mr-1.5 sm:mr-2" />
                        Courses
                    </Button>
                </div>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
                {displayData.days.map((day) => (
                    <div
                        key={day.dayNumber}
                        onClick={() => onDayClick(day.dayNumber)}
                        className="group relative bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:border-orange-100 transition-all duration-300 overflow-hidden cursor-pointer active:scale-[0.98]"
                    >
                        {/* Decorative Background Element */}
                        <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-orange-50 rounded-bl-[80px] sm:rounded-bl-[100px] -mr-12 sm:-mr-16 -mt-12 sm:-mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                        <div className="relative z-10">
                            {/* Day Header — always horizontal, compact on mobile */}
                            <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-slate-100">
                                <div className="shrink-0">
                                    <span className="text-[9px] sm:text-[10px] font-black text-orange-500 uppercase tracking-widest block">
                                        JOUR {day.dayNumber}
                                    </span>
                                    <h4 className="text-lg sm:text-2xl font-serif font-black text-slate-900 leading-none capitalize">
                                        {format(day.date, "EEEE", { locale: fr })}
                                    </h4>
                                </div>
                                <span className="text-[10px] sm:text-xs font-medium text-slate-400 bg-slate-50 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full">
                                    {format(day.date, "d MMM", { locale: fr })}
                                </span>

                                {/* Completion badge on mobile */}
                                {day.isCompleted && (
                                    <span className="ml-auto text-[9px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">✅</span>
                                )}

                                {/* Arrow — always visible */}
                                <div className="ml-auto h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-slate-50 text-slate-400 group-hover:bg-orange-500 group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm shrink-0">
                                    <ChevronRight size={16} className="sm:w-5 sm:h-5" />
                                </div>
                            </div>

                            {/* Menu Content */}
                            {day.menu ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
                                    {/* Breakfast */}
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                                            <span className="text-xs sm:text-sm">🌅</span>
                                        </div>
                                        <div className="min-w-0">
                                            <span className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Matin</span>
                                            <p className="text-xs sm:text-sm font-bold text-slate-800 truncate leading-snug">
                                                {getMealName(day.menu.breakfast)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Lunch */}
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-yellow-50 flex items-center justify-center shrink-0">
                                            <span className="text-xs sm:text-sm">☀️</span>
                                        </div>
                                        <div className="min-w-0">
                                            <span className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Midi</span>
                                            <p className="text-xs sm:text-sm font-bold text-slate-800 truncate leading-snug">
                                                {getMealName(day.menu.lunch)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Snack */}
                                    {day.menu.snack && (
                                        <div className="flex items-center gap-2 sm:gap-3">
                                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-pink-50 flex items-center justify-center shrink-0">
                                                <span className="text-xs sm:text-sm">🍎</span>
                                            </div>
                                            <div className="min-w-0">
                                                <span className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Snack</span>
                                                <p className="text-xs sm:text-sm font-bold text-slate-800 truncate leading-snug">
                                                    {getMealName(day.menu.snack)}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Snack AM */}
                                    {day.menu.snack_afternoon && (
                                        <div className="flex items-center gap-2 sm:gap-3">
                                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                                                <span className="text-xs sm:text-sm">🍪</span>
                                            </div>
                                            <div className="min-w-0">
                                                <span className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Goûter</span>
                                                <p className="text-xs sm:text-sm font-bold text-slate-800 truncate leading-snug">
                                                    {getMealName(day.menu.snack_afternoon)}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Dinner */}
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                                            <span className="text-xs sm:text-sm">🌙</span>
                                        </div>
                                        <div className="min-w-0">
                                            <span className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Soir</span>
                                            <p className="text-xs sm:text-sm font-bold text-slate-800 truncate leading-snug">
                                                {getMealName(day.menu.dinner)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center py-3 sm:py-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                    <p className="text-xs sm:text-sm text-slate-400 italic font-medium flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-slate-300 animate-pulse" />
                                        Menu en cours de préparation...
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
