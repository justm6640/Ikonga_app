import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Clock, Calendar, Sparkles, MessageCircleHeart } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from "date-fns"

export default function WaitingPage() {
    const [mounted, setMounted] = useState(false)
    const [timeLeft, setTimeLeft] = useState<{ days: number, hours: number, minutes: number, seconds: number } | null>(null)

    // Fallback date if user startDate is not available (for demo/protection)
    const targetDate = new Date()
    targetDate.setDate(targetDate.getDate() + 3)

    useEffect(() => {
        setMounted(true)
        const timer = setInterval(() => {
            const now = new Date()
            const diff = targetDate.getTime() - now.getTime()

            if (diff <= 0) {
                setTimeLeft(null)
                clearInterval(timer)
                return
            }

            setTimeLeft({
                days: differenceInDays(targetDate, now),
                hours: differenceInHours(targetDate, now) % 24,
                minutes: differenceInMinutes(targetDate, now) % 60,
                seconds: differenceInSeconds(targetDate, now) % 60
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    if (!mounted) return null

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
                </div>

                {/* Countdown */}
                <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
                    {[
                        { label: 'Jours', value: timeLeft?.days ?? 0 },
                        { label: 'Heures', value: timeLeft?.hours ?? 0 },
                        { label: 'Min', value: timeLeft?.minutes ?? 0 },
                        { label: 'Sec', value: timeLeft?.seconds ?? 0 },
                    ].map((item, i) => (
                        <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col items-center">
                            <span className="text-2xl font-black text-slate-900">{item.value.toString().padStart(2, '0')}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{item.label}</span>
                        </div>
                    ))}
                </div>

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
