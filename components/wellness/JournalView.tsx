"use client"

import { useState } from "react"
import { BookHeart, Lock } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

interface JournalViewProps {
    date: Date
    initialData: any
    onUpdate: (data: any) => void
}

export function JournalView({ date, initialData, onUpdate }: JournalViewProps) {
    const [feeling, setFeeling] = useState(initialData?.feeling || "")
    const [needs, setNeeds] = useState(initialData?.needs || "")
    const [isSaved, setIsSaved] = useState(false)

    const handleSave = () => {
        onUpdate({ feeling, needs })
        setIsSaved(true)
        setTimeout(() => setIsSaved(false), 2000)
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex items-start gap-4">
                <div className="bg-white p-2 rounded-full text-slate-500 border border-slate-100 shadow-sm">
                    <BookHeart size={24} className="fill-slate-500" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-slate-900">Journal Intérieur</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        Vide ton sac ici pour ne pas le vider dans le frigo. <br />
                        <span className="flex items-center gap-1 mt-1 opacity-75 font-semibold text-amber-500">
                            <Lock size={10} /> Privé & Sécurisé
                        </span>
                    </p>
                </div>
            </div>

            {/* Inputs */}
            <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-xs font-black text-slate-900 uppercase tracking-wide">Comment te sens-tu ?</label>
                    <Textarea
                        placeholder="Fatiguée, fière, inquiète..."
                        className="bg-white border-slate-200 rounded-xl min-h-[100px] resize-none focus:border-slate-400 focus:ring-slate-100"
                        value={feeling}
                        onChange={(e) => setFeeling(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-black text-slate-900 uppercase tracking-wide">De quoi as-tu besoin ?</label>
                    <Textarea
                        placeholder="De repos, d'un câlin, de silence..."
                        className="bg-white border-slate-200 rounded-xl min-h-[100px] resize-none focus:border-slate-400 focus:ring-slate-100"
                        value={needs}
                        onChange={(e) => setNeeds(e.target.value)}
                    />
                </div>
            </div>

            {/* Save Button */}
            <Button
                onClick={handleSave}
                className="w-full h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-500 font-bold shadow-lg shadow-slate-200 transition-all border border-slate-800"
                disabled={isSaved}
            >
                {isSaved ? "Enregistré 💛" : "Sauvegarder mes pensées"}
            </Button>
        </div>
    )
}
