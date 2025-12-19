"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Lock } from "lucide-react"
import { cn } from "@/lib/utils"

interface Badge {
    id: string
    code: string
    name: string
    description: string
    icon: string
    isEarned: boolean
}

interface BadgeGridProps {
    badges: Badge[]
}

export function BadgeGrid({ badges }: BadgeGridProps) {
    return (
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {badges.map((badge) => (
                <div key={badge.id} className="group relative">
                    <Card className={cn(
                        "relative flex flex-col items-center justify-center p-4 rounded-[2rem] border-none transition-all duration-500 overflow-hidden",
                        badge.isEarned
                            ? "bg-white shadow-xl shadow-slate-200/50 hover:scale-105"
                            : "bg-slate-50/50 opacity-60 grayscale"
                    )}>
                        {/* Background glow for earned badges */}
                        {badge.isEarned && (
                            <div className="absolute inset-0 bg-ikonga-gradient opacity-0 group-hover:opacity-5 transition-opacity" />
                        )}

                        <div className={cn(
                            "text-4xl mb-3 transition-transform duration-500",
                            badge.isEarned ? "group-hover:scale-125" : ""
                        )}>
                            {badge.icon}
                        </div>

                        <div className="text-center">
                            <h4 className={cn(
                                "text-[10px] uppercase font-black tracking-widest leading-none mb-1",
                                badge.isEarned ? "text-slate-900" : "text-slate-400"
                            )}>
                                {badge.name}
                            </h4>
                        </div>

                        {/* Lock Overlay */}
                        {!badge.isEarned && (
                            <div className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-200/50 text-slate-400">
                                <Lock size={10} />
                            </div>
                        )}
                    </Card>

                    {/* Tooltip Simulation (Simple) */}
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[9px] px-2 py-1 rounded-md whitespace-nowrap z-10 pointer-events-none">
                        {badge.description}
                    </div>
                </div>
            ))}
        </div>
    )
}
