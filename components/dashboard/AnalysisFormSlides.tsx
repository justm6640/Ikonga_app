"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { AnalysisSlideTips } from "@/components/dashboard/AnalysisSlideTips"

interface AnalysisFormSlidesProps {
    existingData?: any
    onComplete: (formData: any) => void
    onCancel?: () => void
}

export function AnalysisFormSlides({ existingData, onComplete, onCancel }: AnalysisFormSlidesProps) {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [formData, setFormData] = useState({
        startWeight: existingData?.startWeight || "",
        heightCm: existingData?.heightCm || "",
        countryOrigin: existingData?.countryOrigin || "",
        allergies: existingData?.allergies || [],
        intolerances: existingData?.intolerances || [],
        targetWeight: existingData?.targetWeight || "",
        freeComment: existingData?.freeComment || "",
    })

    const totalSlides = 8

    const updateFormData = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleNext = () => {
        if (currentSlide < totalSlides - 1) {
            setCurrentSlide(prev => prev + 1)
        } else {
            // Last slide - submit
            onComplete(formData)
        }
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

    const toggleArrayItem = (field: string, item: string) => {
        setFormData(prev => {
            const currentArray = prev[field as keyof typeof prev] as string[]
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
                        value={formData.startWeight}
                        onChange={(e) => updateFormData("startWeight", e.target.value)}
                        placeholder="Ex: 75"
                        className="mt-2"
                    />
                </div>
                <div>
                    <Label htmlFor="heightCm">Taille (cm) *</Label>
                    <Input
                        id="heightCm"
                        type="number"
                        value={formData.heightCm}
                        onChange={(e) => updateFormData("heightCm", e.target.value)}
                        placeholder="Ex: 165"
                        className="mt-2"
                    />
                </div>
                <div>
                    <Label htmlFor="countryOrigin">Pays de résidence *</Label>
                    <Input
                        id="countryOrigin"
                        type="text"
                        value={formData.countryOrigin}
                        onChange={(e) => updateFormData("countryOrigin", e.target.value)}
                        placeholder="Ex: France"
                        className="mt-2"
                    />
                </div>
            </div>
            <AnalysisSlideTips type="basics" />
        </div>,

        // Slide 2: Allergies
        <div key="allergies" className="space-y-6">
            <h2 className="text-2xl font-serif font-bold text-slate-900">
                Allergies 🥜
            </h2>
            <p className="text-sm text-slate-600">Sélectionne toutes celles qui te concernent</p>
            <div className="grid grid-cols-2 gap-3">
                {["Gluten", "Lactose", "Fruits à coque", "Œufs", "Poisson", "Crustacés", "Sésame", "Aucune"].map(allergy => (
                    <button
                        key={allergy}
                        onClick={() => toggleArrayItem("allergies", allergy)}
                        className={`p-4 rounded-2xl border-2 transition-all ${formData.allergies.includes(allergy)
                            ? "border-ikonga-coral bg-ikonga-coral/10 text-ikonga-coral font-bold"
                            : "border-slate-200 hover:border-slate-300"
                            }`}
                    >
                        {allergy}
                    </button>
                ))}
            </div>
            <AnalysisSlideTips type="allergies" />
        </div>,

        // Slide 3: Intolérances
        <div key="intolerances" className="space-y-6">
            <h2 className="text-2xl font-serif font-bold text-slate-900">
                Intolérances 🍃
            </h2>
            <p className="text-sm text-slate-600">Différentes des allergies, elles concernent ton confort digestif</p>
            <div className="grid grid-cols-2 gap-3">
                {["Lactose", "Gluten", "FODMAPs", "Fructose", "Histamine", "Aucune"].map(intolerance => (
                    <button
                        key={intolerance}
                        onClick={() => toggleArrayItem("intolerances", intolerance)}
                        className={`p-4 rounded-2xl border-2 transition-all ${formData.intolerances.includes(intolerance)
                            ? "border-ikonga-coral bg-ikonga-coral/10 text-ikonga-coral font-bold"
                            : "border-slate-200 hover:border-slate-300"
                            }`}
                    >
                        {intolerance}
                    </button>
                ))}
            </div>
            <AnalysisSlideTips type="intolerances" />
        </div>,

        // Slide 4: Habitudes alimentaires (placeholder)
        <div key="habits" className="space-y-6">
            <h2 className="text-2xl font-serif font-bold text-slate-900">
                Habitudes alimentaires 🍽️
            </h2>
            <p className="text-slate-600">
                Cette section sera complétée avec les champs du questionnaire existant
            </p>
            <AnalysisSlideTips type="habits" />
        </div>,

        // Slide 5: Objectifs
        <div key="goals" className="space-y-6">
            <h2 className="text-2xl font-serif font-bold text-slate-900">
                Objectifs 🎯
            </h2>
            <div>
                <Label htmlFor="targetWeight">Poids cible (kg)</Label>
                <Input
                    id="targetWeight"
                    type="number"
                    value={formData.targetWeight}
                    onChange={(e) => updateFormData("targetWeight", e.target.value)}
                    placeholder="Ex: 65"
                    className="mt-2"
                />
            </div>
            <AnalysisSlideTips type="goals" />
        </div>,

        // Slide 6: Commentaire libre
        <div key="comment" className="space-y-6">
            <h2 className="text-2xl font-serif font-bold text-slate-900">
                Commentaire libre 💭
            </h2>
            <div>
                <Label htmlFor="freeComment">Quelque chose d'important à nous dire ?</Label>
                <Textarea
                    id="freeComment"
                    value={formData.freeComment}
                    onChange={(e) => updateFormData("freeComment", e.target.value)}
                    placeholder="Y a-t-il quelque chose d'important que nous devrions savoir ? (Contraintes horaires, préférences spécifiques, etc.)"
                    className="mt-2 min-h-[150px]"
                />
            </div>
            <AnalysisSlideTips type="comment" />
        </div>,

        // Slide 7: Récapitulatif
        <div key="summary" className="space-y-6">
            <h2 className="text-2xl font-serif font-bold text-slate-900">
                Récapitulatif ✨
            </h2>
            <div className="space-y-3 p-6 bg-slate-50 rounded-2xl">
                <div><strong>Poids de départ:</strong> {formData.startWeight} kg</div>
                <div><strong>Taille:</strong> {formData.heightCm} cm</div>
                <div><strong>Pays:</strong> {formData.countryOrigin}</div>
                <div><strong>Allergies:</strong> {formData.allergies.join(", ") || "Aucune"}</div>
                <div><strong>Intolérances:</strong> {formData.intolerances.join(", ") || "Aucune"}</div>
                <div><strong>Poids cible:</strong> {formData.targetWeight || "Non défini"} kg</div>
                {formData.freeComment && <div><strong>Commentaire:</strong> {formData.freeComment}</div>}
            </div>
            <AnalysisSlideTips type="summary" />
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
                        >
                            <ChevronLeft size={20} />
                            Précédent
                        </Button>
                    )}
                    {onCancel && currentSlide === 0 && (
                        <Button variant="ghost" onClick={onCancel}>
                            Annuler
                        </Button>
                    )}
                </div>

                <Button
                    onClick={handleNext}
                    className="gap-2 bg-ikonga-gradient hover:opacity-90"
                >
                    {currentSlide === totalSlides - 1 ? (
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
