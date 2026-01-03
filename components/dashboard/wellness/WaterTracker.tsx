"use client"

import { useState, useTransition } from "react"
import { Droplet, Plus, Minus } from "lucide-react"
import { toggleWaterGlass } from "@/lib/actions/wellness"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface WaterTrackerProps {
    userId: string
    initialValue: number
    date?: Date
}

export function WaterTracker({ userId, initialValue, date = new Date() }: WaterTrackerProps) {
    const [waterCount, setWaterCount] = useState(initialValue)
    const [isPending, startTransition] = useTransition()

    const MAX_GLASSES = 10 // 2.5L
    const GLASS_SIZE_ML = 250
    const DAILY_GOAL = 8 // 2L recommandé

    const handleToggle = async (increment: boolean) => {
        // Optimistic UI update
        const newCount = increment
            ? Math.min(waterCount + 1, MAX_GLASSES)
            : Math.max(waterCount - 1, 0)

        setWaterCount(newCount)

        // Server update
        startTransition(async () => {
            try {
                const result = await toggleWaterGlass(userId, date, increment)
                setWaterCount(result)
            } catch (error) {
                toast.error("Erreur lors de la mise à jour")
                setWaterCount(waterCount) // Rollback on error
            }
        })
    }

    const totalML = waterCount * GLASS_SIZE_ML
    const totalL = (totalML / 1000).toFixed(1)
    const goalL = (DAILY_GOAL * GLASS_SIZE_ML / 1000).toFixed(1)
    const progress = Math.min((waterCount / DAILY_GOAL) * 100, 100)

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-xl">
                        <Droplet className="text-blue-500" size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900">Hydratation</h3>
                        <p className="text-xs text-slate-500">Objectif quotidien</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-black text-blue-500">{totalL}L</p>
                    <p className="text-[10px] text-slate-400 font-medium">/ {goalL}L</p>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 to-blue-500 transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Glass Grid */}
            <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: MAX_GLASSES }).map((_, index) => {
                    const isFilled = index < waterCount
                    return (
                        <button
                            key={index}
                            onClick={() => handleToggle(!isFilled)}
                            disabled={isPending}
                            className={cn(
                                "aspect-square rounded-xl transition-all duration-200 flex items-center justify-center shadow-sm",
                                isFilled
                                    ? "bg-gradient-to-br from-blue-400 to-blue-500 text-white scale-105 shadow-blue-200"
                                    : "bg-slate-100 text-slate-300 hover:bg-slate-200",
                                isPending && "opacity-50 cursor-not-allowed"
                            )}
                        >
                            <Droplet
                                size={16}
                                className={cn(
                                    "transition-all",
                                    isFilled ? "fill-current" : ""
                                )}
                            />
                        </button>
                    )
                })}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between pt-2">
                <button
                    onClick={() => handleToggle(false)}
                    disabled={isPending || waterCount === 0}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-sm font-medium"
                >
                    <Minus size={14} />
                    Retirer
                </button>
                <p className="text-xs text-slate-400 font-medium">
                    {waterCount * GLASS_SIZE_ML}ml
                </p>
                <button
                    onClick={() => handleToggle(true)}
                    disabled={isPending || waterCount >= MAX_GLASSES}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-sm font-medium shadow-sm"
                >
                    <Plus size={14} />
                    Ajouter
                </button>
            </div>

            {/* Motivational Message */}
            {waterCount >= DAILY_GOAL && (
                <div className="mt-2 p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                    <p className="text-xs text-emerald-700 font-medium text-center">
                        🎉 Objectif atteint ! Continue comme ça !
                    </p>
                </div>
            )}
        </div>
    )
}
