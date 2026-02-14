
"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { ArrowRight, Utensils, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface DailyMenuModalProps {
    isOpen: boolean
    onClose: () => void
    dayData: any
}

export function DailyMenuModal({ isOpen, onClose, dayData }: DailyMenuModalProps) {
    if (!dayData) return null

    const menu = dayData.menu
    const dateLabel = format(new Date(dayData.date), "EEEE d MMMM", { locale: fr })

    // Helper to extract meal name safely
    const getMealName = (meal: any) => {
        if (!meal) return "Non défini"
        return typeof meal === 'object' ? meal.name : meal
    }

    // Helper to get meal object if available
    const getMealObject = (meal: any) => {
        return typeof meal === 'object' ? meal : null
    }

    const meals = [
        {
            id: 'breakfast',
            label: "Petit-déjeuner",
            icon: "🌅",
            bg: "bg-orange-50",
            border: "border-orange-100",
            data: menu?.breakfast
        },
        {
            id: 'lunch',
            label: "Déjeuner",
            icon: "☀️",
            bg: "bg-yellow-50",
            border: "border-yellow-100",
            data: menu?.lunch
        },
        {
            id: 'snack',
            label: "Collation",
            icon: "🍎",
            bg: "bg-pink-50",
            border: "border-pink-100",
            data: menu?.snack
        },
        {
            id: 'dinner',
            label: "Dîner",
            icon: "🌙",
            bg: "bg-indigo-50",
            border: "border-indigo-100",
            data: menu?.dinner
        }
    ]

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md p-0 border-none rounded-t-[2rem] sm:rounded-[2rem] overflow-hidden bg-white shadow-2xl max-h-[100dvh] sm:max-h-[95vh] flex flex-col gap-0 [&>button]:hidden">
                {/* Header */}
                <div className="bg-slate-900 px-4 sm:px-6 py-6 sm:py-8 relative overflow-hidden shrink-0">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full -mr-8 -mt-8" />

                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/20 transition-colors z-20"
                    >
                        <X size={16} />
                    </button>

                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-orange-500 text-white border-none px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-black uppercase tracking-widest">
                                JOUR {dayData.dayNumber}
                            </Badge>
                        </div>
                        <DialogTitle className="text-xl sm:text-2xl font-serif font-black text-white capitalize leading-none">
                            {format(new Date(dayData.date), "EEEE", { locale: fr })}
                        </DialogTitle>
                        <p className="text-slate-400 font-medium text-xs sm:text-sm mt-1 capitalize">
                            {format(new Date(dayData.date), "d MMMM yyyy", { locale: fr })}
                        </p>
                    </div>
                </div>

                <ScrollArea className="flex-1 min-h-0 px-4 sm:px-6 py-4 sm:py-6">
                    <div className="space-y-3 sm:space-y-4">
                        {meals.map((meal) => (
                            meal.data ? (
                                <div
                                    key={meal.id}
                                    className={cn(
                                        "group p-4 sm:p-5 rounded-2xl border transition-all duration-300",
                                        "hover:shadow-lg bg-white",
                                        meal.border
                                    )}
                                >
                                    <div className="flex items-start gap-3 sm:gap-4">
                                        <div className={cn(
                                            "w-10 h-10 rounded-xl flex items-center justify-center text-base sm:text-lg shadow-sm shrink-0",
                                            meal.bg
                                        )}>
                                            {meal.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <span className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                                                {meal.label}
                                            </span>
                                            <h4 className="text-slate-900 font-bold text-sm sm:text-base leading-snug line-clamp-2">
                                                {getMealName(meal.data)}
                                            </h4>

                                            {getMealObject(meal.data) && (getMealObject(meal.data).calories > 0) && (
                                                <div className="flex gap-2 mt-2">
                                                    <Badge variant="secondary" className="bg-slate-50 text-slate-500 font-bold text-[9px] sm:text-[10px] h-5 px-1.5">
                                                        {getMealObject(meal.data).calories} kcal
                                                    </Badge>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : null
                        ))}

                        {!menu && (
                            <div className="text-center py-10 text-slate-400 italic text-sm">
                                Menu en cours de préparation...
                            </div>
                        )}
                    </div>
                </ScrollArea>

                <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50 shrink-0">
                    <Button
                        onClick={onClose}
                        className="w-full h-11 sm:h-12 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-colors"
                    >
                        Fermer
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
