"use client"

import { useQuestionnaireStore } from "@/hooks/use-questionnaire-store"
import { motion, AnimatePresence } from "framer-motion"
import { Progress } from "@/components/ui/progress"
import { StepGeneral } from "@/components/questionnaire/steps/StepGeneral"

const STEPS = [
    { id: "general", title: "Faisons connaissance", component: StepGeneral },
    // Placeholder for future steps
    { id: "nutrition", title: "Ton alimentation", component: () => <div>Nutrition (To retrieve)</div> },
    { id: "fitness", title: "Ton activité", component: () => <div>Fitness (To retrieve)</div> },
    { id: "wellness", title: "Ton bien-être", component: () => <div>Wellness (To retrieve)</div> },
    { id: "beauty", title: "Confiance en soi", component: () => <div>Beauty (To retrieve)</div> },
]

export function QuestionnaireWizard() {
    const { currentStep, setStep } = useQuestionnaireStore()

    const progressValue = ((currentStep + 1) / STEPS.length) * 100
    const CurrentStepComponent = STEPS[currentStep].component

    return (
        <div className="max-w-xl mx-auto py-8 px-4">
            {/* Header & Progress */}
            <div className="mb-8 space-y-4">
                <div className="flex justify-between items-center text-sm font-medium text-muted-foreground">
                    <span>Étape {currentStep + 1} sur {STEPS.length}</span>
                    <span>{Math.round(progressValue)}%</span>
                </div>
                <Progress value={progressValue} className="h-2 bg-secondary" />
                <h2 className="text-3xl font-serif text-ikonga-pink mt-4">
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
                            onNext={() => {
                                if (currentStep < STEPS.length - 1) {
                                    setStep(currentStep + 1)
                                } else {
                                    // TODO: Final Submit Action
                                    console.log("Questionnaire Completed")
                                    alert("Terminé ! (Logique de fin à implémenter)")
                                }
                            }}
                        />
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}
