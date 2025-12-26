"use client"

import { useState } from "react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface WeightLog {
    id: string
    date: Date
    weight: number
}

interface WeightHistoryListProps {
    logs: WeightLog[]
}

export function WeightHistoryList({ logs }: WeightHistoryListProps) {
    const [showMore, setShowMore] = useState(false)

    // Default show 10, max 20
    const displayCount = showMore ? 20 : 10
    const visibleLogs = logs.slice(0, displayCount)
    const hasMoreThanDefault = logs.length > 10

    if (logs.length === 0) {
        return (
            <div className="space-y-8">
                <div className="flex items-center justify-between px-2">
                    <h3 className="text-2xl font-serif text-slate-900 tracking-tight">Historique récent</h3>
                </div>
                <p className="text-center text-slate-400 py-12 bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-100">
                    Aucune pesée enregistrée pour le moment.
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between px-2">
                <h3 className="text-2xl font-serif text-slate-900 tracking-tight">Historique récent</h3>
                <span className="text-sm font-medium text-slate-400">
                    Affichage de {visibleLogs.length} sur {logs.length} pesées
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {visibleLogs.map((log) => (
                    <Card key={log.id} className="group overflow-hidden rounded-[2rem] border-none shadow-premium bg-white/50 backdrop-blur-sm hover:bg-white transition-all hover:-translate-y-1 duration-300">
                        <div className="p-6 flex justify-between items-center">
                            <div className="flex flex-col">
                                <span className="font-serif text-lg text-slate-900 capitalize">
                                    {format(new Date(log.date), "EEEE d MMMM", { locale: fr })}
                                </span>
                                <span className="text-sm text-slate-400 font-light">
                                    Enregistré à {format(new Date(log.date), "HH:mm")}
                                </span>
                            </div>
                            <div className="flex flex-col items-end">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-ikonga-gradient">
                                        {log.weight}
                                    </span>
                                    <span className="text-sm font-medium text-slate-400">kg</span>
                                </div>
                                <div className="h-1.5 w-8 rounded-full bg-slate-100 mt-2 block sm:hidden md:block" />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {hasMoreThanDefault && (
                <div className="flex justify-center pt-4">
                    <Button
                        variant="ghost"
                        onClick={() => setShowMore(!showMore)}
                        className="rounded-2xl px-8 py-6 text-slate-600 hover:text-ikonga-pink hover:bg-pink-50 transition-all font-bold gap-2"
                    >
                        {showMore ? (
                            <>
                                Voir moins <ChevronUp size={16} />
                            </>
                        ) : (
                            <>
                                Voir plus <ChevronDown size={16} />
                            </>
                        )}
                    </Button>
                </div>
            )}
        </div>
    )
}
