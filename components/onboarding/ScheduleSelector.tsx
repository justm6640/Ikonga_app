"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar, Rocket, Clock, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { format, addDays } from "date-fns"
import { fr } from "date-fns/locale"

interface ScheduleSelectorProps {
    onSelect: (scenario: {
        type: 'IMMEDIATE' | 'SCHEDULED' | 'LATE' | 'MANUAL'
        date?: Date
    }) => void
}

export function ScheduleSelector({ onSelect }: ScheduleSelectorProps) {
    const [selected, setSelected] = useState<'IMMEDIATE' | 'SCHEDULED' | 'LATE' | 'MANUAL' | null>(null)
    const [customDate, setCustomDate] = useState<Date>(addDays(new Date(), 1))

    const scenarios = [
        {
            type: 'IMMEDIATE' as const,
            icon: Rocket,
            label: "Je commence aujourd'hui",
            emoji: "🚀",
            description: "Accès immédiat à ton programme",
            color: "bg-green-50 border-green-200 hover:bg-green-100"
        },
        {
            type: 'SCHEDULED' as const,
            icon: Calendar,
            label: "Je programme mon démarrage",
            emoji: "📅",
            description: "Choisis ta date de début idéale",
            color: "bg-blue-50 border-blue-200 hover:bg-blue-100"
        },
        {
            type: 'LATE' as const,
            icon: Clock,
            label: "Je rattrape mon retard",
            emoji: "⏰",
            description: "Tu t'es inscrite mais n'as pas démarré ?",
            color: "bg-amber-50 border-amber-200 hover:bg-amber-100"
        },
        {
            type: 'MANUAL' as const,
            icon: Users,
            label: "Accompagnement personnalisé",
            emoji: "👥",
            description: "Le coach définira avec toi",
            color: "bg-purple-50 border-purple-200 hover:bg-purple-100"
        }
    ]

    const handleSelect = (type: typeof selected) => {
        setSelected(type)
    }

    const handleConfirm = () => {
        if (!selected) return

        if (selected === 'SCHEDULED') {
            onSelect({ type: selected, date: customDate })
        } else if (selected === 'LATE') {
            // For late scenario, we'll let the user specify the intended start date in the next step
            onSelect({ type: selected })
        } else {
            onSelect({ type: selected })
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-amber-50/30 to-slate-50 px-4 py-12">
            <div className="max-w-4xl w-full space-y-8">
                {/* Header */}
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-serif font-black text-slate-900">
                        Quand veux-tu commencer ?
                    </h2>
                    <p className="text-slate-600">
                        Choisis l'option qui te convient le mieux. Aucune pression 🌸
                    </p>
                </div>

                {/* Scenarios Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {scenarios.map((scenario) => {
                        const Icon = scenario.icon
                        const isSelected = selected === scenario.type

                        return (
                            <button
                                key={scenario.type}
                                onClick={() => handleSelect(scenario.type)}
                                className={cn(
                                    "text-left p-6 rounded-3xl border-2 transition-all",
                                    scenario.color,
                                    isSelected
                                        ? "ring-4 ring-slate-900/20 border-slate-900 shadow-xl scale-105"
                                        : "border-transparent"
                                )}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-2xl shrink-0">
                                        {scenario.emoji}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-slate-900 text-lg mb-1">
                                            {scenario.label}
                                        </h3>
                                        <p className="text-slate-600 text-sm">
                                            {scenario.description}
                                        </p>
                                    </div>
                                    {isSelected && (
                                        <div className="w-6 h-6 rounded-full bg-slate-900 flex items-center justify-center shrink-0">
                                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            </button>
                        )
                    })}
                </div>

                {/* Custom Date Picker for SCHEDULED */}
                {selected === 'SCHEDULED' && (
                    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <label className="block text-sm font-bold text-slate-900 mb-3">
                            📅 Choisis ta date de début
                        </label>
                        <input
                            type="date"
                            value={format(customDate, 'yyyy-MM-dd')}
                            onChange={(e) => setCustomDate(new Date(e.target.value))}
                            min={format(addDays(new Date(), 1), 'yyyy-MM-dd')}
                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10 transition-all"
                        />
                        <p className="text-xs text-slate-500 mt-2">
                            ✨ Les contenus s'ouvriront 2 jours avant ton démarrage
                        </p>
                    </div>
                )}

                {/* Late Scenario Info */}
                {selected === 'LATE' && (
                    <div className="bg-amber-50 rounded-3xl p-6 border border-amber-200 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <p className="text-amber-900 font-medium">
                            ⏰ Pas de souci ! Le coach va t'aider à te repositionner sur le parcours.
                            Tu ne seras pas pénalisée, on ajuste ensemble.
                        </p>
                    </div>
                )}

                {/* Manual Scenario Info */}
                {selected === 'MANUAL' && (
                    <div className="bg-purple-50 rounded-3xl p-6 border border-purple-200 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <p className="text-purple-900 font-medium">
                            👥 Ton coach va te contacter pour définir ensemble ton plan personnalisé.
                            C'est l'option VIP pour un accompagnement sur-mesure.
                        </p>
                    </div>
                )}

                {/* Confirm Button */}
                {selected && (
                    <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <Button
                            onClick={handleConfirm}
                            size="lg"
                            className="px-12 py-6 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-xl shadow-slate-300 transition-all hover:scale-105"
                        >
                            Valider mon choix
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
