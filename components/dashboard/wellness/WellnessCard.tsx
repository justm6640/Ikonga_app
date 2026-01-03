"use client"

import { useState, useEffect } from "react"
import { Moon, Heart, Plus, Minus } from "lucide-react"
import { updateWellnessMetric } from "@/lib/actions/wellness"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface WellnessCardProps {
    userId: string
    initialSleepHours?: number | null
    initialSleepQuality?: string | null
    initialMood?: string | null
    date?: Date
}

const SLEEP_QUALITIES = [
    { emoji: "😫", label: "BAD", color: "text-red-500" },
    { emoji: "😐", label: "AVERAGE", color: "text-amber-500" },
    { emoji: "🙂", label: "GOOD", color: "text-emerald-500" },
    { emoji: "🤩", label: "EXCELLENT", color: "text-purple-500" }
]

const MOODS = [
    { emoji: "😴", label: "TIRED", name: "Fatigué(e)" },
    { emoji: "⚡", label: "ENERGETIC", name: "Énergique" },
    { emoji: "😰", label: "STRESSED", name: "Stressé(e)" },
    { emoji: "😊", label: "HAPPY", name: "Heureux(se)" },
    { emoji: "🧘", label: "CALM", name: "Calme" },
    { emoji: "💪", label: "MOTIVATED", name: "Motivé(e)" }
]

export function WellnessCard({
    userId,
    initialSleepHours = null,
    initialSleepQuality = null,
    initialMood = null,
    date = new Date()
}: WellnessCardProps) {
    const [sleepHours, setSleepHours] = useState<number>(initialSleepHours || 7)
    const [sleepQuality, setSleepQuality] = useState<string | null>(initialSleepQuality)
    const [mood, setMood] = useState<string | null>(initialMood)
    const [isSaving, setIsSaving] = useState(false)

    // Debounced auto-save for sleep hours
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (sleepHours !== initialSleepHours) {
                setIsSaving(true)
                try {
                    await updateWellnessMetric(userId, date, "sleepHours", sleepHours)
                } catch (error) {
                    toast.error("Erreur lors de la sauvegarde")
                } finally {
                    setIsSaving(false)
                }
            }
        }, 1000)

        return () => clearTimeout(timer)
    }, [sleepHours, userId, date, initialSleepHours])

    // Immediate save for quality and mood selections
    const handleQualityChange = async (quality: string) => {
        setSleepQuality(quality)
        setIsSaving(true)
        try {
            await updateWellnessMetric(userId, date, "sleepQuality", quality)
        } catch (error) {
            toast.error("Erreur lors de la sauvegarde")
        } finally {
            setIsSaving(false)
        }
    }

    const handleMoodChange = async (newMood: string) => {
        setMood(newMood)
        setIsSaving(true)
        try {
            await updateWellnessMetric(userId, date, "mood", newMood)
        } catch (error) {
            toast.error("Erreur lors de la sauvegarde")
        } finally {
            setIsSaving(false)
        }
    }

    const adjustSleepHours = (increment: boolean) => {
        setSleepHours(prev => {
            const newValue = increment ? prev + 0.5 : prev - 0.5
            return Math.max(0, Math.min(12, newValue)) // Clamp between 0 and 12
        })
    }

    return (
        <Card className="border-slate-100 shadow-sm bg-gradient-to-br from-purple-50/50 via-indigo-50/30 to-white">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-serif flex items-center gap-2">
                        <Moon className="text-indigo-500" size={20} />
                        Bien-être
                    </CardTitle>
                    {isSaving && (
                        <span className="text-[10px] text-indigo-400 font-medium animate-pulse">
                            Sauvegarde...
                        </span>
                    )}
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Sleep Section */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-slate-700">Heures de sommeil</p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => adjustSleepHours(false)}
                                className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
                            >
                                <Minus size={14} className="text-slate-600" />
                            </button>
                            <span className="text-2xl font-black text-indigo-600 w-16 text-center">
                                {sleepHours.toFixed(1)}h
                            </span>
                            <button
                                onClick={() => adjustSleepHours(true)}
                                className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
                            >
                                <Plus size={14} className="text-slate-600" />
                            </button>
                        </div>
                    </div>

                    {/* Sleep Quality */}
                    <div className="space-y-2">
                        <p className="text-xs text-slate-500 font-medium">Qualité du sommeil</p>
                        <div className="grid grid-cols-4 gap-2">
                            {SLEEP_QUALITIES.map((quality) => (
                                <button
                                    key={quality.label}
                                    onClick={() => handleQualityChange(quality.label)}
                                    className={cn(
                                        "p-3 rounded-xl border-2 transition-all text-2xl hover:scale-105",
                                        sleepQuality === quality.label
                                            ? "border-indigo-400 bg-indigo-50 shadow-sm scale-105"
                                            : "border-slate-100 bg-white hover:border-slate-200"
                                    )}
                                >
                                    {quality.emoji}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-slate-100" />

                {/* Mood Section */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <Heart className="text-pink-500" size={16} />
                        <p className="text-sm font-medium text-slate-700">
                            Comment te sens-tu aujourd'hui ?
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        {MOODS.map((moodOption) => (
                            <button
                                key={moodOption.label}
                                onClick={() => handleMoodChange(moodOption.label)}
                                className={cn(
                                    "flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all hover:scale-105",
                                    mood === moodOption.label
                                        ? "border-pink-400 bg-pink-50 shadow-sm scale-105"
                                        : "border-slate-100 bg-white hover:border-slate-200"
                                )}
                            >
                                <span className="text-2xl">{moodOption.emoji}</span>
                                <span className="text-[10px] font-medium text-slate-600">
                                    {moodOption.name}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Info Footer */}
                <p className="text-[10px] text-slate-400 text-center pt-2 italic">
                    Tes données sont sauvegardées automatiquement
                </p>
            </CardContent>
        </Card>
    )
}
