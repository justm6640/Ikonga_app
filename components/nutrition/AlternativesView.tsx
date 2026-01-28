"use client"

import { useState } from "react"
import { Search, ChevronDown, ArrowRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface AlternativesViewProps {
    currentPhase: string
}

const ALTERNATIVES_DATA = [
    {
        category: "Protéines",
        items: [
            { name: "Poulet (100g)", alternatives: ["Dinde (100g)", "Tofu (120g)", "Poisson blanc (120g)", "2 Œufs"] },
            { name: "Bœuf (100g)", alternatives: ["Seitan (100g)", "Tempeh (100g)", "Lentilles cuites (150g)"] },
            { name: "Poisson gras (100g)", alternatives: ["Sardines (100g)", "Maquereau (100g)", "Saumon (100g)", "Complément Omega-3"] },
        ]
    },
    {
        category: "Féculents",
        items: [
            { name: "Riz blanc (100g cuit)", alternatives: ["Riz complet (100g cuit)", "Quinoa (100g cuit)", "Patate douce (120g)"] },
            { name: "Pâtes (100g cuites)", alternatives: ["Pâtes complètes (100g)", "Pâtes de légumineuses (100g)", "Courgettes (spiralisées)"] },
            { name: "Pain (1 tranche)", alternatives: ["Pain complet", "Galette de riz (2)", "Pain des fleurs"] },
        ]
    },
    {
        category: "Légumes",
        items: [
            { name: "Épinards", alternatives: ["Blettes", "Chou Kale", "Brocoli"] },
            { name: "Carottes", alternatives: ["Courge", "Patate douce (avec modération)", "Betterave"] },
            { name: "Haricots verts", alternatives: ["Asperges", "Courgettes", "Pois gourmands"] },
        ]
    },
    {
        category: "Matières Grasses",
        items: [
            { name: "Huile d'olive (1 c.à.s)", alternatives: ["Huile de colza", "Huile de noix", "Avocat (1/4)", "Noix (1 petite poignée)"] },
            { name: "Beurre (10g)", alternatives: ["Huile de coco (10g)", "Ghee (10g)", "Purée d'oléagineux (1 c.à.c)"] },
        ]
    }
]

export function AlternativesView({ currentPhase }: AlternativesViewProps) {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

    const filteredData = ALTERNATIVES_DATA.map(cat => ({
        ...cat,
        items: cat.items.filter(item =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.alternatives.some(alt => alt.toLowerCase().includes(searchTerm.toLowerCase()))
        )
    })).filter(cat => cat.items.length > 0)

    return (
        <div className="space-y-6">
            <div className="bg-orange-50 rounded-3xl p-6 border border-orange-100">
                <h3 className="text-xl font-serif font-black text-orange-900 mb-2">
                    Substitutions Intelligentes
                </h3>
                <p className="text-sm text-orange-700/80 mb-6 max-w-lg">
                    Adapte tes menus selon tes goûts, tes allergies ou ton frigo, tout en respectant l'équilibre de la phase <b>{currentPhase}</b>.
                </p>

                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-300" size={20} />
                    <Input
                        placeholder="Rechercher un aliment (ex: Poulet, Riz...)"
                        className="pl-12 h-12 rounded-2xl border-orange-200 bg-white/80 focus:bg-white transition-all text-base"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="space-y-8">
                {filteredData.map((category) => (
                    <div key={category.category} className="space-y-4">
                        <h4 className="font-serif font-black text-slate-900 text-lg flex items-center gap-2">
                            <span className="w-2 h-8 rounded-full bg-orange-500 block" />
                            {category.category}
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {category.items.map((item, idx) => (
                                <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="font-bold text-slate-800">{item.name}</span>
                                        <ArrowRight size={16} className="text-slate-300" />
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {item.alternatives.map((alt, i) => (
                                            <span key={i} className="text-xs font-medium text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                                                {alt}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {filteredData.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-slate-400 italic">Aucun aliment trouvé pour "{searchTerm}"</p>
                    </div>
                )}
            </div>
        </div>
    )
}
