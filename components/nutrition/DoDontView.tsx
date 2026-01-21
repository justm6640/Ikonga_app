"use client"

import { CheckCircle2, XCircle, Info } from "lucide-react"

interface Guideline {
    text: string
    icon?: string
}

interface PhaseGuidelines {
    dos: Guideline[]
    donts: Guideline[]
    tip: string
}

const GUIDELINES: Record<string, PhaseGuidelines> = {
    "DETOX": {
        dos: [
            { text: "Boire beaucoup d'eau (2L+)" },
            { text: "Légumes verts en priorité" },
            { text: "Sommeil réparateur" }
        ],
        donts: [
            { text: "Sucre ajouté" },
            { text: "Alcool" },
            { text: "Fritures & Graisses saturées" }
        ],
        tip: "La phase Détox est la clé pour relancer votre métabolisme. Restez concentrée sur les aliments bruts."
    },
    "EQUILIBRE": {
        dos: [
            { text: "Diversification alimentaire" },
            { text: "Féculents à index glycémique bas" },
            { text: "Protéines maigres" }
        ],
        donts: [
            { text: "Apéritifs caloriques" },
            { text: "Jus industriels & Sodas" },
            { text: "Grignotage entre les repas" }
        ],
        tip: "L'équilibre ne signifie pas privation, mais contrôle des portions et choix intelligents."
    },
    "CONSOLIDATION": {
        dos: [
            { text: "Portions calibrées" },
            { text: "Reprise progressive du sport" },
            { text: "Hydratation constante" }
        ],
        donts: [
            { text: "Excès durables" },
            { text: "Sauter des repas" },
            { text: "Produits trop transformés" }
        ],
        tip: "Cette phase stabilise vos résultats. La patience est votre meilleure alliée ici."
    },
    "ENTRETIEN": {
        dos: [
            { text: "Alimentation saine et variée" },
            { text: "Flexibilité maîtrisée" },
            { text: "Activité physique régulière" }
        ],
        donts: [
            { text: "Désorganisation prolongée" },
            { text: "Retour aux anciennes habitudes" },
            { text: "Oublier de se faire plaisir sainement" }
        ],
        tip: "C'est votre nouveau mode de vie. Profitez de votre énergie retrouvée !"
    }
}

interface DoDontViewProps {
    currentPhase: string
}

export function DoDontView({ currentPhase }: DoDontViewProps) {
    const phase = currentPhase?.toUpperCase() || "DETOX"
    const data = GUIDELINES[phase] || GUIDELINES["DETOX"]

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* DOs */}
                <div className="bg-emerald-50/50 rounded-3xl p-6 border border-emerald-100/50">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                            <CheckCircle2 size={24} />
                        </div>
                        <h3 className="text-xl font-serif font-black text-emerald-900 italic">À privilégier</h3>
                    </div>
                    <ul className="space-y-4">
                        {data.dos.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-3 group">
                                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 group-hover:scale-150 transition-transform" />
                                <span className="text-emerald-800 font-medium leading-tight">{item.text}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* DON'Ts */}
                <div className="bg-rose-50/50 rounded-3xl p-6 border border-rose-100/50">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-rose-500 flex items-center justify-center text-white shadow-lg shadow-rose-200">
                            <XCircle size={24} />
                        </div>
                        <h3 className="text-xl font-serif font-black text-rose-900 italic">À éviter</h3>
                    </div>
                    <ul className="space-y-4">
                        {data.donts.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-3 group">
                                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0 group-hover:scale-150 transition-transform" />
                                <span className="text-rose-800 font-medium leading-tight">{item.text}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Coach Tip */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Info size={80} className="text-slate-900" />
                </div>
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white shrink-0">
                        <Info size={24} />
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">
                            Conseil de Rosy
                        </h4>
                        <p className="text-slate-700 leading-relaxed italic">
                            "{data.tip}"
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
