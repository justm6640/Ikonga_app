"use client"

import { useEffect, useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Rocket, Clock, CalendarCheck } from "lucide-react"

interface PartialLockDialogProps {
    isBeforeCureStart: boolean
    planStartDate: Date | null
}

export function PartialLockDialog({ isBeforeCureStart, planStartDate }: PartialLockDialogProps) {
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        console.log("PartialLockDialog Debug:", { isBeforeCureStart, planStartDate })

        // Only show if:
        // 1. User is in the "Before Cure Start" period (J-48h to J-0)
        // 2. We haven't shown it in this session already (to avoid annoyance)
        if (isBeforeCureStart && planStartDate) {
            // const hasSeenPopup = sessionStorage.getItem("hasSeenPartialLockPopup")
            // if (!hasSeenPopup) {
            setIsOpen(true)
            // sessionStorage.setItem("hasSeenPartialLockPopup", "true")
            // }
        } else {
            console.log("PartialLockDialog: Conditions not met")
        }
    }, [isBeforeCureStart, planStartDate])

    if (!planStartDate) return null

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-md border-none bg-white/95 backdrop-blur-xl shadow-2xl">
                <DialogHeader className="space-y-4">
                    <div className="mx-auto bg-ikonga-gradient p-4 rounded-full w-fit shadow-lg shadow-ikonga-coral/20">
                        <Rocket className="w-8 h-8 text-white" />
                    </div>

                    <DialogTitle className="text-center text-2xl font-serif font-bold text-transparent bg-clip-text bg-ikonga-gradient">
                        Ta cure commence bientôt !
                    </DialogTitle>

                    <DialogDescription className="text-center space-y-4 pt-2">
                        <p className="text-slate-600 text-lg">
                            Tu es actuellement en phase de <strong>préparation</strong>.
                        </p>

                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-3 text-left">
                            <Clock className="w-5 h-5 text-ikonga-coral shrink-0" />
                            <span className="text-sm text-slate-600">
                                L'accès complet à tes menus, séances de sport et soins sera débloqué le :
                            </span>
                        </div>

                        <div className="flex items-center justify-center gap-2 text-xl font-bold text-slate-800 bg-white shadow-sm border border-slate-100 py-3 px-6 rounded-xl">
                            <CalendarCheck className="w-5 h-5 text-ikonga-coral" />
                            {format(new Date(planStartDate), "d MMMM yyyy", { locale: fr })}
                        </div>

                        <p className="text-slate-500 text-sm italic">
                            En attendant, profite de ce moment pour compléter ton profil et explorer ton tableau de bord.
                        </p>
                    </DialogDescription>
                </DialogHeader>

                <div className="flex justify-center pt-4">
                    <Button
                        onClick={() => setIsOpen(false)}
                        className="bg-ikonga-gradient hover:opacity-90 text-white px-8 rounded-full shadow-lg shadow-ikonga-coral/20 transition-all hover:scale-105"
                    >
                        C'est compris ! 🚀
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
