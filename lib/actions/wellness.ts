"use server"

import prisma from "@/lib/prisma"
import { getOrCreateUser } from "@/lib/actions/user"
import { revalidatePath } from "next/cache"
import { WellnessEngine } from "@/lib/engines/wellness-engine"

export async function logWellnessData(data: {
    date: Date
    waterIntake?: number
    sleepHours?: number
    sleepQuality?: string
    stressLevel?: number
    energyLevel?: number
    mood?: string
    feeling?: string
    needs?: string
    steps?: number
    sport?: boolean
}) {
    const user = await getOrCreateUser()
    if (!user) throw new Error("Unauthorized")

    const userId = user.id

    // 1. We already have the user details from getOrCreateUser, typically.
    // However, if we need specific analysis or latest weight, we can assume user object has correct basics or refetch if critical.
    // For weight calculation:
    const waterGoal = user.startWeight ? WellnessEngine.calculateWaterGoal(user.startWeight) / 250 : 8 // est. glasses

    // We merge existing data with new data for accurate scoring
    const existingLog = await prisma.wellnessLog.findUnique({
        where: {
            userId_date: {
                userId,
                date: data.date
            }
        }
    })

    const mergedData = { ...existingLog, ...data }

    const score = WellnessEngine.calculateScore({
        sleepHours: mergedData.sleepHours,
        sleepQuality: mergedData.sleepQuality,
        stressLevel: mergedData.stressLevel,
        energyLevel: mergedData.energyLevel,
        waterIntake: mergedData.waterIntake,
        waterGoal: waterGoal
    })

    const status = WellnessEngine.determineStatus({
        stressLevel: mergedData.stressLevel,
        sleepQuality: mergedData.sleepQuality,
        energyLevel: mergedData.energyLevel,
        score
    })

    // Upsert Log
    await prisma.wellnessLog.upsert({
        where: {
            userId_date: {
                userId,
                date: data.date
            }
        },
        update: {
            ...data,
            wellnessScore: score,
            dayStatus: status,
            updatedAt: new Date()
        },
        create: {
            userId,
            ...data,
            wellnessScore: score,
            dayStatus: status,
        }
    })

    revalidatePath("/dashboard")
    revalidatePath("/wellness")

    return { success: true, score, status }
}

export async function getWellnessDashboardData() {
    const user = await getOrCreateUser()
    if (!user) return null

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const log = await prisma.wellnessLog.findUnique({
        where: {
            userId_date: {
                userId: user.id,
                date: today
            }
        }
    })

    const waterGoal = user.startWeight ? WellnessEngine.calculateWaterGoal(user.startWeight) : 2000

    // Coach Message
    const message = log?.dayStatus
        ? WellnessEngine.generateCoachMessage(log.dayStatus, user.gender, log)
        : "Connecte-toi à tes sensations pour démarrer la journée."

    return {
        log,
        waterGoal,
        message,
        gender: user.gender
    }
}
