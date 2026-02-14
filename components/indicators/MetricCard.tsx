"use client"

import { Card, CardContent } from "@/components/ui/card"
import {
    Scale,
    User,
    Flame,
    Clock,
    LucideIcon
} from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const ICON_MAP: Record<string, LucideIcon> = {
    scale: Scale,
    user: User,
    flame: Flame,
    clock: Clock
}

interface MetricCardProps {
    title: string
    value: string | number
    unit?: string
    interpretation: string
    interpretationColor: string
    iconName: keyof typeof ICON_MAP
    onClick?: () => void
    delay?: number
}

export function MetricCard({
    title,
    value,
    unit,
    interpretation,
    interpretationColor,
    iconName,
    onClick,
    delay = 0
}: MetricCardProps) {
    const Icon = ICON_MAP[iconName] || Scale

    // Map interpretaton color to glass-luxury variants
    const getBadgeStyles = (color: string) => {
        if (color.includes('emerald')) return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
        if (color.includes('yellow') || color.includes('orange')) return "bg-amber-500/10 text-amber-600 border-amber-500/20";
        if (color.includes('rose') || color.includes('red')) return "bg-rose-500/10 text-rose-600 border-rose-500/20";
        if (color.includes('blue')) return "bg-blue-500/10 text-blue-600 border-blue-500/20";
        return "bg-slate-500/10 text-slate-600 border-slate-500/20";
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5 }}
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className="cursor-pointer"
        >
            <Card className="relative rounded-[2.2rem] border border-white/40 shadow-xl shadow-slate-200/40 bg-white/70 backdrop-blur-xl overflow-hidden group">
                {/* Subtle Top Gradient Refraction */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent" />

                <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-5">
                        <div className="p-2.5 rounded-2xl bg-white shadow-sm border border-slate-100/50 text-slate-400 group-hover:bg-ikonga-gradient group-hover:text-white group-hover:scale-110 transition-all duration-500 group-hover:shadow-lg group-hover:shadow-ikonga-coral/20">
                            <Icon size={18} strokeWidth={2.5} />
                        </div>
                        <div className={cn(
                            "text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border",
                            getBadgeStyles(interpretationColor)
                        )}>
                            {interpretation}
                        </div>
                    </div>

                    <div className="space-y-0.5">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">{title}</p>
                        <div className="flex items-baseline gap-1">
                            <h3 className="text-3xl font-serif font-black text-slate-900 tracking-tight leading-none">
                                {value}
                            </h3>
                            {unit && (
                                <span className="text-xs font-black text-slate-400/80 mb-0.5">{unit}</span>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}
