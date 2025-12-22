"use client"

import { motion, useScroll, useSpring } from "framer-motion"
import { useRef } from "react"
import { Leaf, Scale, Heart, Sparkles } from "lucide-react"

const PHASES = [
    {
        id: "01",
        name: "Détox",
        title: "Relancez votre énergie",
        desc: "14 jours pour nettoyer votre organisme, stabiliser votre glycémie et retrouver un sommeil réparateur. Pas de faim, juste de l'éclat.",
        icon: Leaf,
        color: "text-emerald-500",
        bg: "bg-emerald-50",
        accent: "border-emerald-200"
    },
    {
        id: "02",
        name: "Stabilisation",
        title: "Équilibrez vos acquis",
        desc: "On réintroduit les aliments avec stratégie. Votre corps apprend à utiliser l'énergie sans stocker. Le moment où tout devient simple.",
        icon: Scale,
        color: "text-orange-500",
        bg: "bg-orange-50",
        accent: "border-orange-200"
    },
    {
        id: "03",
        name: "Consolidation",
        title: "Vivez la liberté",
        desc: "La méthode devient votre mode de vie. Vous savez comment gérer chaque situation tout en restant rayonnante au quotidien.",
        icon: Heart,
        color: "text-rose-500",
        bg: "bg-rose-50",
        accent: "border-rose-200"
    }
]

export function HowItWorks() {
    const containerRef = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    })
    const scaleY = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    })

    return (
        <section id="how-it-works" ref={containerRef} className="py-32 bg-[#fafafa] px-4 overflow-hidden">
            <div className="max-w-5xl mx-auto relative">
                <div className="text-center mb-24 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 bg-pink-50 text-ikonga-pink px-4 py-2 rounded-full mb-6 font-bold text-xs uppercase tracking-widest"
                    >
                        <Sparkles size={14} /> Le Voyage
                    </motion.div>
                    <h2 className="text-4xl md:text-6xl font-serif text-slate-950 mb-6">Comment ça marche ?</h2>
                    <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
                        Un parcours progressif et bienveillant pour transformer votre corps
                        sans jamais vous sentir limitée.
                    </p>
                </div>

                {/* Progress Line */}
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-200 -translate-x-1/2 hidden md:block" />
                <motion.div
                    style={{ scaleY }}
                    className="absolute left-1/2 top-0 bottom-0 w-px bg-ikonga-gradient -translate-x-1/2 origin-top hidden md:block"
                />

                <div className="relative space-y-40 md:space-y-0">
                    {PHASES.map((phase, idx) => (
                        <div key={phase.id} className={`relative flex flex-col md:flex-row items-center gap-12 md:py-24 ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                            {/* Desktop Bubble Anchor */}
                            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center">
                                <motion.div
                                    whileInView={{ scale: [0, 1.2, 1] }}
                                    className={`w-6 h-6 rounded-full border-4 border-white shadow-lg shadow-black/5 ${idx % 2 === 0 ? 'bg-ikonga-pink' : 'bg-slate-900'}`}
                                />
                            </div>

                            {/* Content */}
                            <motion.div
                                initial={{ opacity: 0, x: idx % 2 === 0 ? 50 : -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="flex-1 space-y-6 text-center md:text-left"
                            >
                                <div className={`inline-flex items-center justify-center w-16 h-16 ${phase.bg} ${phase.color} rounded-[1.5rem] border ${phase.accent}`}>
                                    <phase.icon size={32} />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-center md:justify-start gap-4">
                                        <span className="text-xs font-black text-slate-300 tracking-tighter text-3xl">{phase.id}</span>
                                        <h3 className="text-3xl font-bold text-slate-950">{phase.name}</h3>
                                    </div>
                                    <p className="text-xl font-serif text-ikonga-pink tracking-tight italic">{phase.title}</p>
                                </div>
                                <p className="text-slate-500 leading-relaxed font-sans max-w-sm mx-auto md:mx-0">
                                    {phase.desc}
                                </p>
                            </motion.div>

                            {/* Placeholder for potential visual/image */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="flex-1 relative aspect-square md:aspect-auto h-64 md:h-80 w-full"
                            >
                                <div className={`w-full h-full ${phase.bg} rounded-[3rem] opacity-40 blur-3xl`} />
                                <div className={`absolute inset-0 flex items-center justify-center text-8xl font-black ${phase.color} opacity-5 select-none pointer-events-none`}>
                                    PHASE {phase.id}
                                </div>
                                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-dashed ${phase.accent} rounded-full opacity-20 animate-[spin_20s_linear_infinite]`} />
                            </motion.div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
