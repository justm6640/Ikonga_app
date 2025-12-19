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
import { WeighInForm } from "./WeighInForm"

export function WeighInModal() {
    const [open, setOpen] = useState(false)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    className="w-full sm:w-auto h-14 px-8 text-lg rounded-2xl bg-ikonga-gradient shadow-lg shadow-pink-500/20 hover:opacity-90 transition-all active:scale-[0.98] font-bold"
                >
                    <Plus className="mr-2 h-5 w-5" />
                    Ajouter une pesée
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md rounded-[2.5rem] p-0 overflow-hidden border-none bg-white/95 backdrop-blur-xl">
                <DialogHeader className="pt-8 px-8 flex flex-col items-center">
                    <DialogTitle className="text-2xl font-serif text-slate-900">
                        Nouvelle Pesée
                    </DialogTitle>
                    <p className="text-sm text-slate-500 font-light mt-1 text-center">
                        Enregistrez votre progression du jour
                    </p>
                </DialogHeader>
                <div className="px-8 pb-10">
                    <WeighInForm onSuccess={() => setOpen(false)} />
                </div>
            </DialogContent>
        </Dialog>
    )
}
