"use client"

import { motion } from "framer-motion"
import { Check, Sparkles } from "lucide-react"
import Link from "next/link"

const PROGRAMS = [
    {
        name: "Starter",
        duration: "6 Semaines",
        priceEur: 69,
        priceFcfa: "45 000",
        desc: "Pour découvrir la méthode et initier le changement.",
        features: [
            "Phase 1 : Détox complète",
            "Guide nutritionnel de base",
            "Accès application mobile",
            "Support communauté"
        ],
        cta: "Choisir ce programme",
        popular: false
    },
    {
        name: "Transformation",
        duration: "12 Semaines",
        priceEur: 138,
        priceFcfa: "90 000",
        desc: "L'idéal pour des résultats visibles et durables.",
        features: [
            "Phases 1 & 2 complètes",
            "Menus personnalisés",
            "Analyse de progression",
            "Recettes exclusives IKONGA",
            "Support prioritaire"
        ],
        cta: "Choisir ce programme",
        popular: true
    },
    {
        name: "Metamorphose",
        duration: "24 Semaines",
        priceEur: 276,
        priceFcfa: "180 000",
        desc: "Pour une transformation profonde et ancrée.",
        features: [
            "Le parcours complet (4 Phases)",
            "Coaching de groupe bimensuel",
            "Bilan de fin de phase",
            "Accès VIP aux nouveaux contenus",
            "Stabilisation garantie"
        ],
        cta: "Choisir ce programme",
        popular: false
    },
    {
        name: "VIP",
        duration: "Sur Mesure",
        priceEur: 1700,
        priceFcfa: "1 100 000",
        desc: "Coaching privé et suivi ultra-personnalisé.",
        features: [
            "Suivi quotidien individuel",
            "Ligne directe avec votre coach",
            "Adaptation temps réel",
            "Programme sport sur mesure",
            "Confidentialité totale"
        ],
        cta: "Devenir VIP",
        popular: false
    }
]

export function PricingSection() {
    return (
        <section id="pricing" className="py-32 bg-[#fafafa] overflow-hidden">
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
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-slate-500 font-sans"
                    >
                        Des programmes adaptés à vos objectifs et à votre rythme,
                        conçus pour des résultats durables.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {PROGRAMS.map((prog, idx) => (
                        <motion.div
                            key={prog.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className={`relative bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-100 flex flex-col h-full transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 group ${prog.popular ? 'ring-2 ring-ikonga-pink ring-offset-4 ring-offset-[#fafafa]' : ''}`}
                        >
                            {prog.popular && (
                                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-ikonga-gradient text-white px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2 whitespace-nowrap">
                                    <Sparkles size={12} fill="currentColor" />
                                    Le Plus Populaire
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-slate-900 mb-1">{prog.name}</h3>
                                <p className="text-sm text-slate-400 font-medium uppercase tracking-widest">{prog.duration}</p>
                            </div>

                            <div className="mb-8">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl md:text-5xl font-serif text-slate-950">{prog.priceEur}€</span>
                                    <span className="text-slate-400 text-sm font-medium">/ programme</span>
                                </div>
                                <div className="mt-2 text-xs font-bold text-ikonga-pink/60 uppercase tracking-tighter">
                                    Soit env. {prog.priceFcfa} FCFA
                                </div>
                            </div>

                            <p className="text-slate-500 text-sm leading-relaxed mb-8">
                                {prog.desc}
                            </p>

                            <div className="space-y-4 mb-10 flex-grow">
                                {prog.features.map((feat) => (
                                    <div key={feat} className="flex gap-3 items-start group/feat">
                                        <div className={`mt-1 rounded-full p-0.5 ${prog.popular ? 'bg-ikonga-pink/10 text-ikonga-pink' : 'bg-slate-50 text-slate-400'} group-hover/feat:scale-110 transition-transform`}>
                                            <Check size={12} strokeWidth={4} />
                                        </div>
                                        <span className="text-sm text-slate-600 font-medium leading-tight">{feat}</span>
                                    </div>
                                ))}
                            </div>

                            <Link
                                href="/dashboard"
                                className={`w-full py-4 rounded-2xl text-sm font-bold transition-all text-center flex items-center justify-center gap-2 ${prog.popular
                                        ? 'bg-ikonga-gradient text-white shadow-lg shadow-pink-500/20 hover:scale-[1.02] active:scale-[0.98]'
                                        : 'border-2 border-slate-100 text-slate-900 hover:border-ikonga-pink/20 hover:text-ikonga-pink active:scale-[0.98]'
                                    }`}
                            >
                                {prog.cta}
                            </Link>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-20 text-center">
                    <p className="text-sm text-slate-400 max-w-xl mx-auto">
                        Paiement sécurisé. Accès immédiat à l'application après confirmation.
                        Besoin d'aide ? <Link href="#" className="text-ikonga-pink font-bold border-b border-ikonga-pink/20">Contactez-nous</Link>
                    </p>
                </div>
            </div>
        </section>
    )
}
