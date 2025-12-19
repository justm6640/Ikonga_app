"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface AnimatedGaugeProps {
    value: number
    min?: number
    max?: number
    label: string
    unit?: string
    color?: string
    className?: string
}

export function AnimatedGauge({
    value,
    min = 0,
    max = 100,
    label,
    unit = "",
    color = "text-primary",
    className
}: AnimatedGaugeProps) {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    // Clamp value between min and max
    const clampedValue = Math.min(max, Math.max(min, value))
    const percentage = ((clampedValue - min) / (max - min)) * 100

    const radius = 40
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (percentage / 100) * circumference

    return (
        <div className={cn("flex flex-col items-center justify-center p-4", className)}>
            <div className="relative w-32 h-32">
                {/* Background Circle */}
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="64"
                        cy="64"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-slate-100"
                    />
                    {/* Animated Progress Circle */}
                    <motion.circle
                        cx="64"
                        cy="64"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="8"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={isMounted ? { strokeDashoffset: offset } : {}}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        fill="transparent"
                        strokeLinecap="round"
                        className={color}
                    />
                </svg>

                {/* Value Text in Center */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="text-2xl font-black text-slate-900"
                    >
                        {value}
                    </motion.span>
                    {unit && (
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest -mt-1">
                            {unit}
                        </span>
                    )}
                </div>
            </div>

            <span className="mt-4 text-[10px] uppercase font-black tracking-[0.2em] text-slate-400">
                {label}
            </span>
        </div>
    )
}
