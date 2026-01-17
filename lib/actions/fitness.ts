"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"
import { getOrCreateUser } from "./user" // Assuming this exists common
import { FitnessEngine } from "@/lib/engines/fitness-engine"
import { startOfDay } from "date-fns"

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

    return {
        user: userWithPhases,
        recommendedWorkout,
        alternatives,
        todayLog
    }
}

/**
 * Enregistre une séance réalisée
 */
export async function logWorkout(workoutId: string) {
    const user = await getOrCreateUser()
    if (!user) throw new Error("User not found")

    const workout = await prisma.workout.findUnique({
        where: { id: workoutId }
    })

    if (!workout) throw new Error("Workout not found")

    // Calcul des calories
    // On utilise le poids actuel (last weight logged) ou startWeight ou vide
    // Cherchons le dernier poids enregistré
    const lastWeightLog = await prisma.dailyLog.findFirst({
        where: { userId: user.id, weight: { not: null } },
        orderBy: { date: 'desc' }
    })

    const userWeight = lastWeightLog?.weight || user.startWeight || 70 // Default 70kg if nothing
    const calories = FitnessEngine.calculateCalories(userWeight, workout.duration, workout.metValue)

    const date = new Date()

    // 1. Créer le WorkoutLog
    const log = await prisma.workoutLog.create({
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

    return { success: true, calories }
}
