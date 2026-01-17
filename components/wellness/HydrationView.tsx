"use client"

import { useState } from "react"
import { Droplet, Plus, Minus, GlassWater } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface HydrationViewProps {
    initialValue: number
    goal: number
    onUpdate: (value: number) => void
}

export function HydrationView({ initialValue, goal, onUpdate }: HydrationViewProps) {
    const [intake, setIntake] = useState(initialValue)
    const [glassSize, setGlassSize] = useState(1) // 1 glass = 250ml

    // Calculate percentage
    const percentage = Math.min(100, Math.round((intake / goal) * 100))

    const handleAdd = () => {
        const newValue = intake + 1
        setIntake(newValue)
        onUpdate(newValue)
    }

    const handleRemove = () => {
        if (intake > 0) {
            const newValue = intake - 1
            setIntake(newValue)
            onUpdate(newValue)
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Header / Insight */}
            <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex items-start gap-4">
                <div className="bg-white p-2 rounded-full text-blue-500 border border-slate-100 shadow-sm">
                    <Droplet size={24} className="fill-blue-500" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-slate-900">Hydratation Essentielle</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        L'eau active ton métabolisme. Si tu te sens fatiguée, bois un verre avant de manger.
                    </p>
                </div>
            </div>

            {/* Gauge */}
            <div className="flex flex-col items-center justify-center py-4">
                <div className="relative w-48 h-48 flex items-center justify-center">
                    {/* Placeholder for Circular Gauge, using standard text for now */}
                    <div className="w-40 h-40 rounded-full border-4 border-slate-100 flex flex-col items-center justify-center relative overflow-hidden">
                        {/* Fill effect could be complex, keeping simple for now */}
                        <div
                            className="absolute bottom-0 left-0 right-0 bg-blue-500 transition-all duration-700 ease-out opacity-20"
                            style={{ height: `${percentage}%` }}
                        />
                        <span className="text-4xl font-black text-slate-900 z-10">{intake}</span>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider z-10">Verres</span>
                    </div>
                </div>
                <p className="text-sm font-medium text-slate-500 mt-2">
                    Objectif : {goal} verres (~{(goal * 0.25).toFixed(1)}L)
                </p>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-6">
                <Button
                    variant="outline"
                    size="icon"
                    className="h-14 w-14 rounded-full border-2 border-slate-100 hover:bg-slate-50 hover:border-slate-200"
                    onClick={handleRemove}
                >
                    <Minus size={24} className="text-slate-400" />
                </Button>

                <div className="flex flex-col items-center gap-1">
                    <GlassWater size={32} className="text-blue-500" />
                    <span className="text-[10px] font-bold text-blue-300">250ml</span>
                </div>

                <Button
                    size="icon"
                    className="h-14 w-14 rounded-full bg-slate-900 hover:bg-slate-800 shadow-lg shadow-slate-200"
                    onClick={handleAdd}
                >
                    <Plus size={24} className="text-white" />
                </Button>
            </div>

        </div>
    )
}
