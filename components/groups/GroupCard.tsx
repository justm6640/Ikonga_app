"use client"

import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Lock, Users, ArrowRight, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { GroupStatus } from "@/lib/actions/groups"

interface GroupCardProps {
    name: string
    description: string
    status: GroupStatus
    unlockDate?: Date
    onClick: () => void
}

export function GroupCard({ name, description, status, unlockDate, onClick }: GroupCardProps) {
    const isLocked = status === "LOCKED";
    const isAnticipated = status === "ANTICIPATED";
    const isActive = status === "ACTIVE" || status === "EXPANDED";

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={isActive ? { y: -4 } : {}}
            whileTap={isActive ? { scale: 0.98 } : {}}
            onClick={isActive ? onClick : undefined}
            className={cn("w-full", isActive ? "cursor-pointer" : "cursor-not-allowed")}
        >
            <Card className={cn(
                "rounded-[2.5rem] border-none shadow-xl overflow-hidden transition-all duration-500",
                isActive ? "bg-white" : "bg-slate-100 opacity-80"
            )}>
                <CardContent className="p-8">
                    <div className="flex justify-between items-start mb-6">
                        <div className={cn(
                            "p-4 rounded-3xl",
                            isActive ? "bg-ikonga-gradient text-white" : "bg-white text-slate-300"
                        )}>
                            <Users size={24} strokeWidth={2.5} />
                        </div>

                        <div className="flex flex-col items-end gap-2">
                            {status === "EXPANDED" && (
                                <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full">
                                    Accès élargi
                                </span>
                            )}
                            {isAnticipated && (
                                <span className="text-[10px] font-black uppercase tracking-wider bg-ikonga-coral/10 text-ikonga-coral px-3 py-1 rounded-full flex items-center gap-1.5">
                                    <Sparkles size={10} />
                                    Accès anticipé
                                </span>
                            )}
                            {isActive && status !== "EXPANDED" && (
                                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full">
                                    Groupe actif
                                </span>
                            )}
                            {isLocked && (
                                <span className="text-[10px] font-black uppercase tracking-wider bg-slate-200 text-slate-500 px-3 py-1 rounded-full flex items-center gap-1.5">
                                    <Lock size={10} />
                                    Bientôt disponible
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-2xl font-serif font-black text-slate-800">{name}</h3>
                        <p className="text-sm text-slate-500 leading-relaxed font-medium">
                            {description}
                        </p>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                        {isLocked || isAnticipated ? (
                            <div className="flex flex-col gap-1">
                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Ouverture prévue</p>
                                <p className="text-sm font-bold text-slate-600">
                                    {unlockDate ? unlockDate.toLocaleDateString("fr-FR", { day: "numeric", month: "long" }) : "Plus tard"}
                                </p>
                            </div>
                        ) : (
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                                        <img src={`https://i.pravatar.cc/100?u=${name}${i}`} alt="user" />
                                    </div>
                                ))}
                                <div className="h-8 w-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center">
                                    <span className="text-[8px] font-black text-slate-400">+12</span>
                                </div>
                            </div>
                        )}

                        {isActive && (
                            <div className="h-10 w-10 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-ikonga-coral group-hover:text-white transition-all duration-300">
                                <ArrowRight size={20} />
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}
