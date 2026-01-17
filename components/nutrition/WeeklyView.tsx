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

            {/* Days List */}
            <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 px-2">
                    SEMAINE {selectedWeek}
                </h3>

                {displayData.days.map((day) => (
                    <div
                        key={day.dayNumber}
                        className="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <div className="flex items-baseline gap-3 mb-2">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        SEMAINE {selectedWeek}
                                    </span>
                                </div>
                                <h4 className="text-xl font-serif font-black text-slate-900 mb-1">
                                    Jour {day.dayNumber}
                                </h4>
                                <p className="text-sm text-slate-600 font-medium">
                                    {getMealsSummary(day.menu)}
                                </p>
                            </div>
                            <Button
                                onClick={() => onDayClick(day.dayNumber)}
                                className="h-10 px-6 rounded-full bg-[#FF7F50] hover:bg-[#FF6347] text-white font-bold text-xs uppercase tracking-wider"
                            >
                                Voir détail
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
