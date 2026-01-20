
"use client"

import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog"
import { WeeklyView } from "./WeeklyView"
import { X } from "lucide-react"

interface WeekMenuModalProps {
    isOpen: boolean
    onClose: () => void
    weekData: any
    availableWeeks: number
    onWeekChange: (weekNum: number) => void
    onDayClick: (dayNum: number) => void
}

export function WeekMenuModal({
    isOpen,
    onClose,
    weekData,
    availableWeeks,
    onWeekChange,
    onDayClick
}: WeekMenuModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl p-0 border-none sm:rounded-[2rem] overflow-hidden bg-slate-50/50 h-[90vh] flex flex-col">
                <div className="px-6 py-4 bg-white border-b border-slate-100 flex items-center justify-between shadow-sm relative z-20">
                    <DialogTitle className="text-xl font-serif font-black text-slate-900">
                        {weekData ? `Semaine ${weekData.weekNumber}` : 'Chargement...'}
                    </DialogTitle>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                    >
                        <X size={16} className="text-slate-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                    <WeeklyView
                        weekData={weekData}
                        availableWeeks={availableWeeks}
                        onWeekChange={onWeekChange}
                        onDayClick={onDayClick}
                    />
                </div>
            </DialogContent>
        </Dialog>
    )
}
