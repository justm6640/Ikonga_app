"use client"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface DuplicateConfirmationModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    date: Date;
    onReplace: () => void;
    onAdd: () => void;
}

export function DuplicateConfirmationModal({
    open,
    onOpenChange,
    date,
    onReplace,
    onAdd
}: DuplicateConfirmationModalProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="rounded-[2.5rem] bg-white/95 backdrop-blur-xl border-none shadow-2xl max-w-sm p-8">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-2xl font-black text-slate-900 text-center leading-tight">
                        Pesée déjà existante
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-center font-bold text-slate-500 pt-4 leading-relaxed">
                        Une pesée existe déjà pour le <span className="text-slate-900 font-black">{format(date, "d MMMM", { locale: fr })}</span>.
                        <br /><br />
                        Que souhaites-tu faire ?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-col gap-3 sm:gap-0 mt-8">
                    <AlertDialogAction
                        onClick={onReplace}
                        className="w-full rounded-2xl bg-slate-900 text-white hover:bg-slate-800 h-14 font-black transition-all active:scale-95"
                    >
                        🔄 Remplacer l'ancienne
                    </AlertDialogAction>
                    <AlertDialogAction
                        onClick={onAdd}
                        className="w-full rounded-2xl bg-white text-slate-900 border-2 border-slate-100 hover:bg-slate-50 h-14 font-black shadow-sm mt-3 transition-all active:scale-95"
                    >
                        ➕ Garder les deux
                    </AlertDialogAction>
                    <AlertDialogCancel
                        className="w-full rounded-2xl border-none text-slate-400 font-bold hover:text-slate-600 hover:bg-transparent mt-2 h-10"
                    >
                        Annuler
                    </AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
