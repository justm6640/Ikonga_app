"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { stepFitnessSchema } from "@/lib/validators/questionnaire"
import { useQuestionnaireStore } from "@/hooks/use-questionnaire-store"
import { z } from "zod"
import { cn } from "@/lib/utils"

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
import { Checkbox } from "@/components/ui/checkbox"
import { Activity, Armchair, Dumbbell, Zap } from "lucide-react"

type StepFitnessData = z.infer<typeof stepFitnessSchema>

interface StepProps {
    onNext: () => void
    onBack: () => void
}

const ACTIVITY_LEVELS = [
    { value: "SEDENTARY", label: "Sédentaire", desc: "Peu ou pas d'exercice", icon: Armchair },
    { value: "MODERATE", label: "Modéré", desc: "1-3 fois par semaine", icon: Activity },
    { value: "ACTIVE", label: "Actif", desc: "3-5 fois par semaine", icon: Dumbbell },
    { value: "VERY_ACTIVE", label: "Très Actif", desc: "Sport quotidien ou intense", icon: Zap },
]

const INJURIES_OPTIONS = ["Dos", "Genoux", "Épaules", "Chevilles", "Aucune"]

export function StepFitness({ onNext, onBack }: StepProps) {
    const { data, setData } = useQuestionnaireStore()

    const form = useForm<StepFitnessData>({
        resolver: zodResolver(stepFitnessSchema),
        defaultValues: {
            activityLevel: data.activityLevel || "MODERATE",
            injuries: data.injuries || [],
        },
    })

    function onSubmit(values: StepFitnessData) {
        setData(values)
        onNext()
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                {/* Niveau d'activité */}
                <FormField
                    control={form.control}
                    name="activityLevel"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                            <FormLabel className="text-lg">Ton niveau d'activité physique</FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="grid grid-cols-1 gap-4"
                                >
                                    {ACTIVITY_LEVELS.map((level) => (
                                        <FormItem key={level.value}>
                                            <FormControl>
                                                <RadioGroupItem value={level.value} className="peer sr-only" />
                                            </FormControl>
                                            <FormLabel className="flex items-center justify-between rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-ikonga-pink peer-data-[state=checked]:bg-pink-50 cursor-pointer transition-all">
                                                <div className="flex items-center gap-4">
                                                    <div className="bg-secondary p-2 rounded-full">
                                                        <level.icon className="h-5 w-5 text-foreground" />
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-lg">{level.label}</div>
                                                        <div className="text-sm text-muted-foreground">{level.desc}</div>
                                                    </div>
                                                </div>
                                            </FormLabel>
                                        </FormItem>
                                    ))}
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Blessures */}
                <FormField
                    control={form.control}
                    name="injuries"
                    render={() => (
                        <FormItem>
                            <FormLabel className="text-lg mb-4 block">As-tu des blessures ou douleurs ?</FormLabel>
                            <div className="flex flex-wrap gap-3">
                                {INJURIES_OPTIONS.map((item) => (
                                    <FormField
                                        key={item}
                                        control={form.control}
                                        name="injuries"
                                        render={({ field }) => {
                                            return (
                                                <FormItem
                                                    key={item}
                                                    className="flex flex-row items-center space-x-2 space-y-0"
                                                >
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value?.includes(item)}
                                                            onCheckedChange={(checked) => {
                                                                return checked
                                                                    ? field.onChange([...field.value, item])
                                                                    : field.onChange(
                                                                        field.value?.filter(
                                                                            (value) => value !== item
                                                                        )
                                                                    )
                                                            }}
                                                            className="sr-only"
                                                        />
                                                    </FormControl>
                                                    <FormLabel className={cn(
                                                        "cursor-pointer px-4 py-2 rounded-full border transition-colors",
                                                        field.value?.includes(item)
                                                            ? "bg-foreground text-background border-foreground"
                                                            : "bg-background text-foreground border-border hover:bg-secondary"
                                                    )}>
                                                        {item}
                                                    </FormLabel>
                                                </FormItem>
                                            )
                                        }}
                                    />
                                ))}
                            </div>
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
