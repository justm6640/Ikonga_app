"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { step4WellnessSchema } from "@/lib/validators/questionnaire"
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
import { SelectionGrid } from "@/components/questionnaire/SelectionGrid"
import { ChevronLeft, Heart, Moon, Zap, Sun, Smile, Coffee } from "lucide-react"

type Step4Data = z.infer<typeof step4WellnessSchema>

interface StepWellnessProps {
    onNext: () => void
    onBack: () => void
}

const EMOTION_OPTIONS = [
    { id: "JOY", label: "Joie / Enthousiasme" },
    { id: "STRESS", label: "Stress / Anxiété" },
    { id: "FATIGUE", label: "Fatigue / Épuisement" },
    { id: "SADNESS", label: "Tristesse / Mélancolie" },
    { id: "ANGER", label: "Colère / Frustration" },
    { id: "CALM", label: "Calme / Sérénité" }
]

const RELAXATION_OPTIONS = [
    { id: "READING", label: "Lecture", icon: Sun },
    { id: "MEDITATION", label: "Méditation / Respiration", icon: Heart },
    { id: "BATH", label: "Bain chaud / Soins", icon: Smile },
    { id: "WALK", label: "Marche en nature", icon: Sun },
    { id: "SOCIAL", label: "Voir des amis / Famille", icon: Coffee },
    { id: "NONE", label: "Je ne prends pas de temps" }
]

export function StepWellness({ onNext, onBack }: StepWellnessProps) {
    const { data, setData } = useQuestionnaireStore()

    const form = useForm<Step4Data>({
        resolver: zodResolver(step4WellnessSchema),
        defaultValues: {
            stressLevel: data.stressLevel || 5,
            sleepQuality: data.sleepQuality || 7,
            energyLevel: data.energyLevel || 6,
            morningPosture: data.morningPosture || "MODERATE",
            dominantEmotions: Array.isArray(data.dominantEmotions) ? data.dominantEmotions : [],
            preferredRelaxation: Array.isArray(data.preferredRelaxation) ? data.preferredRelaxation : []
        },
    })

    function onSubmit(values: Step4Data) {
        setData(values)
        onNext()
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">

                {/* Stress */}
                <FormField
                    control={form.control}
                    name="stressLevel"
                    render={({ field }) => (
                        <FormItem className="space-y-6">
                            <FormLabel className="text-slate-900 font-bold flex items-center gap-2">
                                <Zap className="text-amber-500" size={20} />
                                A. Ton niveau de stress actuel (1-10)
                            </FormLabel>
                            <FormControl>
                                <div className="px-2 pt-4">
                                    <Slider
                                        min={1} max={10} step={1}
                                        value={[field.value]}
                                        onValueChange={(val) => field.onChange(val[0])}
                                    />
                                    <div className="flex justify-between mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        <span>Détendu</span>
                                        <span className="text-2xl text-ikonga-pink font-black">{field.value}</span>
                                        <span>Surmené</span>
                                    </div>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Sommeil */}
                <FormField
                    control={form.control}
                    name="sleepQuality"
                    render={({ field }) => (
                        <FormItem className="space-y-6">
                            <FormLabel className="text-slate-900 font-bold flex items-center gap-2">
                                <Moon className="text-indigo-500" size={20} />
                                B. Qualité de ton sommeil (1-10)
                            </FormLabel>
                            <FormControl>
                                <div className="px-2 pt-4">
                                    <Slider
                                        min={1} max={10} step={1}
                                        value={[field.value]}
                                        onValueChange={(val) => field.onChange(val[0])}
                                    />
                                    <div className="flex justify-between mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        <span>Mauvais</span>
                                        <span className="text-2xl text-indigo-500 font-black">{field.value}</span>
                                        <span>Réparateur</span>
                                    </div>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Energie */}
                <FormField
                    control={form.control}
                    name="energyLevel"
                    render={({ field }) => (
                        <FormItem className="space-y-6">
                            <FormLabel className="text-slate-900 font-bold flex items-center gap-2">
                                <Zap className="text-emerald-500" size={20} />
                                C. Ton niveau d'énergie global (1-10)
                            </FormLabel>
                            <FormControl>
                                <div className="px-2 pt-4">
                                    <Slider
                                        min={1} max={10} step={1}
                                        value={[field.value]}
                                        onValueChange={(val) => field.onChange(val[0])}
                                    />
                                    <div className="flex justify-between mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        <span>Épuisée</span>
                                        <span className="text-2xl text-emerald-500 font-black">{field.value}</span>
                                        <span>Radieuse</span>
                                    </div>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Emotions */}
                <FormField
                    control={form.control}
                    name="dominantEmotions"
                    render={({ field }) => (
                        <FormItem className="space-y-4">
                            <FormLabel className="text-slate-900 font-bold flex items-center gap-2">
                                <Smile className="text-ikonga-pink" size={20} />
                                D. Tes émotions dominantes ces derniers temps
                            </FormLabel>
                            <FormControl>
                                <SelectionGrid
                                    options={EMOTION_OPTIONS}
                                    selected={field.value}
                                    onChange={field.onChange}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Relaxation */}
                <FormField
                    control={form.control}
                    name="preferredRelaxation"
                    render={({ field }) => (
                        <FormItem className="space-y-4">
                            <FormLabel className="text-slate-900 font-bold flex items-center gap-2">
                                <Heart className="text-rose-500" size={20} />
                                E. Comment aimes-tu te relaxer ?
                            </FormLabel>
                            <FormControl>
                                <SelectionGrid
                                    options={RELAXATION_OPTIONS}
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
