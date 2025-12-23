"use client"

import { motion } from "framer-motion"
import { Check, Sparkles, Crown } from "lucide-react"
import Link from "next/link"

const CLASSIC_PLANS = [
    {
        name: "Découverte",
        duration: "6 Semaines",
        priceEur: "69,00",
        priceFcfa: "45 260",
        desc: "Idéal pour découvrir la méthode.",
        features: [
            "Phase 1 : Détox complète",
            "Guide nutritionnel digital",
            "Accès application mobile",
            "Support communauté"
        ],
        popular: false
    },
    {
        name: "Transformation",
        duration: "12 Semaines",
        priceEur: "138,00",
        priceFcfa: "90 500",
        desc: "La durée recommandée pour des résultats visibles.",
        features: [
            "Phases 1 & 2 complètes",
            "Menus personnalisés",
            "Suivi de progression",
            "Recettes IKONGA",
            "Support prioritaire"
        ],
        popular: true
    },
    {
        name: "Metamorphose",
        duration: "24 Semaines",
        priceEur: "276,00",
        priceFcfa: "181 000",
        desc: "Pour une transformation profonde.",
        features: [
            "Parcours complet (4 Phases)",
            "Coaching de groupe",
            "Bilans de fin de phase",
            "Accès contenus exclusifs",
            "Stabilisation ancrée"
        ],
        popular: false
    },
    {
        name: "Stabilisation",
        duration: "48 Semaines",
        priceEur: "552,00",
        priceFcfa: "362 000",
        desc: "Un an de suivi pour stabiliser votre poids.",
        features: [
            "Cycle annuel complet",
            "Maintenance long terme",
            "Prévention effet yoyo",
            "Check-up trimestriel",
            "Autonomie totale"
        ],
        popular: false
    }
]

const VIP_PLAN = {
    name: "VIP",
    duration: "Coaching Premium",
    priceEur: "786,00",
    priceFcfa: "515 600",
    desc: "Coaching VIP et suivi prioritaire pour une expérience sur-mesure.",
    features: [
        "Ligne directe 24/7 avec votre coach",
        "Adaptation du programme en temps réel",
        "Analyse biologique & métabolique",
        "Séances privées en visioconférence",
        "Accès à vie à tous les programmes"
    ]
}

export function PricingSection() {
    return (
        <section id="tarifs" className="py-32 bg-[#fafafa] overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-xs font-bold uppercase tracking-[0.3em] text-ikonga-pink mb-4 block"
                    >
                        Investissez en vous
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-serif text-slate-900 mb-6"
                    >
                        Choisissez votre <br />
                        <span className="italic">Prochain Chapitre.</span>
                    </motion.h2>
                </div>

                {/* Classic Plans Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-16">
                    {CLASSIC_PLANS.map((prog, idx) => (
                        <motion.div
                            key={prog.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className={`relative bg-white rounded-[2.5rem] p-8 border border-slate-100 flex flex-col h-full transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 group ${prog.popular ? 'ring-2 ring-ikonga-pink ring-offset-4 ring-offset-[#fafafa]' : ''}`}
                        >
                            {prog.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-ikonga-gradient text-white px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg flex items-center gap-2 whitespace-nowrap z-10">
                                    <Sparkles size={12} fill="currentColor" />
                                    BEST SELLER
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-slate-900 mb-1">{prog.name}</h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{prog.duration}</p>
                            </div>

                            <div className="mb-6">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-serif text-slate-950">{prog.priceEur}€</span>
                                </div>
                                <div className="mt-1 text-xs font-bold text-slate-400">
                                    ~ {prog.priceFcfa} FCFA
                                </div>
                            </div>

                            <p className="text-slate-500 text-sm leading-relaxed mb-8 italic">
                                “{prog.desc}”
                            </p>

                            <div className="space-y-4 mb-10 flex-grow">
                                {prog.features.map((feat) => (
                                    <div key={feat} className="flex gap-3 items-start">
                                        <div className={`mt-1 rounded-full p-0.5 ${prog.popular ? 'bg-ikonga-pink/10 text-ikonga-pink' : 'bg-slate-50 text-slate-400'}`}>
                                            <Check size={10} strokeWidth={4} />
                                        </div>
                                        <span className="text-xs text-slate-600 font-medium leading-tight">{feat}</span>
                                    </div>
                                ))}
                            </div>

                            <Link
                                href="https://ikonga.shop"
                                className={`w-full py-4 rounded-2xl text-sm font-bold transition-all text-center flex items-center justify-center gap-2 ${prog.popular
                                    ? 'bg-ikonga-gradient text-white shadow-lg shadow-pink-500/20 hover:scale-[1.02] active:scale-[0.98]'
                                    : 'border-2 border-slate-100 text-slate-900 hover:border-ikonga-pink/20 hover:text-ikonga-pink active:scale-[0.98]'
                                    }`}
                            >
                                Choisir
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* VIP Plan - Wide Design */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="relative bg-slate-900 rounded-[2.5rem] p-8 md:p-12 overflow-hidden group shadow-2xl shadow-slate-900/20">
                        {/* Decorative Background Elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-ikonga-gradient opacity-10 blur-[80px] -mr-32 -mt-32" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 opacity-5 blur-[80px] -ml-32 -mb-32" />

                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                            <div className="flex-1 text-center md:text-left">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-pink-300 text-[10px] font-black uppercase tracking-widest mb-6 border border-white/10">
                                    <Crown size={14} className="text-pink-400" />
                                    EXPÉRIENCE PRESTIGE
                                </div>
                                <h3 className="text-3xl md:text-5xl font-serif text-white mb-4">{VIP_PLAN.name}</h3>
                                <p className="text-slate-400 text-lg mb-8 max-w-md">{VIP_PLAN.desc}</p>

                                <div className="flex items-center gap-8 mb-8 md:mb-0 justify-center md:justify-start">
                                    <div>
                                        <div className="text-4xl md:text-6xl font-serif text-white">{VIP_PLAN.priceEur}€</div>
                                        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">~ {VIP_PLAN.priceFcfa} FCFA</div>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full md:w-[400px] space-y-4">
                                {VIP_PLAN.features.map((feat) => (
                                    <div key={feat} className="flex gap-4 items-center bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                                        <div className="bg-pink-500/20 text-pink-400 rounded-full p-1">
                                            <Check size={14} strokeWidth={3} />
                                        </div>
                                        <span className="text-sm text-slate-300 font-medium">{feat}</span>
                                    </div>
                                ))}
                                <Link
                                    href="https://ikonga.shop"
                                    className="w-full py-5 rounded-2xl text-sm font-black bg-white text-slate-950 transition-all text-center flex items-center justify-center gap-2 hover:bg-slate-100 hover:scale-[1.02] active:scale-[0.98] mt-6 shadow-xl shadow-white/5"
                                >
                                    Choisir l'expérience VIP
                                </Link>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <div className="mt-20 text-center">
                    <p className="text-xs text-slate-400 max-w-xl mx-auto uppercase tracking-widest font-bold opacity-60">
                        Paiement sécurisé • Accès immédiat • Support 7j/7
                    </p>
                </div>
            </div>
        </section>
    )
}
