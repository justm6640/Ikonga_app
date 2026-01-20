"use client"

import { useState } from "react"
import { FileText, ShoppingCart, ChevronDown } from "lucide-react"
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

    const getMealsSummary = (menu: any) => {
        if (!menu) return "Menu en préparation"
        const meals = []
        if (menu.breakfast) meals.push("Petit-déjeuner")
        if (menu.lunch) meals.push("déjeuner")
        if (menu.dinner) meals.push("dîner")
        if (menu.snack) meals.push("snacks")
        return meals.join(", ") + "."
    }

    return (
        <div className="space-y-6">
            {/* Week Selector and Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <span className="text-sm font-black uppercase tracking-wider text-slate-500">
                        Choisir la semaine :
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

                <div className="flex gap-3">
                    <Button
                        className="h-10 px-6 rounded-full bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg"
                    >
                        <FileText size={16} className="mr-2" />
                        Menus (PDF)
                    </Button>
                    <Button
                        className="h-10 px-6 rounded-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs uppercase tracking-wider"
                    >
                        <ShoppingCart size={16} className="mr-2" />
                        Liste courses
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {displayData.days.map((day) => (
                    <div
                        key={day.dayNumber}
                        className="group relative bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:border-orange-100 transition-all duration-300 overflow-hidden"
                    >
                        {/* Decorative Background Element */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-[100px] -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                        <div className="relative z-10 flex flex-col md:flex-row gap-6 md:items-start">
                            {/* Left: Day & Date */}
                            <div className="md:w-32 shrink-0 flex md:flex-col items-center md:items-start justify-start gap-2 border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-6 mr-12 md:mr-0">
                                <div>
                                    <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest block mb-1">
                                        JOUR {day.dayNumber}
                                    </span>
                                    <h4 className="text-2xl md:text-3xl font-serif font-black text-slate-900 leading-none">
                                        {format(day.date, "EEEE", { locale: fr }).charAt(0).toUpperCase() + format(day.date, "EEEE", { locale: fr }).slice(1)}
                                    </h4>
                                </div>
                                <span className="text-xs font-medium text-slate-400 bg-slate-50 px-3 py-1 rounded-full">
                                    {format(day.date, "d MMMM", { locale: fr })}
                                </span>
                            </div>

                            {/* Middle: Menu List */}
                            <div className="flex-1 min-w-0">
                                {day.menu ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                                        {/* Breakfast */}
                                        <div className="flex items-start gap-3 group/item">
                                            <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center shrink-0 group-hover/item:bg-orange-100 transition-colors">
                                                <span className="text-sm">🌅</span>
                                            </div>
                                            <div className="min-w-0">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Matin</span>
                                                <p className="text-sm font-bold text-slate-800 truncate leading-snug">
                                                    {typeof day.menu.breakfast === 'object' ? day.menu.breakfast?.name : (day.menu.breakfast || "-")}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Lunch */}
                                        <div className="flex items-start gap-3 group/item">
                                            <div className="w-8 h-8 rounded-full bg-yellow-50 flex items-center justify-center shrink-0 group-hover/item:bg-yellow-100 transition-colors">
                                                <span className="text-sm">☀️</span>
                                            </div>
                                            <div className="min-w-0">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Midi</span>
                                                <p className="text-sm font-bold text-slate-800 truncate leading-snug">
                                                    {typeof day.menu.lunch === 'object' ? day.menu.lunch?.name : (day.menu.lunch || "-")}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Snack */}
                                        {day.menu.snack && (
                                            <div className="flex items-start gap-3 group/item">
                                                <div className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center shrink-0 group-hover/item:bg-pink-100 transition-colors">
                                                    <span className="text-sm">🍎</span>
                                                </div>
                                                <div className="min-w-0">
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Snack</span>
                                                    <p className="text-sm font-bold text-slate-800 truncate leading-snug">
                                                        {typeof day.menu.snack === 'object' ? day.menu.snack?.name : day.menu.snack}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Dinner */}
                                        <div className="flex items-start gap-3 group/item">
                                            <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center shrink-0 group-hover/item:bg-indigo-100 transition-colors">
                                                <span className="text-sm">🌙</span>
                                            </div>
                                            <div className="min-w-0">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Soir</span>
                                                <p className="text-sm font-bold text-slate-800 truncate leading-snug">
                                                    {typeof day.menu.dinner === 'object' ? day.menu.dinner?.name : (day.menu.dinner || "-")}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-full flex items-center justify-center py-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                        <p className="text-sm text-slate-400 italic font-medium flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-slate-300 animate-pulse" />
                                            Menu en cours de préparation...
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Right: Action */}
                            <div className="absolute top-0 right-0 md:static flex items-center justify-end md:self-center">
                                <Button
                                    onClick={() => onDayClick(day.dayNumber)}
                                    variant="ghost"
                                    className="h-12 w-12 rounded-full bg-slate-50 text-slate-400 hover:bg-orange-500 hover:text-white transition-all duration-300 shadow-sm"
                                >
                                    <ChevronDown size={20} className="-rotate-90 ml-0.5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
