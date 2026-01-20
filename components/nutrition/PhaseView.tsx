"use client"

import { useState } from "react"
import { ChevronRight } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface PhaseViewProps {
    phaseData: {
        phase: string
        startDate: Date
        endDate: Date
        currentDay: number
        totalDays: number
        totalWeeks: number
        weeks: Array<{
            weekNumber: number
            weekStart: Date
            weekEnd: Date
            completedDays: number
            totalDays: number
        }>
        progressPercentage: number
    } | null
    onWeekClick: (weekNum: number) => void
}

export function PhaseView({ phaseData, onWeekClick }: PhaseViewProps) {
    // Create default structure if no data
    const displayData = phaseData || {
        phase: "DETOX",
        startDate: new Date(),
        endDate: new Date(),
        currentDay: 1,
        totalDays: 84,
        totalWeeks: 12,
        weeks: Array.from({ length: 12 }, (_, i) => ({
            weekNumber: i + 1,
            weekStart: new Date(),
            weekEnd: new Date(),
            completedDays: 0,
            totalDays: 7
        })),
        progressPercentage: 0
    }

    const getPhaseLabel = (phase: string) => {
        const labels: Record<string, string> = {
            DETOX: "Détox",
            EQUILIBRE: "Équilibre",
            CONSOLIDATION: "Consolidation",
            ENTRETIEN: "Entretien"
        }
        return labels[phase] || phase
    }

    return (
        <div className="space-y-6">
            {/* Phase Header */}
            <div className="space-y-3">
                <h2 className="text-2xl font-serif font-black text-slate-900">
                    Phase {getPhaseLabel(displayData.phase)}
                </h2>
                <div className="flex items-center justify-between text-sm">
                    <p className="text-slate-600 font-medium">
                        Du {format(new Date(displayData.startDate), "d MMMM", { locale: fr })} -
                        <span className="font-black text-orange-600 ml-1">
                            {displayData.totalDays} jours
                        </span>
                        <span className="text-slate-400 ml-1">
                            (Standard {displayData.totalWeeks} sem.)
                        </span>
                    </p>
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-wider">
                        Progression : Jour {displayData.currentDay}
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-500"
                        style={{ width: `${displayData.progressPercentage}%` }}
                    />
                </div>
            </div>

            {/* Weeks List */}
            <div className="grid grid-cols-1 gap-4">
                {displayData.weeks.map((week) => (
                    <div
                        key={week.weekNumber}
                        onClick={() => onWeekClick(week.weekNumber)}
                        className="group relative bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:border-orange-100 transition-all duration-300 cursor-pointer overflow-hidden"
                    >
                        {/* Decorative Background Element */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-bl-[80px] -mr-8 -mt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                        <div className="relative z-10 flex items-center justify-between">
                            <div className="flex items-center gap-5">
                                <div className="w-16 h-16 rounded-2xl bg-orange-50 flex flex-col items-center justify-center border border-orange-100 shadow-sm group-hover:scale-105 transition-transform">
                                    <span className="text-[10px] font-black uppercase text-orange-400 tracking-widest mb-0.5">Semaine</span>
                                    <span className="text-2xl font-black text-orange-600 leading-none">
                                        {week.weekNumber}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-serif font-black text-slate-900 mb-1 group-hover:text-orange-600 transition-colors">
                                        Semaine {week.weekNumber}
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                            {format(week.weekStart, "d MMM", { locale: fr })} - {format(week.weekEnd, "d MMM", { locale: fr })}
                                        </span>
                                        <div className="h-1 w-1 rounded-full bg-slate-300" />
                                        <span className="text-xs font-medium text-slate-500">
                                            {week.completedDays}/{week.totalDays} jours
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-all shadow-sm">
                                <ChevronRight
                                    size={20}
                                    className="text-slate-400 group-hover:text-white"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
