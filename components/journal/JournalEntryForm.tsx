"use client"

import { useState } from "react"
import { Mood, Digestion } from "@prisma/client"
import { motion, AnimatePresence } from "framer-motion"
import { Droplet, Moon, MessageSquare, CheckCircle2, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { saveJournalEntry } from "@/lib/actions/journal"
import { toast } from "sonner"

const MOODS = [
    { value: Mood.GREAT, emoji: "🤩", label: "Génial" },
    { value: Mood.GOOD, emoji: "🙂", label: "Bien" },
    { value: Mood.NEUTRAL, emoji: "😐", label: "Neutre" },
    { value: Mood.BAD, emoji: "😞", label: "Pas top" },
    { value: Mood.STRESSED, emoji: "😫", label: "Stressé" },
]

const DIGESTIONS = [
    { value: Digestion.GREAT, emoji: "🦋", label: "Légère" },
    { value: Digestion.NORMAL, emoji: "👌", label: "Normale" },
    { value: Digestion.BLOATED, emoji: "🎈", label: "Ballonnée" },
    { value: Digestion.CONSTIPATED, emoji: "🧱", label: "Lente" },
]

interface JournalEntryFormProps {
    initialData?: any
}

export function JournalEntryForm({ initialData }: JournalEntryFormProps) {
    const [mood, setMood] = useState<Mood | undefined>(initialData?.mood)
    const [digestion, setDigestion] = useState<Digestion | undefined>(initialData?.digestion)
    const [hydration, setHydration] = useState<number>(initialData?.hydration || 0)
    const [sleepHours, setSleepHours] = useState<number>(initialData?.sleepHours || 8)
    const [stressLevel, setStressLevel] = useState<number>(initialData?.stressLevel || 3)
    const [energyLevel, setEnergyLevel] = useState<number>(initialData?.energyLevel || 7)
    const [notes, setNotes] = useState<string>(initialData?.notes || "")
    const [loading, setLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const handleSubmit = async () => {
        setLoading(true)
        const res = await saveJournalEntry({
            mood,
            digestion,
            hydration,
            sleepHours,
            stressLevel,
            energyLevel,
            notes
        })
        setLoading(false)

        if (res.success) {
            toast.success("Journal enregistré avec succès ! ✨")
            setIsSuccess(true)
            setTimeout(() => setIsSuccess(false), 3000)
        } else {
            toast.error("Erreur lors de l'enregistrement: " + res.error)
        }
    }

    return (
        <div className="space-y-10 pb-20">
            {/* Mood */}
            <section className="space-y-4">
                <Label className="text-xl font-serif font-bold text-slate-800">Côté moral ?</Label>
                <div className="flex justify-between gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {MOODS.map((m) => (
                        <motion.button
                            key={m.value}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setMood(m.value)}
                            className={cn(
                                "flex-1 flex flex-col items-center gap-2 p-4 rounded-[2rem] transition-all border-2 min-w-[80px]",
                                mood === m.value
                                    ? "bg-ikonga-pink text-white border-ikonga-pink shadow-lg shadow-pink-200"
                                    : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
                            )}
                        >
                            <span className="text-3xl">{m.emoji}</span>
                            <span className={cn(
                                "text-[10px] font-black uppercase tracking-tighter",
                                mood === m.value ? "text-white" : "text-slate-400"
                            )}>
                                {m.label}
                            </span>
                        </motion.button>
                    ))}
                </div>
            </section>

            {/* Digestion */}
            <section className="space-y-4">
                <Label className="text-xl font-serif font-bold text-slate-800">Côté digestion ?</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {DIGESTIONS.map((d) => (
                        <motion.button
                            key={d.value}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setDigestion(d.value)}
                            className={cn(
                                "flex flex-col items-center gap-2 p-5 rounded-[2rem] transition-all border-2",
                                digestion === d.value
                                    ? "bg-ikonga-orange text-white border-ikonga-orange shadow-lg shadow-orange-200"
                                    : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
                            )}
                        >
                            <span className="text-3xl">{d.emoji}</span>
                            <span className={cn(
                                "text-[10px] font-black uppercase tracking-tighter",
                                digestion === d.value ? "text-white" : "text-slate-400"
                            )}>
                                {d.label}
                            </span>
                        </motion.button>
                    ))}
                </div>
            </section>

            {/* Hydration */}
            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <Label className="text-xl font-serif font-bold text-slate-800">Hydratation</Label>
                    <span className="px-4 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-black italic">
                        {hydration} verres
                    </span>
                </div>
                <div className="flex justify-between items-center bg-slate-50/50 p-6 rounded-[2.5rem] border border-slate-100/50">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <motion.button
                            key={i}
                            whileHover={{ scale: 1.2, rotate: 10 }}
                            whileTap={{ scale: 0.8 }}
                            onClick={() => setHydration(i + 1)}
                            className={cn(
                                "transition-all duration-300",
                                hydration > i ? "text-blue-500" : "text-slate-200"
                            )}
                        >
                            <Droplet
                                size={32}
                                fill={hydration > i ? "currentColor" : "none"}
                                className={cn(hydration > i && "drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]")}
                            />
                        </motion.button>
                    ))}
                </div>
            </section>

            {/* Sleep */}
            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <Label className="text-xl font-serif font-bold text-slate-800 flex items-center gap-2">
                        <Moon size={22} className="text-indigo-500" /> Sommeil
                    </Label>
                    <span className="px-4 py-1 rounded-full bg-indigo-50 text-indigo-600 text-sm font-black italic">
                        {sleepHours} heures
                    </span>
                </div>
                <div className="px-2">
                    <Slider
                        value={[sleepHours]}
                        onValueChange={([v]) => setSleepHours(v)}
                        max={12}
                        min={4}
                        step={0.5}
                        className="py-4 cursor-pointer"
                    />
                    <div className="flex justify-between mt-2 px-1">
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Minimal</span>
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Idéal</span>
                    </div>
                </div>
            </section>

            {/* Stress level */}
            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <Label className="text-xl font-serif font-bold text-slate-800 flex items-center gap-2">
                        <Activity size={22} className="text-orange-500" /> Niveau de Stress
                    </Label>
                    <span className={cn(
                        "px-4 py-1 rounded-full text-sm font-black italic",
                        stressLevel > 7 ? "bg-red-50 text-red-600" : "bg-orange-50 text-orange-600"
                    )}>
                        {stressLevel}/10
                    </span>
                </div>
                <div className="px-2">
                    <Slider
                        value={[stressLevel]}
                        onValueChange={([v]) => setStressLevel(v)}
                        max={10}
                        min={1}
                        step={1}
                        className="py-4 cursor-pointer"
                    />
                    <div className="flex justify-between mt-2 px-1">
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Zen</span>
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Élevé</span>
                    </div>
                </div>
            </section>

            {/* Energy level */}
            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <Label className="text-xl font-serif font-bold text-slate-800 flex items-center gap-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="22" height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-yellow-500"
                        >
                            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                        </svg> Energy
                    </Label>
                    <span className={cn(
                        "px-4 py-1 rounded-full text-sm font-black italic",
                        energyLevel < 4 ? "bg-red-50 text-red-600" : "bg-yellow-50 text-yellow-600"
                    )}>
                        {energyLevel}/10
                    </span>
                </div>
                <div className="px-2">
                    <Slider
                        value={[energyLevel]}
                        onValueChange={([v]) => setEnergyLevel(v)}
                        max={10}
                        min={1}
                        step={1}
                        className="py-4 cursor-pointer"
                    />
                    <div className="flex justify-between mt-2 px-1">
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">K.O.</span>
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Full Power</span>
                    </div>
                </div>
            </section>

            {/* Notes */}
            <section className="space-y-4">
                <Label className="text-xl font-serif font-bold text-slate-800 flex items-center gap-2">
                    <MessageSquare size={22} className="text-ikonga-pink" /> Notes du jour
                </Label>
                <Textarea
                    placeholder="Un ressenti particulier ? Une victoire aujourd'hui ?"
                    className="rounded-[2rem] border-slate-100 p-8 min-h-[150px] focus:ring-ikonga-pink bg-slate-50/30 text-slate-700 font-medium leading-relaxed resize-none"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />
            </section>

            <div className="sticky bottom-4 pt-4">
                <Button
                    onClick={handleSubmit}
                    disabled={loading}
                    className={cn(
                        "w-full h-18 rounded-full text-white font-black text-lg shadow-xl transition-all duration-300 active:scale-95",
                        isSuccess
                            ? "bg-emerald-500 shadow-emerald-200"
                            : "bg-ikonga-gradient shadow-pink-200"
                    )}
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Enregistrement...
                        </span>
                    ) : isSuccess ? (
                        <span className="flex items-center gap-2">
                            <CheckCircle2 size={24} />
                            C'est validé ! ✨
                        </span>
                    ) : (
                        "Terminer mon journal ✍️"
                    )}
                </Button>
            </div>
        </div>
    )
}
