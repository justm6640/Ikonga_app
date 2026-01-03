"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { startOfDay } from "date-fns"

/**
 * Récupère la séance du jour pour l'utilisateur.
 * Retourne une vidéo aléatoire adaptée au niveau (BEGINNER par défaut en MVP).
 * Vérifie si la séance a déjà été complétée aujourd'hui.
 */
export async function getTodayWorkout(userId: string) {
    try {
        // 1. Récupérer une vidéo adaptée (MVP: on prend BEGINNER ou toutes)
        const videos = await prisma.fitnessVideo.findMany({
            where: {
                OR: [
                    { difficulty: "BEGINNER" },
                    { difficulty: "INTERMEDIATE" }
                ]
            },
            orderBy: { createdAt: 'asc' }
        })

        if (videos.length === 0) {
            return { video: null, isCompleted: false }
        }

        // Sélectionner une vidéo aléatoire (ou la première pour la démo)
        const randomIndex = Math.floor(Math.random() * videos.length)
        const selectedVideo = videos[randomIndex]

        // 2. Vérifier si déjà complétée aujourd'hui
        const today = startOfDay(new Date())
        const todayLog = await prisma.workoutLog.findFirst({
            where: {
                userId,
                fitnessVideoId: selectedVideo.id,
                date: {
                    gte: today,
                    lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
                }
            }
        })

        return {
            video: selectedVideo,
            isCompleted: !!todayLog
        }
    } catch (error) {
        console.error("[GET_TODAY_WORKOUT]", error)
        return { video: null, isCompleted: false }
    }
}

/**
 * Marque une séance comme complétée.
 * Crée une entrée dans WorkoutLog.
 */
export async function completeWorkout(
    userId: string,
    videoId: string,
    feedback?: string
) {
    try {
        const today = startOfDay(new Date())

        // Vérifier si déjà complétée aujourd'hui
        const existing = await prisma.workoutLog.findFirst({
            where: {
                userId,
                fitnessVideoId: videoId,
                date: {
                    gte: today,
                    lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
                }
            }
        })

        if (existing) {
            return { success: true, message: "Séance déjà validée aujourd'hui" }
        }

        // Créer le log
        await prisma.workoutLog.create({
            data: {
                userId,
                fitnessVideoId: videoId,
                date: today,
                feedback
            }
        })

        revalidatePath("/dashboard")
        return { success: true, message: "Bravo ! Séance validée 🎉" }
    } catch (error) {
        console.error("[COMPLETE_WORKOUT]", error)
        return { success: false, message: "Erreur lors de la validation" }
    }
}

/**
 * Récupère l'historique des entraînements d'un utilisateur.
 */
export async function getWorkoutHistory(userId: string, limit: number = 7) {
    try {
        const logs = await prisma.workoutLog.findMany({
            where: { userId },
            include: { fitnessVideo: true },
            orderBy: { date: 'desc' },
            take: limit
        })

        return logs
    } catch (error) {
        console.error("[GET_WORKOUT_HISTORY]", error)
        return []
    }
}

/**
 * Récupère toutes les vidéos disponibles (pour un catalogue).
 */
export async function getAllFitnessVideos() {
    try {
        return await prisma.fitnessVideo.findMany({
            orderBy: { createdAt: 'asc' }
        })
    } catch (error) {
        console.error("[GET_ALL_FITNESS_VIDEOS]", error)
        return []
    }
}
