"use client"

import { useState } from "react"
import { Sparkles, Smile, Shirt, Scissors, ChevronRight, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { BeautyCareView } from "./BeautyCareView"

interface BeautyClientProps {
    initialProfile?: any
}

const PILLARS = [
    {
        id: "CARE",
        title: "Soins & Rituels",
        subtitle: "Peau, Corps, Cheveux",
        icon: Sparkles,
        description: "Ancrer la beauté dans le soin, pas dans la performance."
    },
    {
        id: "IMAGE",
        title: "Image de Soi",
        subtitle: "Posture & Présence",
        icon: Smile,
        description: "Transformer le regard sur soi, pas juste l'apparence."
    },
    {
        id: "STYLE",
        title: "Style & Mode",
        subtitle: "S'habiller maintenant",
        icon: Shirt,
        description: "Aider à s'habiller pendant la transformation, pas après."
    },
    {
        id: "HAIR",
        title: "Coiffure & Makeup",
        subtitle: "Confiance & Révélation",
        icon: Scissors,
        description: "La coiffure comme marqueur de transformation."
    }
]

export function BeautyClient({ initialProfile }: BeautyClientProps) {
    const [activeView, setActiveView] = useState<string | null>(null)

    const renderView = () => {
        switch (activeView) {
            case "CARE":
                return <BeautyCareView initialProfile={initialProfile} onBack={() => setActiveView(null)} />
            case "IMAGE":
                return <PlaceholderView title="Image de Soi" onBack={() => setActiveView(null)} />
            case "STYLE":
                return <PlaceholderView title="Style & Mode" onBack={() => setActiveView(null)} />
            case "HAIR":
                return <PlaceholderView title="Coiffure & Makeup" onBack={() => setActiveView(null)} />
            default:
                return <BeautyDashboard onNavigate={setActiveView} />
        }
    }

    return (
        <div className="w-full pb-20 animate-in fade-in duration-500">
            {renderView()}
        </div>
    )
}

function BeautyDashboard({ onNavigate }: { onNavigate: (view: string) => void }) {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-serif font-black text-slate-900 uppercase">IKOBEAUTY</h1>
                <p className="text-sm font-medium text-slate-500">Révèle ton éclat naturel.</p>
            </div>

            {/* Pillars Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PILLARS.map((pillar) => (
                    <button
                        key={pillar.id}
                        onClick={() => onNavigate(pillar.id)}
                        className="group relative overflow-hidden bg-white border border-slate-100 rounded-3xl p-6 text-left shadow-sm hover:shadow-xl hover:border-amber-200 transition-all duration-300"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <pillar.icon size={100} className="text-amber-500" />
                        </div>

                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                <pillar.icon size={24} className="text-amber-600" />
                            </div>

                            <h3 className="text-xl font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                                {pillar.title}
                            </h3>
                            <p className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-2">
                                {pillar.subtitle}
                            </p>
                            <p className="text-sm text-slate-500 leading-relaxed max-w-[90%]">
                                {pillar.description}
                            </p>
                        </div>

                        <div className="absolute bottom-6 right-6">
                            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors">
                                <ChevronRight size={16} />
                            </div>
                        </div>
                    </button>
                ))}
            </div>

            {/* Quote / Promise */}
            <div className="bg-slate-900 rounded-2xl p-6 text-center shadow-lg shadow-slate-200 mt-8">
                <p className="text-slate-400 text-xs uppercase tracking-widest font-bold mb-2">Philosophie</p>
                <p className="text-white font-serif text-lg md:text-xl italic">
                    "On ne se met pas en valeur quand on aura maigri. <br />
                    On se met en valeur pour <span className="text-amber-400">continuer à avancer</span>."
                </p>
            </div>
        </div>
    )
}

function PlaceholderView({ title, onBack }: { title: string, onBack: () => void }) {
    return (
        <div className="space-y-6">
            <button onClick={onBack} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
                <ArrowLeft size={16} /> Retour
            </button>
            <div className="h-64 rounded-3xl bg-slate-50 flex flex-col items-center justify-center text-center p-6 border border-slate-100">
                <Sparkles size={48} className="text-slate-200 mb-4" />
                <h2 className="text-xl font-bold text-slate-900">{title}</h2>
                <p className="text-slate-500">Ce module est en cours de construction.</p>
            </div>
        </div>
    )
}
