"use client"

import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { CheckCircle2, Circle, TrendingDown, Target, Flag } from "lucide-react"
import { cn } from "@/lib/utils"

interface Session {
    sessionNumber: number
    startDate: Date
    endDate: Date
    targetLoss: number
    projectedWeightEnd: number
    type: string
    isCurrent?: boolean
    isFirstAboEnd?: boolean
}

interface PhaseTimelineProps {
    sessions: Session[]
}

export function PhaseTimeline({ sessions }: PhaseTimelineProps) {
    return (
        <div className="space-y-8 relative">
            {/* Timeline Line */}
            <div className="absolute left-[23px] top-4 bottom-4 w-0.5 bg-slate-100" />

            <div className="space-y-6">
                {sessions.map((session, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.05 }}
                        className="relative pl-14"
                    >
                        {/* Dot */}
                        <div className={cn(
                            "absolute left-0 top-1 w-12 h-12 rounded-2xl flex items-center justify-center z-10 shadow-sm transition-all duration-300",
                            session.isCurrent ? "bg-ikonga-gradient text-white scale-110 shadow-pink-200" :
                                new Date() > session.endDate ? "bg-emerald-50 text-emerald-500" : "bg-white text-slate-300"
                        )}>
                            {new Date() > session.endDate ? (
                                <CheckCircle2 size={24} strokeWidth={2.5} />
                            ) : session.isCurrent ? (
                                <Circle size={24} strokeWidth={3} className="animate-pulse" />
                            ) : (
                                <Circle size={20} strokeWidth={2} />
                            )}
                        </div>

                        {/* Content */}
                        <Card className={cn(
                            "rounded-[2rem] border-none shadow-xl transition-all duration-300",
                            session.isCurrent ? "shadow-slate-200/80 ring-1 ring-pink-100" : "shadow-slate-100/30"
                        )}>
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-black text-slate-900">Session {session.sessionNumber}</h4>
                                            {session.isCurrent && (
                                                <span className="text-[10px] font-black uppercase tracking-wider bg-ikonga-coral text-white px-2 py-0.5 rounded-full">
                                                    En cours
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs font-bold text-slate-400">
                                            {session.startDate.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })} — {session.endDate.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center gap-1 justify-end text-ikonga-coral">
                                            <TrendingDown size={14} strokeWidth={3} />
                                            <span className="text-sm font-black">-{session.targetLoss}kg</span>
                                        </div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Objectif Session</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50/50 rounded-2xl">
                                    <div className="flex items-center gap-3">
                                        <Target size={16} className="text-slate-400" />
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase">Poids Visé</p>
                                            <p className="text-sm font-bold text-slate-700">{session.projectedWeightEnd}kg</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Sparkles size={16} className="text-slate-400" />
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase">Type</p>
                                            <p className="text-sm font-bold text-slate-700">Détox + ÉCE</p>
                                        </div>
                                    </div>
                                </div>

                                {session.isFirstAboEnd && (
                                    <div className="mt-4 flex items-center gap-3 p-3 bg-amber-50 border border-amber-100 rounded-2xl">
                                        <Flag size={16} className="text-amber-500" />
                                        <p className="text-[11px] font-bold text-amber-700">
                                            🏁 Fin de ton premier abonnement IKONGA
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

function Sparkles({ size, className }: { size?: number, className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size || 24}
            height={size || 24}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            <path d="M5 3v4" />
            <path d="M19 17v4" />
            <path d="M3 5h4" />
            <path d="M17 19h4" />
        </svg>
    )
}
