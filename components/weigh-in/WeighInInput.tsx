"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarIcon, Camera, Loader2, AlertCircle } from "lucide-react"
import { toast } from "sonner"

import { saveWeightLog, LogWeightResult } from "@/lib/actions/weight"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
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

// Schema
const weighInSchema = z.object({
    weight: z.number()
        .min(10, "Minimum 10kg")
        .max(300, "Maximum 300kg"),
    date: z.date(),
})

type WeighInFormValues = z.infer<typeof weighInSchema>

interface WeighInInputProps {
    onSuccess?: () => void
}

export function WeighInInput({ onSuccess }: WeighInInputProps) {
    const [isPending, setIsPending] = useState(false)
    const [duplicateDialog, setDuplicateDialog] = useState<{ open: boolean, data?: WeighInFormValues }>({ open: false })

    const form = useForm<WeighInFormValues>({
        resolver: zodResolver(weighInSchema),
        defaultValues: {
            date: new Date(),
        },
    })

    const watchWeight = form.watch("weight")

    // Helper to calculate status color
    const getWeightColor = (w?: number) => {
        if (!w) return "text-slate-300"
        if (w < 30 || w > 250) return "text-orange-500" // Warning range
        return "text-slate-900"
    }

    async function handleSubmission(data: WeighInFormValues, behavior: "CHECK" | "REPLACE" | "ADD" = "CHECK") {
        setIsPending(true)
        try {
            console.log(`Submitting with behavior: ${behavior}`)
            const result = await saveWeightLog(data.weight, data.date, undefined, behavior)

            if (result.status === 'error') {
                toast.error(result.message)
            } else if (result.status === 'confirmation_needed') {
                // Open Duplicate Dialog
                setDuplicateDialog({ open: true, data })
            } else {
                // Success / Neutral / Info
                toast[result.status === 'success' ? 'success' : 'info'](result.message, {
                    duration: 5000,
                    className: "text-lg font-medium shadow-xl border-none bg-white/90 backdrop-blur-md"
                })

                form.reset({ date: new Date(), weight: undefined })
                setDuplicateDialog({ open: false })
                onSuccess?.()
            }

        } catch (e) {
            toast.error("Erreur de connexion")
        } finally {
            setIsPending(false)
        }
    }

    const onSubmit = (data: WeighInFormValues) => handleSubmission(data, "CHECK")

    return (
        <div className="w-full max-w-md mx-auto">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex flex-col items-center">

                    {/* 1. Date Picker */}
                    <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                            <FormItem className="flex flex-col items-center">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-[240px] pl-3 text-left font-normal rounded-full border-border/50 bg-white/50 backdrop-blur-sm hover:bg-white/80 transition-all",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, "PPP", { locale: fr })
                                                ) : (
                                                    <span>Choisir une date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0 rounded-2xl shadow-xl border-none" align="center">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) =>
                                                date > new Date() || date < new Date("1900-01-01")
                                            }
                                            initialFocus
                                            className="bg-white/95 backdrop-blur-xl rounded-2xl"
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* 2. Weight INPUT (Big Premium) */}
                    <FormField
                        control={form.control}
                        name="weight"
                        render={({ field }) => (
                            <FormItem className="text-center w-full relative group">
                                <FormControl>
                                    <div className="relative flex justify-center items-center py-6">
                                        <Input
                                            type="number"
                                            step="0.1"
                                            maxLength={5}
                                            placeholder="00.0"
                                            className={cn(
                                                "text-[5rem] leading-none font-serif text-center h-32 w-full border-none bg-transparent focus-visible:ring-0 placeholder:text-slate-200 transition-colors duration-500",
                                                getWeightColor(field.value)
                                            )}
                                            {...field}
                                            onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                        />
                                        <span className={cn(
                                            "absolute right-12 top-1/2 -translate-y-1/2 text-2xl font-bold mt-4 transition-colors duration-500",
                                            field.value ? "text-slate-400" : "text-slate-200"
                                        )}>kg</span>
                                    </div>
                                </FormControl>

                                {/* Verification warning */}
                                {(watchWeight < 30 || watchWeight > 250) && watchWeight > 0 && (
                                    <div className="absolute -bottom-2 left-0 right-0 text-center animate-in slide-in-from-top-2 fade-in">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-sm font-bold">
                                            <AlertCircle size={14} strokeWidth={2.5} />
                                            Vérifie pour être sûr(e) ✍️
                                        </span>
                                    </div>
                                )}
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* 3. Actions (Photo + Submit) */}
                    <div className="flex flex-col gap-4 w-full pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            className="rounded-2xl h-12 border-dashed border-slate-300 text-slate-500 hover:bg-slate-50 hover:text-slate-700 hover:border-slate-400 transition-all font-medium"
                            onClick={() => toast.info("Fonctionnalité photo bientôt disponible !", { icon: "📸" })}
                        >
                            <Camera className="mr-2 h-5 w-5" />
                            Ajouter une photo
                        </Button>

                        <Button
                            type="submit"
                            className="w-full h-14 text-lg rounded-2xl bg-ikonga-gradient shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 hover:scale-[1.02] transition-all active:scale-[0.98] font-bold text-white mb-4"
                            disabled={isPending}
                        >
                            {isPending ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : "Valider ma pesée"}
                        </Button>
                    </div>

                </form>
            </Form>

            {/* DUPLICATE DIALOG */}
            <AlertDialog open={duplicateDialog.open} onOpenChange={(o) => !o && setDuplicateDialog({ open: false })}>
                <AlertDialogContent className="rounded-3xl bg-white/95 backdrop-blur-xl border-none shadow-2xl max-w-sm">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-serif text-slate-900 text-center">
                            Pesée déjà existante
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-center font-medium text-slate-500">
                            Une pesée existe déjà pour le <span className="text-slate-900 font-bold">{duplicateDialog.data?.date && format(duplicateDialog.data.date, "d MMMM", { locale: fr })}</span>.
                            <br />Que souhaitez-vous faire ?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-col gap-2 sm:gap-0 mt-4">
                        <AlertDialogAction
                            onClick={() => duplicateDialog.data && handleSubmission(duplicateDialog.data, "REPLACE")}
                            className="w-full rounded-xl bg-slate-900 text-white hover:bg-slate-800 h-11"
                        >
                            🔄 Remplacer l'ancienne
                        </AlertDialogAction>
                        <AlertDialogAction
                            onClick={() => duplicateDialog.data && handleSubmission(duplicateDialog.data, "ADD")}
                            className="w-full rounded-xl bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 h-11 shadow-sm mt-2"
                        >
                            ➕ Garder les deux
                        </AlertDialogAction>
                        <AlertDialogCancel
                            onClick={() => setDuplicateDialog({ open: false })}
                            className="w-full rounded-xl border-transparent text-slate-400 hover:text-slate-600 hover:bg-transparent mt-1"
                        >
                            Annuler
                        </AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
