"use client"

import { useQuestionnaireStore } from "@/hooks/use-questionnaire-store"
import { motion, AnimatePresence } from "framer-motion"
import { Progress } from "@/components/ui/progress"
// Import Steps
import { StepGeneral } from "@/components/questionnaire/steps/StepGeneral"
import { StepNutrition } from "@/components/questionnaire/steps/StepNutrition"
import { StepFitness } from "@/components/questionnaire/steps/StepFitness"
import { StepWellness } from "@/components/questionnaire/steps/StepWellness"
import { StepBeauty } from "@/components/questionnaire/steps/StepBeauty"

const STEPS = [
    { id: "general", title: "Faisons connaissance", component: StepGeneral },
    { id: "nutrition", title: "Ton alimentation", component: StepNutrition },
    { id: "fitness", title: "Ton activité", component: StepFitness },
    { id: "wellness", title: "Ton bien-être", component: StepWellness },
    { id: "beauty", title: "Confiance en soi", component: StepBeauty },
]

export function QuestionnaireWizard() {
    const { currentStep, setStep } = useQuestionnaireStore()

    const progressValue = ((currentStep + 1) / STEPS.length) * 100
    const CurrentStepComponent = STEPS[currentStep].component

    // Handlers
    const nextStep = () => {
        if (currentStep < STEPS.length - 1) {
            setStep(currentStep + 1)
        }
    }

    const prevStep = () => {
        if (currentStep > 0) {
            setStep(currentStep - 1)
        }
    }

    return (
        <div className="max-w-xl mx-auto py-8 px-4 w-full">
            {/* Header & Progress */}
            <div className="mb-8 space-y-4">
                <div className="flex justify-between items-center text-sm font-medium text-muted-foreground">
                    <span>Étape {currentStep + 1} sur {STEPS.length}</span>
                    <span>{Math.round(progressValue)}%</span>
                </div>
                <Progress value={progressValue} className="h-2 bg-secondary" />
                <h2 className="text-3xl font-serif text-ikonga-pink mt-6 leading-tight">
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
