"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { step3FitnessSchema } from "@/lib/validators/questionnaire"
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
import { ChevronLeft, Dumbbell, Clock, Zap, Target, AlertTriangle } from "lucide-react"

type Step3Data = z.infer<typeof step3FitnessSchema>

interface StepFitnessProps {
    onNext: () => void
    onBack: () => void
}

const ACTIVITY_OPTIONS = [
    { id: "NONE", label: "Aucune activité (Sédentaire)" },
    { id: "WALKING", label: "Marche quotidienne (Active)" },
    { id: "GYM", label: "Salle de sport / Musculation" },
    { id: "CARDIO", label: "Running / Vélo / Natation" },
    { id: "YOGA", label: "Yoga / Pilates / Stretching" },
    { id: "HOME_WORKOUT", label: "Fitness à la maison" }
]

const TIME_OPTIONS = [
    { id: "15", label: "15 - 30 minutes" },
    { id: "30", label: "30 - 45 minutes" },
    { id: "60", label: "1 heure et +" },
    { id: "VARIABLE", label: "C'est variable" }
]

const LEVEL_OPTIONS = [
    { id: "BEGINNER", label: "Débutante (Je commence)" },
    { id: "INTERMEDIATE", label: "Intermédiaire (Régulière)" },
    { id: "ADVANCED", label: "Avancée (Sportive confirmée)" }
]

const EXERCISE_OPTIONS = [
    { id: "ABS", label: "Abdos / Taille" },
    { id: "GLUTES", label: "Fessiers / Jambes" },
    { id: "ARMS", label: "Bras / Dos" },
    { id: "HIIT", label: "Cardio intense (HIIT)" },
    { id: "STRETCH", label: "Souplesse / Mobilité" }
]

const LIMITATION_OPTIONS = [
    { id: "BACK", label: "Douleurs au dos" },
    { id: "KNEES", label: "Douleurs aux genoux" },
    { id: "SHOULDERS", label: "Douleurs aux épaules" },
    { id: "HEART", label: "Problèmes cardiaques" },
    { id: "PREGNANT", label: "Enceinte / Post-partum" },
    { id: "NONE", label: "Aucune limitation" }
]

export function StepFitness({ onNext, onBack }: StepFitnessProps) {
    const { data, setData } = useQuestionnaireStore()

    const form = useForm<Step3Data>({
        resolver: zodResolver(step3FitnessSchema),
        defaultValues: {
            currentActivity: Array.isArray(data.currentActivity) ? data.currentActivity : [],
            availableTimePerDay: data.availableTimePerDay || "15",
            fitnessLevel: data.fitnessLevel || "BEGINNER",
            preferredExercises: Array.isArray(data.preferredExercises) ? data.preferredExercises : [],
            physicalLimitations: Array.isArray(data.physicalLimitations) ? data.physicalLimitations : []
        },
    })

    function onSubmit(values: Step3Data) {
        setData(values)
        onNext()
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">

                {/* Activité actuelle */}
                <FormField
                    control={form.control}
                    name="currentActivity"
                    render={({ field }) => (
                        <FormItem className="space-y-4">
                            <FormLabel className="text-slate-900 font-bold flex items-center gap-2">
                                <Dumbbell className="text-ikonga-pink" size={20} />
                                A. Ton activité physique actuelle
                            </FormLabel>
                            <FormControl>
                                <SelectionGrid
                                    options={ACTIVITY_OPTIONS}
                                    selected={field.value}
                                    onChange={field.onChange}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Temps disponible */}
                <FormField
                    control={form.control}
                    name="availableTimePerDay"
                    render={({ field }) => (
                        <FormItem className="space-y-4">
                            <FormLabel className="text-slate-900 font-bold flex items-center gap-2">
                                <Clock className="text-indigo-500" size={20} />
                                B. Temps moyen disponible par jour
                            </FormLabel>
                            <FormControl>
                                <SelectionGrid
                                    options={TIME_OPTIONS}
                                    selected={[field.value]}
                                    onChange={(val) => field.onChange(val[0])}
                                    multi={false}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Niveau */}
                <FormField
                    control={form.control}
                    name="fitnessLevel"
                    render={({ field }) => (
                        <FormItem className="space-y-4">
                            <FormLabel className="text-slate-900 font-bold flex items-center gap-2">
                                <Zap className="text-amber-500" size={20} />
                                C. Ton niveau de forme
                            </FormLabel>
                            <FormControl>
                                <SelectionGrid
                                    options={LEVEL_OPTIONS}
                                    selected={[field.value]}
                                    onChange={(val) => field.onChange(val[0])}
                                    multi={false}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Exercices préférés */}
                <FormField
                    control={form.control}
                    name="preferredExercises"
                    render={({ field }) => (
                        <FormItem className="space-y-4">
                            <FormLabel className="text-slate-900 font-bold flex items-center gap-2">
                                <Target className="text-emerald-500" size={20} />
                                D. Ce que tu préfères travailler
                            </FormLabel>
                            <FormControl>
                                <SelectionGrid
                                    options={EXERCISE_OPTIONS}
                                    selected={field.value}
                                    onChange={field.onChange}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Limitations */}
                <FormField
                    control={form.control}
                    name="physicalLimitations"
                    render={({ field }) => (
                        <FormItem className="space-y-4">
                            <FormLabel className="text-slate-900 font-bold flex items-center gap-2">
                                <AlertTriangle className="text-rose-500" size={20} />
                                E. Éventuelles douleurs ou contre-indications
                            </FormLabel>
                            <FormControl>
                                <SelectionGrid
                                    options={LIMITATION_OPTIONS}
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
