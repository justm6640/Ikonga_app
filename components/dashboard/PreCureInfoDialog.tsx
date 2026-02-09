"use client"

import { useEffect, useState } from "react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Lock, Sparkles, CheckCircle2 } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface PreCureInfoDialogProps {
    isBeforeCureStart: boolean
    planStartDate: Date | null
    userId: string
}

export function PreCureInfoDialog({ isBeforeCureStart, planStartDate, userId }: PreCureInfoDialogProps) {
    const [showDialog, setShowDialog] = useState(false)

    useEffect(() => {
        // Clé localStorage unique par utilisateur
        const storageKey = `preCureInfo_dismissed_${userId}`
        const isDismissed = localStorage.getItem(storageKey)

        // Afficher le dialog si conditions remplies et pas déjà fermé
        if (isBeforeCureStart && planStartDate && !isDismissed) {
            setShowDialog(true)
        }
    }, [isBeforeCureStart, planStartDate, userId])

    const handleDismiss = () => {
        const storageKey = `preCureInfo_dismissed_${userId}`
        localStorage.setItem(storageKey, "true")
        setShowDialog(false)
    }

    if (!planStartDate) return null

    const formattedDate = format(new Date(planStartDate), "d MMMM yyyy", { locale: fr })

    return (
        <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
            <AlertDialogContent className="max-w-md border-2 border-white/20 bg-white/80 backdrop-blur-xl shadow-2xl">
                <AlertDialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 rounded-2xl bg-gradient-to-br from-ikonga-coral to-ikonga-orange">
                            <Lock className="text-white" size={24} />
                        </div>
                        <AlertDialogTitle className="text-2xl font-serif text-slate-900">
                            Sections en Préparation
                        </AlertDialogTitle>
                    </div>
                    <AlertDialogDescription className="text-base text-slate-700 space-y-4 pt-4">
                        <p className="leading-relaxed">
                            Tes sections <strong className="text-ikonga-coral">IKONGA</strong> (Nutrition, Fitness, Beauté, Wellness)
                            seront déverrouillées le{" "}
                            <strong className="text-transparent bg-clip-text bg-ikonga-gradient">
                                {formattedDate}
                            </strong>.
                        </p>

                        <div className="space-y-3 bg-slate-50 p-4 rounded-xl">
                            <p className="font-medium text-slate-900 flex items-center gap-2">
                                <Sparkles size={18} className="text-ikonga-coral" />
                                En attendant, tu peux :
                            </p>
                            <ul className="space-y-2 ml-2">
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 size={18} className="text-ikonga-coral mt-0.5 flex-shrink-0" />
                                    <span>Remplir ton analyse personnalisée</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 size={18} className="text-ikonga-coral mt-0.5 flex-shrink-0" />
                                    <span>Consulter ton tableau de bord</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 size={18} className="text-ikonga-coral mt-0.5 flex-shrink-0" />
                                    <span>Te familiariser avec l'interface</span>
                                </li>
                            </ul>
                        </div>

                        <p className="text-center text-ikonga-coral font-medium pt-2">
                            À très bientôt pour démarrer ton parcours ! 🌸
                        </p>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction
                        onClick={handleDismiss}
                        className="w-full bg-ikonga-gradient hover:opacity-90 text-white font-medium"
                    >
                        J'ai compris ✨
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
