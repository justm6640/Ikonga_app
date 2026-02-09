"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { OnboardingSlides } from "./OnboardingSlides"
import { skipOnboarding } from "@/lib/actions/onboarding"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

export function OnboardingClient() {
    const [isCompleting, setIsCompleting] = useState(false)
    const router = useRouter()

    const handleStartJourney = async () => {
        setIsCompleting(true)
        try {
            const result = await skipOnboarding()
            if (result.success) {
                router.push("/dashboard")
            } else {
                toast.error(result.error || "Une erreur est survenue")
                setIsCompleting(false)
            }
        } catch (error) {
            toast.error("Erreur de connexion")
            setIsCompleting(false)
        }
    }

    return (
        <div className="min-h-screen w-full bg-slate-50">
            <AnimatePresence mode="wait">
                <AnimatePresence mode="wait">
                    <motion.div
                        key="slides"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="fixed inset-0 z-50"
                    >
                        {isCompleting ? (
                            <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white">
                                <Loader2 className="h-12 w-12 animate-spin text-ikonga-coral" />
                                <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">
                                    Initialisation de ton espace...
                                </p>
                            </div>
                        ) : (
                            <OnboardingSlides onComplete={handleStartJourney} mode="onboarding" />
                        )}
                    </motion.div>
                </AnimatePresence>
            </AnimatePresence>
        </div>
    )
}
