"use client"

import { motion } from "framer-motion"

interface MetabolicAgeRingsProps {
    realAge: number
    metabolicAge: number
}

export function MetabolicAgeRings({ realAge, metabolicAge }: MetabolicAgeRingsProps) {
    const size = 200;
    const center = size / 2;

    // Outer Ring (Metabolic Age)
    const metabolicRadius = 80;
    const metabolicCircumference = 2 * Math.PI * metabolicRadius;
    const metabolicProgress = Math.min(metabolicAge / 100, 1);
    const metabolicOffset = metabolicCircumference - metabolicProgress * metabolicCircumference;

    // Inner Ring (Real Age)
    const realRadius = 60;
    const realCircumference = 2 * Math.PI * realRadius;
    const realProgress = Math.min(realAge / 100, 1);
    const realOffset = realCircumference - realProgress * realCircumference;

    return (
        <div className="relative flex flex-col items-center justify-center">
            <svg width={size} height={size} className="rotate-[-90deg]">
                {/* Metabolic Ring (Outer) */}
                <circle
                    cx={center}
                    cy={center}
                    r={metabolicRadius}
                    fill="transparent"
                    stroke="#f1f5f9"
                    strokeWidth="12"
                />
                <motion.circle
                    cx={center}
                    cy={center}
                    r={metabolicRadius}
                    fill="transparent"
                    stroke="url(#ikonga-gradient)"
                    strokeWidth="12"
                    strokeDasharray={metabolicCircumference}
                    initial={{ strokeDashoffset: metabolicCircumference }}
                    animate={{ strokeDashoffset: metabolicOffset }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    strokeLinecap="round"
                />

                {/* Real Ring (Inner) */}
                <circle
                    cx={center}
                    cy={center}
                    r={realRadius}
                    fill="transparent"
                    stroke="#f8fafc"
                    strokeWidth="8"
                />
                <motion.circle
                    cx={center}
                    cy={center}
                    r={realRadius}
                    fill="transparent"
                    stroke="#cbd5e1"
                    strokeWidth="8"
                    strokeDasharray={realCircumference}
                    initial={{ strokeDashoffset: realCircumference }}
                    animate={{ strokeDashoffset: realOffset }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    strokeLinecap="round"
                />

                <defs>
                    <linearGradient id="ikonga-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#F79A32" />
                        <stop offset="100%" stopColor="#E5488A" />
                    </linearGradient>
                </defs>
            </svg>

            {/* Labels */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-serif font-black text-slate-900 leading-none">{metabolicAge}</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Ans</span>
            </div>

            <div className="mt-8 flex gap-6">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-ikonga-gradient" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Âge Métabolique</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-slate-300" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Âge Réel ({realAge})</span>
                </div>
            </div>
        </div>
    )
}
