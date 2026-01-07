"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { stepNutritionSchema } from "@/lib/validators/questionnaire"
import { useQuestionnaireStore } from "@/hooks/use-questionnaire-store"
import { z } from "zod"
import { motion, AnimatePresence } from "framer-motion"

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
import { Input } from "@/components/ui/input"

type StepNutritionData = z.infer<typeof stepNutritionSchema>

interface StepProps {
    onNext: () => void
    onBack: () => void
}

const STANDARD_ALLERGIES = ["Gluten", "Lactose", "Arachides", "Fruits de mer", "Oeufs", "Soja", "Aucune"]
const ALLERGIES_OPTIONS = [...STANDARD_ALLERGIES, "Autre"]
const HABITS_OPTIONS = ["Grignotage", "Diner tardif", "Saut de repas", "Sucre addicitif", "Fast-food régulier", "Aucune"]

export function StepNutrition({ onNext, onBack }: StepProps) {
    const { data, setData } = useQuestionnaireStore()

    const form = useForm<StepNutritionData>({
        resolver: zodResolver(stepNutritionSchema),
        defaultValues: {
            allergies: Array.isArray(data.allergies) ? data.allergies : [],
            mealsPerDay: typeof data.mealsPerDay === 'number' ? data.mealsPerDay : 3,
            habits: Array.isArray(data.habits) ? data.habits : [],
        },
    })

    const watchAllergies = form.watch("allergies") || []
    const isOtherSelected = watchAllergies.includes("Autre")

    // Retrouver la valeur personnalisée (celle qui n'est pas dans STANDARD_ALLERGIES ni "Autre")
    const customAllergyValue = watchAllergies.find(a => !ALLERGIES_OPTIONS.includes(a)) || ""

    function onSubmit(values: StepNutritionData) {
        // Nettoyage final : s'assurer que si "Autre" est décoché, on vire le custom
        let finalAllergies = [...values.allergies]
        if (!finalAllergies.includes("Autre")) {
            finalAllergies = finalAllergies.filter(a => STANDARD_ALLERGIES.includes(a))
        }

        setData({ ...values, allergies: finalAllergies })
        onNext()
    }

    const handleCustomAllergyChange = (val: string) => {
        const currentAllergies = form.getValues("allergies") || []
        // Filtrer pour garder les standards + "Autre"
        const baseAllergies = currentAllergies.filter(a => ALLERGIES_OPTIONS.includes(a))

        if (val.trim() === "") {
            form.setValue("allergies", baseAllergies, { shouldValidate: true })
        } else {
            form.setValue("allergies", [...baseAllergies, val], { shouldValidate: true })
        }
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
                <div className="space-y-4">
                    <FormLabel className="text-lg block">As-tu des allergies ou intolérances ?</FormLabel>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        {ALLERGIES_OPTIONS.map((item) => (
                            <FormField
                                key={item}
                                control={form.control}
                                name="allergies"
                                render={({ field }) => {
                                    const isChecked = field.value?.includes(item)
                                    return (
                                        <FormItem
                                            key={item}
                                            className={`flex flex-row items-start space-x-3 space-y-0 rounded-xl border p-3 hover:bg-secondary/50 cursor-pointer transition-colors ${isChecked ? 'border-ikonga-pink bg-ikonga-pink/5' : ''}`}
                                        >
                                            <FormControl>
                                                <Checkbox
                                                    checked={isChecked}
                                                    onCheckedChange={(checked) => {
                                                        const current = field.value || []
                                                        if (checked) {
                                                            field.onChange([...current, item])
                                                        } else {
                                                            // Si on décoche "Autre", on retire aussi la valeur custom
                                                            let newVal = current.filter((v) => v !== item)
                                                            if (item === "Autre") {
                                                                newVal = newVal.filter(v => STANDARD_ALLERGIES.includes(v))
                                                            }
                                                            field.onChange(newVal)
                                                        }
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

                    <AnimatePresence>
                        {isOtherSelected && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="pt-2">
                                    <Input
                                        placeholder="Ex: Arachides, Gluten, Fraises..."
                                        defaultValue={customAllergyValue}
                                        onChange={(e) => handleCustomAllergyChange(e.target.value)}
                                        className="rounded-xl h-12 border-ikonga-pink/30 focus-visible:ring-ikonga-pink"
                                    />
                                    <p className="text-[10px] text-slate-400 mt-2 ml-1 italic">
                                        Précise tes allergies pour un menu sur-mesure.
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <FormMessage />
                </div>

                {/* Habitudes */}
                <div className="space-y-4">
                    <FormLabel className="text-lg block">Tes habitudes alimentaires actuelles</FormLabel>
                    <div className="grid grid-cols-2 gap-3">
                        {HABITS_OPTIONS.map((item) => (
                            <FormField
                                key={item}
                                control={form.control}
                                name="habits"
                                render={({ field }) => {
                                    const isChecked = field.value?.includes(item)
                                    return (
                                        <FormItem
                                            key={item}
                                            className={`flex flex-row items-start space-x-3 space-y-0 rounded-xl border p-3 hover:bg-secondary/50 cursor-pointer transition-colors ${isChecked ? 'border-ikonga-pink bg-ikonga-pink/5' : ''}`}
                                        >
                                            <FormControl>
                                                <Checkbox
                                                    checked={isChecked}
                                                    onCheckedChange={(checked) => {
                                                        const current = field.value || []
                                                        return checked
                                                            ? field.onChange([...current, item])
                                                            : field.onChange(
                                                                current.filter(
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
                </div>

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
