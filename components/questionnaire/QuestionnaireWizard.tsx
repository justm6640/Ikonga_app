"use client"

import { useQuestionnaireStore } from "@/hooks/use-questionnaire-store"
import { motion, AnimatePresence } from "framer-motion"
import { Progress } from "@/components/ui/progress"
// Import Steps
import { StepGeneral } from "@/components/questionnaire/steps/StepGeneral"
import { StepNutrition } from "@/components/questionnaire/steps/StepNutrition"
import { StepFitness } from "@/components/questionnaire/steps/StepFitness"
import { StepWellness } from "@/components/questionnaire/steps/StepWellness"
import { StepHealth } from "@/components/questionnaire/steps/StepHealth"
import { StepLifestyle } from "@/components/questionnaire/steps/StepLifestyle"
import { StepBeauty } from "@/components/questionnaire/steps/StepBeauty"
import { StepMotivation } from "@/components/questionnaire/steps/StepMotivation"

const STEPS = [
    { id: "general", title: "Informations générales", component: StepGeneral },
    { id: "nutrition", title: "IKONUTRITION", component: StepNutrition },
    { id: "fitness", title: "IKOFITNESS", component: StepFitness },
    { id: "wellness", title: "IKOWELLNESS", component: StepWellness },
    { id: "health", title: "IKONUTRITION+ (Santé)", component: StepHealth },
    { id: "lifestyle", title: "IKOLIFESTYLE", component: StepLifestyle },
    { id: "beauty", title: "IKOBEAUTY", component: StepBeauty },
    { id: "motivation", title: "Motivation & Engagement", component: StepMotivation },
]

export function QuestionnaireWizard() {
    const { currentStep, setStep } = useQuestionnaireStore()

    const progressValue = ((currentStep + 1) / STEPS.length) * 100
    const CurrentStepComponent = STEPS[currentStep].component

    // Handlers
    const nextStep = () => {
        if (currentStep < STEPS.length - 1) {
            setStep(currentStep + 1)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }

    const prevStep = () => {
        if (currentStep > 0) {
            setStep(currentStep - 1)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }

    return (
        <div className="max-w-xl mx-auto py-8 px-4 w-full">
            {/* Header & Progress */}
            <div className="mb-8 space-y-4">
                <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <span>Bloc {currentStep + 1} / {STEPS.length}</span>
                    <span>{Math.round(progressValue)}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressValue}%` }}
                        className="h-full bg-ikonga-gradient shadow-[0_0_10px_rgba(236,72,153,0.3)]"
                    />
                </div>
                <h2 className="text-3xl font-serif text-slate-900 mt-6 leading-tight">
                    {STEPS[currentStep].title}
                </h2>
            </div>

            {/* Step Content with Animation */}
            <div className="relative min-h-[400px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -20, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <CurrentStepComponent
                            onNext={nextStep}
                            onBack={prevStep}
                        />
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}
