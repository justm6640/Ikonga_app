"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { stepNutritionSchema } from "@/lib/validators/questionnaire"
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
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"

type StepNutritionData = z.infer<typeof stepNutritionSchema>

interface StepProps {
    onNext: () => void
    onBack: () => void
}

const ALLERGIES_OPTIONS = ["Gluten", "Lactose", "Arachides", "Fruits de mer", "Oeufs", "Soja", "Aucune"]
const HABITS_OPTIONS = ["Grignotage", "Diner tardif", "Saut de repas", "Sucre addicitif", "Fast-food régulier", "Aucune"]

export function StepNutrition({ onNext, onBack }: StepProps) {
    const { data, setData } = useQuestionnaireStore()

    const form = useForm<StepNutritionData>({
        resolver: zodResolver(stepNutritionSchema),
        defaultValues: {
            allergies: data.allergies || [],
            mealsPerDay: data.mealsPerDay || 3,
            habits: data.habits || [],
        },
    })

    function onSubmit(values: StepNutritionData) {
        setData(values)
        onNext()
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                {/* Repas par jour */}
                <FormField
                    control={form.control}
                    name="mealsPerDay"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-lg">Combien de repas prends-tu par jour ?</FormLabel>
                            <FormControl>
                                <div className="space-y-4 pt-4">
                                    <Slider
                                        min={1}
                                        max={8}
                                        step={1}
                                        value={[field.value]}
                                        onValueChange={(val) => field.onChange(val[0])}
                                        className="py-4"
                                    />
                                    <div className="text-center font-bold text-3xl text-ikonga-pink">
                                        {field.value}
                                    </div>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Allergies */}
                <FormField
                    control={form.control}
                    name="allergies"
                    render={() => (
                        <FormItem>
                            <FormLabel className="text-lg mb-4 block">As-tu des allergies ou intolérances ?</FormLabel>
                            <div className="grid grid-cols-2 gap-3">
                                {ALLERGIES_OPTIONS.map((item) => (
                                    <FormField
                                        key={item}
                                        control={form.control}
                                        name="allergies"
                                        render={({ field }) => {
                                            return (
                                                <FormItem
                                                    key={item}
                                                    className="flex flex-row items-start space-x-3 space-y-0 rounded-xl border p-3 hover:bg-secondary/50 cursor-pointer"
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
                                                        />
                                                    </FormControl>
                                                    <FormLabel className="font-normal cursor-pointer w-full">
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

                {/* Habitudes */}
                <FormField
                    control={form.control}
                    name="habits"
                    render={() => (
                        <FormItem>
                            <FormLabel className="text-lg mb-4 block">Tes habitudes alimentaires actuelles</FormLabel>
                            <div className="grid grid-cols-2 gap-3">
                                {HABITS_OPTIONS.map((item) => (
                                    <FormField
                                        key={item}
                                        control={form.control}
                                        name="habits"
                                        render={({ field }) => {
                                            return (
                                                <FormItem
                                                    key={item}
                                                    className="flex flex-row items-start space-x-3 space-y-0 rounded-xl border p-3 hover:bg-secondary/50 cursor-pointer"
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
                                                        />
                                                    </FormControl>
                                                    <FormLabel className="font-normal cursor-pointer w-full">
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
