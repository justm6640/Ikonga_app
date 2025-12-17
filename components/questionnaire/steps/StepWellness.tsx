"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { stepWellnessSchema } from "@/lib/validators/questionnaire"
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
import { Slider } from "@/components/ui/slider"
import { Moon, HeartPulse } from "lucide-react"

type StepWellnessData = z.infer<typeof stepWellnessSchema>

interface StepProps {
    onNext: () => void
    onBack: () => void
}

export function StepWellness({ onNext, onBack }: StepProps) {
    const { data, setData } = useQuestionnaireStore()

    const form = useForm<StepWellnessData>({
        resolver: zodResolver(stepWellnessSchema),
        defaultValues: {
            stressLevel: data.stressLevel || 5,
            sleepQuality: data.sleepQuality || 7,
        },
    })

    function onSubmit(values: StepWellnessData) {
        setData(values)
        onNext()
    }

    const renderScaleLabel = (value: number) => {
        if (value <= 3) return "Faible";
        if (value <= 7) return "Modéré";
        return "Élevé";
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">

                {/* Niveau de Stress */}
                <FormField
                    control={form.control}
                    name="stressLevel"
                    render={({ field }) => (
                        <FormItem className="space-y-4">
                            <div className="flex items-center gap-3">
                                <HeartPulse className="h-6 w-6 text-ikonga-pink" />
                                <FormLabel className="text-xl">Niveau de Stress</FormLabel>
                            </div>
                            <FormControl>
                                <div className="space-y-4 pt-2">
                                    <Slider
                                        min={1}
                                        max={10}
                                        step={1}
                                        value={[field.value]}
                                        onValueChange={(val) => field.onChange(val[0])}
                                        className="py-4"
                                    />
                                    <div className="flex justify-between items-center px-1">
                                        <span className="text-sm text-muted-foreground">Zen (1)</span>
                                        <span className="text-2xl font-bold text-primary">{field.value}</span>
                                        <span className="text-sm text-muted-foreground">Stressé (10)</span>
                                    </div>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Qualité du Sommeil */}
                <FormField
                    control={form.control}
                    name="sleepQuality"
                    render={({ field }) => (
                        <FormItem className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Moon className="h-6 w-6 text-indigo-500" />
                                <FormLabel className="text-xl">Qualité du Sommeil</FormLabel>
                            </div>
                            <FormControl>
                                <div className="space-y-4 pt-2">
                                    <Slider
                                        min={1}
                                        max={10}
                                        step={1}
                                        value={[field.value]}
                                        onValueChange={(val) => field.onChange(val[0])}
                                        className="py-4"
                                    />
                                    <div className="flex justify-between items-center px-1">
                                        <span className="text-sm text-muted-foreground">Mauvais (1)</span>
                                        <span className="text-2xl font-bold text-primary">{field.value}</span>
                                        <span className="text-sm text-muted-foreground">Excellent (10)</span>
                                    </div>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex gap-4 pt-4">
                    <Button type="button" variant="outline" onClick={onBack} className="w-1/3 h-12 rounded-xl">
                        Retour
                    </Button>
                    <Button type="submit" className="w-2/3 h-12 rounded-xl bg-ikonga-gradient hover:opacity-90">
                        Suivant
                    </Button>
                </div>
            </form>
        </Form>
    )
}
