"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface BMRBuildingProps {
    bmr: number
    targetBmr?: number
}

export function BMRBuilding({ bmr, targetBmr }: BMRBuildingProps) {
    // Each block represents 100 kcal
    const totalBlocks = 25; // Up to 2500 kcal
    const filledBlocks = Math.floor(bmr / 100);
    const partialValue = (bmr % 100) / 100;

    return (
        <div className="flex items-end gap-12 justify-center h-64">
            {/* Main Building */}
            <div className="flex flex-col-reverse gap-1 w-16 h-full">
                {Array.from({ length: totalBlocks }).map((_, idx) => {
                    const isFilled = idx < filledBlocks;
                    const isPartial = idx === filledBlocks;

                    return (
                        <motion.div
                            key={idx}
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            className={cn(
                                "h-2 w-full rounded-sm",
                                isFilled ? "bg-ikonga-gradient shadow-sm" :
                                    isPartial ? "bg-ikonga-orange/50 overflow-hidden relative" : "bg-slate-50"
                            )}
                        >
                            {isPartial && (
                                <div
                                    className="absolute left-0 top-0 bottom-0 bg-ikonga-gradient"
                                    style={{ width: `${partialValue * 100}%` }}
                                />
                            )}
                        </motion.div>
                    )
                })}
                <p className="text-[10px] font-black text-slate-400 text-center mt-2 whitespace-nowrap">Actuel</p>
            </div>

            {/* Target Building (if provided) */}
            {targetBmr && (
                <div className="flex flex-col-reverse gap-1 w-8 h-full opacity-40">
                    {Array.from({ length: totalBlocks }).map((_, idx) => {
                        const targetFilled = idx < Math.floor(targetBmr / 100);
                        return (
                            <div
                                key={idx}
                                className={cn(
                                    "h-2 w-full rounded-sm",
                                    targetFilled ? "bg-slate-300" : "bg-slate-50"
                                )}
                            />
                        )
                    })}
                    <p className="text-[10px] font-black text-slate-400 text-center mt-2 whitespace-nowrap">PISI</p>
                </div>
            )}
        </div>
    )
}
