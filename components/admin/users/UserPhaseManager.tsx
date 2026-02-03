"use client"

import { useState, useEffect } from "react"
import { Calendar, TrendingDown, Target, ShieldCheck, ArrowRight, Save, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { getUserPhaseSessions, overridePhase, initializeUserCalendar } from "@/lib/actions/admin-phases"
import { PhaseType, SubscriptionTier, SessionStatus } from "@prisma/client"

interface UserPhaseManagerProps {
    userId: string
    userProfile: any
}

export function UserPhaseManager({ userId, userProfile }: UserPhaseManagerProps) {
    const [sessions, setSessions] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedTier, setSelectedTier] = useState<SubscriptionTier>(userProfile.subscriptionTier)

    useEffect(() => {
        loadSessions()
    }, [userId])

    const loadSessions = async () => {
        setIsLoading(true)
        const data = await getUserPhaseSessions(userId)
        setSessions(data)
        setIsLoading(false)
    }

    const handleResetCalendar = async () => {
        if (confirm("Réinitialiser le calendrier ? Cela supprimera les sessions existantes.")) {
            await initializeUserCalendar(userId, selectedTier, new Date())
            loadSessions()
        }
    }

    const currentWeight = userProfile.lastWeight || userProfile.startWeight || 0
    const startWeight = userProfile.startWeight || 0
    const pisi = userProfile.pisi || 0
    const kilosLost = startWeight - currentWeight
    const consolidationDays = Math.ceil(Math.max(0, kilosLost * 10))

    return (
        <div className="space-y-8">
            {/* Health vs Goal Monitor */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <HealthCard
                    title="Poids Actuel"
                    value={`${currentWeight} kg`}
                    icon={TrendingDown}
                    color="text-blue-600"
                    bgColor="bg-blue-50"
                />
                <HealthCard
                    title="Objectif (Goal)"
                    value={`${userProfile.targetWeight} kg`}
                    icon={Target}
                    color="text-orange-600"
                    bgColor="bg-orange-50"
                />
                <HealthCard
                    title="Objectif Santé (PISI)"
                    value={`${pisi} kg`}
                    icon={ShieldCheck}
                    color="text-emerald-600"
                    bgColor="bg-emerald-50"
                />
            </div>

            {/* Automation Setup */}
            <div className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-[2rem] p-8 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-xl font-serif font-black text-slate-900 uppercase">Configuration Automate</h3>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pilotage par l'abonnement</p>
                    </div>
                    <div className="flex gap-2">
                        <select
                            value={selectedTier}
                            onChange={(e) => setSelectedTier(e.target.value as SubscriptionTier)}
                            className="bg-slate-50 border-none rounded-xl px-4 py-2 text-sm font-bold text-slate-900 outline-none"
                        >
                            {Object.values(SubscriptionTier).map(tier => (
                                <option key={tier} value={tier}>{tier.replace('_', ' ')}</option>
                            ))}
                        </select>
                        <Button onClick={handleResetCalendar} variant="ghost" className="rounded-xl hover:bg-slate-100">
                            <RotateCcw size={18} className="mr-2" /> Reset
                        </Button>
                    </div>
                </div>

                {/* Sessions Timeline */}
                <div className="space-y-3">
                    {sessions.length > 0 ? (
                        sessions.map((session, idx) => (
                            <div
                                key={session.id}
                                className={cn(
                                    "flex items-center gap-4 p-4 rounded-2xl border transition-all",
                                    session.status === "ACTIVE"
                                        ? "bg-amber-50/50 border-amber-200 shadow-sm"
                                        : "bg-white border-slate-100"
                                )}
                            >
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xs font-black text-slate-400">
                                    S{session.sessionNumber}
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-slate-900">{session.phaseType}</span>
                                        {session.status === "ACTIVE" && (
                                            <Badge className="bg-amber-500 text-white border-none text-[10px] uppercase font-black">En cours</Badge>
                                        )}
                                    </div>
                                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                                        {format(new Date(session.startDate), 'dd MMM', { locale: fr })} → {format(new Date(session.endDate), 'dd MMM yyyy', { locale: fr })}
                                    </p>
                                </div>

                                <Button variant="ghost" size="sm" className="rounded-lg text-[10px] font-black uppercase text-slate-400 hover:text-slate-900">
                                    Ajuster
                                </Button>
                            </div>
                        ))
                    ) : (
                        <div className="py-12 flex flex-col items-center justify-center text-center">
                            <Calendar size={48} className="text-slate-200 mb-4" />
                            <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Aucun calendrier généré</p>
                            <Button onClick={handleResetCalendar} className="mt-4 bg-slate-900 text-white rounded-xl">Générer maintenant</Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Consolidation Formula Preview */}
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <TrendingDown size={140} />
                </div>
                <div className="relative z-10">
                    <h4 className="text-orange-400 text-xs font-black uppercase tracking-[0.2em] mb-4">Calcul Consolidation</h4>
                    <div className="flex items-baseline gap-3 mb-2">
                        <span className="text-4xl font-serif font-black">{consolidationDays} jours</span>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed max-w-md">
                        Basé sur la règle IKONGA : <span className="text-white">10 jours par kilo perdu</span>.
                        Sur un départ à {startWeight} kg et un poids actuel de {currentWeight} kg ({kilosLost} kg perdus).
                    </p>
                </div>
            </div>
        </div>
    )
}

function HealthCard({ title, value, icon: Icon, color, bgColor }: any) {
    return (
        <div className={cn("rounded-3xl p-6 flex items-center gap-4 border border-white shadow-sm", bgColor)}>
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center bg-white shadow-sm", color)}>
                <Icon size={24} />
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
                <p className={cn("text-xl font-black", color)}>{value}</p>
            </div>
        </div>
    )
}
