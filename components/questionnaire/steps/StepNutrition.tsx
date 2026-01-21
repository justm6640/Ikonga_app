"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { step2NutritionSchema } from "@/lib/validators/questionnaire"
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
import { Textarea } from "@/components/ui/textarea"
import { SelectionGrid } from "@/components/questionnaire/SelectionGrid"
import { ChevronLeft, Soup, Ban, Zap, Utensils, Target, Heart, Clock } from "lucide-react"

type Step2Data = z.infer<typeof step2NutritionSchema>

interface StepNutritionProps {
    onNext: () => void
    onBack: () => void
}

const ALLERGY_OPTIONS = [
    { id: "PEANUTS", label: "Arachides" },
    { id: "GLUTEN", label: "Gluten" },
    { id: "LACTOSE", label: "Lactose" },
    { id: "SEAFOOD", label: "Fruits de mer / Poissons" },
    { id: "EGGS", label: "Œufs" },
    { id: "SOYA", label: "Soja" },
    { id: "NONE", label: "Aucun" }
]

const REFUSED_OPTIONS = [
    { id: "RED_MEAT", label: "Viande rouge" },
    { id: "POULTRY", label: "Volaille" },
    { id: "FISH", label: "Poisson" },
    { id: "LEGUMES", label: "Légumineuses" },
    { id: "DAIRY", label: "Produits laitiers" },
    { id: "CARBS_EVENING", label: "Féculents le soir" },
    { id: "NONE", label: "Aucun" }
]

const HABIT_OPTIONS = [
    { id: "SKIP_BREAKFAST", label: "Je saute le petit-déjeuner" },
    { id: "SNACKING", label: "Je grignote entre les repas" },
    { id: "LOW_WATER", label: "Je bois peu d'eau" },
    { id: "SODA", label: "Je bois du soda" },
    { id: "LARGE_DINNER", label: "Grosse quantité le soir" },
    { id: "FAST_EATING", label: "Je mange très vite" },
    { id: "NONE", label: "Aucun" }
]

const MEALS_OPTIONS = [
    { id: "1", label: "1 repas" },
    { id: "2", label: "2 repas" },
    { id: "3", label: "3 repas" },
    { id: "3_SNACK", label: "3 repas + collation" },
    { id: "VARIABLE", label: "Variable" }
]

const EQUIPMENT_OPTIONS = [
    { id: "FRIDGE", label: "Frigo", icon: Utensils },
    { id: "FREEZER", label: "Congélateur", icon: Utensils },
    { id: "MICROWAVE", label: "Micro-ondes", icon: Zap },
    { id: "GAS", label: "Gazinière", icon: Utensils },
    { id: "BLENDER", label: "Blender", icon: Target },
    { id: "NONE", label: "Aucun" }
]

const GOAL_OPTIONS = [
    { id: "LOSE_WEIGHT", label: "Perdre du poids" },
    { id: "STABILIZE", label: "Stabiliser" },
    { id: "EAT_BETTER", label: "Mieux manger" },
    { id: "LESS_SUGAR", label: "Réduire le sucre" },
    { id: "LESS_STRESS", label: "Gérer le stress alimentaire" }
]

export function StepNutrition({ onNext, onBack }: StepNutritionProps) {
    const { data, setData } = useQuestionnaireStore()

    const form = useForm<Step2Data>({
        resolver: zodResolver(step2NutritionSchema),
        defaultValues: {
            allergies: Array.isArray(data.allergies) ? data.allergies : [],
            refusedFoods: Array.isArray(data.refusedFoods) ? data.refusedFoods : [],
            eatingHabits: Array.isArray(data.eatingHabits) ? data.eatingHabits : [],
            mealsPerDay: data.mealsPerDay || "3",
            kitchenEquipment: Array.isArray(data.kitchenEquipment) ? data.kitchenEquipment : [],
            nutritionGoals: Array.isArray(data.nutritionGoals) ? data.nutritionGoals : [],
            favoriteFoods: data.favoriteFoods || ""
        },
    })

    function onSubmit(values: Step2Data) {
        setData(values)
        onNext()
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">

                {/* Allergies */}
                <FormField
                    control={form.control}
                    name="allergies"
                    render={({ field }) => (
                        <FormItem className="space-y-4">
                            <FormLabel className="text-slate-900 font-bold flex items-center gap-2">
                                <Soup className="text-ikonga-pink" size={20} />
                                A. Allergies & Intolérances
                            </FormLabel>
                            <FormControl>
                                <SelectionGrid
                                    options={ALLERGY_OPTIONS}
                                    selected={field.value}
                                    onChange={field.onChange}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Refusés */}
                <FormField
                    control={form.control}
                    name="refusedFoods"
                    render={({ field }) => (
                        <FormItem className="space-y-4">
                            <FormLabel className="text-slate-900 font-bold flex items-center gap-2">
                                <Ban className="text-rose-500" size={20} />
                                B. Aliments strictement refusés
                            </FormLabel>
                            <FormControl>
                                <SelectionGrid
                                    options={REFUSED_OPTIONS}
                                    selected={field.value}
                                    onChange={field.onChange}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Habitudes */}
                <FormField
                    control={form.control}
                    name="eatingHabits"
                    render={({ field }) => (
                        <FormItem className="space-y-4">
                            <FormLabel className="text-slate-900 font-bold flex items-center gap-2">
                                <Clock className="text-indigo-500" size={20} />
                                C. Habitudes alimentaires
                            </FormLabel>
                            <FormControl>
                                <SelectionGrid
                                    options={HABIT_OPTIONS}
                                    selected={field.value}
                                    onChange={field.onChange}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Nombre de repas */}
                <FormField
                    control={form.control}
                    name="mealsPerDay"
                    render={({ field }) => (
                        <FormItem className="space-y-4">
                            <FormLabel className="text-slate-900 font-bold">D. Nombre de repas par jour</FormLabel>
                            <FormControl>
                                <SelectionGrid
                                    options={MEALS_OPTIONS}
                                    selected={[field.value]}
                                    onChange={(val) => field.onChange(val[0])}
                                    multi={false}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Matériel */}
                <FormField
                    control={form.control}
                    name="kitchenEquipment"
                    render={({ field }) => (
                        <FormItem className="space-y-4">
                            <FormLabel className="text-slate-900 font-bold flex items-center gap-2">
                                <Utensils className="text-amber-500" size={20} />
                                E. Accès cuisine / matériel
                            </FormLabel>
                            <FormControl>
                                <SelectionGrid
                                    options={EQUIPMENT_OPTIONS}
                                    selected={field.value}
                                    onChange={field.onChange}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Objectifs */}
                <FormField
                    control={form.control}
                    name="nutritionGoals"
                    render={({ field }) => (
                        <FormItem className="space-y-4">
                            <FormLabel className="text-slate-900 font-bold flex items-center gap-2">
                                <Target className="text-emerald-500" size={20} />
                                F. Objectifs nutritionnels
                            </FormLabel>
                            <FormControl>
                                <SelectionGrid
                                    options={GOAL_OPTIONS}
                                    selected={field.value}
                                    onChange={field.onChange}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Préférés */}
                <FormField
                    control={form.control}
                    name="favoriteFoods"
                    render={({ field }) => (
                        <FormItem className="space-y-4">
                            <FormLabel className="text-slate-900 font-bold flex items-center gap-2">
                                <Heart className="text-pink-500" size={20} />
                                G. Aliments préférés
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Libre cours à tes envies (ex: avocat, poulet grillé, chocolat noir...)"
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
