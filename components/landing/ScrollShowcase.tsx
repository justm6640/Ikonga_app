"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { Smartphone, CheckCircle2 } from "lucide-react"

const STEPS = [
    {
        title: "Suivi Intelligent",
        desc: "Mesurez vos progrès en temps réel avec des outils d'analyse avancés.",
        color: "from-pink-500 to-rose-500"
    },
    {
        title: "Recettes sur-mesure",
        desc: "Accédez à une bibliothèque culinaire adaptée à vos objectifs et préférences.",
        color: "from-orange-500 to-amber-500"
    },
    {
        title: "Journal Intime",
        desc: "Capturez vos émotions, vos réussites et votre évolution au quotidien.",
        color: "from-indigo-500 to-purple-500"
    }
]

export function ScrollShowcase() {
    const containerRef = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    })

    const phoneY = useTransform(scrollYProgress, [0, 1], ["0%", "0%"]) // Stay centered
    const phoneRotate = useTransform(scrollYProgress, [0, 0.5, 1], [0, -5, 0])

    return (
        <section ref={containerRef} className="relative min-h-[300vh] bg-white">
            <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
                <div className="max-w-6xl mx-auto w-full px-4 flex flex-col md:flex-row items-center gap-20">

                    {/* Left side: Text mapping to scroll */}
                    <div className="flex-1 space-y-[60vh] py-[20vh]">
                        {STEPS.map((step, idx) => (
                            <motion.div
                                key={step.title}
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ margin: "-45% 0px -45% 0px" }}
                                transition={{ duration: 0.8 }}
                                className="space-y-6"
                            >
                                <div className={`w-12 h-12 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center text-white`}>
                                    <CheckCircle2 size={24} />
                                </div>
                                <h3 className="text-4xl font-bold text-slate-900">{step.title}</h3>
                                <p className="text-xl text-slate-500 leading-relaxed max-w-md">
                                    {step.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Right side: Sticky Mockup */}
                    <div className="flex-1 hidden md:flex justify-center relative">
                        <motion.div
                            style={{ rotate: phoneRotate }}
                            className="relative w-[300px] h-[600px] bg-slate-950 rounded-[3rem] border-[8px] border-slate-900 shadow-2xl p-4 overflow-hidden"
                        >
                            {/* Notch */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl z-20" />

                            {/* App Content Placeholder */}
                            <div className="relative h-full w-full bg-slate-50 rounded-[2.2rem] overflow-hidden flex flex-col">
                                <div className="h-12 bg-ikonga-gradient w-full" />
                                <div className="p-6 space-y-4">
                                    <div className="h-32 bg-slate-200 rounded-2xl animate-pulse" />
                                    <div className="space-y-2">
                                        <div className="h-4 bg-slate-200 rounded-full w-3/4 animate-pulse" />
                                        <div className="h-4 bg-slate-100 rounded-full w-1/2 animate-pulse" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 mt-8">
                                        <div className="h-20 bg-pink-50 rounded-xl" />
                                        <div className="h-20 bg-orange-50 rounded-xl" />
                                        <div className="h-20 bg-blue-50 rounded-xl" />
                                        <div className="h-20 bg-emerald-50 rounded-xl" />
                                    </div>
                                </div>
                                <div className="mt-auto p-4 border-t border-slate-100 flex justify-between">
                                    <div className="w-8 h-8 rounded-full bg-slate-200" />
                                    <div className="w-8 h-8 rounded-full bg-slate-200" />
                                    <div className="w-8 h-8 rounded-full bg-slate-200" />
                                </div>
                            </div>
                        </motion.div>

                        {/* Blurred Backglow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-ikonga-gradient opacity-20 blur-[100px] -z-10" />
                    </div>
                </div>
            </div>
        </section>
    )
}
