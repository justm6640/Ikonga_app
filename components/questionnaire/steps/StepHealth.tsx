"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { step5HealthSchema } from "@/lib/validators/questionnaire"
import { useQuestionnaireStore } from "@/hooks/use-questionnaire-store"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { SelectionGrid } from "@/components/questionnaire/SelectionGrid"
import { ChevronLeft, FlaskConical, Pill, Activity } from "lucide-react"

type Step5Data = z.infer<typeof step5HealthSchema>

interface StepHealthProps {
    onNext: () => void
    onBack: () => void
}

const SUPPLEMENT_OPTIONS = [
    { id: "MULTIVITAMINS", label: "Multivitamines" },
    { id: "MAGNESIUM", label: "Magnésium" },
    { id: "OMEGA3", label: "Oméga 3" },
    { id: "VITAMIN_D", label: "Vitamine D" },
    { id: "IRON", label: "Fer" },
    { id: "NONE", label: "Aucun" }
]

const BLOOD_TEST_OPTIONS = [
    { id: "LESS_6_MONTHS", label: "Moins de 6 mois" },
    { id: "6_TO_12_MONTHS", label: "6 à 12 mois" },
    { id: "MORE_1_YEAR", label: "Plus d'un an" },
    { id: "NEVER", label: "Jamais fait" }
]

const HEALTH_OPTIONS = [
    { id: "DIGESTION", label: "Problèmes digestifs" },
    { id: "THYROID", label: "Problèmes thyroïdiens" },
    { id: "DIABETES", label: "Diabète / Insulinorésistance" },
    { id: "PCOS", label: "SOPK / Hormonal" },
    { id: "ANEMIA", label: "Anémie / Fatigue chronique" },
    { id: "NONE", label: "Aucun problème majeur" }
]

export function StepHealth({ onNext, onBack }: StepHealthProps) {
    const { data, setData } = useQuestionnaireStore()

    const form = useForm<Step5Data>({
        resolver: zodResolver(step5HealthSchema),
        defaultValues: {
            supplements: Array.isArray(data.supplements) ? data.supplements : [],
            recentBloodTest: data.recentBloodTest || "NEVER",
            healthIssues: Array.isArray(data.healthIssues) ? data.healthIssues : []
        },
    })

    function onSubmit(values: Step5Data) {
        setData(values)
        onNext()
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">

                {/* Compléments */}
                <FormField
                    control={form.control}
                    name="supplements"
                    render={({ field }) => (
                        <FormItem className="space-y-4">
                            <FormLabel className="text-slate-900 font-bold flex items-center gap-2">
                                <Pill className="text-ikonga-pink" size={20} />
                                A. Prends-tu des compléments alimentaires ?
                            </FormLabel>
                            <FormControl>
                                <SelectionGrid
                                    options={SUPPLEMENT_OPTIONS}
                                    selected={field.value}
                                    onChange={field.onChange}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Bilan sanguin */}
                <FormField
                    control={form.control}
                    name="recentBloodTest"
                    render={({ field }) => (
                        <FormItem className="space-y-4">
                            <FormLabel className="text-slate-900 font-bold flex items-center gap-2">
                                <FlaskConical className="text-indigo-500" size={20} />
                                B. À quand remonte ton dernier bilan sanguin complet ?
                            </FormLabel>
                            <FormControl>
                                <SelectionGrid
                                    options={BLOOD_TEST_OPTIONS}
                                    selected={[field.value]}
                                    onChange={(val) => field.onChange(val[0])}
                                    multi={false}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Pathologies */}
                <FormField
                    control={form.control}
                    name="healthIssues"
                    render={({ field }) => (
                        <FormItem className="space-y-4">
                            <FormLabel className="text-slate-900 font-bold flex items-center gap-2">
                                <Activity className="text-rose-500" size={20} />
                                C. Partage avec nous d'éventuels soucis de santé
                            </FormLabel>
                            <FormControl>
                                <SelectionGrid
                                    options={HEALTH_OPTIONS}
                                    selected={field.value}
                                    onChange={field.onChange}
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
                        className="h-16 px-8 rounded-3xl text-slate-400 hover:text-slate-600 font-bold"
                    >
                        <ChevronLeft size={24} />
                    </Button>
                    <Button
                        type="submit"
                        className="flex-1 h-16 text-lg font-black uppercase tracking-widest rounded-3xl bg-ikonga-gradient shadow-xl shadow-pink-200"
                    >
                        Continuer
                    </Button>
                </div>
            </form>
        </Form>
    )
}
