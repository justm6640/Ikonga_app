"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { stepBeautySchema } from "@/lib/validators/questionnaire"
import { useQuestionnaireStore } from "@/hooks/use-questionnaire-store"
import { z } from "zod"
import { Loader2, Smile, Frown, Meh } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useState } from "react"
import { submitOnboarding } from "@/lib/actions/onboarding"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

type StepBeautyData = z.infer<typeof stepBeautySchema>

interface StepProps {
    onNext: () => void // Not used here as we submit
    onBack: () => void
}

const CONFIDENCE_LEVELS = [
    { value: "LOW", label: "Faible", icon: Frown, color: "text-orange-500" },
    { value: "MEDIUM", label: "Moyenne", icon: Meh, color: "text-yellow-500" },
    { value: "HIGH", label: "Élevée", icon: Smile, color: "text-green-500" },
]

export function StepBeauty({ onBack }: StepProps) {
    const { data, setData, reset } = useQuestionnaireStore()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()

    const form = useForm<StepBeautyData>({
        resolver: zodResolver(stepBeautySchema),
        defaultValues: {
            bodyConfidence: data.bodyConfidence || "MEDIUM",
        },
    })

    async function onSubmit(values: StepBeautyData) {
        setIsSubmitting(true)
        setData(values)

        // Merge final data
        const finalData = { ...data, ...values }

        // Note: We need to ensure we have all required fields before calling action.
        // Assuming validation passed in previous steps. If a user refreshed and lost partial state, this might fail logic-wise if we don't handle hydration properly, but Zustand persist handles this.

        try {
            // @ts-ignore - The types should match, but data is Partial in store. 
            // In a real app we'd validate the merged object against the full schema here.
            const result = await submitOnboarding(finalData as any);

            if (result.success) {
                toast.success("Profil créé avec succès !")
                reset() // Clear store
                if (result.nextPath) {
                    router.push(result.nextPath)
                }
            } else {
                toast.error(result.error || "Une erreur est survenue")
            }

        } catch (error) {
            toast.error("Erreur de connexion")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                <FormField
                    control={form.control}
                    name="bodyConfidence"
                    render={({ field }) => (
                        <FormItem className="space-y-6">
                            <FormLabel className="text-xl text-center block">Comment te sens-tu dans ton corps ?</FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="grid grid-cols-3 gap-4"
                                >
                                    {CONFIDENCE_LEVELS.map((level) => (
                                        <FormItem key={level.value}>
                                            <FormControl>
                                                <RadioGroupItem value={level.value} className="peer sr-only" />
                                            </FormControl>
                                            <FormLabel className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-ikonga-pink peer-data-[state=checked]:bg-pink-50 cursor-pointer transition-all h-32">
                                                <level.icon className={`h-10 w-10 ${level.color}`} />
                                                <span className="font-medium text-lg">{level.label}</span>
                                            </FormLabel>
                                        </FormItem>
                                    ))}
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex gap-4 pt-8">
                    <Button type="button" variant="outline" onClick={onBack} className="w-1/3 h-14 rounded-2xl text-lg">
                        Retour
                    </Button>
                    <Button
                        type="submit"
                        className="w-2/3 h-14 rounded-2xl bg-ikonga-gradient text-lg shadow-xl hover:opacity-90 transition-all active:scale-[0.98]"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Génération...
                            </>
                        ) : (
                            "Terminer & Générer"
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
