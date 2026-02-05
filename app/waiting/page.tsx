"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Clock, Calendar, Sparkles } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function WaitingPage() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-md w-full space-y-8 z-10"
            >
                {/* Icon */}
                <div className="flex justify-center">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center relative">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 border-2 border-dashed border-primary/20 rounded-full"
                        />
                        <Clock className="w-10 h-10 text-primary" />
                    </div>
                </div>

                {/* Text Content */}
                <div className="space-y-4">
                    <h1 className="text-4xl font-bold tracking-tight text-foreground">
                        Bientôt <span className="text-primary italic">prête ?</span>
                    </h1>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                        Ton parcours IKONGA commence très bientôt. Prépare-toi doucement, le contenu sera débloqué 48h avant ton premier jour.
                    </p>
                </div>

                {/* Features/Info Cards */}
                <div className="grid grid-cols-1 gap-4 pt-4">
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-center gap-4 text-left"
                    >
                        <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-orange-500" />
                        </div>
                        <div>
                            <p className="font-medium text-foreground">Accès anticipation</p>
                            <p className="text-xs text-muted-foreground">Ton menu sera visible 48h avant le départ.</p>
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-center gap-4 text-left"
                    >
                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-purple-500" />
                        </div>
                        <div>
                            <p className="font-medium text-foreground">Préparation mentale</p>
                            <p className="text-xs text-muted-foreground">Une notification t'avertira dès l'ouverture.</p>
                        </div>
                    </motion.div>
                </div>

                {/* Action */}
                <div className="pt-8">
                    <Link href="/login">
                        <Button variant="outline" className="rounded-full px-8 py-6 h-auto text-lg border-primary/20 hover:bg-primary/5">
                            Retour à l'accueil
                        </Button>
                    </Link>
                </div>
            </motion.div>

            {/* Footer Brand */}
            <div className="absolute bottom-8 left-0 right-0 opacity-20 pointer-events-none">
                <span className="text-6xl font-black tracking-tighter uppercase select-none">IKONGA</span>
            </div>
        </div>
    )
}
