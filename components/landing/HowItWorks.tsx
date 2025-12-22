"use client"

import { motion, useScroll, useSpring } from "framer-motion"
import { useRef } from "react"
import { Leaf, Scale, Anchor, ShieldCheck, Sparkles } from "lucide-react"

const PHASES = [
    {
        id: "01",
        name: "Détox",
        title: "Relancer le métabolisme",
        desc: "Purifier l'organisme en profondeur et stabiliser la glycémie pour retrouver une énergie débordante dès les premiers jours.",
        icon: Leaf,
        color: "text-emerald-500",
        bg: "bg-emerald-50",
        accent: "border-emerald-200",
        glow: "shadow-[0_0_50px_-12px_rgba(16,185,129,0.3)]"
    },
    {
        id: "02",
        name: "Équilibre",
        title: "Apprendre sans interdits",
        desc: "Réintroduire les plaisirs avec stratégie. Votre corps apprend à utiliser l'énergie sans stocker. Le moment où tout devient simple.",
        icon: Scale,
        color: "text-orange-500",
        bg: "bg-orange-50",
        accent: "border-orange-200",
        glow: "shadow-[0_0_50px_-12px_rgba(249,115,22,0.3)]"
    },
    {
        id: "03",
        name: "Stabilisation",
        title: "Ancrer les habitudes",
        desc: "Sécuriser vos résultats et ancrer vos nouveaux réflexes. Vous apprenez à gérer les imprévus tout en restant rayonnante.",
        icon: Anchor,
        color: "text-blue-500",
        bg: "bg-blue-50",
        accent: "border-blue-200",
        glow: "shadow-[0_0_50px_-12px_rgba(59,130,246,0.3)]"
    },
    {
        id: "04",
        name: "Consolidation",
        title: "L'autonomie totale",
        desc: "La méthode devient votre seconde nature. Vous vivez votre transformation avec confiance et sérénité, pour toujours.",
        icon: ShieldCheck,
        color: "text-rose-500",
        bg: "bg-rose-50",
        accent: "border-rose-200",
        glow: "shadow-[0_0_50px_-12px_rgba(244,63,94,0.3)]"
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
                        <Sparkles size={14} /> Le Parcours en 4 Phases
                    </motion.div>
                    <h2 className="text-4xl md:text-6xl font-serif text-slate-950 mb-6">Comment ça marche ?</h2>
                    <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
                        Un voyage progressif vers votre transformation durable,
                        structuré pour respecter votre rythme et votre corps.
                    </p>
                </div>

                {/* Progress Line */}
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-200 -translate-x-1/2 hidden md:block" />
                <motion.div
                    style={{ scaleY }}
                    className="absolute left-1/2 top-0 bottom-0 w-px bg-ikonga-gradient -translate-x-1/2 origin-top hidden md:block"
                />

                <div className="relative space-y-24 md:space-y-0">
                    {PHASES.map((phase, idx) => (
                        <div key={phase.id} className={`relative flex flex-col md:flex-row items-center gap-12 md:py-24 ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                            {/* Desktop Bubble Anchor */}
                            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center">
                                <motion.div
                                    whileInView={{
                                        scale: [0, 1.2, 1],
                                        backgroundColor: idx % 2 === 0 ? "#f43f5e" : "#0f172a"
                                    }}
                                    viewport={{ amount: 0.8 }}
                                    className="w-6 h-6 rounded-full border-4 border-white shadow-lg"
                                />
                            </div>

                            {/* Content Card with Glow */}
                            <motion.div
                                initial={{ opacity: 0, x: idx % 2 === 0 ? 50 : -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="flex-1"
                            >
                                <motion.div
                                    whileInView={{
                                        scale: 1.02,
                                        backgroundColor: "rgba(255, 255, 255, 1)"
                                    }}
                                    viewport={{ amount: 0.6 }}
                                    className="relative z-10 bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 transition-all duration-700 hover:shadow-xl group overflow-hidden"
                                >
                                    {/* Active Glow Effect */}
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        viewport={{ amount: 0.8 }}
                                        className={`absolute inset-0 z-0 ${phase.glow} opacity-0 group-hover:opacity-100 transition-opacity`}
                                    />

                                    <div className="relative z-10 space-y-6 text-center md:text-left">
                                        <div className={`inline-flex items-center justify-center w-16 h-16 ${phase.bg} ${phase.color} rounded-[1.5rem] border ${phase.accent}`}>
                                            <phase.icon size={32} />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-center md:justify-start gap-4">
                                                <span className="text-xs font-black text-slate-300 tracking-tighter text-3xl italic">{phase.id}</span>
                                                <h3 className="text-3xl font-bold text-slate-950">{phase.name}</h3>
                                            </div>
                                            <p className="text-xl font-serif text-ikonga-pink tracking-tight italic">{phase.title}</p>
                                        </div>
                                        <p className="text-slate-500 leading-relaxed font-sans max-w-sm mx-auto md:mx-0">
                                            {phase.desc}
                                        </p>
                                    </div>
                                </motion.div>
                            </motion.div>

                            {/* Decorative Visual Placeholder */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="flex-1 relative aspect-square md:aspect-auto h-64 md:h-80 w-full flex items-center justify-center"
                            >
                                <div className={`absolute inset-0 ${phase.bg} rounded-full opacity-30 blur-[80px]`} />
                                <div className={`relative z-10 flex items-center justify-center text-9xl font-black ${phase.color} opacity-[0.03] select-none pointer-events-none`}>
                                    PHASE
                                </div>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                                    className={`absolute w-64 h-64 border-2 border-dashed ${phase.accent} rounded-full opacity-20`}
                                />
                                <phase.icon className={`absolute ${phase.color} opacity-10`} size={120} strokeWidth={1} />
                            </motion.div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
