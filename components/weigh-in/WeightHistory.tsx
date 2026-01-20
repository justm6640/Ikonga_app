"use client"

import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { ArrowDown, ArrowUp, Minus, Trash2, Edit2, Scale, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface WeightLog {
    id: string;
    date: Date | string;
    weight: number;
    variation?: number;
}

interface WeightHistoryProps {
    logs: WeightLog[];
    totalPages: number;
    currentPage: number;
    pageSize: number;
}

export function WeightHistory({ logs, totalPages, currentPage, pageSize }: WeightHistoryProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Navigation and Page Size handlers
    const updateParams = (page: number, limit: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", page.toString());
        params.set("limit", limit.toString());
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            updateParams(newPage, pageSize);
        }
    };

    const handleLimitChange = (value: string) => {
        updateParams(1, parseInt(value));
    };

    // Helper for variation display
    const getVariationDisplay = (variation?: number) => {
        if (variation === undefined || variation === null) return null;

        if (Math.abs(variation) <= 0.1) {
            return {
                icon: Minus,
                color: "text-slate-400",
                bg: "bg-slate-100",
                text: "Stable",
                message: "Continue comme ça ✨"
            }
        }

        if (variation < 0) {
            return {
                icon: ArrowDown,
                color: "text-emerald-500",
                bg: "bg-emerald-100",
                text: `${variation.toFixed(1)} kg`,
                message: "Bravo ! 🎉"
            }
        }

        return {
            icon: ArrowUp,
            color: "text-orange-500",
            bg: "bg-orange-100",
            text: `+${variation.toFixed(1)} kg`,
            message: "Rien de grave, on ajuste 💪"
        }
    }

    if (logs.length === 0 && currentPage === 1) {
        return (
            <div className="text-center py-12 bg-white/50 rounded-[2rem] border border-dashed border-slate-200">
                <p className="text-slate-400">Aucune pesée enregistrée pour le moment.</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-2">
                <h2 className="text-2xl font-serif text-slate-900 font-bold">Historique</h2>

                <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-slate-400">Afficher</span>
                    <Select value={pageSize.toString()} onValueChange={handleLimitChange}>
                        <SelectTrigger className="w-[80px] bg-white/70 border-slate-100 rounded-xl font-bold">
                            <SelectValue placeholder="20" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-100">
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                            <SelectItem value="30">30</SelectItem>
                        </SelectContent>
                    </Select>
                    <span className="text-sm font-bold text-slate-400">pesées</span>
                </div>
            </div>

            <div className="grid gap-4">
                {logs.map((log) => {
                    const info = getVariationDisplay(log.variation);
                    const Icon = info?.icon || Scale;

                    return (
                        <div
                            key={log.id}
                            className="group relative bg-white/70 backdrop-blur-sm rounded-[1.5rem] p-4 sm:p-5 flex items-center gap-4 sm:gap-6 border border-slate-100 shadow-sm hover:shadow-md hover:bg-white transition-all duration-300"
                        >
                            <div className={cn(
                                "flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
                                info?.bg || "bg-slate-100",
                                info?.color || "text-slate-400"
                            )}>
                                <Icon size={20} strokeWidth={2.5} />
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                                        {log.weight.toFixed(1)}
                                    </span>
                                    <span className="text-xs font-bold text-slate-400 uppercase">kg</span>
                                </div>
                                <div className="text-sm font-medium text-slate-500 capitalize">
                                    {format(new Date(log.date), "EEEE d MMMM", { locale: fr })}
                                </div>
                            </div>

                            {info && (
                                <div className="hidden sm:flex flex-col items-end text-right">
                                    <span className={cn(
                                        "text-sm font-bold flex items-center gap-1",
                                        info.color
                                    )}>
                                        {info.text}
                                    </span>
                                    <span className="text-xs text-slate-400 font-medium mt-0.5">
                                        {info.message}
                                    </span>
                                </div>
                            )}

                            {info && (
                                <div className={cn(
                                    "sm:hidden text-xs font-bold px-2 py-1 rounded-lg",
                                    info.bg,
                                    info.color
                                )}>
                                    {info.text}
                                </div>
                            )}

                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 bg-white/90 shadow-sm rounded-xl p-1">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-slate-900 rounded-lg">
                                                <Edit2 size={14} />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="top">Modifier</TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-red-500 rounded-lg">
                                                <Trash2 size={14} />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="top">Supprimer</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <Button
                        variant="ghost"
                        size="icon"
                        disabled={currentPage <= 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                        className="rounded-xl h-10 w-10 text-slate-400 border border-slate-100 bg-white/50"
                    >
                        <ChevronLeft size={18} />
                    </Button>

                    <div className="flex items-center gap-1 px-4 py-2 bg-white/50 backdrop-blur-sm border border-slate-100 rounded-xl text-sm font-bold text-slate-500">
                        Page <span className="text-slate-900">{currentPage}</span> sur <span className="text-slate-900">{totalPages}</span>
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        disabled={currentPage >= totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                        className="rounded-xl h-10 w-10 text-slate-400 border border-slate-100 bg-white/50"
                    >
                        <ChevronRight size={18} />
                    </Button>
                </div>
            )}
        </div>
    )
}
