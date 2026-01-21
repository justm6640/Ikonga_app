"use server"

import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { PhaseType } from "@prisma/client"
import { addDays } from "date-fns"

/**
 * Liste tous les onboardings en cours/incomplets
 */
export async function getOnboardingQueue() {
    try {
        const onboardings = await prisma.onboardingState.findMany({
            where: {
                isComplete: false
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                        createdAt: true
                    }
                }
            },
            orderBy: {
                createdAt: 'asc'
            }
        })

        // Calculate "needs attention" flag
        const enrichedOnboardings = onboardings.map(ob => {
            const daysSinceCreation = Math.floor(
                (Date.now() - ob.createdAt.getTime()) / (1000 * 60 * 60 * 24)
            )
            const needsAttention = daysSinceCreation > 3 && !ob.isComplete

            return {
                ...ob,
                daysSinceCreation,
                needsAttention
            }
        })

        return { success: true, onboardings: enrichedOnboardings }
    } catch (error) {
        console.error("[GET_ONBOARDING_QUEUE]", error)
        return { success: false, error: "Impossible de récupérer la file" }
    }
}

/**
 * Obtient les détails d'un onboarding
 */
export async function getOnboardingDetails(userId: string) {
    try {
        const onboarding = await prisma.onboardingState.findUnique({
            where: { userId },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                        heightCm: true,
                        startWeight: true,
                        targetWeight: true,
                        pisi: true,
                        gender: true,
                        birthDate: true,
                        hasCompletedOnboarding: true,
                        createdAt: true
                    }
                }
            }
        })

        if (!onboarding) {
            return { success: false, error: "Onboarding non trouvé" }
        }

        // Get action history
        const actions = await prisma.onboardingAction.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 20
        })

        // Calculate metrics
        const { calculateIMC, calculatePISI, calculateAge } = await import("@/lib/engines/calculators")
        let metrics = null

        if (onboarding.user.heightCm && onboarding.user.startWeight) {
            const imc = calculateIMC(onboarding.user.startWeight, onboarding.user.heightCm)
            const pisi = calculatePISI(onboarding.user.heightCm, onboarding.user.gender)
            const age = onboarding.user.birthDate ? calculateAge(onboarding.user.birthDate) : null

            metrics = { imc, pisi, age }
        }

        return {
            success: true,
            onboarding,
            actions,
            metrics
        }
    } catch (error) {
        console.error("[GET_ONBOARDING_DETAILS]", error)
        return { success: false, error: "Impossible de récupérer les détails" }
    }
}

/**
 * Le coach ajuste la phase de départ
 */
export async function coachAdjustStartPhase(
    userId: string,
    phase: PhaseType,
    reason: string,
    adminId: string
) {
    try {
        const user = await prisma.user.findUnique({ where: { id: userId } })
        if (!user) {
            return { success: false, error: "Utilisateur non trouvé" }
        }

        // Update or create the initial phase
        const startDate = user.startDate || new Date()

        // Deactivate any existing active phases
        await prisma.userPhase.updateMany({
            where: { userId, isActive: true },
            data: { isActive: false }
        })

        // Create new phase with manual override
        const newPhase = await prisma.userPhase.create({
            data: {
                userId,
                type: phase,
                startDate,
                plannedEndDate: addDays(startDate, phase === 'DETOX' ? 14 : 21),
                isActive: true,
                isManualOverride: true,
                adminNote: reason
            }
        })

        // Update onboarding state
        await prisma.onboardingState.update({
            where: { userId },
            data: {
                wasManuallyAdjusted: true,
                adjustedBy: adminId
            }
        })

        // Track action
        await prisma.onboardingAction.create({
            data: {
                userId,
                action: "COACH_ADJUSTED_PHASE",
                triggeredBy: `COACH:${adminId}`,
                metadata: {
                    phase,
                    reason,
                    previousPhase: user.phases?.[0]?.type || null
                }
            }
        })

        // Send notification to user
        const { createNotification } = await import("./notifications")
        await createNotification(
            userId,
            "Ton programme a été personnalisé 🌸",
            `Le coach a ajusté ton plan pour partir sur ${phase}. ${reason}`,
            "INFO",
            "/dashboard"
        )

        revalidatePath("/admin/onboarding")
        revalidatePath("/dashboard")
        return { success: true, phase: newPhase }
    } catch (error) {
        console.error("[COACH_ADJUST_START_PHASE]", error)
        return { success: false, error: "Impossible d'ajuster la phase" }
    }
}

/**
 * Le coach personnalise le message de bienvenue
 */
export async function coachSetWelcomeMessage(
    userId: string,
    message: string,
    adminId: string
) {
    try {
        const updated = await prisma.onboardingState.update({
            where: { userId },
            data: {
                welcomeMessage: message,
                wasManuallyAdjusted: true,
                adjustedBy: adminId
            }
        })

        // Track action
        await prisma.onboardingAction.create({
            data: {
                userId,
                action: "COACH_SET_WELCOME_MESSAGE",
                triggeredBy: `COACH:${adminId}`,
                metadata: { messagePreview: message.substring(0, 100) }
            }
        })

        revalidatePath("/admin/onboarding")
        revalidatePath("/onboarding")
        return { success: true, onboarding: updated }
    } catch (error) {
        console.error("[COACH_SET_WELCOME_MESSAGE]", error)
        return { success: false, error: "Impossible de définir le message" }
    }
}

/**
 * Recalcule le calendrier pour inscription tardive
 */
export async function recalculateJourney(userId: string, newStartDate: Date) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { phases: { where: { isActive: true } } }
        })

        if (!user) {
            return { success: false, error: "Utilisateur non trouvé" }
        }

        // Update user start date
        await prisma.user.update({
            where: { id: userId },
            data: { startDate: newStartDate }
        })

        // Update active phase dates
        if (user.phases.length > 0) {
            const activePhase = user.phases[0]
            const phaseDuration = 14 // Default for DETOX

            await prisma.userPhase.update({
                where: { id: activePhase.id },
                data: {
                    startDate: newStartDate,
                    plannedEndDate: addDays(newStartDate, phaseDuration)
                }
            })
        }

        // Update onboarding state
        await prisma.onboardingState.update({
            where: { userId },
            data: {
                actualStartDate: newStartDate,
                startScenario: 'LATE'
            }
        })

        // Track action
        await prisma.onboardingAction.create({
            data: {
                userId,
                action: "JOURNEY_RECALCULATED",
                triggeredBy: "COACH",
                metadata: {
                    newStartDate: newStartDate.toISOString(),
                    previousStartDate: user.startDate?.toISOString()
                }
            }
        })

        revalidatePath("/admin/onboarding")
        revalidatePath("/dashboard")
        return { success: true }
    } catch (error) {
        console.error("[RECALCULATE_JOURNEY]", error)
        return { success: false, error: "Impossible de recalculer le parcours" }
    }
}

/**
 * Le coach envoie un message personnalisé à un utilisateur
 */
export async function coachSendMessage(
    userId: string,
    message: string,
    adminId: string
) {
    try {
        const { createNotification } = await import("./notifications")
        await createNotification(
            userId,
            "Message de ton coach 💌",
            message,
            "INFO",
            "/dashboard"
        )

        // Track action
        await prisma.onboardingAction.create({
            data: {
                userId,
                action: "COACH_SENT_MESSAGE",
                triggeredBy: `COACH:${adminId}`,
                metadata: { messagePreview: message.substring(0, 100) }
            }
        })

        return { success: true }
    } catch (error) {
        console.error("[COACH_SEND_MESSAGE]", error)
        return { success: false, error: "Impossible d'envoyer le message" }
    }
}

/**
 * Force la finalisation de l'onboarding (en cas de blocage)
 */
export async function coachForceFinalize(userId: string, adminId: string) {
    try {
        // Update onboarding state
        await prisma.onboardingState.update({
            where: { userId },
            data: {
                currentStep: "COMPLETE",
                isComplete: true,
                wasManuallyAdjusted: true,
                adjustedBy: adminId
            }
        })

        // Mark user as onboarded
        await prisma.user.update({
            where: { id: userId },
            data: { hasCompletedOnboarding: true }
        })

        // Track action
        await prisma.onboardingAction.create({
            data: {
                userId,
                action: "COACH_FORCED_FINALIZATION",
                triggeredBy: `COACH:${adminId}`,
                metadata: { reason: "Manuel override by coach" }
            }
        })

        revalidatePath("/admin/onboarding")
        revalidatePath("/dashboard")
        return { success: true }
    } catch (error) {
        console.error("[COACH_FORCE_FINALIZE]", error)
        return { success: false, error: "Impossible de forcer la finalisation" }
    }
}
