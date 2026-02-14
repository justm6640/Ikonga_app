"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { WeighInInput } from "./WeighInInput"

export function WeighInModal() {
    const [open, setOpen] = useState(false)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    className="w-14 h-14 sm:w-auto sm:h-14 rounded-full sm:rounded-2xl bg-ikonga-gradient shadow-lg shadow-pink-500/20 hover:opacity-90 transition-all active:scale-[0.98] font-bold text-white p-0 sm:px-8"
                >
                    <Plus className="h-6 w-6 sm:mr-2 sm:h-5 sm:w-5" />
                    <span className="hidden sm:inline text-lg">Ajouter une pesée</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md rounded-[2.5rem] p-0 overflow-hidden border-none bg-white/95 backdrop-blur-xl transition-all duration-300">
                <DialogHeader className="pt-8 px-8 flex flex-col items-center">
                    <DialogTitle className="text-2xl font-serif text-slate-900">
                        Nouvelle Pesée
                    </DialogTitle>
                    <p className="text-sm text-slate-500 font-light mt-1 text-center">
                        Enregistrez votre progression du jour
                    </p>
                </DialogHeader>
                <div className="px-8 pb-10">
                    <WeighInInput onSuccess={() => setOpen(false)} />
                </div>
            </DialogContent>
        </Dialog>
    )
}
