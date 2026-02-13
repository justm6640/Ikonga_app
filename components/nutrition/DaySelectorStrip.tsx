"use client"

import React, { useRef, useEffect, useState, useCallback } from "react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { ChevronLeft, ChevronRight } from "lucide-react"

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
    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const [canScrollRight, setCanScrollRight] = useState(false)

    const updateScrollIndicators = useCallback(() => {
        const el = scrollRef.current
        if (!el) return
        setCanScrollLeft(el.scrollLeft > 4)
        setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
    }, [])

    useEffect(() => {
        const el = scrollRef.current
        if (!el) return

        updateScrollIndicators()
        el.addEventListener("scroll", updateScrollIndicators, { passive: true })

        // Also check on resize
        const ro = new ResizeObserver(updateScrollIndicators)
        ro.observe(el)

        return () => {
            el.removeEventListener("scroll", updateScrollIndicators)
            ro.disconnect()
        }
    }, [updateScrollIndicators, days])

    // Auto-scroll to selected day on mount / change
    useEffect(() => {
        if (scrollRef.current) {
            const selectedElement = scrollRef.current.querySelector('[data-selected="true"]')
            if (selectedElement) {
                selectedElement.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })
            }
        }
        // Small delay to let scroll finish before updating indicators
        const t = setTimeout(updateScrollIndicators, 350)
        return () => clearTimeout(t)
    }, [selectedDayNumber, updateScrollIndicators])

    const scrollBy = (direction: "left" | "right") => {
        const el = scrollRef.current
        if (!el) return
        const amount = direction === "left" ? -200 : 200
        el.scrollBy({ left: amount, behavior: "smooth" })
    }

    return (
        <div className="relative w-full group/strip">
            {/* Left Arrow */}
            <button
                onClick={() => scrollBy("left")}
                className={`
                    absolute left-0 top-1/2 -translate-y-1/2 z-10
                    w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm border border-slate-200 
                    flex items-center justify-center shadow-md
                    transition-all duration-300
                    ${canScrollLeft
                        ? "opacity-100 pointer-events-auto hover:bg-white hover:scale-110 hover:shadow-lg"
                        : "opacity-0 pointer-events-none"
                    }
                `}
                aria-label="Défiler à gauche"
            >
                <ChevronLeft size={16} className="text-slate-600" />
            </button>

            {/* Left fade gradient */}
            <div className={`
                absolute left-0 top-0 bottom-0 w-8 z-[5] pointer-events-none
                bg-gradient-to-r from-white to-transparent
                transition-opacity duration-300
                ${canScrollLeft ? "opacity-100" : "opacity-0"}
            `} />

            {/* Scrollable Days */}
            <div
                ref={scrollRef}
                className="w-full overflow-x-auto no-scrollbar py-2 px-10"
            >
                <div className="flex items-start gap-3 sm:gap-4 min-w-max">
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
                                    <div className="w-[10px] h-[10px] opacity-0" />
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Right fade gradient */}
            <div className={`
                absolute right-0 top-0 bottom-0 w-8 z-[5] pointer-events-none
                bg-gradient-to-l from-white to-transparent
                transition-opacity duration-300
                ${canScrollRight ? "opacity-100" : "opacity-0"}
            `} />

            {/* Right Arrow */}
            <button
                onClick={() => scrollBy("right")}
                className={`
                    absolute right-0 top-1/2 -translate-y-1/2 z-10
                    w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm border border-slate-200 
                    flex items-center justify-center shadow-md
                    transition-all duration-300
                    ${canScrollRight
                        ? "opacity-100 pointer-events-auto hover:bg-white hover:scale-110 hover:shadow-lg"
                        : "opacity-0 pointer-events-none"
                    }
                `}
                aria-label="Défiler à droite"
            >
                <ChevronRight size={16} className="text-slate-600" />
            </button>

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
