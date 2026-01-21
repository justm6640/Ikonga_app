"use client"

import { motion } from "framer-motion"

interface BodyFatDonutProps {
    percentage: number
}

export function BodyFatDonut({ percentage }: BodyFatDonutProps) {
    const strokeWidth = 14;
    const radius = 35;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="flex flex-col items-center">
            <div className="relative h-48 w-48">
                <svg className="h-full w-full rotate-[-90deg]">
                    {/* Background Circle */}
                    <circle
                        cx="50%"
                        cy="50%"
                        r={radius}
                        fill="transparent"
                        stroke="#f1f5f9"
                        strokeWidth={strokeWidth}
                        className="transition-all duration-500"
                    />
                    {/* Progress Circle */}
                    <motion.circle
                        cx="50%"
                        cy="50%"
                        r={radius}
                        fill="transparent"
                        stroke="url(#ikonga-gradient)"
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        strokeLinecap="round"
                    />

                    <defs>
                        <linearGradient id="ikonga-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#F79A32" />
                            <stop offset="100%" stopColor="#E5488A" />
                        </linearGradient>
                    </defs>
                </svg>

                {/* Center Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.h4
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-4xl font-serif font-black text-slate-900 leading-none"
                    >
                        {Math.round(percentage)}%
                    </motion.h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Masse grasse</p>
                </div>
            </div>

            <div className="flex items-center gap-8 mt-4">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-ikonga-gradient" />
                    <span className="text-[10px] font-bold text-slate-500">GRAS</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-slate-100" />
                    <span className="text-[10px] font-bold text-slate-500">MUSCLE/EAU</span>
                </div>
            </div>
        </div>
    )
}
