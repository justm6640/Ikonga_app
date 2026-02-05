"use client"

import { Button } from "@/components/ui/button"
import { Sparkles, Heart, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

interface WelcomeScreenProps {
    onContinue: () => void
    welcomeMessage?: string
}

export function WelcomeScreen({ onContinue, welcomeMessage }: WelcomeScreenProps) {
    const defaultMessage = `Bienvenue chez IKONGA. 🌸
    
    Je vais t’accompagner pas à pas dans ce parcours de transformation.
    
    Tu n’as rien à réussir aujourd’hui, juste à commencer.
    Sache que ton abonnement définit notre durée ensemble, tandis que les phases (Détox, Équilibre, Consolidation, Entretien) organisent ton évolution.

    Je suis là pour toi.`

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-amber-50/30 to-slate-50 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-2xl w-full space-y-8"
            >
                {/* Logo / Brand */}
                <div className="text-center space-y-4">
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 shadow-2xl shadow-amber-200"
                    >
                        <Sparkles size={40} className="text-white" />
                    </motion.div>
                    <h1 className="text-5xl font-serif font-black text-slate-900 tracking-tight">
                        IKONGA
                    </h1>
                    <p className="text-lg text-slate-600 font-medium">
                        Ton parcours de transformation commence ici
                    </p>
                </div>

                {/* Coach Message */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-3xl p-8 shadow-lg shadow-slate-200/50 border border-slate-100"
                >
                    <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center shadow-md">
                            <Heart size={24} className="text-white fill-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-widest">
                                Message de bienvenue
                            </h3>
                            <p className="text-xs text-slate-500 mt-1">De ton coach IKONGA</p>
                        </div>
                    </div>
                    <p className="text-slate-700 leading-relaxed whitespace-pre-line italic">
                        "{welcomeMessage || defaultMessage}"
                    </p>
                </motion.div>

                {/* Key Points */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                    {[
                        { icon: "🌸", text: "Bienveillant" },
                        { icon: "🎯", text: "Personnalisé" },
                        { icon: "💪", text: "Accompagné" }
                    ].map((item, idx) => (
                        <div
                            key={idx}
                            className="bg-slate-50 rounded-2xl p-4 text-center border border-slate-100"
                        >
                            <span className="text-3xl block mb-2">{item.icon}</span>
                            <span className="text-sm font-bold text-slate-700">{item.text}</span>
                        </div>
                    ))}
                </motion.div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-center space-y-4"
                >
                    <Button
                        onClick={onContinue}
                        size="default"
                        className="px-12 py-7 rounded-full bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white font-bold text-lg shadow-xl shadow-slate-300 transition-all hover:scale-105 group h-auto"
                    >
                        Commencer mon parcours
                        <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <p className="text-xs text-slate-400 font-medium">
                        ✨ Pas de pression, tu avances à ton rythme
                    </p>
                </motion.div>
            </motion.div>
        </div>
    )
}
