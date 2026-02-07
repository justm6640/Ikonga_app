"use client"

import { motion } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { UserPhase, PhaseType } from "@prisma/client"
import { differenceInDays } from "date-fns"
import Link from "next/link"

interface UpcomingPhaseBannerProps {
    upcomingPhase: UserPhase
}

const PHASE_CONFIG = {
    DETOX: {
        label: "Détox",
        description: "Purification et préparation de ton corps",
        color: "from-purple-500 to-purple-600",
        icon: "🌸"
    },
    EQUILIBRE: {
        label: "Équilibre",
        description: "Phase d'attaque intensive et transformation",
        color: "from-pink-500 to-orange-500",
        icon: "⚖️"
    },
    CONSOLIDATION: {
        label: "Consolidation",
        description: "Stabilisation et ancrage des résultats",
        color: "from-emerald-500 to-teal-500",
        icon: "🎯"
    },
    ENTRETIEN: {
        label: "Entretien",
        description: "Nouveau mode de vie autonome et durable",
        color: "from-blue-500 to-indigo-500",
        icon: "💪"
    }
} as const

export function UpcomingPhaseBanner({ upcomingPhase }: UpcomingPhaseBannerProps) {
    const config = upcomingPhase.type in PHASE_CONFIG ? PHASE_CONFIG[upcomingPhase.type as keyof typeof PHASE_CONFIG] : PHASE_CONFIG.DETOX
    const daysUntil = upcomingPhase.startDate ? differenceInDays(upcomingPhase.startDate, new Date()) : 0

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 shadow-2xl"
        >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-pink-500/10 to-transparent rounded-full blur-2xl" />

            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center gap-2 mb-3">
                    <Sparkles size={16} className="text-amber-400" />
                    <span className="text-xs font-black uppercase tracking-widest text-amber-400">
                        Prochaine Phase
                    </span>
                </div>

                {/* Content */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-3xl">{config.icon}</span>
                            <h3 className="text-2xl font-black text-white">
                                Phase {config.label}
                            </h3>
                        </div>
                        <p className="text-slate-300 text-sm mb-3">
                            {config.description}
                        </p>
                        <div className="flex items-center gap-2">
                            <div className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                                <span className="text-xs font-bold text-white">
                                    {daysUntil === 0 ? "Aujourd'hui !" : daysUntil === 1 ? "Demain" : `Dans ${daysUntil} jours`}
                                </span>
                            </div>
                            {daysUntil <= 2 && (
                                <div className="px-3 py-1 bg-amber-500/20 backdrop-blur-sm rounded-full border border-amber-400/30">
                                    <span className="text-xs font-bold text-amber-300">
                                        🎁 Preview disponible
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* CTA */}
                    <Link href={`/phases/${upcomingPhase.type.toLowerCase()}`}>
                        <Button
                            size="default"
                            className={`rounded-full bg-gradient-to-r ${config.color} hover:opacity-90 text-white font-bold shadow-xl transition-all hover:scale-105 group h-12 px-6`}
                        >
                            Découvrir
                            <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>
            </div>
        </motion.div>
    )
}
