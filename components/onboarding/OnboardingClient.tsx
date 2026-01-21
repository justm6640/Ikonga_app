"use client"

import { useState } from "react"
import { OnboardingSlides } from "./OnboardingSlides"
import { WelcomeScreen } from "./WelcomeScreen"
import { QuestionnaireWizard } from "@/components/questionnaire/QuestionnaireWizard"
import { motion, AnimatePresence } from "framer-motion"

export function OnboardingClient() {
    const [view, setView] = useState<"slides" | "welcome" | "questionnaire">("slides")

    return (
        <div className="min-h-screen w-full bg-slate-50">
            <AnimatePresence mode="wait">
                {view === "slides" && (
                    <motion.div
                        key="slides"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="fixed inset-0 z-50"
                    >
                        <OnboardingSlides onComplete={() => setView("welcome")} />
                    </motion.div>
                )}

                {view === "welcome" && (
                    <motion.div
                        key="welcome"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="min-h-screen"
                    >
                        <WelcomeScreen onContinue={() => setView("questionnaire")} />
                    </motion.div>
                )}

                {view === "questionnaire" && (
                    <motion.div
                        key="questionnaire"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="min-h-screen flex flex-col items-center pt-10 px-4"
                    >
                        <div className="w-full max-w-2xl mb-8 text-center">
                            <h1 className="text-4xl md:text-5xl font-serif font-black text-slate-900 tracking-tighter uppercase mb-4">
                                Bienvenue chez <span className="text-ikonga-pink">IKONGA</span>
                            </h1>
                            <p className="text-slate-500 text-lg md:text-xl font-light max-w-lg mx-auto leading-relaxed">
                                Quelques questions pour bâtir <span className="font-bold text-slate-800">ton programme idéal</span>.
                            </p>
                        </div>

                        <div className="w-full max-w-2xl bg-white/40 backdrop-blur-xl shadow-2xl shadow-slate-200/50 rounded-[3rem] border border-white p-6 md:p-10">
                            <QuestionnaireWizard />
                        </div>

                        <div className="mt-8 mb-12 text-slate-400 text-xs font-medium uppercase tracking-[0.2em]">
                            Piliers : Nutrition • Fitness • Wellness • Beauty
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
