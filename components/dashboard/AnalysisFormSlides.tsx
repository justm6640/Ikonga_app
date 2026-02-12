"use client"

import { useState, useTransition } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { AnalysisSlideTips } from "@/components/dashboard/AnalysisSlideTips"
import { AnalysisFormData, AnalysisResult } from "@/lib/validators/analysis"
import { generateAndSaveAnalysis } from "@/lib/actions/analysis"
import { toast } from "sonner"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface AnalysisFormSlidesProps {
    existingData?: Partial<AnalysisFormData>
    onComplete: (result: AnalysisResult, submittedData: AnalysisFormData) => void
    onCancel?: () => void
}

export function AnalysisFormSlides({ existingData, onComplete, onCancel }: AnalysisFormSlidesProps) {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [isPending, startTransition] = useTransition()

    const [formData, setFormData] = useState<Partial<AnalysisFormData>>({
        allergies: existingData?.allergies || [],
        intolerances: existingData?.intolerances || [],
        aliments_refuses: existingData?.aliments_refuses || [],
        nb_repas_jour: existingData?.nb_repas_jour || "3",
        grignotage: existingData?.grignotage || "Jamais",
        stress: existingData?.stress || 5,
        sommeil: existingData?.sommeil || 5,
        activite_physique: existingData?.activite_physique || "Modéré",
        douleurs: existingData?.douleurs || "",
        disponibilite_jours: existingData?.disponibilite_jours || "30min",
        motivation: existingData?.motivation || "Moyenne",
        temps_pour_soi: existingData?.temps_pour_soi || "Parfois",
        routine_beaute: existingData?.routine_beaute || "Basique",
        relation_au_corps: existingData?.relation_au_corps || "Neutre",
        objectif: existingData?.objectif || "",
        commentaire_libre: existingData?.commentaire_libre || "",
        autres_infos: existingData?.autres_infos || "",
        startWeight: existingData?.startWeight || undefined,
        targetWeight: existingData?.targetWeight || undefined,
        heightCm: existingData?.heightCm || undefined,
        countryOrigin: existingData?.countryOrigin || "",
    })

    const totalSlides = 9

    const updateFormData = (field: keyof AnalysisFormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleNext = () => {
        if (currentSlide < totalSlides - 1) {
            setCurrentSlide(prev => prev + 1)
        } else {
            // Last slide - submit and generate analysis
            handleSubmit()
        }
    }

    const handleSubmit = () => {
        startTransition(async () => {
            try {
                const result = await generateAndSaveAnalysis(formData as AnalysisFormData)

                if (result.success && result.data) {
                    toast.success("Analyse générée avec succès ! ✨")
                    onComplete(result.data, formData as AnalysisFormData)
                } else {
                    toast.error(result.error || "Une erreur est survenue")
                }
            } catch (error) {
                console.error("Submit error:", error)
                toast.error("Une erreur est survenue lors de la génération de l'analyse")
            }
        })
    }

    const handlePrev = () => {
        if (currentSlide > 0) {
            setCurrentSlide(prev => prev - 1)
        }
    }

    const handleSlideClick = (index: number) => {
        if (index <= currentSlide) {
            setCurrentSlide(index)
        }
    }

    const toggleArrayItem = (field: keyof AnalysisFormData, item: string) => {
        setFormData(prev => {
            const currentArray = (prev[field] as string[]) || []
            const newArray = currentArray.includes(item)
                ? currentArray.filter(i => i !== item)
                : [...currentArray, item]
            return { ...prev, [field]: newArray }
        })
    }

    const slides = [
        // Slide 0: Bienvenue
        <div key="welcome" className="space-y-6">
            <div className="text-center space-y-4">
                <h2 className="text-4xl font-serif font-bold text-transparent bg-clip-text bg-ikonga-gradient">
                    Créons ton profil ensemble 🌸
                </h2>
                <p className="text-lg text-slate-600">
                    Ces informations nous permettent de personnaliser ton parcours IKONGA
                </p>
            </div>
            <AnalysisSlideTips type="welcome" />
        </div>,

        // Slide 1: Informations de base
        <div key="basics" className="space-y-6">
            <h2 className="text-2xl font-serif font-bold text-slate-900">
                Informations de base 📊
            </h2>
            <div className="space-y-4">
                <div>
                    <Label htmlFor="startWeight">Poids de départ (kg) *</Label>
                    <Input
                        id="startWeight"
                        type="number"
                        value={formData.startWeight || ""}
                        onChange={(e) => updateFormData("startWeight", parseFloat(e.target.value))}
                        placeholder="Ex: 75"
                        className="mt-2"
                    />
                </div>
                <div>
                    <Label htmlFor="heightCm">Taille (cm) *</Label>
                    <Input
                        id="heightCm"
                        type="number"
                        value={formData.heightCm || ""}
                        onChange={(e) => updateFormData("heightCm", parseFloat(e.target.value))}
                        placeholder="Ex: 165"
                        className="mt-2"
                    />
                </div>
                <div>
                    <Label htmlFor="countryOrigin">Pays de résidence *</Label>
                    <Input
                        id="countryOrigin"
                        type="text"
                        value={formData.countryOrigin || ""}
                        onChange={(e) => updateFormData("countryOrigin", e.target.value)}
                        placeholder="Ex: France"
                        className="mt-2"
                    />
                </div>
            </div>
            <AnalysisSlideTips type="basics" />
        </div>,

        // Slide 1: Allergies & Intolérances
        <div key="allergies" className="space-y-6">
            <h2 className="text-2xl font-serif font-bold text-slate-900">
                Allergies & Intolérances 🥜🍃
            </h2>

            <div className="space-y-4">
                <div>
                    <Label className="text-base font-medium mb-3 block">Allergies</Label>
                    <div className="grid grid-cols-2 gap-2">
                        {["Gluten", "Lactose", "Fruits à coque", "Œufs", "Poisson", "Crustacés", "Aucune"].map(allergy => (
                            <button
                                key={allergy}
                                type="button"
                                onClick={() => toggleArrayItem("allergies", allergy)}
                                className={`p-3 rounded-xl border-2 transition-all text-sm ${formData.allergies?.includes(allergy)
                                    ? "border-ikonga-coral bg-ikonga-coral/10 text-ikonga-coral font-bold"
                                    : "border-slate-200 hover:border-slate-300"
                                    }`}
                            >
                                {allergy}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <Label className="text-base font-medium mb-3 block">Intolérances</Label>
                    <div className="grid grid-cols-2 gap-2">
                        {["Lactose", "Gluten", "FODMAPs", "Fructose", "Aucune"].map(intolerance => (
                            <button
                                key={intolerance}
                                type="button"
                                onClick={() => toggleArrayItem("intolerances", intolerance)}
                                className={`p-3 rounded-xl border-2 transition-all text-sm ${formData.intolerances?.includes(intolerance)
                                    ? "border-ikonga-coral bg-ikonga-coral/10 text-ikonga-coral font-bold"
                                    : "border-slate-200 hover:border-slate-300"
                                    }`}
                            >
                                {intolerance}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <AnalysisSlideTips type="allergies" />
        </div>,

        // Slide 2: Nutrition
        <div key="nutrition" className="space-y-6">
            <h2 className="text-2xl font-serif font-bold text-slate-900">
                Alimentation 🍽️
            </h2>

            <div className="space-y-4">
                <div>
                    <Label>Combien de repas par jour ?</Label>
                    <Select value={formData.nb_repas_jour} onValueChange={(val) => updateFormData("nb_repas_jour", val)}>
                        <SelectTrigger className="mt-2">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1">1 repas</SelectItem>
                            <SelectItem value="2">2 repas</SelectItem>
                            <SelectItem value="3">3 repas</SelectItem>
                            <SelectItem value="3+grignotage">3+ grignotages</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label>Grignotage ?</Label>
                    <Select value={formData.grignotage} onValueChange={(val) => updateFormData("grignotage", val)}>
                        <SelectTrigger className="mt-2">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Jamais">Jamais</SelectItem>
                            <SelectItem value="Parfois (stress)">Parfois (stress)</SelectItem>
                            <SelectItem value="Souvent">Souvent</SelectItem>
                            <SelectItem value="Tout le temps">Tout le temps</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label className="text-base font-medium mb-3 block">Aliments refusés (optionnel)</Label>
                    <div className="grid grid-cols-2 gap-2">
                        {["Viande rouge", "Porc", "Alcool", "Légumineuses", "Produits laitiers"].map(food => (
                            <button
                                key={food}
                                type="button"
                                onClick={() => toggleArrayItem("aliments_refuses", food)}
                                className={`p-3 rounded-xl border-2 transition-all text-sm ${formData.aliments_refuses?.includes(food)
                                    ? "border-ikonga-coral bg-ikonga-coral/10 text-ikonga-coral font-bold"
                                    : "border-slate-200 hover:border-slate-300"
                                    }`}
                            >
                                {food}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <AnalysisSlideTips type="habits" />
        </div>,

        // Slide 3: Wellness
        <div key="wellness" className="space-y-6">
            <h2 className="text-2xl font-serif font-bold text-slate-900">
                Bien-être 🧘‍♀️
            </h2>

            <div className="space-y-6">
                <div>
                    <Label>Niveau de stress (1-10)</Label>
                    <div className="mt-4 px-2">
                        <Slider
                            value={[formData.stress || 5]}
                            onValueChange={([val]) => updateFormData("stress", val)}
                            max={10}
                            min={1}
                            step={1}
                        />
                        <div className="text-center mt-2 text-2xl font-bold text-ikonga-coral">
                            {formData.stress}/10
                        </div>
                    </div>
                </div>

                <div>
                    <Label>Qualité du sommeil (1-10)</Label>
                    <div className="mt-4 px-2">
                        <Slider
                            value={[formData.sommeil || 5]}
                            onValueChange={([val]) => updateFormData("sommeil", val)}
                            max={10}
                            min={1}
                            step={1}
                        />
                        <div className="text-center mt-2 text-2xl font-bold text-ikonga-coral">
                            {formData.sommeil}/10
                        </div>
                    </div>
                </div>
            </div>

            <AnalysisSlideTips type="wellness" />
        </div>,

        // Slide 4: Fitness
        <div key="fitness" className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">
                Activité Physique 💪
            </h2>

            <div className="space-y-4">
                <div>
                    <Label>Niveau d'activité actuel</Label>
                    <Select value={formData.activite_physique} onValueChange={(val) => updateFormData("activite_physique", val)}>
                        <SelectTrigger className="mt-2">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Sédentaire">Sédentaire</SelectItem>
                            <SelectItem value="Léger">Léger</SelectItem>
                            <SelectItem value="Modéré">Modéré</SelectItem>
                            <SelectItem value="Intense">Intense</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label>Disponibilité par jour</Label>
                    <Select value={formData.disponibilite_jours} onValueChange={(val) => updateFormData("disponibilite_jours", val)}>
                        <SelectTrigger className="mt-2">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="15min">15 minutes</SelectItem>
                            <SelectItem value="30min">30 minutes</SelectItem>
                            <SelectItem value="1h">1 heure</SelectItem>
                            <SelectItem value="Illimité">Illimité</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label htmlFor="douleurs">Douleurs ou limitations (optionnel)</Label>
                    <Input
                        id="douleurs"
                        value={formData.douleurs}
                        onChange={(e) => updateFormData("douleurs", e.target.value)}
                        placeholder="Ex: Mal de dos, genoux fragiles..."
                        className="mt-2"
                    />
                </div>
            </div>

            <AnalysisSlideTips type="fitness" />
        </div>,

        // Slide 5: Lifestyle & Beauty
        <div key="lifestyle" className="space-y-6">
            <h2 className="text-2xl font-serif font-bold text-slate-900">
                Lifestyle & Beauté ✨
            </h2>

            <div className="space-y-4">
                <div>
                    <Label>Temps pour toi</Label>
                    <Select value={formData.temps_pour_soi} onValueChange={(val) => updateFormData("temps_pour_soi", val)}>
                        <SelectTrigger className="mt-2">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Jamais">Jamais</SelectItem>
                            <SelectItem value="Rarement">Rarement</SelectItem>
                            <SelectItem value="Parfois">Parfois</SelectItem>
                            <SelectItem value="Régulièrement">Régulièrement</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label>Routine beauté</Label>
                    <Select value={formData.routine_beaute} onValueChange={(val) => updateFormData("routine_beaute", val)}>
                        <SelectTrigger className="mt-2">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Inexistante">Inexistante</SelectItem>
                            <SelectItem value="Basique">Basique</SelectItem>
                            <SelectItem value="Complète">Complète</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label>Relation au corps</Label>
                    <Select value={formData.relation_au_corps} onValueChange={(val) => updateFormData("relation_au_corps", val)}>
                        <SelectTrigger className="mt-2">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Mauvaise">Mauvaise</SelectItem>
                            <SelectItem value="Difficile">Difficile</SelectItem>
                            <SelectItem value="Neutre">Neutre</SelectItem>
                            <SelectItem value="Bonne">Bonne</SelectItem>
                            <SelectItem value="Excellente">Excellente</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <AnalysisSlideTips type="beauty" />
        </div>,

        // Slide 6: Motivation & Objectifs
        <div key="goals" className="space-y-6">
            <h2 className="text-2xl font-serif font-bold text-slate-900">
                Objectifs & Motivation 🎯
            </h2>

            <div className="space-y-4">
                <div>
                    <Label>Objectif principal *</Label>
                    <Select value={formData.objectif} onValueChange={(val) => updateFormData("objectif", val)}>
                        <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Sélectionne ton objectif" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Perte de poids">Perte de poids</SelectItem>
                            <SelectItem value="Santé">Santé</SelectItem>
                            <SelectItem value="Énergie">Énergie</SelectItem>
                            <SelectItem value="Confiance">Confiance en moi</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label htmlFor="targetWeight">Poids cible (kg)</Label>
                    <Input
                        id="targetWeight"
                        type="number"
                        value={formData.targetWeight || ""}
                        onChange={(e) => updateFormData("targetWeight", parseFloat(e.target.value))}
                        placeholder="Ex: 60"
                        className="mt-2"
                    />
                </div>

                <div>
                    <Label>Niveau de motivation</Label>
                    <Select value={formData.motivation} onValueChange={(val) => updateFormData("motivation", val)}>
                        <SelectTrigger className="mt-2">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Faible">Faible</SelectItem>
                            <SelectItem value="Moyenne">Moyenne</SelectItem>
                            <SelectItem value="Élevée">Élevée</SelectItem>
                            <SelectItem value="Maximale">Maximale</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <AnalysisSlideTips type="goals" />
        </div>,

        // Slide 7: Commentaire libre & Récapitulatif
        <div key="comment" className="space-y-6">
            <h2 className="text-2xl font-serif font-bold text-slate-900">
                Commentaire libre 💭
            </h2>

            <div>
                <Label htmlFor="commentaire_libre">Quelque chose d'important à nous dire ?</Label>
                <Textarea
                    id="commentaire_libre"
                    value={formData.commentaire_libre}
                    onChange={(e) => updateFormData("commentaire_libre", e.target.value)}
                    placeholder="Y a-t-il quelque chose d'important que nous devrions savoir ? (Contraintes horaires, préférences spécifiques, etc.)"
                    className="mt-2 min-h-[150px]"
                />
            </div>

            <AnalysisSlideTips type="comment" />
        </div>,
    ]

    return (
        <div className="max-w-2xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-600">
                        Étape {currentSlide + 1} sur {totalSlides}
                    </span>
                    <span className="text-sm text-slate-500">
                        {Math.round(((currentSlide + 1) / totalSlides) * 100)}%
                    </span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-ikonga-gradient"
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>

                {/* Slide indicators */}
                <div className="flex gap-1 mt-3 justify-center">
                    {Array.from({ length: totalSlides }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => handleSlideClick(index)}
                            className={`w-2 h-2 rounded-full transition-all ${index === currentSlide
                                ? "bg-ikonga-coral w-6"
                                : index < currentSlide
                                    ? "bg-ikonga-coral/50 cursor-pointer hover:bg-ikonga-coral/70"
                                    : "bg-slate-300"
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* Slides */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="min-h-[400px]"
                >
                    {slides[currentSlide]}
                </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-200">
                <div>
                    {currentSlide > 0 && (
                        <Button
                            variant="ghost"
                            onClick={handlePrev}
                            className="gap-2"
                            disabled={isPending}
                        >
                            <ChevronLeft size={20} />
                            Précédent
                        </Button>
                    )}
                    {onCancel && currentSlide === 0 && (
                        <Button variant="ghost" onClick={onCancel} disabled={isPending}>
                            Annuler
                        </Button>
                    )}
                </div>

                <Button
                    onClick={handleNext}
                    className="gap-2 bg-ikonga-gradient hover:opacity-90"
                    disabled={isPending}
                >
                    {isPending ? (
                        <>
                            <Loader2 size={20} className="animate-spin" />
                            Génération...
                        </>
                    ) : currentSlide === totalSlides - 1 ? (
                        <>
                            <Check size={20} />
                            Générer mon analyse
                        </>
                    ) : (
                        <>
                            Suivant
                            <ChevronRight size={20} />
                        </>
                    )}
                </Button>
            </div>
        </div>
    )
}
