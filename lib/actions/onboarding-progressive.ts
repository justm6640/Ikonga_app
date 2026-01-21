"use server"

import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

/**
 * Démarre l'onboarding avec accueil émotionnel
 */
export async function startOnboarding(userId: string) {
    try {
        const onboarding = await prisma.onboardingState.create({
            data: {
                userId,
                currentStep: "WELCOME",
                completedSteps: [],
                isComplete: false,
                canSkipQuestionnaire: true,
                welcomeMessage: `Bienvenue chez IKONGA.
Je vais t'accompagner pas à pas dans ce parcours.
Tu n'as rien à réussir aujourd'hui, juste à commencer.
Je suis là pour toi. 🌸
— Coach IKONGA`
            }
        })

        // Track action
        await prisma.onboardingAction.create({
            data: {
                userId,
                action: "ONBOARDING_STARTED",
                triggeredBy: "SYSTEM",
                metadata: { step: "WELCOME" }
            }
        })

        revalidatePath("/onboarding")
        return { success: true, onboarding }
    } catch (error) {
        console.error("[START_ONBOARDING]", error)
        return { success: false, error: "Impossible de démarrer l'onboarding" }
    }
}

/**
 * Valide une étape et passe à la suivante (non-bloquant)
 */
export async function completeOnboardingStep(
    userId: string,
    stepName: string,
    data?: any
) {
    try {
        const existing = await prisma.onboardingState.findUnique({
            where: { userId }
        })

        if (!existing) {
            return { success: false, error: "Onboarding non trouvé" }
        }

        // Determine next step
        const stepOrder = ["WELCOME", "PROFILE", "QUESTIONNAIRE", "SCHEDULE", "ANALYSIS", "COMPLETE"]
        const currentIndex = stepOrder.indexOf(stepName)
        const nextStep = currentIndex < stepOrder.length - 1 ? stepOrder[currentIndex + 1] : "COMPLETE"

        // Update onboarding state
        const updated = await prisma.onboardingState.update({
            where: { userId },
            data: {
                currentStep: nextStep,
                completedSteps: {
                    push: stepName
                },
                isComplete: nextStep === "COMPLETE",
                ...(data?.questionnaireProgress && { questionnaireProgress: data.questionnaireProgress })
            }
        })

        // Track action
        await prisma.onboardingAction.create({
            data: {
                userId,
                action: "STEP_COMPLETED",
                triggeredBy: "USER",
                metadata: { step: stepName, nextStep, additionalData: data }
            }
        })

        revalidatePath("/onboarding")
        return { success: true, nextStep, onboarding: updated }
    } catch (error) {
        console.error("[COMPLETE_STEP]", error)
        return { success: false, error: "Impossible de compléter l'étape" }
    }
}

/**
 * Sauvegarde partielle du questionnaire (peut être complété plus tard)
 */
export async function saveQuestionnaireProgress(
    userId: string,
    partialData: any
) {
    try {
        // Calculate progress percentage
        const totalFields = 15 // Adjust based on your questionnaire
        const filledFields = Object.keys(partialData).filter(key => partialData[key]).length
        const progress = (filledFields / totalFields) * 100

        // Update onboarding state
        await prisma.onboardingState.update({
            where: { userId },
            data: {
                questionnaireProgress: progress,
                questionnaireData: partialData
            }
        })

        // Track action
        await prisma.onboardingAction.create({
            data: {
                userId,
                action: "QUESTIONNAIRE_PROGRESS_SAVED",
                triggeredBy: "USER",
                metadata: { progress, filledFields, totalFields }
            }
        })

        revalidatePath("/onboarding")
        return { success: true, progress }
    } catch (error) {
        console.error("[SAVE_QUESTIONNAIRE_PROGRESS]", error)
        return { success: false, error: "Impossible de sauvegarder la progression" }
    }
}

/**
 * Configure le scénario de démarrage
 */
export async function setStartScenario(
    userId: string,
    scenario: 'IMMEDIATE' | 'SCHEDULED' | 'LATE' | 'MANUAL',
    scheduledDate?: Date
) {
    try {
        const actualStartDate = scenario === 'IMMEDIATE' ? new Date() : undefined

        const updated = await prisma.onboardingState.update({
            where: { userId },
            data: {
                startScenario: scenario,
                scheduledStartDate: scheduledDate,
                actualStartDate
            }
        })

        // Track action
        await prisma.onboardingAction.create({
            data: {
                userId,
                action: "START_SCENARIO_SET",
                triggeredBy: "USER",
                metadata: { scenario, scheduledDate: scheduledDate?.toISOString() }
            }
        })

        // Send notifications based on scenario
        if (scenario === 'SCHEDULED' && scheduledDate) {
            const { createNotification } = await import("./notifications")
            await createNotification(
                userId,
                "Ton parcours IKONGA est programmé ! 📅",
                `Tu commenceras le ${scheduledDate.toLocaleDateString('fr-FR')}. Prépare-toi !`,
                "INFO",
                "/onboarding"
            )
        }

        if (scenario === 'IMMEDIATE') {
            const { createNotification } = await import("./notifications")
            await createNotification(
                userId,
                "C'est parti ! 🚀",
                "Ton programme IKONGA commence maintenant. Bienvenue !",
                "SUCCESS",
                "/dashboard"
            )
        }

        revalidatePath("/onboarding")
        return { success: true, onboarding: updated }
    } catch (error) {
        console.error("[SET_START_SCENARIO]", error)
        return { success: false, error: "Impossible de définir le scénario" }
    }
}

/**
 * Génère l'analyse AI même si questionnaire incomplet
 */
export async function generatePartialAnalysis(userId: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId }
        })

        if (!user) {
            return { success: false, error: "Utilisateur non trouvé" }
        }

        // Fetch onboarding state for questionnaire data
        const onboarding = await prisma.onboardingState.findUnique({
            where: { userId }
        })

        // If enough data exists, generate analysis
        if (user.heightCm && user.startWeight && onboarding?.questionnaireData) {
            const { calculatePISI, calculateIMC, calculateAge } = await import("@/lib/engines/calculators")
            const { generateUserAnalysis } = await import("@/lib/ai/generator")

            const age = user.birthDate ? calculateAge(user.birthDate) : 25 // Default
            const imc = calculateIMC(user.startWeight, user.heightCm)
            const pisi = calculatePISI(user.heightCm, user.gender)

            const userProfileForAI = { age, imc, pisi }
            const analysisResult = await generateUserAnalysis(
                userProfileForAI,
                onboarding.questionnaireData as any
            )

            // Save analysis
            await prisma.userAnalysis.upsert({
                where: { userId },
                update: { content: analysisResult as any, createdAt: new Date() },
                create: {
                    userId,
                    content: analysisResult as any
                }
            })

            // Track action
            await prisma.onboardingAction.create({
                data: {
                    userId,
                    action: "PARTIAL_ANALYSIS_GENERATED",
                    triggeredBy: "SYSTEM",
                    metadata: { age, imc, pisi }
                }
            })

            return { success: true, analysis: analysisResult }
        }

        return { success: false, error: "Données insuffisantes pour l'analyse" }
    } catch (error) {
        console.error("[GENERATE_PARTIAL_ANALYSIS]", error)
        return { success: false, error: "Impossible de générer l'analyse" }
    }
}

/**
 * Finalise l'onboarding (peut être partiel)
 */
export async function finalizeOnboarding(userId: string) {
    try {
        // Update onboarding state
        await prisma.onboardingState.update({
            where: { userId },
            data: {
                currentStep: "COMPLETE",
                isComplete: true
            }
        })

        // Mark user as onboarded
        await prisma.user.update({
            where: { id: userId },
            data: {
                hasCompletedOnboarding: true
            }
        })

        // Generate first weekly plan
        const { generateUserWeeklyPlan } = await import("@/lib/ai/menu-generator")
        await generateUserWeeklyPlan(userId)

        // Track action
        await prisma.onboardingAction.create({
            data: {
                userId,
                action: "ONBOARDING_FINALIZED",
                triggeredBy: "SYSTEM",
                metadata: { completedAt: new Date().toISOString() }
            }
        })

        // Send welcome notification
        const { createNotification } = await import("./notifications")
        await createNotification(
            userId,
            "Bienvenue dans IKONGA ! 🌸",
            "Ton parcours personnalisé est prêt. C'est parti pour la transformation !",
            "SUCCESS",
            "/dashboard"
        )

        revalidatePath("/dashboard")
        revalidatePath("/onboarding")
        return { success: true }
    } catch (error) {
        console.error("[FINALIZE_ONBOARDING]", error)
        return { success: false, error: "Impossible de finaliser l'onboarding" }
    }
}

/**
 * Récupère l'état de l'onboarding
 */
export async function getOnboardingState(userId: string) {
    try {
        const onboarding = await prisma.onboardingState.findUnique({
            where: { userId }
        })

        if (!onboarding) {
            // If no onboarding exists, create one
            return await startOnboarding(userId)
        }

        return { success: true, onboarding }
    } catch (error) {
        console.error("[GET_ONBOARDING_STATE]", error)
        return { success: false, error: "Impossible de récupérer l'état" }
    }
}
