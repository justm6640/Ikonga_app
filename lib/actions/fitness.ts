"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"
import { getOrCreateUser } from "./user" // Assuming this exists common
import { FitnessEngine } from "@/lib/engines/fitness-engine"
import { startOfDay, endOfDay, addDays, startOfMonth, endOfMonth } from "date-fns"
import { WorkoutType, WorkoutIntensity, WorkoutCategory } from "@prisma/client"

/**
 * Récupère les données pour le Fitness Hub
 */
export async function getFitnessHubData() {
    const user = await getOrCreateUser()
    if (!user) return null

    // Charger les phases pour l'engine
    const userWithPhases = await prisma.user.findUnique({
        where: { id: user.id },
        include: { phases: { where: { isActive: true } } }
    })

    if (!userWithPhases) return null

    const recommendedWorkout = await FitnessEngine.getDailyWorkoutRecommendation(userWithPhases)
    const alternatives = await FitnessEngine.getAlternatives(userWithPhases, recommendedWorkout?.id)

    // Vérifier si une séance est déjà loggée aujourd'hui
    const todayLog = await prisma.workoutLog.findFirst({
        where: {
            userId: user.id,
            date: {
                gte: startOfDay(new Date()),
                lt: startOfDay(new Date(new Date().setDate(new Date().getDate() + 1)))
            }
        }
    })

    // Message motivationnel par phase
    const phaseMessages: Record<string, string> = {
        DETOX: "🧘 Phase Détox – Écoute ton corps, réveille-le en douceur",
        DETOX_VIP: "🧘 Phase Détox VIP – Ton corps te remercie",
        EQUILIBRE: "🔥 Tu es en phase Équilibre. Ton corps est prêt à brûler !",
        ECE: "⚡ Phase ECE – Équilibre et progression",
        CONSOLIDATION: "🔒 Phase Consolidation – Stabilise tes acquis",
        ENTRETIEN: "🌱 Phase Entretien – Le sport devient un plaisir"
    }

    const activePhase = userWithPhases.phases[0]?.type || "DETOX"
    const phaseMessage = phaseMessages[activePhase] || ""

    return {
        user: userWithPhases,
        recommendedWorkout,
        alternatives,
        todayLog,
        phaseMessage
    }
}

/**
 * Enregistre une séance réalisée
 */
export async function logWorkout(workoutId: string, duration?: number) {
    const user = await getOrCreateUser()
    if (!user) throw new Error("User not found")

    const workout = await prisma.workout.findUnique({
        where: { id: workoutId }
    })

    if (!workout) throw new Error("Workout not found")

    // Calcul des calories
    const lastWeightLog = await prisma.dailyLog.findFirst({
        where: { userId: user.id, weight: { not: null } },
        orderBy: { date: 'desc' }
    })

    const userWeight = lastWeightLog?.weight || user.startWeight || 70
    const actualDuration = duration || workout.duration
    const calories = FitnessEngine.calculateCalories(userWeight, actualDuration, workout.metValue, user.gender)

    const date = new Date()

    // 1. Créer le WorkoutLog
    await prisma.workoutLog.create({
        data: {
            userId: user.id,
            workoutId: workout.id,
            date: date,
            calories: calories
        }
    })

    // 2. Mettre à jour le DailyLog (Workout Done)
    await prisma.dailyLog.upsert({
        where: {
            userId_date: {
                userId: user.id,
                date: startOfDay(date)
            }
        },
        update: {
            workoutDone: true
        },
        create: {
            userId: user.id,
            date: startOfDay(date),
            workoutDone: true
        }
    })

    revalidatePath("/fitness")
    revalidatePath("/dashboard")

    return { success: true, calories, duration: actualDuration }
}

/**
 * Planifie une séance future
 */
export async function scheduleWorkout(workoutId: string, scheduledAt: Date) {
    const user = await getOrCreateUser()
    if (!user) throw new Error("User not found")

    const workout = await prisma.workout.findUnique({
        where: { id: workoutId }
    })

    if (!workout) throw new Error("Workout not found")

    const planned = await prisma.plannedWorkout.create({
        data: {
            userId: user.id,
            workoutId: workout.id,
            scheduledAt: scheduledAt
        },
        include: { workout: true }
    })

    revalidatePath("/fitness")
    return { success: true, plannedWorkout: planned }
}

/**
 * Supprime une séance planifiée
 */
export async function cancelScheduledWorkout(plannedWorkoutId: string) {
    const user = await getOrCreateUser()
    if (!user) throw new Error("User not found")

    await prisma.plannedWorkout.delete({
        where: { id: plannedWorkoutId }
    })

    revalidatePath("/fitness")
    return { success: true }
}

/**
 * Marque une séance planifiée comme terminée
 */
export async function completeScheduledWorkout(plannedWorkoutId: string, duration?: number) {
    const user = await getOrCreateUser()
    if (!user) throw new Error("User not found")

    const planned = await prisma.plannedWorkout.findUnique({
        where: { id: plannedWorkoutId },
        include: { workout: true }
    })

    if (!planned) throw new Error("Planned workout not found")

    // Marquer comme complété
    await prisma.plannedWorkout.update({
        where: { id: plannedWorkoutId },
        data: {
            completed: true,
            completedAt: new Date()
        }
    })

    // Logger la séance
    const result = await logWorkout(planned.workoutId, duration)

    return result
}

/**
 * Récupère le calendrier sportif pour un mois donné
 */
export async function getWorkoutCalendar(year: number, month: number) {
    const user = await getOrCreateUser()
    if (!user) return null

    const startDate = startOfMonth(new Date(year, month - 1))
    const endDate = endOfMonth(new Date(year, month - 1))

    // Séances passées (logs)
    const logs = await prisma.workoutLog.findMany({
        where: {
            userId: user.id,
            date: {
                gte: startDate,
                lte: endDate
            }
        },
        include: { workout: true },
        orderBy: { date: 'asc' }
    })

    // Séances planifiées
    const planned = await prisma.plannedWorkout.findMany({
        where: {
            userId: user.id,
            scheduledAt: {
                gte: startDate,
                lte: endDate
            }
        },
        include: { workout: true },
        orderBy: { scheduledAt: 'asc' }
    })

    return { logs, planned }
}

/**
 * Récupère les séances d'un jour donné (multi-séances autorisées)
 */
export async function getDayWorkouts(date: Date) {
    const user = await getOrCreateUser()
    if (!user) return null

    const dayStart = startOfDay(date)
    const dayEnd = endOfDay(date)

    const logs = await prisma.workoutLog.findMany({
        where: {
            userId: user.id,
            date: {
                gte: dayStart,
                lte: dayEnd
            }
        },
        include: { workout: true }
    })

    const planned = await prisma.plannedWorkout.findMany({
        where: {
            userId: user.id,
            scheduledAt: {
                gte: dayStart,
                lte: dayEnd
            }
        },
        include: { workout: true }
    })

    return { logs, planned }
}

/**
 * Récupère l'historique des séances
 */
export async function getWorkoutHistory(limit: number = 30) {
    const user = await getOrCreateUser()
    if (!user) return []

    const logs = await prisma.workoutLog.findMany({
        where: { userId: user.id },
        include: { workout: true },
        orderBy: { date: 'desc' },
        take: limit
    })

    // Calculer les stats
    const totalCalories = logs.reduce((acc, log) => acc + (log.calories || 0), 0)
    const totalDuration = logs.reduce((acc, log) => acc + (log.workout?.duration || 0), 0)

    return {
        logs,
        stats: {
            totalWorkouts: logs.length,
            totalCalories,
            totalDuration
        }
    }
}

/**
 * Récupère la bibliothèque de séances avec filtres
 */
export async function getWorkoutLibrary(filters?: {
    type?: WorkoutType
    intensity?: WorkoutIntensity
    category?: WorkoutCategory
    minDuration?: number
    maxDuration?: number
    search?: string
}) {
    const user = await getOrCreateUser()
    if (!user) return []

    const where: any = {}

    // Filtrer par phase de l'utilisateur
    const userWithPhases = await prisma.user.findUnique({
        where: { id: user.id },
        include: { phases: { where: { isActive: true } } }
    })

    if (userWithPhases?.phases[0]) {
        where.allowedPhases = { has: userWithPhases.phases[0].type }
    }

    // Filtrer par genre
    where.gender = { in: ['ALL', user.gender] }

    // Filtres optionnels
    if (filters?.type) where.type = filters.type
    if (filters?.intensity) where.intensity = filters.intensity
    if (filters?.category) where.category = filters.category

    if (filters?.minDuration || filters?.maxDuration) {
        where.duration = {}
        if (filters.minDuration) where.duration.gte = filters.minDuration
        if (filters.maxDuration) where.duration.lte = filters.maxDuration
    }

    if (filters?.search) {
        where.OR = [
            { title: { contains: filters.search, mode: 'insensitive' } },
            { description: { contains: filters.search, mode: 'insensitive' } }
        ]
    }

    const workouts = await prisma.workout.findMany({
        where,
        orderBy: { title: 'asc' }
    })

    // Estimer les calories pour chaque séance
    const lastWeightLog = await prisma.dailyLog.findFirst({
        where: { userId: user.id, weight: { not: null } },
        orderBy: { date: 'desc' }
    })
    const userWeight = lastWeightLog?.weight || user.startWeight || 70

    const workoutsWithCalories = workouts.map(w => ({
        ...w,
        estimatedCalories: FitnessEngine.calculateCalories(userWeight, w.duration, w.metValue, user.gender)
    }))

    return workoutsWithCalories
}

/**
 * Estime les calories pour une séance avant exécution
 */
export async function estimateCalories(workoutId: string, customDuration?: number) {
    const user = await getOrCreateUser()
    if (!user) return 0

    const workout = await prisma.workout.findUnique({
        where: { id: workoutId }
    })

    if (!workout) return 0

    const lastWeightLog = await prisma.dailyLog.findFirst({
        where: { userId: user.id, weight: { not: null } },
        orderBy: { date: 'desc' }
    })

    const userWeight = lastWeightLog?.weight || user.startWeight || 70
    const duration = customDuration || workout.duration

    return FitnessEngine.calculateCalories(userWeight, duration, workout.metValue, user.gender)
}
