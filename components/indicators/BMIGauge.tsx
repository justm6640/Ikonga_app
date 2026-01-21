"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface BMIGaugeProps {
    bmi: number
}

const ZONES = [
    { label: "Maigreur", min: 10, max: 18.5, color: "bg-blue-400" },
    { label: "Normal", min: 18.5, max: 25, color: "bg-emerald-400" },
    { label: "Surpoids", min: 25, max: 30, color: "bg-yellow-400" },
    { label: "Obésité 1", min: 30, max: 35, color: "bg-orange-400" },
    { label: "Obésitê 2", min: 35, max: 40, color: "bg-red-400" },
    { label: "Obésité 3", min: 40, max: 50, color: "bg-red-600" },
]

export function BMIGauge({ bmi }: BMIGaugeProps) {
    // Map BMI (10-50) to percentage (0-100)
    const position = Math.min(Math.max(((bmi - 10) / (50 - 10)) * 100, 0), 100);

    return (
        <div className="space-y-6">
            <div className="relative h-3 w-full bg-slate-100 rounded-full flex overflow-hidden">
                {ZONES.map((zone, idx) => {
                    const width = ((zone.max - zone.min) / (50 - 10)) * 100;
                    return (
                        <div
                            key={idx}
                            style={{ width: `${width}%` }}
                            className={cn(zone.color, "h-full border-r border-white/20 last:border-0")}
                        />
                    )
                })}

                {/* Cursor */}
                <motion.div
                    initial={{ left: 0 }}
                    animate={{ left: `${position}%` }}
                    transition={{ type: "spring", stiffness: 50, damping: 15 }}
                    className="absolute top-1/2 -translate-y-1/2 -ml-2"
                >
                    <div className="h-5 w-5 rounded-full bg-white border-2 border-slate-900 shadow-lg relative z-10" />
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black px-1.5 py-0.5 rounded">
                        {bmi.toFixed(1)}
                    </div>
                </motion.div>
            </div>

            <div className="grid grid-cols-3 gap-2">
                {ZONES.filter((z, i) => i % 2 === 0).map((zone, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                        <div className={cn("w-2 h-2 rounded-full", zone.color)} />
                        <span className="text-[10px] text-slate-500 font-bold uppercase">{zone.label}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
