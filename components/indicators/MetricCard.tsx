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
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className="cursor-pointer"
        >
            <Card className="rounded-[2rem] border-none shadow-xl shadow-slate-100/50 bg-white overflow-hidden group">
                <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-ikonga-gradient group-hover:text-white transition-all duration-300">
                            <Icon size={20} strokeWidth={2.5} />
                        </div>
                        <span className={cn(
                            "text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg bg-opacity-10",
                            interpretationColor.replace('text-', 'bg-'),
                            interpretationColor
                        )}>
                            {interpretation}
                        </span>
                    </div>

                    <div className="space-y-1">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{title}</p>
                        <div className="flex items-baseline gap-1">
                            <h3 className="text-3xl font-serif font-black text-slate-900 leading-none">
                                {value}
                            </h3>
                            {unit && <span className="text-sm font-black text-slate-400">{unit}</span>}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}
