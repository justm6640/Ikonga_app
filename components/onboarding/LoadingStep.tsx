"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { Zap } from "lucide-react"

const LOADING_MESSAGES = [
    "Analyse de ton profil...",
    "Génération de ton menu de la semaine...",
    "Préparation de ta liste de courses...",
    "Optimisation de ton programme Rosey...",
    "Tout est prêt !"
]

export function LoadingStep() {
    const [messageIndex, setMessageIndex] = useState(0)
    const router = useRouter()

    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex((prev) => (prev < LOADING_MESSAGES.length - 1 ? prev + 1 : prev))
        }, 1800)

        const timeout = setTimeout(() => {
            router.push("/dashboard")
        }, LOADING_MESSAGES.length * 1800 + 500)

        return () => {
            clearInterval(interval)
            clearTimeout(timeout)
        }
    }, [router])

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center space-y-12 py-12"
        >
            <div className="relative">
                {/* Premium Pulse Animation */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.1, 0.3]
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -inset-8 bg-pink-200 rounded-full blur-3xl"
                />

                <div className="relative w-32 h-32 rounded-full border-b-4 border-ikonga-coral animate-spin">
                    <div className="absolute inset-2 rounded-full border-t-2 border-slate-100 flex items-center justify-center">
                        <Zap className="text-ikonga-coral w-10 h-10 fill-ikonga-coral/10" />
                    </div>
                </div>
            </div>

            <div className="text-center space-y-4 max-w-sm">
                <h2 className="text-2xl font-serif font-black text-slate-900 uppercase tracking-tighter animate-pulse">
                    Génération IA en cours
                </h2>

                <div className="h-8 flex items-center justify-center overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={messageIndex}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="text-slate-500 font-light text-lg italic"
                        >
                            {LOADING_MESSAGES[messageIndex]}
                        </motion.p>
                    </AnimatePresence>
                </div>
            </div>

            <div className="w-48 h-1 bg-slate-50 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: LOADING_MESSAGES.length * 1.8, ease: "linear" }}
                    className="h-full bg-ikonga-gradient"
                />
            </div>
        </motion.div>
    )
}
