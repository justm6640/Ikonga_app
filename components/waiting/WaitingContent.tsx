"use client"

import { motion } from "framer-motion"
import { Calendar, Sparkles, MessageCircleHeart } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { WaitingCountdown } from "./WaitingCountdown"

interface WaitingContentProps {
    unlockDate: Date
    userFirstName: string
}

export function WaitingContent({ unlockDate, userFirstName }: WaitingContentProps) {
    const router = useRouter()

    const handleCountdownComplete = () => {
        router.refresh() // This will trigger the server component to re-render and redirect if unlocked
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden font-sans">
            {/* Background luxury elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-ikonga-coral/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-ikonga-gold/5 rounded-full blur-[120px]" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="max-w-xl w-full space-y-10 z-10"
            >
                {/* Brand */}
                <div className="space-y-2">
                    <p className="text-xs font-bold tracking-[0.3em] text-ikonga-coral uppercase">Ikonga App</p>
                    <h1 className="text-5xl font-serif font-black text-slate-900 tracking-tight">
                        Patience <span className="text-ikonga-coral italic">&</span> Douceur
                    </h1>
                    <p className="text-slate-400 font-medium">Bon retour, {userFirstName} ✨</p>
                </div>

                {/* Countdown */}
                <WaitingCountdown
                    targetDate={new Date(unlockDate)}
                    onComplete={handleCountdownComplete}
                />

                {/* Coach Message section */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden text-left"
                >
                    <div className="absolute top-0 right-0 p-6 opacity-5">
                        <MessageCircleHeart size={120} className="text-ikonga-coral" />
                    </div>

                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center">
                            <Sparkles size={20} className="text-ikonga-gold" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Message de ton coach</p>
                            <p className="font-bold text-slate-900">Rosy – IKONGA</p>
                        </div>
                    </div>

                    <p className="text-slate-600 text-lg md:text-xl font-serif italic leading-relaxed">
                        "Bienvenue chez IKONGA. Je vais t’accompagner pas à pas. Prépare-toi doucement, le contenu sera débloqué 48h avant ton premier jour."
                    </p>
                </motion.div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 rounded-3xl bg-white/60 border border-white backdrop-blur-md flex items-center gap-4 text-left shadow-sm">
                        <div className="w-10 h-10 rounded-2xl bg-ikonga-coral/10 flex items-center justify-center shrink-0">
                            <Calendar className="w-5 h-5 text-ikonga-coral" />
                        </div>
                        <p className="text-sm font-medium text-slate-700 leading-snug">Accès anticipé à ton menu 48h avant le départ.</p>
                    </div>

                    <div className="p-5 rounded-3xl bg-white/60 border border-white backdrop-blur-md flex items-center gap-4 text-left shadow-sm">
                        <div className="w-10 h-10 rounded-2xl bg-ikonga-gold/10 flex items-center justify-center shrink-0">
                            <Sparkles className="w-5 h-5 text-ikonga-gold" />
                        </div>
                        <p className="text-sm font-medium text-slate-700 leading-snug">Tu recevras une notification dès l'ouverture.</p>
                    </div>
                </div>

                {/* Action */}
                <div className="pt-4">
                    <Link href="/login">
                        <Button variant="ghost" className="rounded-full px-8 text-slate-400 hover:text-slate-600 hover:bg-slate-100/50">
                            Se déconnecter
                        </Button>
                    </Link>
                </div>
            </motion.div>
        </div>
    )
}
