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

    // Small sizing for mobile, normal for desktop
    const radius = 38
    const strokeWidth = 8
    const viewBoxSize = 100
    const center = viewBoxSize / 2
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (percentage / 100) * circumference

    return (
        <div className={cn("flex flex-col items-center justify-center p-2 md:p-4", className)}>
            <div className="relative w-20 h-20 md:w-32 md:h-32">
                {/* Background Circle */}
                <svg
                    viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
                    className="w-full h-full transform -rotate-90"
                >
                    <circle
                        cx={center}
                        cy={center}
                        r={radius}
                        stroke="currentColor"
                        strokeWidth={strokeWidth}
                        fill="transparent"
                        className="text-slate-100"
                    />
                    {/* Animated Progress Circle */}
                    <motion.circle
                        cx={center}
                        cy={center}
                        r={radius}
                        stroke="currentColor"
                        strokeWidth={strokeWidth}
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
                        className="text-lg md:text-2xl font-black text-slate-900"
                    >
                        {value}
                    </motion.span>
                    {unit && (
                        <span className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest -mt-0.5 md:-mt-1">
                            {unit}
                        </span>
                    )}
                </div>
            </div>

            <span className="mt-2 md:mt-4 text-[8px] md:text-[10px] uppercase font-black tracking-[0.15em] md:tracking-[0.2em] text-slate-400 text-center line-clamp-1">
                {label}
            </span>
        </div>
    )
}
