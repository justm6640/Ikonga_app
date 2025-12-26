"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, Loader2 } from "lucide-react"
import { format, nextMonday } from "date-fns"
import { fr } from "date-fns/locale"
import { setJourneyStartDate } from "@/lib/actions/onboarding"
import { toast } from "sonner"

interface DateSelectionStepProps {
    userId: string
    onNext: () => void
}

export function DateSelectionStep({ userId, onNext }: DateSelectionStepProps) {
    const [loading, setLoading] = useState<string | null>(null)

    // Logic for next monday
    const nextMon = nextMonday(new Date())
    const formattedNextMon = format(nextMon, "EEEE d MMMM", { locale: fr })

    const handleSelect = async (type: 'NOW' | 'MONDAY') => {
        setLoading(type)
        const date = type === 'NOW' ? 'NOW' : nextMon

        try {
            const res = await setJourneyStartDate(userId, date)
            if (res.success) {
                // We add a slight delay for better UX feel during transition
                setTimeout(() => {
                    onNext()
                }, 600)
            } else {
                toast.error(res.error || "Une erreur est survenue")
                setLoading(null)
            }
        } catch (error) {
            toast.error("Impossible de définir la date.")
            setLoading(null)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8 max-w-lg mx-auto"
        >
            <div className="text-center space-y-2">
                <h2 className="text-3xl md:text-4xl font-serif font-black text-slate-900 uppercase tracking-tighter leading-tight">
                    Quand souhaites-tu <br /> <span className="text-ikonga-pink underline decoration-pink-100 italic">débuter</span> ?
                </h2>
                <p className="text-slate-500 font-light text-lg">
                    Ton programme s'adaptera parfaitement à ton timing.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {/* Option 1: NOW */}
                <button
                    disabled={!!loading}
                    onClick={() => handleSelect('NOW')}
                    className={`group relative flex items-center gap-5 p-8 rounded-[2.5rem] bg-white border-2 transition-all text-left shadow-sm
                        ${loading === 'NOW' ? 'border-ikonga-pink ring-4 ring-pink-50' : 'border-slate-50 hover:border-ikonga-pink/30 hover:shadow-xl hover:shadow-pink-500/5'}
                    `}
                >
                    <div className="w-14 h-14 rounded-2xl bg-pink-50 flex items-center justify-center text-ikonga-pink group-hover:scale-110 transition-transform">
                        {loading === 'NOW' ? <Loader2 className="animate-spin" /> : <Calendar className="w-7 h-7" />}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <span className="text-xl font-bold text-slate-900">Tout de suite</span>
                        </div>
                        <p className="text-slate-400 font-light mt-1">
                            Je suis prêt(e), activez mon menu maintenant.
                        </p>
                    </div>
                    {loading === 'NOW' && (
                        <div className="absolute top-4 right-8">
                            <span className="text-[10px] text-ikonga-pink font-black uppercase tracking-widest animate-pulse">Activation...</span>
                        </div>
                    )}
                </button>

                {/* Option 2: NEXT MONDAY */}
                <button
                    disabled={!!loading}
                    onClick={() => handleSelect('MONDAY')}
                    className={`group relative flex items-center gap-5 p-8 rounded-[2.5rem] bg-white border-2 transition-all text-left shadow-sm
                        ${loading === 'MONDAY' ? 'border-ikonga-pink ring-4 ring-pink-50' : 'border-slate-50 hover:border-ikonga-pink/30 hover:shadow-xl hover:shadow-pink-500/5'}
                    `}
                >
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
                        {loading === 'MONDAY' ? <Loader2 className="animate-spin" /> : <Calendar className="w-7 h-7" />}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <span className="text-xl font-bold text-slate-900 capitalize leading-tight">
                                {formattedNextMon}
                            </span>
                        </div>
                        <p className="text-slate-400 font-light mt-1">
                            Je veux faire mes courses et me préparer sereinement.
                        </p>
                    </div>
                    {loading === 'MONDAY' && (
                        <div className="absolute top-4 right-8">
                            <span className="text-[10px] text-ikonga-pink font-black uppercase tracking-widest animate-pulse">Planification...</span>
                        </div>
                    )}
                </button>
            </div>

            <p className="text-center text-[10px] text-slate-300 uppercase tracking-widest font-black italic pt-4">
                * Tu pourras toujours modifier tes préférences dans ton profil.
            </p>
        </motion.div>
    )
}
