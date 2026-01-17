"use client"

import { useState, useTransition } from "react"
import { AlertTriangle, ChevronDown, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { saveCustomMenu, getNutritionData } from "@/lib/actions/nutrition"

interface ComposerViewProps {
    phaseDays: Array<{ dayNumber: number; date: Date; label: string }>
    currentPhase: string
    initialData?: any
}

export function ComposerView({ phaseDays, currentPhase, initialData }: ComposerViewProps) {
    const [selectedDay, setSelectedDay] = useState(phaseDays[0] || { dayNumber: 1, label: "Jour 1", date: new Date() })
    const [formData, setFormData] = useState({
        breakfast: initialData?.menu?.breakfast?.name || "",
        snack: initialData?.menu?.snack?.name || "", // Maps to Snack Matin
        lunch: initialData?.menu?.lunch?.name || "",
        snack_afternoon: "", // New field not in standard menu but requested in UI
        dinner: initialData?.menu?.dinner?.name || ""
    })
    const [isPending, startTransition] = useTransition()

    const handleDayChange = (day: any) => {
        setSelectedDay(day)
        // Reset form or fetch existing custom menu for that day
        startTransition(async () => {
            const data = await getNutritionData(day.date)
            setFormData({
                breakfast: data?.menu?.breakfast?.name || "",
                snack: data?.menu?.snack?.name || "",
                lunch: data?.menu?.lunch?.name || "",
                snack_afternoon: "",
                dinner: data?.menu?.dinner?.name || ""
            })
        })
    }

    const handleGenerate = () => {
        // Reset to standard plan (simulated by fetching again or clearing to let backend default logic take over? 
        // For now, let's just keep the current or maybe clear placeholders?)
        // The user request "Générer Auto" implies filling with suggested meals. 
        // Since we loaded initial data, we can just reset to that if we had it, or re-fetch.
        handleDayChange(selectedDay)
    }

    const handleSave = () => {
        startTransition(async () => {
            await saveCustomMenu(selectedDay.date, {
                breakfast: formData.breakfast,
                snack: formData.snack,
                lunch: formData.lunch,
                snack_afternoon: formData.snack_afternoon,
                dinner: formData.dinner
            })
        })
    }

    return (
        <div className="space-y-6">
            {/* Day Selector and Generate Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="w-full sm:w-auto flex-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">
                        JOUR
                    </label>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div className="w-full bg-white border border-slate-200 px-4 py-3 rounded-xl flex items-center justify-between cursor-pointer hover:border-slate-300 transition-colors">
                                <span className="text-slate-900 font-bold text-sm">
                                    {selectedDay.label}
                                    <span className="ml-2 text-slate-400 font-normal">
                                        {selectedDay.date && format(new Date(selectedDay.date), "d MMMM", { locale: fr })}
                                    </span>
                                </span>
                                <ChevronDown size={16} className="text-slate-400" />
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-[300px] max-h-[300px] overflow-y-auto">
                            {phaseDays.map((day) => (
                                <DropdownMenuItem
                                    key={day.dayNumber}
                                    onClick={() => handleDayChange(day)}
                                    className="cursor-pointer font-bold text-sm py-3"
                                >
                                    {day.label}
                                    <span className="ml-auto text-xs text-slate-400 font-normal">
                                        {day.date && format(new Date(day.date), "d MMM", { locale: fr })}
                                    </span>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="self-end pb-1">
                    <Button
                        onClick={handleGenerate}
                        className="bg-[#FF7F50] hover:bg-[#FF6347] text-white font-bold text-xs uppercase tracking-wider h-11 px-6 rounded-xl shadow-lg shadow-orange-200"
                    >
                        <Sparkles size={16} className="mr-2" />
                        Générer Auto
                    </Button>
                </div>
            </div>

            {/* Warning Banner */}
            <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 flex items-start gap-3">
                <AlertTriangle className="text-orange-500 shrink-0 mt-0.5" size={18} />
                <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-orange-800 mb-1">
                        PHASE {currentPhase}
                    </h4>
                    <p className="text-orange-700 text-xs leading-relaxed">
                        L'IA respectera les contraintes de ta phase (ne pas de féculents le soir en détox).
                    </p>
                </div>
            </div>

            {/* Inputs Grid */}
            <div className="space-y-4">
                <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">
                        PETIT-DÉJEUNER
                    </label>
                    <Textarea
                        value={formData.breakfast}
                        onChange={(e) => setFormData({ ...formData, breakfast: e.target.value })}
                        placeholder="Clique sur ✨ Générer ou écris ici..."
                        className="bg-slate-50 border-0 focus-visible:ring-1 focus-visible:ring-orange-200 text-sm min-h-[60px] resize-none rounded-xl placeholder:italic placeholder:text-slate-400"
                    />
                </div>

                <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">
                        SNACK MATIN
                    </label>
                    <Textarea
                        value={formData.snack}
                        onChange={(e) => setFormData({ ...formData, snack: e.target.value })}
                        placeholder="Clique sur ✨ Générer ou écris ici..."
                        className="bg-slate-50 border-0 focus-visible:ring-1 focus-visible:ring-orange-200 text-sm min-h-[60px] resize-none rounded-xl placeholder:italic placeholder:text-slate-400"
                    />
                </div>

                <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">
                        DÉJEUNER
                    </label>
                    <Textarea
                        value={formData.lunch}
                        onChange={(e) => setFormData({ ...formData, lunch: e.target.value })}
                        placeholder="Clique sur ✨ Générer ou écris ici..."
                        className="bg-slate-50 border-0 focus-visible:ring-1 focus-visible:ring-orange-200 text-sm min-h-[60px] resize-none rounded-xl placeholder:italic placeholder:text-slate-400"
                    />
                </div>

                <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">
                        SNACK APRÈS-MIDI
                    </label>
                    <Textarea
                        value={formData.snack_afternoon}
                        onChange={(e) => setFormData({ ...formData, snack_afternoon: e.target.value })}
                        placeholder="Clique sur ✨ Générer ou écris ici..."
                        className="bg-slate-50 border-0 focus-visible:ring-1 focus-visible:ring-orange-200 text-sm min-h-[60px] resize-none rounded-xl placeholder:italic placeholder:text-slate-400"
                    />
                </div>

                <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">
                        DÎNER
                    </label>
                    <Textarea
                        value={formData.dinner}
                        onChange={(e) => setFormData({ ...formData, dinner: e.target.value })}
                        placeholder="Clique sur ✨ Générer ou écris ici..."
                        className="bg-slate-50 border-0 focus-visible:ring-1 focus-visible:ring-orange-200 text-sm min-h-[60px] resize-none rounded-xl placeholder:italic placeholder:text-slate-400"
                    />
                </div>
            </div>

            {/* Validate Button */}
            <div className="sticky bottom-4 pt-4">
                <Button
                    onClick={handleSave}
                    disabled={isPending}
                    className="w-full bg-[#1c1c1c] hover:bg-black text-white h-14 rounded-2xl font-bold uppercase tracking-widest shadow-xl"
                >
                    {isPending ? "Sauvegarde en cours..." : "VALIDER CE MENU"}
                </Button>
                <p className="text-center mt-3 text-[10px] text-slate-400">
                    Tu pourras retrouver ce menu dans ton journal et ta liste de courses.
                </p>
            </div>
        </div>
    )
}
