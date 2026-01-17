"use client"

import { useState } from "react"
import { ArrowLeft, Sparkles, Droplet, Sun, Moon, FlaskConical, ChefHat, Check, User } from "lucide-react"
import { cn } from "@/lib/utils"
// import { Button } from "@/components/ui/button" // Unused but might need
import { upsertBeautyProfile, generateDIYRecipe, saveBeautyRecipe } from "@/lib/actions/beauty"
// import { Textarea } from "@/components/ui/textarea" // Unused but might need
import { toast } from "sonner"

interface BeautyCareViewProps {
    initialProfile?: any
    onBack: () => void
}

const SKIN_TYPES = [
    { id: "OILY", label: "Grasse", desc: "Brillance, pores dilatés" },
    { id: "DRY", label: "Sèche", desc: "Tiraillements, rugosité" },
    { id: "NORMAL", label: "Normale", desc: "Équilibrée, confortable" },
    { id: "MIXED", label: "Mixte", desc: "T sec, joues normales" },
    { id: "SENSITIVE", label: "Sensible", desc: "Rougeurs, réactive" },
]

export function BeautyCareView({ initialProfile, onBack }: BeautyCareViewProps) {
    const [view, setView] = useState<"ROUTINE" | "LABO">("ROUTINE")
    const [skinType, setSkinType] = useState<string>(initialProfile?.skinType || "NORMAL")
    const [isSaving, setIsSaving] = useState(false)

    const handleSaveType = async (type: string) => {
        setSkinType(type)
        setIsSaving(true)
        try {
            await upsertBeautyProfile({ skinType: type as any })
            toast.success("Profil beauté mis à jour")
        } catch (error) {
            toast.error("Erreur lors de la mise à jour")
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
            {/* Nav Header */}
            <div className="flex items-center justify-between">
                <button onClick={onBack} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
                    <ArrowLeft size={16} /> Retour
                </button>
                <div className="flex bg-slate-100 p-1 rounded-full">
                    <button
                        onClick={() => setView("ROUTINE")}
                        className={cn("px-4 py-1.5 rounded-full text-xs font-bold transition-all", view === "ROUTINE" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500")}
                    >
                        Routine Peau
                    </button>
                    <button
                        onClick={() => setView("LABO")}
                        className={cn("px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1", view === "LABO" ? "bg-white text-amber-600 shadow-sm" : "text-slate-500")}
                    >
                        <Sparkles size={12} /> Labo DIY
                    </button>
                </div>
            </div>

            {view === "ROUTINE" ? (
                <RoutineView skinType={skinType} onTypeChange={handleSaveType} isSaving={isSaving} />
            ) : (
                <LaboView />
            )}
        </div>
    )
}

function RoutineView({ skinType, onTypeChange, isSaving }: { skinType: string, onTypeChange: (t: string) => void, isSaving: boolean }) {
    // Mock routine data based on skin type
    const getRoutine = (type: string) => {
        // ... (We can expand this map later)
        return [
            { step: 1, title: "Nettoyant Doux", sub: "Gelée ou mousse aérienne" },
            { step: 2, title: "Tonique", sub: "Eau florale ou lotion hydratante" },
            { step: 3, title: "Sérum", sub: "Vitamine C pour l'éclat" },
            { step: 4, title: "Hydratant", sub: "Crème adaptée à ton type de peau" },
            { step: 5, title: "SPF 50", sub: "Indispensable, même en hiver" },
        ]
    }

    return (
        <div className="space-y-6">
            <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Ton Type de Peau</h3>
                <div className="flex flex-wrap gap-2">
                    {SKIN_TYPES.map(t => (
                        <button
                            key={t.id}
                            onClick={() => onTypeChange(t.id)}
                            className={cn(
                                "px-4 py-2 rounded-2xl text-sm font-bold border transition-all",
                                skinType === t.id
                                    ? "bg-slate-900 text-white border-slate-900 shadow-lg"
                                    : "bg-white text-slate-500 border-slate-200 hover:border-amber-200"
                            )}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-amber-50/50 border border-amber-100 p-6 rounded-3xl">
                <div className="flex items-center gap-2 mb-6">
                    <Sun className="text-amber-500" size={20} />
                    <h3 className="text-lg font-serif font-black text-amber-900">Routine Matin</h3>
                </div>

                <div className="space-y-4">
                    {getRoutine(skinType).map((step, i) => (
                        <div key={i} className="flex items-start gap-4">
                            <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                                {step.step}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900">{step.title}</p>
                                <p className="text-xs text-slate-500">{step.sub}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

function LaboView() {
    const [ingredients, setIngredients] = useState("")
    const [recipe, setRecipe] = useState<any>(null)
    const [loading, setLoading] = useState(false)

    const handleGenerate = async () => {
        if (!ingredients) return
        setLoading(true)
        try {
            const result = await generateDIYRecipe(ingredients)
            setRecipe(result)
        } catch (e) {
            toast.error("Erreur de génération")
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        if (!recipe) return
        await saveBeautyRecipe(recipe)
        toast.success("Recette sauvegardée !")
    }

    return (
        <div className="space-y-6">
            <div className="text-center py-8">
                <div className="w-16 h-16 bg-gradient-to-tr from-amber-100 to-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                    <FlaskConical size={32} className="text-amber-500" />
                </div>
                <h2 className="text-2xl font-serif font-black text-slate-900">Labo Beauté IA</h2>
                <p className="text-sm text-slate-500">Crée tes soins avec ce que tu as.</p>
            </div>

            {!recipe && (
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Ingrédients disponibles</label>
                        <textarea
                            className="w-full bg-slate-50 border-slate-100 rounded-xl p-4 text-sm focus:ring-amber-200 focus:border-amber-300 transition-all resize-none min-h-[100px]"
                            placeholder="Ex: Miel, Citron, Yaourt, Sucre, Huile d'olive..."
                            value={ingredients}
                            onChange={(e) => setIngredients(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={handleGenerate}
                        disabled={loading || !ingredients}
                        className="w-full h-12 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? "Création en cours..." : <><Sparkles size={16} /> Inventer ma recette</>}
                    </button>
                </div>
            )}

            {recipe && (
                <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-lg animate-in zoom-in-95 duration-300">
                    <div className="bg-amber-50 p-6 border-b border-amber-100">
                        <h3 className="text-xl font-bold text-slate-900">{recipe.title}</h3>
                        <div className="flex gap-2 mt-2">
                            {recipe.ingredients.map((ing: string) => (
                                <span key={ing} className="px-2 py-1 bg-white rounded-lg text-xs font-bold text-amber-600 border border-amber-100">
                                    {ing}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="p-6 space-y-4">
                        <p className="text-sm text-slate-600 leading-relaxed font-medium">
                            {recipe.instructions}
                        </p>
                        <div className="pt-4 flex gap-3">
                            <button
                                onClick={handleSave}
                                className="flex-1 h-10 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all"
                            >
                                Sauvegarder
                            </button>
                            <button
                                onClick={() => setRecipe(null)}
                                className="h-10 px-4 border border-slate-200 text-slate-500 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all"
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
