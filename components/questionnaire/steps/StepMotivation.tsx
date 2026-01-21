"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { step8MotivationSchema } from "@/lib/validators/questionnaire"
import { useQuestionnaireStore } from "@/hooks/use-questionnaire-store"
import { z } from "zod"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { submitOnboarding } from "@/lib/actions/onboarding"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { SelectionGrid } from "@/components/questionnaire/SelectionGrid"
import { ChevronLeft, Rocket, Loader2, Heart, Star } from "lucide-react"

type Step8Data = z.infer<typeof step8MotivationSchema>

interface StepMotivationProps {
    onBack: () => void
}

const WHY_JOIN_OPTIONS = [
    { id: "WEIGHT_LOSS", label: "Perdre du poids durablement" },
    { id: "ENERGY", label: "Retrouver de l'énergie" },
    { id: "HEALTH", label: "Améliorer ma santé (bilan, digestion...)" },
    { id: "SELF_LOVE", label: "Me reconnecter à mon corps / Image de soi" },
    { id: "ROUTINE", label: "Mettre en place une discipline saine" }
]

const ENGAGEMENT_OPTIONS = [
    { id: "MAX", label: "100% Déterminée (Je veux des résultats)" },
    { id: "HIGH", label: "Prête à m'investir sérieusement" },
    { id: "MODERATE", label: "Je vais faire de mon mieux" },
    { id: "LOW", label: "Je teste pour voir" }
]

export function StepMotivation({ onBack }: StepMotivationProps) {
    const { data, setData, reset } = useQuestionnaireStore()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()

    const form = useForm<Step8Data>({
        resolver: zodResolver(step8MotivationSchema),
        defaultValues: {
            whyJoin: Array.isArray(data.whyJoin) ? data.whyJoin : [],
            engagementLevel: data.engagementLevel || "HIGH",
            additionalNotes: data.additionalNotes || ""
        },
    })

    async function onSubmit(values: Step8Data) {
        setIsSubmitting(true)
        setData(values)

        // Merge final data
        const finalData = { ...data, ...values }

        try {
            const result = await submitOnboarding(finalData as any);

            if (result.success) {
                toast.success("Profil IKONGA créé avec succès !")
                reset() // Clear store
                router.push("/dashboard") // Force refresh or use nextPath
            } else {
                toast.error(result.error || "Une erreur est survenue")
            }
        } catch (error) {
            toast.error("Erreur de connexion au serveur")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">

                {/* Pourquoi rejoindre */}
                <FormField
                    control={form.control}
                    name="whyJoin"
                    render={({ field }) => (
                        <FormItem className="space-y-4">
                            <FormLabel className="text-slate-900 font-bold flex items-center gap-2">
                                <Heart className="text-rose-500" size={20} />
                                A. Pourquoi souhaites-tu rejoindre l'aventure IKONGA ?
                            </FormLabel>
                            <FormControl>
                                <SelectionGrid
                                    options={WHY_JOIN_OPTIONS}
                                    selected={field.value}
                                    onChange={field.onChange}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Niveau d'engagement */}
                <FormField
                    control={form.control}
                    name="engagementLevel"
                    render={({ field }) => (
                        <FormItem className="space-y-4">
                            <FormLabel className="text-slate-900 font-bold flex items-center gap-2">
                                <Star className="text-amber-500" size={20} />
                                B. Ton niveau d'engagement actuel
                            </FormLabel>
                            <FormControl>
                                <SelectionGrid
                                    options={ENGAGEMENT_OPTIONS}
                                    selected={[field.value]}
                                    onChange={(val) => field.onChange(val[0])}
                                    multi={false}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Notes additionnelles */}
                <FormField
                    control={form.control}
                    name="additionalNotes"
                    render={({ field }) => (
                        <FormItem className="space-y-4">
                            <FormLabel className="text-slate-900 font-bold flex items-center gap-2">
                                <Rocket className="text-indigo-500" size={20} />
                                C. Un dernier mot ou une précision pour Rosy ?
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Dis-nous tout ce qui te semble important..."
                                    className="min-h-[120px] rounded-3xl bg-slate-50 border-none p-6 focus-visible:ring-ikonga-pink/20"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex gap-4 pt-6">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onBack}
                        className="h-20 px-8 rounded-3xl text-slate-400 hover:text-slate-600 font-bold"
                    >
                        <ChevronLeft size={24} />
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 h-20 text-xl font-black uppercase tracking-widest rounded-3xl bg-ikonga-gradient shadow-2xl shadow-pink-200 active:scale-95 transition-all"
                    >
                        {isSubmitting ? (
                            <div className="flex items-center gap-3">
                                <Loader2 className="animate-spin" />
                                <span>Génération...</span>
                            </div>
                        ) : (
                            "Générer mon analyse"
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
