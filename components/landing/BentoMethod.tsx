"use client"

import { motion } from "framer-motion"
import { ChefHat, Activity, Moon, Sparkles, ArrowUpRight } from "lucide-react"
import { NodeAnimation } from "./NodeAnimation"

const PILLARS = [
    {
        title: "Menus Gourmands",
        subtitle: "Nutrition Intuitive",
        desc: "Finies les privations. Apprenez à nourrir votre corps avec des recettes éclatantes qui soutiennent votre métabolisme.",
        icon: ChefHat,
        color: "from-pink-50 to-rose-50 text-ikonga-pink",
        label: "Pillar 01",
        span: "lg:col-span-2",
        iconBg: "bg-ikonga-pink/10",
        img: null
    },
    {
        title: "Sport Adapté",
        subtitle: "Ciblé & Court",
        desc: "20 minutes par jour pour sculpter et tonifier sans s'épuiser.",
        icon: Activity,
        color: "from-orange-50 to-amber-50 text-orange-600",
        label: "Pillar 02",
        span: "lg:col-span-1",
        iconBg: "bg-orange-600/10"
    },
    {
        title: "Bien-être Mental",
        subtitle: "Équilibre & Sérénité",
        desc: "Méditation et rituels de sérénité pour un esprit apaisé.",
        icon: Moon,
        color: "from-indigo-50 to-purple-50 text-indigo-600",
        label: "Pillar 03",
        span: "lg:col-span-1",
        iconBg: "bg-indigo-600/10"
    },
    {
        title: "Éclat & Soins",
        subtitle: "Beauté Holistique",
        desc: "Ressentez la différence de l'intérieur vers l'extérieur avec nos conseils skincare et routine éclat.",
        icon: Sparkles,
        color: "from-rose-50 to-pink-50 text-rose-500",
        label: "Pillar 04",
        span: "lg:col-span-2",
        iconBg: "bg-rose-500/10"
    }
]

export function BentoMethod() {
    return (
        <section id="method" className="py-32 bg-white px-4 relative overflow-hidden">
            <NodeAnimation />
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
                    <div className="space-y-4">
                        <motion.span
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="text-xs font-bold uppercase tracking-[0.3em] text-ikonga-pink"
                        >
                            La Méthode IKONGA
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-6xl font-serif text-slate-950"
                        >
                            Les 4 Piliers<br />
                            <span className="italic">du Quotidien.</span>
                        </motion.h2>
                    </div>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-slate-500 max-w-sm font-medium leading-relaxed"
                    >
                        Une approche holistique qui ne laisse rien au hasard pour
                        vous accompagner vers votre meilleure version.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {PILLARS.map((pillar, idx) => (
                        <motion.div
                            key={pillar.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, delay: idx * 0.1, ease: "easeOut" }}
                            className={`group relative ${pillar.span} bg-gradient-to-br ${pillar.color} rounded-[2.5rem] p-10 border border-transparent hover:border-white/50 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 overflow-hidden flex flex-col`}
                        >
                            <div className="flex justify-between items-start mb-8">
                                <div className={`w-14 h-14 ${pillar.iconBg} rounded-[1.2rem] flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                                    <pillar.icon size={28} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-30">{pillar.label}</span>
                            </div>

                            <div className="space-y-2 mb-4">
                                <h3 className="text-2xl md:text-3xl font-bold text-slate-950 tracking-tight">{pillar.title}</h3>
                                <p className="text-sm font-bold text-ikonga-pink/70 uppercase tracking-widest">{pillar.subtitle}</p>
                            </div>

                            <p className="text-slate-600/80 leading-relaxed max-w-xs font-sans">
                                {pillar.desc}
                            </p>

                            <div className="mt-auto pt-8 flex items-center gap-2 font-bold text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">
                                Découvrir <ArrowUpRight size={14} />
                            </div>

                            {/* Background decoration */}
                            <div className="absolute -bottom-10 -right-10 opacity-5 group-hover:opacity-10 transition-opacity rotate-12 group-hover:rotate-0 duration-700">
                                <pillar.icon size={250} />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
