"use client"

import { useState } from "react"
import { Moon, Star, Clock, Check } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SleepViewProps {
    date: Date
    initialData: any
    onUpdate: (data: any) => void
}

export function SleepView({ date, initialData, onUpdate }: SleepViewProps) {
    const [quality, setQuality] = useState<string>(initialData?.sleepQuality || "")
    const [hours, setHours] = useState<number>(initialData?.sleepHours || 7)
    const [isValidated, setIsValidated] = useState(false)

    const handleQuality = (q: string) => {
        setQuality(q)
        setIsValidated(false)
    }

    const handleHours = (val: number[]) => {
        setHours(val[0])
        setIsValidated(false)
    }

    const handleValidate = () => {
        onUpdate({ sleepQuality: quality, sleepHours: hours })
        setIsValidated(true)
        setTimeout(() => setIsValidated(false), 2000)
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex items-start gap-4">
                <div className="bg-white p-2 rounded-full text-slate-900 border border-slate-100 shadow-sm">
                    <Moon size={24} className="fill-slate-900" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-slate-900">Sommeil Réparateur</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        C'est la nuit que tu brûles et que tu construis. Une bonne nuit vaut mieux qu'un entraînement forcé.
                    </p>
                </div>
            </div>

            {/* Quality Selector */}
            <div className="space-y-4">
                <label className="text-xs font-black text-slate-900 uppercase tracking-wide">Qualité de ta nuit</label>
                <div className="grid grid-cols-2 gap-3">
                    {[
                        { id: "BAD", label: "Difficile", icon: "😩" },
                        { id: "AVERAGE", label: "Moyenne", icon: "😐" },
                        { id: "GOOD", label: "Bonne", icon: "🙂" },
                        { id: "EXCELLENT", label: "Excellente", icon: "🤩" }
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => handleQuality(item.id)}
                            className={cn(
                                "flex flex-col items-center justify-center gap-2 p-4 rounded-2xl transition-all border",
                                quality === item.id
                                    ? "bg-slate-900 border-slate-900 text-amber-400 shadow-md"
                                    : "bg-white border-slate-100 text-slate-500 hover:border-slate-300 hover:text-slate-700"
                            )}
                        >
                            <span className="text-2xl">{item.icon}</span>
                            <span className="text-xs font-bold">{item.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Duration Slider */}
            <div className="space-y-4 pt-4">
                <div className="flex items-end justify-between">
                    <label className="text-xs font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
                        <Clock size={14} /> Durée (heures)
                    </label>
                    <span className="text-sm font-bold text-amber-500">{hours}h</span>
                </div>

                <div className="px-2">
                    <Slider
                        defaultValue={[hours]}
                        max={12}
                        min={3}
                        step={0.5}
                        value={[hours]}
                        onValueChange={handleHours}
                        className="[&>.relative>.absolute]:bg-slate-900 [&>span]:border-slate-900 [&>span]:focus:ring-slate-200"
                    />
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
                            : "bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-200"
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
