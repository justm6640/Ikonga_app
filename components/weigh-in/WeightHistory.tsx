"use client"

import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Trash2, Scale, ChevronLeft, ChevronRight, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { deleteWeighIn } from "@/lib/actions/weight"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"

interface WeightLog {
    id: string;
    date: Date | string;
    weight: number;
    variation: number;
    isFirst: boolean;
    photoUrl?: string | null;
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

    const handleDelete = async (id: string) => {
        const result = await deleteWeighIn(id);
        if (result.success) {
            toast.success("Pesée supprimée");
        } else {
            toast.error("Erreur lors de la suppression");
        }
    };

    const getVariationDisplay = (variation: number, isFirst: boolean) => {
        if (isFirst) return {
            textColor: "text-blue-600",
            bgColor: "bg-blue-50",
            iconColor: "text-blue-500",
            text: "Première pesée",
            encouragement: "C'est le début d'une belle aventure ! ✨"
        }

        if (Math.abs(variation) <= 0.1) return {
            textColor: "text-slate-600",
            bgColor: "bg-slate-50",
            iconColor: "text-slate-400",
            text: "Stable",
            encouragement: "Les plateaux sont normaux, tu tiens bon 👊"
        }

        if (variation < 0) return {
            textColor: "text-emerald-600",
            bgColor: "bg-emerald-50",
            iconColor: "text-emerald-500",
            text: `${variation.toFixed(1)} kg`,
            encouragement: "Super baisse ! Tu continues de rayonner ✨"
        }

        return {
            textColor: "text-orange-600",
            bgColor: "bg-orange-50",
            iconColor: "text-orange-500",
            text: `+${variation.toFixed(1)} kg`,
            encouragement: "Rien de grave ! On ajuste ensemble 💪"
        }
    }

    if (logs.length === 0 && currentPage === 1) {
        return (
            <div className="text-center py-20 bg-white/40 backdrop-blur-md rounded-[2.5rem] border-2 border-dashed border-slate-200">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Scale className="text-slate-300" size={32} />
                </div>
                <p className="text-slate-500 font-medium">Aucune pesée enregistrée pour le moment.</p>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 px-4">
                <div className="space-y-1">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Mon Historique</h2>
                    <p className="text-slate-500 text-sm font-medium">Suis ton évolution jour après jour</p>
                </div>

                <div className="flex items-center gap-4 bg-white/60 p-1.5 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-2 px-3">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Afficher</span>
                        <Select value={pageSize.toString()} onValueChange={handleLimitChange}>
                            <SelectTrigger className="w-[80px] bg-transparent border-none shadow-none font-black text-slate-900 focus:ring-0">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl">
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="20">20</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <div className="grid gap-6">
                <AnimatePresence mode="popLayout">
                    {logs.map((log, index) => {
                        const display = getVariationDisplay(log.variation, log.isFirst)
                        return (
                            <motion.div
                                key={log.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: index * 0.05 }}
                                className="group relative bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:translate-y-[-4px] transition-all duration-500"
                            >
                                <div className="flex items-center gap-6">
                                    {/* Variation Icon Box */}
                                    <div className={cn(
                                        "w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-[1.5rem] flex items-center justify-center transition-transform group-hover:scale-110 duration-500 shrink-0",
                                        display.bgColor
                                    )}>
                                        <Scale className={display.iconColor} size={24} className="sm:w-7 sm:h-7" />
                                    </div>

                                    {/* Weight & Date */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-baseline gap-1 sm:gap-2">
                                            <span className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tighter">
                                                {log.weight.toFixed(1)}
                                            </span>
                                            <span className="text-base sm:text-xl font-bold text-slate-300">kg</span>
                                        </div>
                                        <div className="text-[10px] sm:text-sm font-bold text-slate-400 mt-0.5 sm:mt-1 uppercase tracking-wider truncate">
                                            {format(new Date(log.date), "EEE. d MMMM", { locale: fr })}
                                        </div>
                                    </div>

                                    {/* Variation Badge */}
                                    <div className="hidden sm:flex flex-col items-end gap-1">
                                        <div className={cn(
                                            "px-4 py-1.5 rounded-full text-sm font-black shadow-sm",
                                            display.bgColor,
                                            display.textColor
                                        )}>
                                            {display.text}
                                        </div>
                                    </div>

                                    {/* Image Preview if exists */}
                                    {log.photoUrl && (
                                        <div className="hidden md:block w-16 h-16 rounded-2xl overflow-hidden border-2 border-white shadow-md">
                                            <img src={log.photoUrl} alt="Photo de pesée" className="w-full h-full object-cover" />
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="absolute right-6 top-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button size="icon" variant="ghost" className="w-10 h-10 rounded-xl text-slate-300 hover:text-red-500 hover:bg-red-50">
                                                    <Trash2 size={18} />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent className="rounded-[2rem]">
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle className="text-2xl font-black">Supprimer cette pesée ?</AlertDialogTitle>
                                                    <AlertDialogDescription className="text-slate-500 font-medium pt-2">
                                                        Cette action est irréversible. La pesée et la photo associée seront définitivement supprimées.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter className="gap-2 mt-4">
                                                    <AlertDialogCancel className="rounded-xl font-bold">Annuler</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(log.id)} className="rounded-xl font-bold bg-red-500 hover:bg-red-600">Supprimer</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </div>

                                {/* Encouragement Message */}
                                <div className="mt-6 flex items-center gap-3 bg-slate-50/80 rounded-2xl p-4 border border-slate-100/50">
                                    <Info size={16} className="text-slate-400" />
                                    <p className="text-sm font-bold text-slate-600 italic">
                                        "{display.encouragement}"
                                    </p>
                                </div>
                            </motion.div>
                        )
                    })}
                </AnimatePresence>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 pt-10 pb-20">
                    <Button
                        variant="ghost"
                        size="icon"
                        disabled={currentPage <= 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                        className="rounded-2xl h-12 w-12 text-slate-400 border border-slate-200 bg-white shadow-sm hover:shadow-md disabled:opacity-30"
                    >
                        <ChevronLeft size={24} />
                    </Button>

                    <div className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-[1.25rem] text-sm font-black shadow-sm">
                        <span className="text-slate-400">Page</span>
                        <span className="text-slate-900">{currentPage}</span>
                        <span className="text-slate-400">/</span>
                        <span className="text-slate-900">{totalPages}</span>
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        disabled={currentPage >= totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                        className="rounded-2xl h-12 w-12 text-slate-400 border border-slate-200 bg-white shadow-sm hover:shadow-md disabled:opacity-30"
                    >
                        <ChevronRight size={24} />
                    </Button>
                </div>
            )}
        </div>
    )
}
