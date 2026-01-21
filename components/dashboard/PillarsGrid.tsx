"use client"

import { Activity, Moon, Sparkles, Utensils } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { motion } from "framer-motion";

interface PillarsGridProps {
    nutritionLabel?: string;
    fitnessLabel?: string;
    wellnessLabel?: string;
    beautyLabel?: string;
}

export function PillarsGrid({
    nutritionLabel = "Menus & Courses",
    fitnessLabel = "Séance du jour",
    wellnessLabel = "Mon Équilibre",
    beautyLabel = "Ma Routine"
}: PillarsGridProps) {
    const pillars = [
        {
            id: "nutrition",
            label: "Nutrition",
            sub: nutritionLabel,
            icon: Utensils,
            gradient: "from-orange-400 to-amber-500",
            bgGradient: "from-orange-50 to-amber-50",
            iconColor: "text-orange-500",
            href: "/nutrition"
        },
        {
            id: "fitness",
            label: "Fitness",
            sub: fitnessLabel,
            icon: Activity,
            gradient: "from-blue-400 to-cyan-500",
            bgGradient: "from-blue-50 to-cyan-50",
            iconColor: "text-blue-500",
            href: "/fitness"
        },
        {
            id: "wellness",
            label: "Wellness",
            sub: wellnessLabel,
            icon: Moon,
            gradient: "from-purple-400 to-pink-500",
            bgGradient: "from-purple-50 to-pink-50",
            iconColor: "text-purple-500",
            href: "/wellness"
        },
        {
            id: "beauty",
            label: "Beauté",
            sub: beautyLabel,
            icon: Sparkles,
            gradient: "from-pink-400 to-rose-500",
            bgGradient: "from-pink-50 to-rose-50",
            iconColor: "text-pink-500",
            href: "/beauty"
        }
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {pillars.map((pillar, index) => (
                <Link key={pillar.id} href={pillar.href} className="group">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className={cn(
                            "relative border-none shadow-sm overflow-hidden flex flex-col items-center justify-center p-4 sm:p-5 rounded-[1.75rem] transition-all hover:shadow-xl hover:-translate-y-1 active:scale-95 text-center min-h-[140px] sm:min-h-[160px]",
                            `bg-gradient-to-br ${pillar.bgGradient}`
                        )}>
                            {/* Decorative blur */}
                            <div className={cn(
                                "absolute -top-10 -right-10 w-24 h-24 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity",
                                `bg-gradient-to-br ${pillar.gradient}`
                            )} />

                            <div className={cn(
                                "relative z-10 p-3 sm:p-4 rounded-2xl mb-3 sm:mb-4 transition-all group-hover:scale-110 group-hover:rotate-3 shadow-md",
                                "bg-white",
                                pillar.iconColor
                            )}>
                                <pillar.icon size={24} className="sm:w-7 sm:h-7" strokeWidth={2.5} />
                            </div>

                            <div className="relative z-10 space-y-1">
                                <h4 className="font-black text-xs sm:text-sm text-slate-900 uppercase tracking-tight leading-tight">
                                    {pillar.label}
                                </h4>
                                <p className="text-[9px] sm:text-[10px] text-slate-500 font-semibold truncate w-full px-1 opacity-80">
                                    {pillar.sub}
                                </p>
                            </div>
                        </Card>
                    </motion.div>
                </Link>
            ))}
        </div>
    );
}
