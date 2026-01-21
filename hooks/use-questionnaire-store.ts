import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { QuestionnaireData } from '@/lib/validators/questionnaire'

interface QuestionnaireState {
    data: Partial<QuestionnaireData>
    currentStep: number // 0 to 7 (depending on total steps)

    // Actions
    setStep: (step: number) => void
    setData: (data: Partial<QuestionnaireData>) => void
    reset: () => void
}

export const useQuestionnaireStore = create<QuestionnaireState>()(
    persist(
        (set) => ({
            data: {
                allergies: [],
                refusedFoods: [],
                eatingHabits: [],
                kitchenEquipment: [],
                nutritionGoals: [],
                currentActivity: [],
                availableWorkoutDays: [],
                preferredExercises: [],
                physicalLimitations: [],
                dominantEmotions: [],
                preferredRelaxation: [],
                supplements: [],
                healthIssues: [],
                mainChallenges: [],
                aestheticConcerns: [],
                whyJoin: [],
                stressLevel: 5,
                sleepQuality: 7,
                energyLevel: 6,
                morningPosture: "MODERATE",
            },
            currentStep: 0,

            setStep: (step) => set({ currentStep: step }),
            setData: (newData) => set((state) => ({
                data: { ...state.data, ...newData }
            })),
            reset: () => set({ currentStep: 0, data: {} })
        }),
        {
            name: 'ikonga-questionnaire-storage',
        }
    )
)
