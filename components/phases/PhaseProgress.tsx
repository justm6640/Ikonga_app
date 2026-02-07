"use client"

import { motion } from "framer-motion"
import { Check, Clock, Lock } from "lucide-react"
import { cn } from "@/lib/utils"
import { format, differenceInDays } from "date-fns"
import { fr } from "date-fns/locale"
import { UserPhase, PhaseType } from "@prisma/client"

interface PhaseProgressProps {
    current: UserPhase
    upcoming: UserPhase | null
    past: UserPhase[]
    all: UserPhase[]
}

const PHASE_CONFIG = {
    DETOX: {
        label: "Détox",
        color: "from-purple-500 to-purple-600",
        bgColor: "bg-purple-50",
        textColor: "text-purple-700",
        borderColor: "border-purple-200",
        icon: "🌸"
    },
    EQUILIBRE: {
        label: "Équilibre",
        color: "from-pink-500 to-orange-500",
        bgColor: "bg-pink-50",
        textColor: "text-pink-700",
        borderColor: "border-pink-200",
        icon: "⚖️"
    },
    CONSOLIDATION: {
        label: "Consolidation",
        color: "from-emerald-500 to-teal-500",
        bgColor: "bg-emerald-50",
        textColor: "text-emerald-700",
        borderColor: "border-emerald-200",
        icon: "🎯"
    },
    ENTRETIEN: {
        label: "Entretien",
        color: "from-blue-500 to-indigo-500",
        bgColor: "bg-blue-50",
        textColor: "text-blue-700",
        borderColor: "border-blue-200",
        icon: "💪"
    }
} as const

export function PhaseProgress({ current, upcoming, past, all }: PhaseProgressProps) {
    const today = new Date()

    const getPhaseStatus = (phase: UserPhase): "completed" | "active" | "upcoming" | "locked" => {
        if (past.some(p => p.id === phase.id)) return "completed"
        if (phase.id === current?.id) return "active"
        if (phase.id === upcoming?.id) return "upcoming"
        return "locked"
    }

    return (
        <div className="w-full bg-white rounded-[2rem] p-6 shadow-lg border border-slate-100">
            <div className="mb-6">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-500">
                    Ton Parcours IKONGA
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                    Phase actuelle : {current?.type && current.type in PHASE_CONFIG ? PHASE_CONFIG[current.type as keyof typeof PHASE_CONFIG].label : "Détox"}
                </p>
            </div>

            <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200" />

                {/* Phase Items */}
                <div className="space-y-6">
                    {all.map((phase, index) => {
                        const status = getPhaseStatus(phase)
                        const config = phase.type in PHASE_CONFIG ? PHASE_CONFIG[phase.type as keyof typeof PHASE_CONFIG] : PHASE_CONFIG.DETOX
                        const daysUntil = phase.startDate ? differenceInDays(phase.startDate, today) : null

                        return (
                            <motion.div
                                key={phase.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="relative flex items-start gap-4"
                            >
                                {/* Icon Circle */}
                                <div
                                    className={cn(
                                        "relative z-10 w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-all border-2",
                                        status === "completed" && "bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-200 border-emerald-300",
                                        status === "active" && `bg-gradient-to-br ${config.color} shadow-xl shadow-pink-200 scale-110 border-white`,
                                        status === "upcoming" && "bg-white border-slate-300 border-dashed",
                                        status === "locked" && "bg-slate-50 border-slate-200"
                                    )}
                                >
                                    {status === "completed" && <Check size={24} className="text-white" strokeWidth={3} />}
                                    {status === "active" && <span className="text-2xl">{config.icon}</span>}
                                    {status === "upcoming" && <Clock size={20} className="text-slate-400" />}
                                    {status === "locked" && <Lock size={16} className="text-slate-300" />}
                                </div>

                                {/* Content */}
                                <div className="flex-1 pb-2">
                                    <div
                                        className={cn(
                                            "rounded-2xl p-4 transition-all border-2",
                                            status === "active" && `${config.bgColor} ${config.borderColor}`,
                                            status === "completed" && "bg-emerald-50/50 border-emerald-100",
                                            (status === "upcoming" || status === "locked") && "bg-slate-50 border-slate-100"
                                        )}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <h4
                                                className={cn(
                                                    "font-black text-base uppercase tracking-wider",
                                                    status === "active" && config.textColor,
                                                    status === "completed" && "text-emerald-700",
                                                    (status === "upcoming" || status === "locked") && "text-slate-500"
                                                )}
                                            >
                                                {config.label}
                                            </h4>
                                            {status === "active" && (
                                                <span className="px-3 py-1 bg-white rounded-full text-[10px] font-black uppercase tracking-wider text-ikonga-coral shadow-sm">
                                                    En cours
                                                </span>
                                            )}
                                            {status === "upcoming" && daysUntil !== null && (
                                                <span className="text-xs text-slate-500 font-bold bg-white px-2 py-1 rounded-full">
                                                    Dans {daysUntil}j
                                                </span>
                                            )}
                                        </div>

                                        {phase.startDate && (
                                            <p className="text-xs text-slate-500 font-medium">
                                                {status === "completed" ? "Terminée" : "Début"} : {format(phase.actualEndDate || phase.plannedEndDate || phase.startDate, "d MMMM yyyy", { locale: fr })}
                                            </p>
                                        )}

                                        {status === "upcoming" && daysUntil !== null && daysUntil <= 2 && (
                                            <div className="mt-3 p-2 bg-white rounded-lg border border-amber-200">
                                                <p className="text-xs text-amber-700 font-bold">
                                                    ✨ Preview disponible - Prépare-toi pour la suite !
                                                </p>
                                            </div>
                                        )}

                                        {status === "locked" && (
                                            <p className="text-xs text-slate-400 mt-2">
                                                🔒 Se débloquera automatiquement
                                            </p>
                                        )}

                                        {status === "completed" && (
                                            <p className="text-xs text-emerald-600 mt-2 font-bold">
                                                ✓ Phase terminée avec succès
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
