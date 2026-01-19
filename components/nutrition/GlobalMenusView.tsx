"use client"

import { useState, useTransition } from "react"
import { saveCustomMenu } from "@/lib/actions/nutrition"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { toast } from "sonner"
import { Loader2, CalendarIcon, Check, Copy } from "lucide-react"
import { cn } from "@/lib/utils"

interface GlobalMenusViewProps {
    menus: any[]
    currentPhase: string
}

export function GlobalMenusView({ menus, currentPhase }: GlobalMenusViewProps) {
    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-3xl border border-indigo-100">
                <h2 className="text-xl font-serif font-black text-indigo-900 uppercase tracking-tighter">
                    Bibliothèque de Menus
                </h2>
                <p className="text-indigo-700 text-sm mt-2">
                    Retrouvez ici des menus types créés pour la phase <span className="font-bold">{currentPhase}</span>.
                    Vous pouvez les appliquer à la date de votre choix.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {menus.filter(m => m.phaseCompat.includes(currentPhase)).map((menu) => (
                    <MenuTemplateCard key={menu.id} menu={menu} />
                ))}

                {menus.filter(m => m.phaseCompat.includes(currentPhase)).length === 0 && (
                    <div className="col-span-full py-12 text-center text-slate-400 italic">
                        Aucun modèle disponible pour la phase {currentPhase}.
                    </div>
                )}
            </div>
        </div>
    )
}

function MenuTemplateCard({ menu }: { menu: any }) {
    const [date, setDate] = useState<Date | undefined>(new Date())
    const [isOpen, setIsOpen] = useState(false)
    const [isPending, startTransition] = useTransition()

    const handleApply = () => {
        if (!date) return toast.error("Date requise")

        startTransition(async () => {
            // We use saveCustomMenu which saves to UserCustomMenu (overriding existing)
            try {
                await saveCustomMenu(date, {
                    breakfast: menu.content.breakfast,
                    snack: menu.content.snack,
                    lunch: menu.content.lunch,
                    dinner: menu.content.dinner,
                    snack_afternoon: menu.content.snack_afternoon || "" // Handle optional
                })
                toast.success("Menu appliqué avec succès")
                setIsOpen(false)
            } catch (e) {
                toast.error("Erreur lors de l'application")
            }
        })
    }

    return (
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
                <h3 className="font-bold text-slate-900 line-clamp-2 text-sm uppercase tracking-wide">
                    {menu.title}
                </h3>
                <span className="bg-indigo-50 text-indigo-600 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                    TYPE
                </span>
            </div>

            <div className="space-y-2 flex-1 border-l-2 border-slate-100 pl-3">
                <div className="text-xs">
                    <span className="font-bold text-slate-400 block text-[9px] uppercase tracking-wider">Petit-Déjeuner</span>
                    <span className="text-slate-600 line-clamp-1">{menu.content.breakfast}</span>
                </div>
                <div className="text-xs">
                    <span className="font-bold text-slate-400 block text-[9px] uppercase tracking-wider">Déjeuner</span>
                    <span className="text-slate-600 line-clamp-1">{menu.content.lunch}</span>
                </div>
                <div className="text-xs">
                    <span className="font-bold text-slate-400 block text-[9px] uppercase tracking-wider">Dîner</span>
                    <span className="text-slate-600 line-clamp-1">{menu.content.dinner}</span>
                </div>
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" className="w-full rounded-xl border-indigo-100 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 font-bold text-xs uppercase">
                        <Copy size={14} className="mr-2" />
                        Utiliser ce menu
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Appliquer le menu</DialogTitle>
                        <DialogDescription>
                            Choisissez la date à laquelle vous souhaitez appliquer le menu "{menu.title}".
                            Cela remplacera le menu existant pour ce jour.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Date d'application</label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal rounded-xl h-11",
                                            !date && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {date ? format(date, "PPP", { locale: fr }) : <span>Choisir une date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <Button
                            onClick={handleApply}
                            disabled={isPending}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl h-11"
                        >
                            {isPending ? <Loader2 className="animate-spin" /> : "Valider et Appliquer"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
