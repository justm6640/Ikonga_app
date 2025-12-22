"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white px-4">
            {/* Background Abstract Element */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, 0],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] bg-pink-100/50 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, -5, 0],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] bg-slate-100/50 rounded-full blur-[100px]"
                />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wider text-ikonga-pink uppercase bg-pink-50 rounded-full">
                        L'art du bien-être
                    </span>
                    <h1 className="text-6xl md:text-8xl font-serif text-slate-900 leading-[1.1] mb-8 tracking-tight">
                        Révélez votre <br />
                        <span className="bg-ikonga-gradient bg-clip-text text-transparent italic">éclat intérieur</span>
                    </h1>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed"
                >
                    Une approche holistique et sur-mesure pour transformer votre quotidien.
                    Nutrition, fitness et sérénité, réunis dans une expérience unique.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                >
                    <button className="group relative bg-ikonga-gradient text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl shadow-pink-500/20 hover:scale-[1.05] transition-transform flex items-center gap-2 mx-auto">
                        Commencer l'expérience
                        <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2"
            >
                <div className="w-[1px] h-12 bg-slate-200 relative overflow-hidden">
                    <motion.div
                        animate={{ top: ["-100%", "100%"] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute w-full h-full bg-slate-400"
                    />
                </div>
            </motion.div>
        </section>
    )
}
