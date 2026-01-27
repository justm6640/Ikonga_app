"use client"

import { useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarIcon, Camera, Loader2, AlertCircle, X, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"

import { saveWeightLog, uploadWeighInPhoto } from "@/lib/actions/weight"
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
import { DuplicateConfirmationModal } from "./DuplicateConfirmationModal"

const weighInSchema = z.object({
    weight: z.number().min(10, "Minimum 10kg").max(300, "Maximum 300kg"),
    date: z.date(),
})

type WeighInFormValues = z.infer<typeof weighInSchema>

interface WeighInInputProps {
    onSuccess?: () => void
}

export function WeighInInput({ onSuccess }: WeighInInputProps) {
    const [isPending, setIsPending] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [photoPreview, setPhotoPreview] = useState<string | null>(null)
    const [photoFile, setPhotoFile] = useState<File | null>(null)
    const [duplicateModal, setDuplicateModal] = useState<{ open: boolean, data?: WeighInFormValues }>({ open: false })
    const fileInputRef = useRef<HTMLInputElement>(null)

    const form = useForm<WeighInFormValues>({
        resolver: zodResolver(weighInSchema),
        defaultValues: {
            date: new Date(),
        },
    })

    const watchWeight = form.watch("weight")

    const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image trop lourde (max 5MB)")
            return
        }

        setPhotoFile(file)
        const reader = new FileReader()
        reader.onloadend = () => setPhotoPreview(reader.result as string)
        reader.readAsDataURL(file)
    }

    const removePhoto = () => {
        setPhotoFile(null)
        setPhotoPreview(null)
        if (fileInputRef.current) fileInputRef.current.value = ""
    }

    async function handleSubmission(data: WeighInFormValues, behavior: "CHECK" | "REPLACE" | "ADD" = "CHECK") {
        setIsPending(true)
        try {
            let uploadedUrl = undefined;
            if (photoFile) {
                setIsUploading(true)
                uploadedUrl = await uploadWeighInPhoto(photoFile);
                setIsUploading(false)
                if (!uploadedUrl) {
                    toast.error("Erreur lors de l'envoi de la photo")
                    setIsPending(false)
                    return
                }
            }

            const result = await saveWeightLog(data.weight, data.date, uploadedUrl || undefined, behavior)

            if (result.status === 'error') {
                toast.error(result.message)
            } else if (result.status === 'confirmation_needed') {
                setDuplicateModal({ open: true, data })
            } else {
                toast.success(result.message, {
                    description: result.motivationalMessage,
                    duration: 6000,
                    icon: <CheckCircle2 className="text-emerald-500" />
                })
                form.reset({ date: new Date(), weight: 0 })
                removePhoto()
                setDuplicateModal({ open: false })
                onSuccess?.()
            }
        } catch (e) {
            toast.error("Erreur de connexion")
        } finally {
            setIsPending(false)
            setIsUploading(false)
        }
    }

    return (
        <div className="w-full">
            <Form {...form}>
                <form onSubmit={form.handleSubmit((d) => handleSubmission(d))} className="space-y-8 flex flex-col items-center">

                    {/* Date Picker */}
                    <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                            <FormItem className="flex flex-col items-center">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "w-[200px] h-10 px-4 text-sm font-black rounded-full border-slate-100 bg-slate-50 text-slate-900 transition-all hover:bg-slate-100",
                                                    !field.value && "text-slate-400"
                                                )}
                                            >
                                                {field.value ? format(field.value, "d MMMM yyyy", { locale: fr }) : "Date"}
                                                <CalendarIcon className="ml-2 h-4 w-4 text-slate-400" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0 rounded-[2rem] border-none shadow-2xl" align="center">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                            initialFocus
                                            className="bg-white rounded-3xl"
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Weight Display */}
                    <FormField
                        control={form.control}
                        name="weight"
                        render={({ field }) => (
                            <FormItem className="w-full relative py-4">
                                <FormControl>
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="relative flex items-baseline">
                                            <Input
                                                type="number"
                                                step="0.1"
                                                placeholder="00.0"
                                                className="text-[6rem] sm:text-[8rem] font-black text-slate-900 h-auto w-full border-none bg-transparent text-center focus-visible:ring-0 placeholder:text-slate-100 leading-none tracking-tighter"
                                                {...field}
                                                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                            />
                                            <span className="text-2xl font-black text-slate-300 ml-2">kg</span>
                                        </div>

                                        <AnimatePresence>
                                            {(watchWeight < 30 || watchWeight > 250) && watchWeight > 0 && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0 }}
                                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-orange-50 text-orange-600 text-xs font-black uppercase tracking-widest mt-2"
                                                >
                                                    <AlertCircle size={14} />
                                                    Vérifie le poids ✍️
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </FormControl>
                                <FormMessage className="text-center mt-4" />
                            </FormItem>
                        )}
                    />

                    {/* Photo Action */}
                    <div className="w-full px-4">
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handlePhotoSelect}
                        />

                        <AnimatePresence mode="wait">
                            {photoPreview ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="relative aspect-video rounded-3xl overflow-hidden border-4 border-white shadow-xl group"
                                >
                                    <img src={photoPreview} alt="Aperçu" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            className="rounded-full w-12 h-12"
                                            onClick={removePhoto}
                                        >
                                            <X size={24} />
                                        </Button>
                                    </div>
                                </motion.div>
                            ) : (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full h-24 rounded-[2rem] border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 hover:border-slate-300 transition-all text-slate-400 font-bold"
                                >
                                    <Camera size={28} strokeWidth={1.5} />
                                    <span className="text-xs uppercase tracking-widest">Ajouter une photo</span>
                                </Button>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Submit Button */}
                    <div className="w-full px-4 pt-4 pb-4">
                        <Button
                            disabled={isPending || isUploading}
                            className="w-full h-16 rounded-3xl bg-slate-900 text-white text-lg font-black shadow-xl hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-50"
                        >
                            {(isPending || isUploading) ? (
                                <span className="flex items-center gap-3">
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                    {isUploading ? "Envoi de la photo..." : "Enregistrement..."}
                                </span>
                            ) : (
                                "Valider ma pesée"
                            )}
                        </Button>
                    </div>
                </form>
            </Form>

            <DuplicateConfirmationModal
                open={duplicateModal.open}
                onOpenChange={(open) => setDuplicateModal({ open, data: duplicateModal.data })}
                date={duplicateModal.data?.date || new Date()}
                onReplace={() => duplicateModal.data && handleSubmission(duplicateModal.data, "REPLACE")}
                onAdd={() => duplicateModal.data && handleSubmission(duplicateModal.data, "ADD")}
            />
        </div>
    )
}
