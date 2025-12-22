"use client"

import { motion } from "framer-motion"
import { Star, Quote } from "lucide-react"

const TESTIMONIALS = [
    { name: "Sophie D.", text: "J'ai perdu 4.5kg en Phase 1 sans jamais ressentir de fatigue. C'est magique.", role: "Detox terminée", color: "bg-emerald-50 text-emerald-600" },
    { name: "Marie L.", text: "La méthode m'a réconciliée avec mon corps. Les recettes sont délicieuses.", role: "Stabilisation", color: "bg-pink-50 text-ikonga-pink" },
    { name: "Julie P.", text: "Une clarté mentale incroyable dès la première semaine. Je revis !", role: "Consolidation", color: "bg-blue-50 text-blue-600" },
    { name: "Amélie K.", text: "L'application est tellement intuitive. Un vrai plaisir au quotidien.", role: "Nouvelle membre", color: "bg-orange-50 text-orange-600" },
    { name: "Inès B.", text: "Enfin un programme qui s'adapte à ma vie de maman débordée.", role: "Maman active", color: "bg-indigo-50 text-indigo-600" },
    { name: "Karine G.", text: "Le soutien de la communauté et le journal font toute la différence.", role: "Entretien", color: "bg-rose-50 text-rose-600" }
]

export function TestimonialsMarquee() {
    return (
        <section id="testimonials" className="py-32 bg-white overflow-hidden border-y border-slate-50">
            <div className="text-center mb-16 px-4">
                <motion.span
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400 mb-4 block"
                >
                    Elles rayonnent déjà
                </motion.span>
                <h2 className="text-3xl md:text-5xl font-serif text-slate-900">Leurs success stories</h2>
            </div>

            <div className="relative flex">
                {/* Fade overlays */}
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10" />
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />

                <motion.div
                    animate={{ x: [0, -1800] }}
                    transition={{
                        duration: 35,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="flex gap-8 pr-8 whitespace-nowrap"
                >
                    {[...TESTIMONIALS, ...TESTIMONIALS].map((t, idx) => (
                        <div
                            key={idx}
                            className="inline-block w-[420px] bg-[#fafafa] p-10 rounded-[2.5rem] border border-slate-100 hover:border-ikonga-pink/20 transition-colors group"
                        >
                            <div className="flex justify-between items-start mb-8">
                                <div className="flex gap-1 text-ikonga-pink">
                                    {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                                </div>
                                <Quote size={24} className="text-slate-200 group-hover:text-ikonga-pink/20 transition-colors" />
                            </div>

                            <p className="text-slate-700 font-medium mb-8 whitespace-normal leading-relaxed text-lg font-serif italic">
                                "{t.text}"
                            </p>

                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-2xl ${t.color} flex items-center justify-center font-black text-lg shadow-sm`}>
                                    {t.name[0]}
                                </div>
                                <div>
                                    <div className="font-bold text-slate-900 leading-none mb-1">{t.name}</div>
                                    <div className="text-[10px] font-black uppercase tracking-widest opacity-40">{t.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>

            <div className="mt-20 text-center">
                <button className="text-sm font-bold text-slate-900 border-b-2 border-ikonga-pink pb-1 hover:text-ikonga-pink hover:border-slate-900 transition-all">
                    Plus de témoignages
                </button>
            </div>
        </section>
    )
}
