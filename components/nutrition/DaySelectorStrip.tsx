"use client"

import React, { useRef, useEffect } from "react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface DaySelectorStripProps {
    days: Array<{
        dayNumber: number
        date: Date
        label: string
        isCompleted?: boolean
    }>
    selectedDayNumber: number
    onDaySelect: (day: any) => void
}

export function DaySelectorStrip({ days, selectedDayNumber, onDaySelect }: DaySelectorStripProps) {
    const scrollRef = useRef<HTMLDivElement>(null)

    // Optional: auto-scroll to selected day on mount
    useEffect(() => {
        if (scrollRef.current) {
            const selectedElement = scrollRef.current.querySelector('[data-selected="true"]')
            if (selectedElement) {
                selectedElement.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })
            }
        }
    }, [selectedDayNumber])

    return (
        <div
            ref={scrollRef}
            className="w-full overflow-x-auto no-scrollbar py-2 px-1"
        >
            <div className="flex items-start gap-4 min-w-max px-2">
                {days.map((day) => {
                    const isSelected = day.dayNumber === selectedDayNumber
                    const dateObj = new Date(day.date)
                    const dayName = format(dateObj, "EEE", { locale: fr }).toUpperCase().replace('.', '')
                    const dayDate = format(dateObj, "d")

                    return (
                        <div key={day.dayNumber} className="flex flex-col items-center gap-1.5 group">
                            <button
                                onClick={() => onDaySelect(day)}
                                data-selected={isSelected}
                                className={`
                                    w-[40px] h-[48px] rounded-[10px] flex flex-col items-center justify-center transition-all duration-300 shadow-[0_4px_4px_rgba(0,0,0,0.1)]
                                    ${isSelected
                                        ? "bg-[#EB6440] text-white scale-105"
                                        : "bg-white text-[#241919] hover:bg-slate-50 border border-slate-100"
                                    }
                                `}
                            >
                                <span className={`text-[8px] font-black tracking-tighter mb-0.5 ${isSelected ? "text-white/90" : "text-[#241919]/60"}`}>
                                    {dayName}
                                </span>
                                <span className={`text-[14px] font-black italic leading-none ${isSelected ? "text-white" : "text-[#241919]"}`}>
                                    {dayDate}
                                </span>
                            </button>

                            {/* Completion Dot Indicator */}
                            {day.isCompleted ? (
                                <div className="w-[10px] h-[10px] rounded-full bg-[#004B23] shadow-sm animate-in fade-in zoom-in duration-500" />
                            ) : (
                                <div className="w-[10px] h-[10px] opacity-0" /> // Placeholder to maintain height
                            )}
                        </div>
                    )
                })}
            </div>
            <style jsx>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    )
}
