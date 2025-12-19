"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarIcon, Camera, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useState } from "react"
import { saveWeightLog } from "@/lib/actions/weight"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"

// Schema
const weighInSchema = z.object({
    weight: z.number().min(30, "Minimum 30kg").max(250, "Maximum 250kg"),
    date: z.date(),
    // photoUrl handled separately or inside hidden input if needed
})

type WeighInFormValues = z.infer<typeof weighInSchema>

interface WeighInFormProps {
    onSuccess?: () => void
}

export function WeighInForm({ onSuccess }: WeighInFormProps) {
    const [isPending, setIsPending] = useState(false)

    const form = useForm<WeighInFormValues>({
        resolver: zodResolver(weighInSchema),
        defaultValues: {
            date: new Date(),
            // weight is undefined initially
        },
    })

    async function onSubmit(data: WeighInFormValues) {
        setIsPending(true)
        try {
            const result = await saveWeightLog(data.weight, data.date)

            if (result.status === 'error') {
                toast.error(result.message)
            } else {
                // Success / Neutral / Info
                toast[result.status === 'success' ? 'success' : 'info'](result.message, {
                    duration: 5000,
                    className: "text-lg font-medium"
                })
                // Reset logic if needed, but keeping value might be better for UX or clear?
                // Usually clear weight to prevent double sub.
                form.reset({ date: new Date(), weight: undefined })
                onSuccess?.()
            }

        } catch (e) {
            toast.error("Erreur de connexion")
        } finally {
            setIsPending(false)
        }
    }

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
                                                    "w-[240px] pl-3 text-left font-normal rounded-full border-border/50 bg-white/50 backdrop-blur-sm hover:bg-white/80",
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
                                    <PopoverContent className="w-auto p-0" align="center">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) =>
                                                date > new Date() || date < new Date("1900-01-01")
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* 2. Weight INPUT (Big) */}
                    <FormField
                        control={form.control}
                        name="weight"
                        render={({ field }) => (
                            <FormItem className="text-center w-full">
                                <FormControl>
                                    <div className="relative flex justify-center items-center">
                                        <Input
                                            type="number"
                                            step="0.1"
                                            maxLength={5}
                                            placeholder="00.0"
                                            className="text-7xl font-serif text-center h-32 w-full border-none bg-transparent focus-visible:ring-0 placeholder:text-muted-foreground/20 "
                                            {...field}
                                            onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                        />
                                        <span className="absolute right-8 text-xl font-medium text-muted-foreground mt-8">kg</span>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* 3. Actions (Photo + Submit) */}
                    <div className="flex flex-col gap-4 w-full">
                        <Button
                            type="button"
                            variant="outline"
                            className="rounded-xl h-12 border-dashed border-primary/30 text-primary hover:bg-primary/5"
                            onClick={() => toast.info("Fonctionnalité photo bientôt disponible !")}
                        >
                            <Camera className="mr-2 h-5 w-5" />
                            Ajouter une photo
                        </Button>

                        <Button
                            type="submit"
                            className="w-full h-14 text-lg rounded-2xl bg-ikonga-gradient shadow-lg hover:opacity-90 transition-all active:scale-[0.98]"
                            disabled={isPending}
                        >
                            {isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Valider ma pesée"}
                        </Button>
                    </div>

                </form>
            </Form>
        </div>
    )
}
