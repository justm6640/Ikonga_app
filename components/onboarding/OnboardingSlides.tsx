"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface OnboardingSlidesProps {
    onComplete: () => void
}

import { calculateIMC, calculatePISI } from "@/lib/engines/calculators"

const SLIDES = [
    {
        title: "Bienvenue sur IKONGA",
        description: "La santé et le bien-être retrouvés, en harmonie avec les repas traditionnels de chez toi, du fitness et un nouveau mode de vie sain.",
        image: "/images/onboarding/slide-1.jpg",
        gradient: "from-slate-900/80 via-slate-800/70 to-transparent"
    },
    {
        title: "Nutrition & Sport réunis",
        description: "Des repas variés et savoureux, des entraînements adaptés, et une méthode complète pour perdre du poids sans te priver.",
        image: "/images/onboarding/slide-2.png",
        gradient: "from-emerald-900/70 via-emerald-800/60 to-transparent"
    },
    {
        title: "Prête pour ta transformation ?",
        description: "Ton nouveau mode de vie commence maintenant. Pas de régimes miracles, mais une transformation en profondeur.",
        image: "/images/onboarding/slide-7.png",
        gradient: "from-slate-900/80 via-slate-800/70 to-transparent"
    }
]

export function OnboardingSlides({ onComplete }: OnboardingSlidesProps) {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [direction, setDirection] = useState(0)

    const handleNext = () => {
        if (currentSlide === SLIDES.length - 1) {
            onComplete()
        } else {
            setDirection(1)
            setCurrentSlide(prev => prev + 1)
        }
    }

    const handlePrev = () => {
        if (currentSlide > 0) {
            setDirection(-1)
            setCurrentSlide(prev => prev - 1)
        }
    }

    const handleSkip = () => {
        onComplete()
    }

    const slide = SLIDES[currentSlide]
    const isLastSlide = currentSlide === SLIDES.length - 1

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        })
    }

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-black">
            <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                    key={currentSlide}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 }
                    }}
                    className="absolute inset-0"
                >
                    {/* Background Image */}
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: `url(${slide.image})`,
                            filter: "brightness(0.7)"
                        }}
                    />

                    {/* Gradient Overlay */}
                    <div className={cn(
                        "absolute inset-0 bg-gradient-to-t",
                        slide.gradient
                    )} />

                    {/* Content */}
                    <div className="relative z-10 flex flex-col h-full justify-between p-6 md:p-12">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                            {/* Badge */}
                            <div className="px-4 py-2 rounded-full bg-gradient-to-r from-orange-500 via-pink-500 to-pink-600 shadow-lg">
                                <span className="text-white text-xs font-bold uppercase tracking-wider">
                                    IKONGA APP
                                </span>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1 flex flex-col justify-center min-h-0 py-4 md:py-8 space-y-4 md:space-y-6 max-w-2xl">
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-3xl sm:text-4xl md:text-6xl font-serif font-black text-white leading-[1.1] md:leading-tight"
                            >
                                {slide.title}
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-sm sm:text-base md:text-xl text-white/90 leading-relaxed max-w-xl"
                            >
                                {slide.description}
                            </motion.p>

                            {isLastSlide && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="pt-6 grid grid-cols-2 gap-4"
                                >
                                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-3xl">
                                        <p className="text-white/60 text-xs uppercase tracking-widest font-bold mb-1">Analyse</p>
                                        <p className="text-white font-serif italic text-lg">"Prête pour le changement"</p>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-3xl">
                                        <p className="text-white/60 text-xs uppercase tracking-widest font-bold mb-1">Status</p>
                                        <p className="text-white font-serif italic text-lg">Éligible DÉTOX</p>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Bottom Section */}
                        <div className="space-y-6 pb-2 md:pb-0 mb-safe">
                            {/* Progress Indicators */}
                            <div className="flex items-center justify-center gap-2">
                                {SLIDES.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            setDirection(idx > currentSlide ? 1 : -1)
                                            setCurrentSlide(idx)
                                        }}
                                        className={cn(
                                            "h-1.5 md:h-2 rounded-full transition-all",
                                            idx === currentSlide
                                                ? "w-6 md:w-8 bg-gradient-to-r from-orange-500 to-pink-500"
                                                : "w-1.5 md:w-2 bg-white/30 hover:bg-white/50"
                                        )}
                                    />
                                ))}
                            </div>

                            {/* Navigation Buttons */}
                            <div className="flex items-center gap-4">
                                {currentSlide > 0 && (
                                    <Button
                                        onClick={handlePrev}
                                        variant="ghost"
                                        size="icon"
                                        className="rounded-full w-12 h-12 md:w-14 md:h-14 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white shrink-0"
                                    >
                                        <ChevronLeft size={24} />
                                    </Button>
                                )}

                                <Button
                                    onClick={handleNext}
                                    className="flex-1 h-12 md:h-14 rounded-full bg-gradient-to-r from-orange-500 via-pink-500 to-pink-600 hover:from-orange-600 hover:via-pink-600 hover:to-pink-700 text-white font-bold text-sm md:text-base shadow-2xl shadow-pink-500/50 transition-all hover:scale-105 active:scale-95"
                                >
                                    {isLastSlide ? "Commencer l'aventure" : "Suivant"}
                                </Button>
                            </div>

                            {/* Removed Skip Link */}
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    )
}
