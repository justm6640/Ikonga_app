"use client"

import { cn } from "@/lib/utils"
import { CheckCircle2, PlayCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface DayPlan {
    day: string
    dayLabel: string
    title: string
    status: 'COMPLETED' | 'TODO' | 'REST'
    type?: 'CARDIO' | 'STRENGTH' | 'MOBILITY' | 'WALK' | 'REST'
}

// Mock data based on the screenshot for design purpose
const MOCK_WEEK_PLAN: DayPlan[] = [
    { day: "Lun", dayLabel: "Lundi", title: "Cardio", status: "COMPLETED", type: "CARDIO" },
    { day: "Mar", dayLabel: "Mardi", title: "Repos", status: "REST", type: "REST" },
    { day: "Mer", dayLabel: "Mercredi", title: "Renfo", status: "TODO", type: "STRENGTH" },
    { day: "Jeu", dayLabel: "Jeudi", title: "Repos", status: "REST", type: "REST" },
    { day: "Ven", dayLabel: "Vendredi", title: "Mobilité", status: "TODO", type: "MOBILITY" },
    { day: "Sam", dayLabel: "Samedi", title: "Repos", status: "REST", type: "REST" },
    { day: "Dim", dayLabel: "Dimanche", title: "Marche", status: "TODO", type: "WALK" },
]

export function WeeklyView() {
    return (
        <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-serif font-black text-slate-900">Ta semaine</h2>
                <Badge className="bg-orange-50 text-orange-600 border border-orange-100 px-3 py-1 font-bold text-xs hover:bg-orange-50">
                    Objectif: 3 séances
                </Badge>
            </div>

            {/* List */}
            <div className="flex flex-col gap-3">
                {MOCK_WEEK_PLAN.map((plan, index) => {
                    const isCompleted = plan.status === 'COMPLETED'
                    const isRest = plan.status === 'REST'
                    const isTodo = plan.status === 'TODO'

                    return (
                        <div
                            key={index}
                            className={cn(
                                "flex items-center justify-between p-4 rounded-2xl border transition-all",
                                isCompleted ? "bg-emerald-50 border-emerald-100" :
                                    isRest ? "bg-slate-50 border-slate-100 opacity-60" :
                                        "bg-white border-slate-100 hover:border-orange-200 hover:shadow-sm"
                            )}
                        >
                            {/* Left: Day + Info */}
                            <div className="flex items-center gap-4">
                                {/* Day Badge */}
                                <div className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center font-black text-xs uppercase",
                                    isCompleted ? "bg-emerald-500 text-white" :
                                        isRest ? "bg-slate-200 text-slate-500" :
                                            "bg-orange-100 text-orange-600"
                                )}>
                                    {plan.day}
                                </div>

                                {/* Text Info */}
                                <div className="flex flex-col">
                                    <span className={cn(
                                        "font-black text-sm",
                                        isCompleted ? "text-emerald-900" :
                                            isRest ? "text-slate-500" :
                                                "text-slate-900"
                                    )}>
                                        {plan.title}
                                    </span>

                                    <div className="flex items-center gap-1">
                                        <span className={cn(
                                            "text-xs font-medium",
                                            isCompleted ? "text-emerald-700" :
                                                isRest ? "text-slate-400" :
                                                    "text-slate-500"
                                        )}>
                                            {isCompleted && "Séance terminée"}
                                            {isRest && "Récupération"}
                                            {isTodo && "À faire"}
                                        </span>
                                        {isCompleted && <CheckCircle2 size={12} className="text-emerald-600 fill-emerald-600 text-white" />}
                                        {/* Icon trick: fill-emerald-600 makes the inside green if filled, text-white makes check white? actually CheckCircle2 outline is currentcolor. */}
                                    </div>
                                </div>
                            </div>

                            {/* Right: Action */}
                            <div>
                                {isCompleted && (
                                    // Completed Icon already in text? Or separate? 
                                    // Screenshot shows simple clean look. 
                                    // Let's add a green check on the right? No, screenshot has it in status text or similar.
                                    // Actually screenshot shows green check IN THE STATUS TEXT line. 
                                    // Right side is empty for completed.
                                    null
                                )}

                                {isTodo && (
                                    <button className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center hover:scale-105 transition-transform shadow-md shadow-orange-200">
                                        <PlayCircle size={20} className="text-white fill-orange-500" />
                                    </button>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>

            <p className="text-[10px] text-center text-slate-300 italic">
                Tu peux modifier ton planning à tout moment dans le calendrier complet.
            </p>
        </div>
    )
}
