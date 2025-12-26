"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

interface WelcomeStepProps {
    onNext: () => void
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center text-center space-y-8"
        >
            <div className="w-20 h-20 rounded-3xl bg-pink-50 flex items-center justify-center mb-4">
                <Sparkles className="text-ikonga-pink w-10 h-10 animate-pulse" />
            </div>

            <div className="space-y-4 max-w-lg">
                <h1 className="text-4xl md:text-5xl font-serif font-black text-slate-900 tracking-tighter uppercase leading-tight">
                    Bienvenue chez <span className="text-ikonga-pink">Ikonga</span>.
                </h1>
                <p className="text-slate-500 text-lg md:text-xl font-light leading-relaxed">
                    Ton voyage vers une meilleure santé commence ici. Prenons un moment pour configurer ton espace.
                </p>
            </div>

            <Button
                onClick={onNext}
                className="h-16 px-12 rounded-2xl bg-ikonga-gradient text-xl font-bold shadow-2xl shadow-pink-500/20 hover:scale-105 transition-all active:scale-95 group"
            >
                Commencer
                <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="ml-2"
                >
                    →
                </motion.span>
            </Button>

            <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 opacity-50 grayscale hover:grayscale-0 transition-all">
                {/* Visual anchors to enforce premium feel */}
                <div className="text-[10px] uppercase tracking-widest font-black text-slate-400">Expertise</div>
                <div className="text-[10px] uppercase tracking-widest font-black text-slate-400">Personnalisation</div>
                <div className="text-[10px] uppercase tracking-widest font-black text-slate-400">Élégance</div>
                <div className="text-[10px] uppercase tracking-widest font-black text-slate-400">Résultats</div>
            </div>
        </motion.div>
    )
}
