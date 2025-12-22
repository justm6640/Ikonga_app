"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"

const TESTIMONIALS = [
    { name: "Sophie", text: "Une transformation radicale, tant mentale que physique. Merci Ikonga !", role: "Post-Detox" },
    { name: "Léa", text: "Les recettes sont incroyables, je ne me suis jamais sentie aussi bien.", role: "Equilibre" },
    { name: "Mélanie", text: "Le journal intime m'a aidée à comprendre mes blocages.", role: "Consolidation" },
    { name: "Julie", text: "Un coaching bienveillant et structuré. Je recommande à 200%.", role: "Entretien" },
    { name: "Camille", text: "L'application est magnifique et tellement simple à utiliser.", role: "Nouveau membre" },
    { name: "Inès", text: "J'ai retrouvé mon énergie et ma vitalité grâce au fitness.", role: "Detox" }
]

export function TestimonialsMarquee() {
    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="text-center mb-16 px-4">
                <h2 className="text-3xl font-serif text-slate-900">Elles nous font confiance</h2>
            </div>

            <div className="flex">
                <motion.div
                    animate={{ x: [0, -1000] }}
                    transition={{
                        duration: 30,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="flex gap-6 pr-6 whitespace-nowrap"
                >
                    {[...TESTIMONIALS, ...TESTIMONIALS].map((t, idx) => (
                        <div
                            key={idx}
                            className="inline-block w-[350px] bg-slate-50 p-8 rounded-[2rem] border border-slate-100"
                        >
                            <div className="flex gap-1 mb-4 text-ikonga-pink">
                                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                            </div>
                            <p className="text-slate-700 font-medium mb-6 whitespace-normal italic">
                                "{t.text}"
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-ikonga-gradient flex items-center justify-center text-white font-bold text-xs">
                                    {t.name[0]}
                                </div>
                                <div>
                                    <div className="font-bold text-slate-900 text-sm">{t.name}</div>
                                    <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">{t.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
