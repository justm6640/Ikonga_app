
import { User, PhaseType, WorkoutType, WorkoutIntensity, WorkoutGender, WorkoutCategory } from "@prisma/client"
import prisma from "@/lib/prisma"
import { differenceInWeeks, startOfDay } from "date-fns"

/**
 * Moteur de recommandation Fitness IKONGA
 * Gère les recommandations par phase avec ratios cardio/renforcement évolutifs
 */
export class FitnessEngine {

    /**
     * Calcule les calories brûlées pour une activité.
     * Formule simplifiée : Calories = MET * Poids (kg) * (Durée (min) / 60)
     */
    static calculateCalories(userWeight: number, durationMinutes: number, metValue: number, gender: string = 'FEMALE'): number {
        if (!userWeight || !durationMinutes || !metValue) return 0
        // Sexe coefficient: Men typically burn ~5-10% more for same MET/weight due to muscle mass
        const genderFactor = gender === 'MALE' ? 1.1 : 1.0
        return Math.round(metValue * userWeight * (durationMinutes / 60) * genderFactor)
    }

    /**
     * Recommande une séance du jour basée sur le profil et la phase de l'utilisateur.
     */
    static async getDailyWorkoutRecommendation(user: any) {
        if (!user || !user.phases || user.phases.length === 0) return null

        const activePhase = user.phases[0]
        const phaseType = activePhase.type
        const phaseStartDate = new Date(activePhase.startDate)
        const weeksSinceStart = differenceInWeeks(new Date(), phaseStartDate)

        // Filtres de base
        const baseFilter: any = {
            gender: { in: [WorkoutGender.ALL, user.gender === 'MALE' ? WorkoutGender.MALE : WorkoutGender.FEMALE] },
            allowedPhases: { has: phaseType }
        }

        // --- Règle 1: Phase DETOX / DETOX_VIP ---
        if (phaseType === PhaseType.DETOX || phaseType === PhaseType.DETOX_VIP) {
            // DETOX Logic: 
            // - Interdit HIIT
            // - 70% Cardio Doux / 30% Récupération (Mobilité/Stretching)
            // - Intensité LOW uniquement

            const roll = Math.random()

            if (roll < 0.7) {
                // 70% Cardio Doux (Marche active, Cardio doux)
                return await prisma.workout.findFirst({
                    where: {
                        ...baseFilter,
                        type: { in: [WorkoutType.CARDIO, WorkoutType.DANCE] },
                        intensity: WorkoutIntensity.LOW
                    }
                }) || await prisma.workout.findFirst({ where: { ...baseFilter, intensity: WorkoutIntensity.LOW } })
            } else {
                // 30% Mobilité / Récupération (Yoga, Recovery)
                return await prisma.workout.findFirst({
                    where: {
                        ...baseFilter,
                        type: { in: [WorkoutType.YOGA, WorkoutType.RECOVERY] },
                        intensity: WorkoutIntensity.LOW
                    }
                }) || await prisma.workout.findFirst({ where: { ...baseFilter, intensity: WorkoutIntensity.LOW } })
            }
        }

        // --- Règle 2: Phase ECE (Équilibre Culinaire Équilibré) ---
        // Similaire à EQUILIBRE mais plus progressif
        if (phaseType === PhaseType.ECE) {
            const isEarlyPhase = weeksSinceStart < 2
            const roll = Math.random()

            if (isEarlyPhase) {
                // 60% Cardio, 40% Strength
                if (roll < 0.6) {
                    return await prisma.workout.findFirst({
                        where: { ...baseFilter, type: { in: [WorkoutType.CARDIO, WorkoutType.DANCE] } }
                    }) || await prisma.workout.findFirst({ where: baseFilter })
                } else {
                    return await prisma.workout.findFirst({
                        where: { ...baseFilter, type: WorkoutType.STRENGTH }
                    }) || await prisma.workout.findFirst({ where: baseFilter })
                }
            } else {
                // 40% Cardio, 60% Strength
                if (roll < 0.4) {
                    return await prisma.workout.findFirst({
                        where: { ...baseFilter, type: { in: [WorkoutType.CARDIO, WorkoutType.DANCE] } }
                    }) || await prisma.workout.findFirst({ where: baseFilter })
                } else {
                    return await prisma.workout.findFirst({
                        where: { ...baseFilter, type: WorkoutType.STRENGTH }
                    }) || await prisma.workout.findFirst({ where: baseFilter })
                }
            }
        }

        // --- Règle 2: Phase EQUILIBRE (Attack) ---
        if (phaseType === PhaseType.EQUILIBRE) {
            // Logic: 
            // - Start (e.g., first 4 weeks): 80% Cardio/HIIT, 20% Strength
            // - End: 20% Cardio, 80% Strength
            // - Allows High Intensity

            const isEarlyPhase = weeksSinceStart < 4
            const roll = Math.random()

            if (isEarlyPhase) {
                // Early: 80% Cardio/HIIT priority
                if (roll < 0.8) {
                    return await prisma.workout.findFirst({
                        where: { ...baseFilter, type: { in: [WorkoutType.CARDIO, WorkoutType.HIIT, WorkoutType.DANCE] } }
                    }) || await prisma.workout.findFirst({ where: baseFilter })
                } else {
                    return await prisma.workout.findFirst({
                        where: { ...baseFilter, type: WorkoutType.STRENGTH }
                    }) || await prisma.workout.findFirst({ where: baseFilter })
                }
            } else {
                // Late: 80% Strength priority
                if (roll < 0.8) {
                    return await prisma.workout.findFirst({
                        where: { ...baseFilter, type: WorkoutType.STRENGTH }
                    }) || await prisma.workout.findFirst({ where: baseFilter })
                } else {
                    return await prisma.workout.findFirst({
                        where: { ...baseFilter, type: { in: [WorkoutType.CARDIO, WorkoutType.HIIT, WorkoutType.DANCE] } }
                    }) || await prisma.workout.findFirst({ where: baseFilter })
                }
            }
        }

        // --- Règle 3: Phase CONSOLIDATION ---
        if (phaseType === PhaseType.CONSOLIDATION) {
            // Logic:
            // - Start: 20% Cardio / 80% Strength
            // - End: 50% Cardio / 50% Strength

            const isEarlyPhase = weeksSinceStart < 4
            const roll = Math.random()

            if (isEarlyPhase) {
                if (roll < 0.8) {
                    return await prisma.workout.findFirst({
                        where: { ...baseFilter, type: WorkoutType.STRENGTH }
                    }) || await prisma.workout.findFirst({ where: baseFilter })
                } else {
                    return await prisma.workout.findFirst({
                        where: { ...baseFilter, type: { in: [WorkoutType.CARDIO, WorkoutType.HIIT] } }
                    }) || await prisma.workout.findFirst({ where: baseFilter })
                }
            } else {
                // 50/50
                if (roll < 0.5) {
                    return await prisma.workout.findFirst({
                        where: { ...baseFilter, type: WorkoutType.STRENGTH }
                    }) || await prisma.workout.findFirst({ where: baseFilter })
                } else {
                    return await prisma.workout.findFirst({
                        where: { ...baseFilter, type: { in: [WorkoutType.CARDIO, WorkoutType.HIIT] } }
                    }) || await prisma.workout.findFirst({ where: baseFilter })
                }
            }
        }

        // --- Règle 4: Phase ENTRETIEN (MAINTENANCE) ---
        // 50% Cardio / 50% Strength
        const roll = Math.random()
        if (roll < 0.5) {
            return await prisma.workout.findFirst({
                where: { ...baseFilter, type: WorkoutType.STRENGTH }
            }) || await prisma.workout.findFirst({ where: baseFilter })
        } else {
            return await prisma.workout.findFirst({
                where: { ...baseFilter, type: { in: [WorkoutType.CARDIO, WorkoutType.HIIT, WorkoutType.DANCE] } }
            }) || await prisma.workout.findFirst({ where: baseFilter })
        }
    }

    /**
     * Récupère 5 alternatives compatibles
     */
    static async getAlternatives(user: any, excludeId?: string) {
        if (!user || !user.phases || user.phases.length === 0) return []

        const activePhase = user.phases[0]
        const phaseType = activePhase.type

        return await prisma.workout.findMany({
            where: {
                gender: { in: [WorkoutGender.ALL, user.gender === 'MALE' ? WorkoutGender.MALE : WorkoutGender.FEMALE] },
                allowedPhases: { has: phaseType },
                id: excludeId ? { not: excludeId } : undefined
            },
            take: 5
        })
    }
}
