"use client"

import { useState, useTransition } from "react"
import { updateUserMeal, regenerateWeeklyPlanAction } from "@/lib/actions/admin-nutrition"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Loader2, CheckCircle2, Sparkles, RefreshCcw } from "lucide-react"

interface WeeklyPlanEditorProps {
    plan: any // The WeeklyPlan object
}

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
const DAY_LABELS: Record<string, string> = {
    monday: "Lundi",
    tuesday: "Mardi",
    wednesday: "Mercredi",
    thursday: "Jeudi",
    friday: "Vendredi",
    saturday: "Samedi",
    sunday: "Dimanche"
}
const MEALS = ["breakfast", "lunch", "snack", "dinner"]
const MEAL_LABELS: Record<string, string> = {
    breakfast: "Matin",
    lunch: "Midi",
    snack: "Goûter",
    dinner: "Soir"
}

export function WeeklyPlanEditor({ plan }: WeeklyPlanEditorProps) {
    const [isPending, startTransition] = useTransition()
    const [savingCell, setSavingCell] = useState<string | null>(null)
    const [isRegenerating, setIsRegenerating] = useState(false)

    const handleUpdate = async (day: string, mealType: string, value: string) => {
        const currentValue = plan.content?.[day]?.[mealType] || ""
        if (value === currentValue) return

        const cellKey = `${day}-${mealType}`
        setSavingCell(cellKey)

        startTransition(async () => {
            try {
                await updateUserMeal(plan.id, day, mealType, value)
                toast.success("Enregistré")
            } catch (error) {
                toast.error("Erreur de sauvegarde")
            } finally {
                setSavingCell(null)
            }
        })
    }

    const handleRegenerate = async () => {
        if (!confirm("Attention : Cela va écraser le menu actuel par une nouvelle version générée par l'IA. Continuer ?")) return

        setIsRegenerating(true)
        try {
            const res = await regenerateWeeklyPlanAction(plan.userId)
            if (res.success) {
                toast.success("Menu régénéré avec succès !")
                window.location.reload() // Dynamic update
            } else {
                toast.error("Erreur lors de la régénération")
            }
        } catch (error) {
            toast.error("Action impossible")
        } finally {
            setIsRegenerating(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRegenerate}
                    disabled={isRegenerating}
                    className="rounded-full border-ikonga-pink text-ikonga-pink hover:bg-ikonga-pink/5 font-bold"
                >
                    {isRegenerating ? (
                        <Loader2 size={14} className="animate-spin mr-2" />
                    ) : (
                        <Sparkles size={14} className="mr-2" />
                    )}
                    Régénérer par IA
                </Button>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <div className="hidden lg:grid grid-cols-[120px_repeat(4,1fr)] gap-4 items-center font-bold text-[10px] uppercase tracking-widest text-slate-400 mb-4 px-2">
                    <div>Jour</div>
                    {MEALS.map(m => <div key={m}>{MEAL_LABELS[m]}</div>)}
                </div>

                <div className="space-y-4 sm:space-y-3">
                    {DAYS.map((day) => (
                        <div key={day} className="flex flex-col lg:grid lg:grid-cols-[120px_repeat(4,1fr)] gap-4 items-start lg:items-center bg-white p-4 lg:p-2 rounded-2xl sm:rounded-xl border border-slate-100 shadow-sm">
                            <div className="font-bold text-slate-900 text-sm lg:text-sm mb-2 lg:mb-0 uppercase tracking-tighter">
                                {DAY_LABELS[day]}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:contents gap-3 w-full">
                                {MEALS.map((meal) => {
                                    const cellKey = `${day}-${meal}`
                                    const isSaving = savingCell === cellKey

                                    return (
                                        <div key={meal} className="relative group w-full">
                                            <div className="lg:hidden text-[9px] font-black uppercase text-slate-400 mb-1 ml-1 tracking-widest flex items-center gap-2">
                                                {MEAL_LABELS[meal]}
                                                {isSaving && <Loader2 size={10} className="animate-spin text-ikonga-pink" />}
                                            </div>
                                            <Input
                                                defaultValue={plan.content?.[day]?.[meal] || ""}
                                                onBlur={(e) => handleUpdate(day, meal, e.target.value)}
                                                className="h-11 lg:h-10 text-xs border-transparent bg-slate-50 focus:bg-white focus:border-ikonga-pink transition-all pr-8 rounded-xl"
                                                placeholder="..."
                                            />
                                            <div className="absolute right-3 top-[34px] lg:top-1/2 lg:-translate-y-1/2">
                                                {!isSaving && (
                                                    <CheckCircle2 size={14} className="text-emerald-500 opacity-0 group-hover:opacity-20 transition-opacity" />
                                                )}
                                                {isSaving && <div className="hidden lg:block"><Loader2 size={14} className="animate-spin text-ikonga-pink" /></div>}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-end italic text-[10px] text-slate-400">
                Les modifications sont enregistrées automatiquement à la sortie du champ.
            </div>
        </div>
    )
}
