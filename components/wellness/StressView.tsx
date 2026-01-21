"use client"

import { useState } from "react"
import { AlertCircle, Check } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface StressViewProps {
    date: Date
    initialData: any
    onUpdate: (data: any) => void
}

const COMMON_TRIGGERS = [
    "Travail", "Famille", "Finances", "Santé", "Temps", "Sommeil", "Inconnu"
]

export function StressView({ date, initialData, onUpdate }: StressViewProps) {
    const [level, setLevel] = useState<number>(initialData?.stressLevel || 5)
    // Safely handle if initialData.stressTags is not an array or is null
    const [triggers, setTriggers] = useState<string[]>(
        Array.isArray(initialData?.stressTags) ? initialData.stressTags : []
    )
    const [isValidated, setIsValidated] = useState(false)

    const handleLevel = (val: number[]) => {
        setLevel(val[0])
        setIsValidated(false)
    }

    const toggleTrigger = (trigger: string) => {
        let newTriggers
        if (triggers.includes(trigger)) {
            newTriggers = triggers.filter(t => t !== trigger)
        } else {
            newTriggers = [...triggers, trigger]
        }
        setTriggers(newTriggers)
        setIsValidated(false)
    }

    const handleValidate = () => {
        onUpdate({ stressLevel: level, stressTags: triggers })
        setIsValidated(true)
        setTimeout(() => setIsValidated(false), 2000)
    }

    const getStressColor = (val: number) => {
        if (val <= 3) return "text-emerald-500"
        if (val <= 6) return "text-orange-500"
        return "text-red-500"
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex items-start gap-4">
                <div className="bg-white p-2 rounded-full text-orange-500 border border-slate-100 shadow-sm">
                    <AlertCircle size={24} className="" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-slate-900">Niveau de Tension</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        Le stress bloque la perte de poids (cortisol). L'identifier, c'est déjà le désamorcer.
                    </p>
                </div>
            </div>

            {/* Slider 1-10 */}
            <div className="space-y-6 pt-4">
                <div className="flex flex-col items-center justify-center">
                    <span className={cn("text-5xl font-black mb-2", getStressColor(level))}>
                        {level}
                        <span className="text-lg text-slate-300 font-medium">/10</span>
                    </span>
                    <p className="text-sm text-slate-500 font-medium uppercase tracking-wide">
                        {level <= 3 ? "Zen / Calme" : level <= 7 ? "Sous tension" : "Stress Intense"}
                    </p>
                </div>

                <div className="px-4">
                    <Slider
                        defaultValue={[level]}
                        max={10}
                        min={1}
                        step={1}
                        value={[level]}
                        onValueChange={handleLevel}
                        className={cn(
                            "[&>.relative>.absolute]:bg-orange-500 [&>span]:border-orange-500",
                            getLevelColorClass(level)
                        )}
                    />
                    <div className="flex justify-between mt-2 px-1">
                        <span className="text-[10px] text-slate-400">Zen</span>
                        <span className="text-[10px] text-slate-400">Intense</span>
                    </div>
                </div>
            </div>

            {/* Triggers */}
            <div className="space-y-3">
                <label className="text-xs font-black text-slate-900 uppercase tracking-wide">Déclencheurs</label>
                <div className="flex flex-wrap gap-2">
                    {COMMON_TRIGGERS.map(t => (
                        <button
                            key={t}
                            onClick={() => toggleTrigger(t)}
                            className={cn(
                                "px-4 py-2 rounded-full text-xs font-bold border transition-all flex items-center gap-2",
                                triggers.includes(t)
                                    ? "bg-slate-900 text-amber-400 border-slate-900"
                                    : "bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700"
                            )}
                        >
                            {t}
                            {triggers.includes(t) && <Check size={12} />}
                        </button>
                    ))}
                </div>
            </div>

            {/* Validation Button */}
            <div className="flex justify-center mt-6">
                <Button
                    onClick={handleValidate}
                    disabled={isValidated}
                    className={cn(
                        "px-8 py-6 rounded-full font-bold text-sm tracking-wider transition-all",
                        isValidated
                            ? "bg-green-500 hover:bg-green-500 text-white shadow-lg shadow-green-200"
                            : "bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-200"
                    )}
                >
                    {isValidated ? (
                        <div className="flex items-center gap-2">
                            <Check size={20} />
                            <span>Validé !</span>
                        </div>
                    ) : (
                        <span>Valider mes données</span>
                    )}
                </Button>
            </div>

        </div>
    )
}

function getLevelColorClass(level: number) {
    if (level <= 3) return "[&>.relative>.absolute]:bg-emerald-500 [&>span]:border-emerald-500"
    if (level <= 7) return "[&>.relative>.absolute]:bg-orange-500 [&>span]:border-orange-500"
    return "[&>.relative>.absolute]:bg-red-500 [&>span]:border-red-500"
}
