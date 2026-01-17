"use client"

import { useState } from "react"
import { Battery, Zap } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

interface EnergyViewProps {
    date: Date
    initialData: any
    onUpdate: (data: any) => void
}

export function EnergyView({ date, initialData, onUpdate }: EnergyViewProps) {
    const [level, setLevel] = useState<number>(initialData?.energyLevel || 5)

    const handleLevel = (val: number[]) => {
        setLevel(val[0])
        onUpdate({ energyLevel: val[0] })
    }

    const getRecommendation = (val: number) => {
        if (val <= 3) return "Douceur (Yoga, Mobilité, Marche)"
        if (val <= 7) return "Modéré (Renfo, Cardio léger)"
        return "Intense (HIIT, Cardio, Défi)"
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex items-start gap-4">
                <div className="bg-white p-2 rounded-full text-yellow-500 border border-slate-100 shadow-sm">
                    <Zap size={24} className="fill-yellow-500" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-slate-900">Niveau d'Énergie</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        L'énergie pilote l'intensité. Adapte ton effort pour ne pas t'épuiser.
                    </p>
                </div>
            </div>

            {/* Slider 1-10 */}
            <div className="space-y-6 pt-4">
                <div className="flex flex-col items-center justify-center">
                    <span className="text-5xl font-black text-slate-900 mb-2">
                        {level}
                        <span className="text-lg text-slate-300 font-medium">/10</span>
                    </span>
                    <div className="flex items-center gap-2 text-sm text-slate-500 font-bold uppercase tracking-wide">
                        <Battery size={16} className={cn(
                            level <= 3 ? "text-slate-400" : level <= 7 ? "text-amber-400" : "text-amber-500"
                        )} />
                        {level <= 3 ? "Épuisée" : level <= 7 ? "Normale" : "Au Top"}
                    </div>
                </div>

                <div className="px-4">
                    <Slider
                        defaultValue={[level]}
                        max={10}
                        min={1}
                        step={1}
                        value={[level]}
                        onValueChange={handleLevel}
                        className="[&>.relative>.absolute]:bg-slate-900 [&>span]:border-slate-900"
                    />
                    <div className="flex justify-between mt-2 px-1">
                        <span className="text-[10px] text-slate-400">À plat</span>
                        <span className="text-[10px] text-slate-400">Explosive</span>
                    </div>
                </div>
            </div>

            {/* Recommendation Box */}
            <div className="bg-slate-50 rounded-2xl p-4 text-center border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Impact Fitness</p>
                <p className="text-sm font-medium text-slate-900">
                    Avec ce niveau, privilégie : <br />
                    <span className="text-amber-600 font-bold text-base">{getRecommendation(level)}</span>
                </p>
            </div>
        </div>
    )
}
