"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { step6LifestyleSchema } from "@/lib/validators/questionnaire"
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
import { ChevronLeft, Coffee, Users, Target } from "lucide-react"

type Step6Data = z.infer<typeof step6LifestyleSchema>

interface StepLifestyleProps {
    onNext: () => void
    onBack: () => void
}

const TIME_SELF_OPTIONS = [
    { id: "NONE", label: "Aucun temps pour moi" },
    { id: "LITTLE", label: "Peu (moins de 30 min/jour)" },
    { id: "ENOUGH", label: "Assez (1h/jour)" },
    { id: "PLENTY", label: "Beaucoup (plus d'1h/jour)" }
]

const FAMILY_OPTIONS = [
    { id: "SOLO", label: "Je vis seule" },
    { id: "COUPLE", label: "En couple" },
    { id: "KIDS", label: "Avec enfants (organisation intense)" },
    { id: "MULTIGEN", label: "Famille nombreuse / multigénérationnelle" }
]

const CHALLENGE_OPTIONS = [
    { id: "TIME", label: "Manque de temps" },
    { id: "MOTIVATION", label: "Manque de motivation" },
    { id: "SOCIAL", label: "Vie sociale très chargée" },
    { id: "WORK", label: "Travail stressant / Horaires décalés" },
    { id: "EMOTIONS", label: "Gestion des émotions" },
    { id: "ORGANIZATION", label: "Manque d'organisation" }
]

export function StepLifestyle({ onNext, onBack }: StepLifestyleProps) {
    const { data, setData } = useQuestionnaireStore()

    const form = useForm<Step6Data>({
        resolver: zodResolver(step6LifestyleSchema),
        defaultValues: {
            timeForSelf: data.timeForSelf || "LITTLE",
            familyOrganization: data.familyOrganization || "COUPLE",
            mainChallenges: Array.isArray(data.mainChallenges) ? data.mainChallenges : []
        },
    })

    function onSubmit(values: Step6Data) {
        setData(values)
        onNext()
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">

                {/* Temps pour soi */}
                <FormField
                    control={form.control}
                    name="timeForSelf"
                    render={({ field }) => (
                        <FormItem className="space-y-4">
                            <FormLabel className="text-slate-900 font-bold flex items-center gap-2">
                                <Coffee className="text-amber-500" size={20} />
                                A. Temps accordé à ton bien-être personnel
                            </FormLabel>
                            <FormControl>
                                <SelectionGrid
                                    options={TIME_SELF_OPTIONS}
                                    selected={[field.value]}
                                    onChange={(val) => field.onChange(val[0])}
                                    multi={false}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Organisation familiale */}
                <FormField
                    control={form.control}
                    name="familyOrganization"
                    render={({ field }) => (
                        <FormItem className="space-y-4">
                            <FormLabel className="text-slate-900 font-bold flex items-center gap-2">
                                <Users className="text-indigo-500" size={20} />
                                B. Ton environnement familial / de vie
                            </FormLabel>
                            <FormControl>
                                <SelectionGrid
                                    options={FAMILY_OPTIONS}
                                    selected={[field.value]}
                                    onChange={(val) => field.onChange(val[0])}
                                    multi={false}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Défis */}
                <FormField
                    control={form.control}
                    name="mainChallenges"
                    render={({ field }) => (
                        <FormItem className="space-y-4">
                            <FormLabel className="text-slate-900 font-bold flex items-center gap-2">
                                <Target className="text-rose-500" size={20} />
                                C. Tes plus grands défis au quotidien
                            </FormLabel>
                            <FormControl>
                                <SelectionGrid
                                    options={CHALLENGE_OPTIONS}
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
