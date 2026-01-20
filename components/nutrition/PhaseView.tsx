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
            isLocked?: boolean
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
            totalDays: 7,
            isLocked: false
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
                        onClick={() => !week.isLocked && onWeekClick(week.weekNumber)}
                        className={`group relative bg-white rounded-3xl p-6 border border-slate-100 shadow-sm transition-all duration-300 overflow-hidden ${week.isLocked ? 'cursor-not-allowed opacity-60' : 'hover:shadow-xl hover:border-orange-100 cursor-pointer'}`}
                    >
                        {/* Decorative Background Element */}
                        {!week.isLocked && (
                            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-bl-[80px] -mr-8 -mt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        )}

                        <div className="relative z-10 flex items-center justify-between">
                            <div className="flex items-center gap-5">
                                <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center border shadow-sm transition-transform ${week.isLocked ? 'bg-slate-100 border-slate-200' : 'bg-orange-50 border-orange-100 group-hover:scale-105'}`}>
                                    <span className={`text-[10px] font-black uppercase tracking-widest mb-0.5 ${week.isLocked ? 'text-slate-400' : 'text-orange-400'}`}>Semaine</span>
                                    <span className={`text-2xl font-black leading-none ${week.isLocked ? 'text-slate-500' : 'text-orange-600'}`}>
                                        {week.weekNumber}
                                    </span>
                                </div>
                                <div>
                                    <h3 className={`text-xl font-serif font-black mb-1 transition-colors ${week.isLocked ? 'text-slate-500' : 'text-slate-900 group-hover:text-orange-600'}`}>
                                        Semaine {week.weekNumber}
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                            {format(week.weekStart, "d MMM", { locale: fr })} - {format(week.weekEnd, "d MMM", { locale: fr })}
                                        </span>
                                        {!week.isLocked && (
                                            <>
                                                <div className="h-1 w-1 rounded-full bg-slate-300" />
                                                <span className="text-xs font-medium text-slate-500">
                                                    {week.completedDays}/{week.totalDays} jours
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className={`h-10 w-10 rounded-full flex items-center justify-center transition-all shadow-sm ${week.isLocked ? 'bg-slate-50 text-slate-300' : 'bg-slate-50 text-slate-400 group-hover:bg-orange-500 group-hover:text-white'}`}>
                                {week.isLocked ? (
                                    <span className="text-sm">🔒</span>
                                ) : (
                                    <ChevronRight size={20} />
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
