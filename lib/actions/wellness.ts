"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { startOfDay } from "date-fns"

/**
 * Récupère le log wellness du jour pour un utilisateur.
 * Retourne un objet vide par défaut si inexistant.
 */
export async function getDailyWellness(userId: string, date: Date) {
    try {
        const normalizedDate = startOfDay(date)

        const log = await prisma.wellnessLog.findUnique({
            where: {
                userId_date: {
                    userId,
                    date: normalizedDate
                }
            }
        })

        return log || {
            waterIntake: 0,
            sleepHours: null,
            sleepQuality: null,
            mood: null,
            steps: null,
            sport: false
        }
    } catch (error) {
        console.error("[GET_DAILY_WELLNESS]", error)
        return {
            waterIntake: 0,
            sleepHours: null,
            sleepQuality: null,
            mood: null,
            steps: null,
            sport: false
        }
    }
}

/**
 * Ajoute ou retire un verre d'eau (250ml).
 * Crée automatiquement le log s'il n'existe pas.
 */
export async function toggleWaterGlass(userId: string, date: Date, increment: boolean) {
    try {
        const normalizedDate = startOfDay(date)

        // Récupérer la valeur actuelle ou créer avec upsert
        const result = await prisma.wellnessLog.upsert({
            where: {
                userId_date: {
                    userId,
                    date: normalizedDate
                }
            },
            update: {
                waterIntake: {
                    increment: increment ? 1 : -1
                }
            },
            create: {
                userId,
                date: normalizedDate,
                waterIntake: increment ? 1 : 0
            }
        })

        // S'assurer que waterIntake ne descend jamais en dessous de 0
        if (result.waterIntake < 0) {
            await prisma.wellnessLog.update({
                where: { id: result.id },
                data: { waterIntake: 0 }
            })
            revalidatePath("/dashboard")
            return 0
        }

        revalidatePath("/dashboard")
        return result.waterIntake
    } catch (error) {
        console.error("[TOGGLE_WATER_GLASS]", error)
        throw new Error("Impossible de mettre à jour l'hydratation")
    }
}

/**
 * Met à jour une métrique wellness spécifique.
 * Fonction générique pour sommeil, humeur, pas, sport, etc.
 */
export async function updateWellnessMetric(
    userId: string,
    date: Date,
    field: string,
    value: any
) {
    try {
        const normalizedDate = startOfDay(date)

        // Liste blanche des champs autorisés
        const allowedFields = ['sleepHours', 'sleepQuality', 'mood', 'steps', 'sport']
        if (!allowedFields.includes(field)) {
            throw new Error("Champ non autorisé")
        }

        const result = await prisma.wellnessLog.upsert({
            where: {
                userId_date: {
                    userId,
                    date: normalizedDate
                }
            },
            update: {
                [field]: value
            },
            create: {
                userId,
                date: normalizedDate,
                [field]: value
            }
        })

        revalidatePath("/dashboard")
        return { success: true, data: result }
    } catch (error) {
        console.error("[UPDATE_WELLNESS_METRIC]", error)
        return { success: false, error: "Impossible de mettre à jour la métrique" }
    }
}

/**
 * Récupère les logs wellness des N derniers jours.
 */
export async function getRecentWellnessLogs(userId: string, days: number = 7) {
    try {
        const logs = await prisma.wellnessLog.findMany({
            where: { userId },
            orderBy: { date: 'desc' },
            take: days
        })

        return logs
    } catch (error) {
        console.error("[GET_RECENT_WELLNESS_LOGS]", error)
        return []
    }
}

/**
 * Soumet le check-in bien-être quotidien (Sauvegarde dans DailyLog).
 */
export async function submitWellnessLog(data: {
    sleepHours: number
    stressLevel: number
    energyLevel: number
}) {
    try {
        const { getOrCreateUser } = await import("./user")
        const { calculateDailyScore } = await import("@/lib/engines/wellness")

        const user = await getOrCreateUser()
        if (!user) throw new Error("Utilisateur non authentifié")

        const today = startOfDay(new Date())
        const score = calculateDailyScore(data.stressLevel, data.energyLevel, data.sleepHours)

        const result = await prisma.dailyLog.upsert({
            where: {
                userId_date: {
                    userId: user.id,
                    date: today
                }
            },
            update: {
                sleepHours: Math.round(data.sleepHours),
                stressLevel: data.stressLevel,
                energyLevel: data.energyLevel,
                wellnessScore: score
            },
            create: {
                userId: user.id,
                date: today,
                sleepHours: Math.round(data.sleepHours),
                stressLevel: data.stressLevel,
                energyLevel: data.energyLevel,
                wellnessScore: score
            }
        })

        revalidatePath("/wellness")
        revalidatePath("/dashboard")

        return { success: true, data: result }
    } catch (error) {
        console.error("[SUBMIT_WELLNESS_LOG]", error)
        return { success: false, error: "Erreur lors de la sauvegarde" }
    }
}

/**
 * Récupère les logs DailyLog récents pour alimenter le WellnessChart.
 */
export async function getRecentDailyWellnessLogs(userId: string, days: number = 7) {
    try {
        const logs = await prisma.dailyLog.findMany({
            where: {
                userId,
                wellnessScore: { not: null }
            },
            orderBy: { date: 'desc' },
            take: days
        })

        return logs
    } catch (error) {
        console.error("[GET_RECENT_DAILY_WELLNESS_LOGS]", error)
        return []
    }
}
