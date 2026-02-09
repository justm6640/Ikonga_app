"use client"

interface AnalysisSlideTipsProps {
    type: "welcome" | "basics" | "allergies" | "intolerances" | "habits" | "goals" | "comment" | "summary"
}

const TIPS = {
    welcome: {
        icon: "💖",
        message: "Prends ton temps, chaque information compte pour personnaliser ton accompagnement !"
    },
    basics: {
        icon: "📏",
        message: "Ton poids de départ est notre point de référence, sois honnête avec toi-même."
    },
    allergies: {
        icon: "🥜",
        message: "Mieux vaut en dire trop que pas assez, ta sécurité est prioritaire !"
    },
    intolerances: {
        icon: "🍃",
        message: "Les intolérances sont différentes des allergies, pense aussi à ton confort digestif."
    },
    habits: {
        icon: "🍽️",
        message: "Pas de jugement ici ! Ces infos nous aident à personnaliser tes menus."
    },
    goals: {
        icon: "🎯",
        message: "Fixe-toi un objectif réaliste et motivant, on sera là à chaque étape."
    },
    comment: {
        icon: "💭",
        message: "C'est ton espace pour tout ce qu'on n'a pas demandé mais qui te semble important."
    },
    summary: {
        icon: "✨",
        message: "Vérifie que tout est correct avant de valider, tu pourras toujours modifier plus tard !"
    }
}

export function AnalysisSlideTips({ type }: AnalysisSlideTipsProps) {
    const tip = TIPS[type]

    return (
        <div className="p-4 bg-gradient-to-r from-ikonga-coral/10 to-ikonga-orange/10 rounded-2xl border border-ikonga-coral/20">
            <div className="flex items-start gap-3">
                <span className="text-2xl">{tip.icon}</span>
                <p className="text-sm text-slate-700 leading-relaxed">
                    {tip.message}
                </p>
            </div>
        </div>
    )
}
