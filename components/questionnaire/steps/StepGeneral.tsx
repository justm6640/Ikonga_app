"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { stepGeneralSchema, QuestionnaireData } from "@/lib/validators/questionnaire"
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
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

// Infer the type specifically for this step
type StepGeneralData = z.infer<typeof stepGeneralSchema>

interface StepGeneralProps {
    onNext: () => void
}

export function StepGeneral({ onNext }: StepGeneralProps) {
    const { data, setData } = useQuestionnaireStore()

    const form = useForm<StepGeneralData>({
        resolver: zodResolver(stepGeneralSchema),
        defaultValues: {
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            // @ts-ignore - Handle date object needing conversion if persisted as string, or init null
            birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
            gender: data.gender || "FEMALE",
            heightCm: data.heightCm || undefined,
            startWeight: data.startWeight || undefined,
            targetWeight: data.targetWeight || undefined,
        },
    })

    function onSubmit(values: StepGeneralData) {
        if (!values.birthDate) {
            form.setError("birthDate", { message: "Date requise" });
            return;
        }

        setData(values)
        onNext()
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                {/* Prénom & Nom */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Prénom</FormLabel>
                                <FormControl>
                                    <Input placeholder="Anna" className="h-12 text-lg" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nom</FormLabel>
                                <FormControl>
                                    <Input placeholder="Doe" className="h-12 text-lg" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Date de Naissance */}
                <FormField
                    control={form.control}
                    name="birthDate"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Date de naissance</FormLabel>
                            <FormControl>
                                <Input
                                    type="date"
                                    className="h-12 text-lg w-full"
                                    value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                                    onChange={(e) => field.onChange(e.target.valueAsDate)}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Genre */}
                <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                            <FormLabel>Genre</FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex space-x-4"
                                >
                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value="FEMALE" />
                                        </FormControl>
                                        <FormLabel className="font-normal font-sans">
                                            Femme
                                        </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value="MALE" />
                                        </FormControl>
                                        <FormLabel className="font-normal font-sans">
                                            Homme
                                        </FormLabel>
                                    </FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Taille & Poids */}
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="heightCm"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Taille (cm)</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="165"
                                        className="h-12 text-lg"
                                        {...field}
                                        onChange={e => field.onChange(e.target.valueAsNumber)}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="startWeight"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Poids actuel (kg)</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="65"
                                        className="h-12 text-lg"
                                        {...field}
                                        onChange={e => field.onChange(e.target.valueAsNumber)}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="targetWeight"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Objectif (optionnel)</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    placeholder="60"
                                    className="h-12 text-lg"
                                    {...field}
                                    onChange={e => field.onChange(e.target.valueAsNumber)}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full h-12 text-lg mt-8 rounded-xl bg-ikonga-gradient hover:opacity-90 transition-opacity">
                    Suivant
                </Button>
            </form>
        </Form>
    )
}
