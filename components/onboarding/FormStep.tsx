"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ClipboardList, ChevronRight } from "lucide-react"

interface FormStepProps {
    onNext: () => void
}

export function FormStep({ onNext }: FormStepProps) {
    const [loading, setLoading] = useState(false)
    const [objective, setObjective] = useState<string>("")
    const [allergies, setAllergies] = useState<string>("")

    const handleSave = async () => {
        setLoading(true)
        // Simulation of server action saving
        await new Promise(resolve => setTimeout(resolve, 1000))
        setLoading(false)
        onNext()
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col space-y-8 max-w-lg mx-auto"
        >
            <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
                    <ClipboardList className="text-ikonga-coral w-8 h-8" />
                </div>
                <h2 className="text-3xl md:text-4xl font-serif font-black text-slate-900 uppercase tracking-tighter">
                    Ton <span className="text-ikonga-coral">Profil</span> Santé
                </h2>
                <p className="text-slate-500 font-light text-lg">
                    Aide-nous à affiner ton programme en quelques secondes.
                </p>
            </div>

            <div className="space-y-6 bg-white/50 p-6 rounded-[2rem] border border-white">
                <div className="space-y-4">
                    <Label className="text-[10px] uppercase tracking-widest font-black text-slate-400 ml-1">Quel est ton objectif principal ?</Label>
                    <Select onValueChange={setObjective}>
                        <SelectTrigger className="h-14 rounded-2xl bg-white border-slate-100 text-lg shadow-sm focus:ring-ikonga-coral">
                            <SelectValue placeholder="Choisir un objectif" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-slate-100 shadow-2xl">
                            <SelectItem value="weight-loss" className="py-3 text-lg focus:bg-pink-50">Perte de poids</SelectItem>
                            <SelectItem value="vitality" className="py-3 text-lg focus:bg-pink-50">Vitalité & Énergie</SelectItem>
                            <SelectItem value="muscle-gain" className="py-3 text-lg focus:bg-pink-50">Prise de masse</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-4">
                    <Label className="text-[10px] uppercase tracking-widest font-black text-slate-400 ml-1">Des allergies ou intolérances ?</Label>
                    <Input
                        placeholder="Ex: Noix, Gluten, Lactose..."
                        value={allergies}
                        onChange={(e) => setAllergies(e.target.value)}
                        className="h-14 rounded-2xl bg-white border-slate-100 text-lg shadow-sm focus:ring-ikonga-coral"
                    />
                    <p className="text-[10px] text-slate-400 italic ml-1">* Laisse vide si aucune allergie.</p>
                </div>
            </div>

            <div className="flex flex-col items-center space-y-6 pt-4">
                <Button
                    onClick={handleSave}
                    disabled={!objective || loading}
                    className="w-full h-16 rounded-2xl bg-ikonga-gradient text-xl font-bold shadow-xl shadow-pink-500/20 hover:scale-[1.02] transition-all active:scale-95 group"
                >
                    {loading ? "Enregistrement..." : "Valider mon profil"}
                    {!loading && <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />}
                </Button>

                <button
                    onClick={onNext}
                    className="text-slate-400 text-xs uppercase tracking-widest font-black hover:text-ikonga-coral transition-colors underline decoration-slate-200 underline-offset-4"
                >
                    Passer cette étape
                </button>
            </div>
        </motion.div>
    )
}
