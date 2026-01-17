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
            <div className="space-y-3">
                {displayData.weeks.map((week) => (
                    <div
                        key={week.weekNumber}
                        onClick={() => onWeekClick(week.weekNumber)}
                        className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-md hover:border-slate-200 transition-all cursor-pointer group"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
                                    <span className="text-lg font-black text-orange-600">
                                        S{week.weekNumber}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-serif font-black text-slate-900 mb-1">
                                        Semaine {week.weekNumber}
                                    </h3>
                                    <p className="text-sm text-slate-500 font-medium">
                                        Jours ({week.completedDays}/{week.totalDays})
                                    </p>
                                </div>
                            </div>
                            <ChevronRight
                                size={20}
                                className="text-slate-300 group-hover:text-orange-500 transition-colors"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
