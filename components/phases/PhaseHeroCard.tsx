"use client"

import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Calendar, ChevronRight, Lock, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { PhaseType } from "@prisma/client"

interface PhaseHeroCardProps {
    currentPhase: {
        type: PhaseType
        startDate: Date
        endDate?: Date | null
        dayNumber: number
        totalDays: number
    }
    nextPhase?: {
        type: PhaseType
        startDate: Date
    } | null
    subscriptionTier: string
}

export function PhaseHeroCard({ currentPhase, nextPhase, subscriptionTier }: PhaseHeroCardProps) {
    const progress = Math.min((currentPhase.dayNumber / currentPhase.totalDays) * 100, 100);

    // Logic for next phase teaser (48h window)
    const today = new Date();
    const isWithin48h = nextPhase ?
        (nextPhase.startDate.getTime() - today.getTime()) <= (48 * 60 * 60 * 1000) : false;

    return (
        <div className="space-y-6">
            {/* Main Phase Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <Card className="rounded-[2.5rem] border-none bg-ikonga-gradient shadow-2xl shadow-pink-200/50 overflow-hidden relative">
                    <CardContent className="p-8 md:p-10 relative z-10 text-white">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Sparkles size={18} className="text-white/80" />
                                    <span className="text-xs font-black uppercase tracking-[0.2em] text-white/80">Phase Actuelle</span>
                                </div>
                                <h2 className="text-4xl md:text-5xl font-serif font-black">{currentPhase.type}</h2>
                                <p className="text-white/80 font-medium">
                                    Abonnement {subscriptionTier.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                </p>
                            </div>

                            {/* Circular Progress */}
                            <div className="relative h-32 w-32 flex items-center justify-center shrink-0">
                                <svg className="h-full w-full rotate-[-90deg]">
                                    <circle
                                        cx="50%"
                                        cy="50%"
                                        r="58"
                                        fill="transparent"
                                        stroke="rgba(255,255,255,0.2)"
                                        strokeWidth="8"
                                    />
                                    <motion.circle
                                        cx="50%"
                                        cy="50%"
                                        r="58"
                                        fill="transparent"
                                        stroke="white"
                                        strokeWidth="8"
                                        strokeDasharray={2 * Math.PI * 58}
                                        initial={{ strokeDashoffset: 2 * Math.PI * 58 }}
                                        animate={{ strokeDashoffset: (2 * Math.PI * 58) * (1 - progress / 100) }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-2xl font-black">{currentPhase.dayNumber}</span>
                                    <span className="text-[10px] uppercase font-bold text-white/60">sur {currentPhase.totalDays}j</span>
                                </div>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-4 mt-10 p-4 bg-white/10 rounded-3xl backdrop-blur-sm">
                            <div className="flex items-center gap-3">
                                <div className="bg-white/20 p-2 rounded-xl">
                                    <Calendar size={18} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-white/60 tracking-wider">Début</p>
                                    <p className="font-bold text-sm">{currentPhase.startDate.toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="bg-white/20 p-2 rounded-xl">
                                    <ChevronRight size={18} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-white/60 tracking-wider">Fin Estimée</p>
                                    <p className="font-bold text-sm">{currentPhase.endDate?.toLocaleDateString() || "TBD"}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>

                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-400/10 rounded-full -ml-24 -mb-24 blur-2xl" />
                </Card>
            </motion.div>

            {/* Next Phase Teaser */}
            {nextPhase && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card className={cn(
                        "rounded-3xl border-none shadow-lg overflow-hidden transition-all duration-500",
                        isWithin48h ? "bg-white" : "bg-slate-50/50"
                    )}>
                        <CardContent className="p-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "h-12 w-12 rounded-2xl flex items-center justify-center shadow-sm",
                                    isWithin48h ? "bg-ikonga-gradient text-white animate-pulse" : "bg-slate-100 text-slate-400"
                                )}>
                                    {isWithin48h ? <Sparkles size={24} /> : <Lock size={20} />}
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-900 leading-none">
                                        {isWithin48h ? "Ta prochaine phase arrive !" : "Prochaine étape"}
                                    </h4>
                                    <p className="text-sm text-slate-500 mt-1 font-medium">
                                        {isWithin48h ?
                                            `Début le ${nextPhase.startDate.toLocaleDateString()} (${nextPhase.type})` :
                                            "Bientôt dévoilée..."
                                        }
                                    </p>
                                </div>
                            </div>

                            {!isWithin48h && (
                                <div className="text-[10px] font-black uppercase tracking-widest text-slate-300 bg-slate-100/50 px-3 py-1.5 rounded-full">
                                    Focus Actuel
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            )}
        </div>
    )
}
