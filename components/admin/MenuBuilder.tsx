"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { createDailyMenu } from "@/lib/actions/admin-menu"
import { useTransition } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Coffee, Salad, Apple, Soup } from "lucide-react"

const formSchema = z.object({
    title: z.string().min(1, "Le titre est requis"),
    isPremium: z.boolean().default(false),
    phaseCompat: z.array(z.string()).min(1, "Sélectionnez au moins une phase"),
    breakfast: z.string().min(1, "Petit-déjeuner requis"),
    lunch: z.string().min(1, "Déjeuner requis"),
    snack: z.string().min(1, "Collation requise"),
    dinner: z.string().min(1, "Dîner requis"),
})

const PHASES = [
    { id: "DETOX", label: "Détox" },
    { id: "EQUILIBRE", label: "Équilibre" },
    { id: "CONSOLIDATION", label: "Consolidation" },
    { id: "ENTRETIEN", label: "Entretien" },
]

export function MenuBuilder() {
    const [isPending, startTransition] = useTransition()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            isPremium: false as boolean,
            phaseCompat: [],
            breakfast: "",
            lunch: "",
            snack: "",
            dinner: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const formData = new FormData()
        formData.append("title", values.title)
        formData.append("isPremium", values.isPremium.toString())
        values.phaseCompat.forEach(phase => formData.append("phaseCompat", phase))
        formData.append("breakfast", values.breakfast)
        formData.append("lunch", values.lunch)
        formData.append("snack", values.snack)
        formData.append("dinner", values.dinner)

        startTransition(async () => {
            const result = await createDailyMenu({}, formData)
            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success("Menu créé avec succès !")
                form.reset()
            }
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-4xl">
                <Card className="border-none shadow-sm bg-white rounded-3xl overflow-hidden">
                    <CardContent className="p-8 space-y-8">
                        {/* Header Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                            <div className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Titre du Menu</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ex: Semaine 1 - Lundi" {...field} className="rounded-xl" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="isPremium"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-xl border p-4 shadow-sm">
                                            <div className="space-y-0.5">
                                                <FormLabel>Contenu Premium</FormLabel>
                                                <div className="text-sm text-muted-foreground">
                                                    Réserver ce menu aux abonnés payants.
                                                </div>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="space-y-4">
                                <Label>Phases compatibles</Label>
                                <div className="grid grid-cols-2 gap-3">
                                    {PHASES.map((phase) => (
                                        <FormField
                                            key={phase.id}
                                            control={form.control}
                                            name="phaseCompat"
                                            render={({ field }) => {
                                                return (
                                                    <FormItem
                                                        key={phase.id}
                                                        className="flex flex-row items-start space-x-3 space-y-0 rounded-xl border p-4 shadow-sm hover:bg-slate-50 transition-colors"
                                                    >
                                                        <FormControl>
                                                            <Checkbox
                                                                checked={field.value?.includes(phase.id)}
                                                                onCheckedChange={(checked) => {
                                                                    return checked
                                                                        ? field.onChange([...field.value, phase.id])
                                                                        : field.onChange(
                                                                            field.value?.filter(
                                                                                (value) => value !== phase.id
                                                                            )
                                                                        )
                                                                }}
                                                            />
                                                        </FormControl>
                                                        <FormLabel className="font-normal cursor-pointer w-full">
                                                            {phase.label}
                                                        </FormLabel>
                                                    </FormItem>
                                                )
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-slate-100" />

                        {/* Meals Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Breakfast */}
                            <FormField
                                control={form.control}
                                name="breakfast"
                                render={({ field }) => (
                                    <FormItem className="space-y-3">
                                        <div className="flex items-center gap-2 text-ikonga-pink">
                                            <Coffee size={20} />
                                            <FormLabel className="text-base font-semibold">Petit-Déjeuner</FormLabel>
                                        </div>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Quoi de bon pour bien commencer la journée ?"
                                                className="min-h-[120px] rounded-2xl resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Lunch */}
                            <FormField
                                control={form.control}
                                name="lunch"
                                render={({ field }) => (
                                    <FormItem className="space-y-3">
                                        <div className="flex items-center gap-2 text-pillar-nutrition">
                                            <Salad size={20} />
                                            <FormLabel className="text-base font-semibold">Déjeuner</FormLabel>
                                        </div>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Un repas équilibré et savoureux..."
                                                className="min-h-[120px] rounded-2xl resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Snack */}
                            <FormField
                                control={form.control}
                                name="snack"
                                render={({ field }) => (
                                    <FormItem className="space-y-3">
                                        <div className="flex items-center gap-2 text-pillar-fitness">
                                            <Apple size={20} />
                                            <FormLabel className="text-base font-semibold">Collation</FormLabel>
                                        </div>
                                        <FormControl>
                                            <Textarea
                                                placeholder="La petite pause plaisir et saine..."
                                                className="min-h-[120px] rounded-2xl resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Dinner */}
                            <FormField
                                control={form.control}
                                name="dinner"
                                render={({ field }) => (
                                    <FormItem className="space-y-3">
                                        <div className="flex items-center gap-2 text-pillar-wellness">
                                            <Soup size={20} />
                                            <FormLabel className="text-base font-semibold">Dîner</FormLabel>
                                        </div>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Léger pour un sommeil réparateur..."
                                                className="min-h-[120px] rounded-2xl resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {form.formState.errors.root && (
                            <div className="text-red-500 text-sm mt-2 text-center">
                                {form.formState.errors.root.message}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full h-14 text-lg font-bold rounded-2xl bg-ikonga-gradient hover:opacity-90 transition-opacity"
                            disabled={isPending}
                        >
                            {isPending ? "Enregistrement..." : "Enregistrer le Menu"}
                        </Button>
                    </CardContent>
                </Card>
            </form>
        </Form>
    )
}
