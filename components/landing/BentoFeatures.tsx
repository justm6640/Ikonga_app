"use client"

import { motion } from "framer-motion"
import { Utensils, Dumbbell, Heart, Sparkles } from "lucide-react"

const FEATURES = [
    {
        title: "Nutrition",
        desc: "Des menus personnalisés et gourmands adaptés à votre métabolisme.",
        icon: Utensils,
        color: "bg-pink-100 text-ikonga-coral",
        span: "col-span-1 md:col-span-2",
        img: null // Placeholder for potential image decoration
    },
    {
        title: "Fitness",
        desc: "Des séances ciblées pour sculpter votre corps à votre rythme.",
        icon: Dumbbell,
        color: "bg-orange-100 text-pillar-fitness",
        span: "col-span-1",
    },
    {
        title: "Wellness",
        desc: "Méditation et rituels pour un esprit serein chaque jour.",
        icon: Heart,
        color: "bg-blue-100 text-pillar-wellness",
        span: "col-span-1",
    },
    {
        title: "Beauté",
        desc: "Conseils et rituels naturels pour rayonner de l'extérieur.",
        icon: Sparkles,
        color: "bg-emerald-100 text-emerald-600",
        span: "col-span-1 md:col-span-2",
    }
]

export function BentoFeatures() {
    return (
        <section className="py-24 bg-slate-50/50 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-serif text-slate-900 mb-4"
                    >
                        Nos Piliers de Transformation
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-500 font-medium"
                    >
                        Une synergie complète pour des résultats durables.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {FEATURES.map((feature, idx) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, delay: idx * 0.1, ease: "easeOut" }}
                            className={`${feature.span} group relative bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 overflow-hidden hover:scale-[1.02] transition-transform cursor-pointer`}
                        >
                            <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                                <feature.icon size={28} />
                            </div>

                            <h3 className="text-2xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                            <p className="text-slate-500 leading-relaxed">
                                {feature.desc}
                            </p>

                            <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity">
                                <feature.icon size={120} />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
