"use client"

import { Flame } from "lucide-react"
import { cn } from "@/lib/utils"

interface StreakCounterProps {
    streak: number
    className?: string
}

export function StreakCounter({ streak, className }: StreakCounterProps) {
    const isActive = streak > 0

    return (
        <div className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-500",
            isActive
                ? "bg-orange-500/10 text-orange-500 animate-pulse ring-1 ring-orange-500/20"
                : "bg-slate-100 text-slate-400",
            className
        )}>
            <Flame
                size={18}
                className={cn(
                    "transition-transform",
                    isActive && "fill-orange-500 scale-110"
                )}
            />
            <span className="text-sm font-black tracking-tight">
                {streak}
            </span>
        </div>
    )
}
