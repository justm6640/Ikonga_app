"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { Loader2, Sparkles, ChevronRight, Check } from "lucide-react"
import { toast } from "sonner"

import { AnalysisFormData, analysisFormSchema, AnalysisResult } from "@/lib/validators/analysis"
import { generateAndSaveAnalysis } from "@/lib/actions/analysis"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface AnalysisFormProps {
    existingData?: Partial<AnalysisFormData>
    onCancel?: () => void
    onAnalysisGenerated?: (result: AnalysisResult, submittedData: AnalysisFormData) => void
}

export function AnalysisForm({ existingData, onCancel, onAnalysisGenerated }: AnalysisFormProps) {
    const [isPending, startTransition] = useTransition()

    // Default values merging
    const defaultValues: Partial<AnalysisFormData> = {
        allergies: [],
        intolerances: [],
        aliments_refuses: [],
        nb_repas_jour: "3",
        grignotage: "Jamais",
        stress: 5,
        sommeil: 7,
        activite_physique: "Modérée",
        disponibilite_jours: "30min",
        motivation: "Élevée",
        temps_pour_soi: "Parfois",
        routine_beaute: "Basique",
        relation_au_corps: "Neutre",
        objectif: "Perte de poids",
        ...existingData
    }

    const form = useForm<AnalysisFormData>({
        resolver: zodResolver(analysisFormSchema),
        defaultValues: defaultValues as any,
    })

    function onSubmit(data: AnalysisFormData) {
        startTransition(async () => {
            const result = await generateAndSaveAnalysis(data)
            if (result.success) {
                toast.success("Analyse générée avec succès !", {
                    description: "Rosy a terminé son analyse.",
                    icon: <Sparkles className="text-purple-500" />
                })

                if (onAnalysisGenerated && result.data) {
                    onAnalysisGenerated(result.data, data)
                }
            } else {
                toast.error("Erreur", {
                    description: result.error
                })
            }
        })
    }

    return (
        <div className="max-w-2xl mx-auto">


            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                    {/* SECTION 1: NUTRITION */}
                    <Card className="border-none shadow-md overflow-hidden">
                        <div className="h-1 bg-gradient-to-r from-emerald-400 to-teal-500" />
                        <CardHeader>
                            <CardTitle className="flex items-center text-lg text-emerald-700">
                                🍽️ Nutrition & Habitudes
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="nb_repas_jour"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Combien de repas par jour ?</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Sélectionner" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="1">1 repas (OMAD)</SelectItem>
                                                <SelectItem value="2">2 repas</SelectItem>
                                                <SelectItem value="3">3 repas</SelectItem>
                                                <SelectItem value="3+snack">3 repas + Collation</SelectItem>
                                                <SelectItem value="grignotage_constant">Grignotage constant</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="grignotage"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tendance au grignotage / Sucre ?</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Sélectionner" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Jamais">Jamais</SelectItem>
                                                <SelectItem value="Rarement">Rarement</SelectItem>
                                                <SelectItem value="Parfois (stress)">Parfois (émotionnel/stress)</SelectItem>
                                                <SelectItem value="Souvent">Souvent (tous les jours)</SelectItem>
                                                <SelectItem value="Compulsif">Compulsif / Incontrôlable</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    {/* SECTION 2: WELLNESS */}
                    <Card className="border-none shadow-md overflow-hidden">
                        <div className="h-1 bg-gradient-to-r from-purple-400 to-pink-500" />
                        <CardHeader>
                            <CardTitle className="flex items-center text-lg text-purple-700">
                                😌 Bien-être & Stress
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <FormField
                                control={form.control}
                                name="stress"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex justify-between mb-2">
                                            <FormLabel>Niveau de Stress (0-10)</FormLabel>
                                            <span className="text-sm font-bold text-slate-500">{field.value}/10</span>
                                        </div>
                                        <FormControl>
                                            <Slider
                                                min={0}
                                                max={10}
                                                step={1}
                                                defaultValue={[field.value]}
                                                onValueChange={(vals) => field.onChange(vals[0])}
                                                className="py-4"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="sommeil"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex justify-between mb-2">
                                            <FormLabel>Qualité du Sommeil (0-10)</FormLabel>
                                            <span className="text-sm font-bold text-slate-500">{field.value}/10</span>
                                        </div>
                                        <FormControl>
                                            <Slider
                                                min={0}
                                                max={10}
                                                step={1}
                                                defaultValue={[field.value]}
                                                onValueChange={(vals) => field.onChange(vals[0])}
                                                className="py-4"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    {/* SECTION 3: FITNESS */}
                    <Card className="border-none shadow-md overflow-hidden">
                        <div className="h-1 bg-gradient-to-r from-orange-400 to-red-500" />
                        <CardHeader>
                            <CardTitle className="flex items-center text-lg text-orange-700">
                                🔋 Fitness & Énergie
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="activite_physique"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Niveau d'activité actuel</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Sélectionner" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Sédentaire">Sédentaire (Bureau, peu de marche)</SelectItem>
                                                <SelectItem value="Léger">Léger (Marche 1-2x/semaine)</SelectItem>
                                                <SelectItem value="Modéré">Modéré (Sport 2-3x/semaine)</SelectItem>
                                                <SelectItem value="Intense">Intense (Sport 4x+/semaine)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="disponibilite_jours"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Temps disponible par jour pour bouger</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Sélectionner" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="10min">10-15 minutes max</SelectItem>
                                                <SelectItem value="30min">30 minutes</SelectItem>
                                                <SelectItem value="1h">1 heure</SelectItem>
                                                <SelectItem value="Plus">Plus d'1 heure</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    {/* SECTION 4: BEAUTY & LIFESTYLE */}
                    <Card className="border-none shadow-md overflow-hidden">
                        <div className="h-1 bg-gradient-to-r from-pink-400 to-rose-500" />
                        <CardHeader>
                            <CardTitle className="flex items-center text-lg text-pink-700">
                                💅 Beauté & Lifestyle
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="routine_beaute"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Votre Routine Beauté actuelle</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Sélectionner" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Inexistante">Inexistante (Juste de l'eau)</SelectItem>
                                                <SelectItem value="Basique">Basique (Nettoyant + Crème)</SelectItem>
                                                <SelectItem value="Complète">Complète (Sérum, Crème, Gommage...)</SelectItem>
                                                <SelectItem value="Experte">Experte (Layering, Rétinol...)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="relation_au_corps"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Relation avec votre corps</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Sélectionner" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Difficile">Difficile, je me cache</SelectItem>
                                                <SelectItem value="Neutre">Neutre, je ne le regarde pas trop</SelectItem>
                                                <SelectItem value="Bonne">Bonne, mais je veux améliorer</SelectItem>
                                                <SelectItem value="Excellente">Excellente, je m'aime !</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    {/* SECTION 5: OBJECTIFS & INFOS */}
                    <Card className="border-none shadow-md overflow-hidden">
                        <div className="h-1 bg-gradient-to-r from-blue-400 to-indigo-500" />
                        <CardHeader>
                            <CardTitle className="flex items-center text-lg text-blue-700">
                                🎯 Objectifs & Détails
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="objectif"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Votre Objectif Principal</FormLabel>
                                        <Input {...field} placeholder="Ex: Perdre 10kg, retrouver confiance..." />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none">
                                        Allergies (séparées par des virgules)
                                    </label>
                                    <Input
                                        placeholder="Arachides, Lait..."
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            form.setValue("allergies", val ? val.split(",").map(s => s.trim()) : []);
                                        }}
                                        defaultValue={fieldValueToString(existingData?.allergies)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none">
                                        Douleurs / Limitations (optionnel)
                                    </label>
                                    <Input {...form.register("douleurs")} placeholder="Genoux, Dos..." />
                                </div>
                            </div>

                            <FormField
                                control={form.control}
                                name="commentaire_libre"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Autre chose à dire à Rosy ?</FormLabel>
                                        <FormControl>
                                            <Textarea {...field} placeholder="Je suis végétarienne, je viens d'accoucher..." />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full h-14 text-lg font-bold rounded-2xl bg-ikonga-gradient shadow-lg shadow-pink-500/20 hover:opacity-90 transition-all"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Analyse en cours par Rosy...
                            </>
                        ) : (
                            <>
                                <Sparkles className="mr-2 h-5 w-5" />
                                Générer mon Analyse Personnalisée
                            </>
                        )}
                    </Button>

                    {onCancel && (
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onCancel}
                            className="w-full"
                        >
                            Annuler
                        </Button>
                    )}
                </form>
            </Form>
        </div>
    )
}

function fieldValueToString(val?: string[]) {
    if (!val) return "";
    return val.join(", ");
}
