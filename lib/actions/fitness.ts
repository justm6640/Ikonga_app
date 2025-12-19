"use server"

import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { startOfDay, endOfDay } from "date-fns"

export async function getDailyWorkout() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || !user.email) return null

    try {
        const dbUser = await prisma.user.findUnique({
            where: { email: user.email },
            include: {
                phases: {
                    where: { isActive: true },
                    take: 1
                }
            }
        })

        if (!dbUser || !dbUser.phases.length) return null

        const activePhase = dbUser.phases[0]
        const today = new Date()

        // Calculate the day number in the phase (starts at 0)
        const diffTime = Math.abs(today.getTime() - activePhase.startDate.getTime())
        const dayIndex = Math.floor(diffTime / (1000 * 60 * 60 * 24))

        // Get fitness content compatible with this phase
        const workouts = await prisma.contentLibrary.findMany({
            where: {
                category: "FITNESS",
                targetPhases: {
                    has: activePhase.type
                }
            },
            orderBy: { createdAt: 'asc' }
        })

        if (workouts.length === 0) return null

        // Select workout using rotation (modulo)
        const video = workouts[dayIndex % workouts.length]

        // Check if completed today
        const completion = await prisma.contentLog.findFirst({
            where: {
                userId: dbUser.id,
                contentId: video.id,
                completedAt: {
                    gte: startOfDay(today),
                    lte: endOfDay(today)
                }
            }
        })

        return {
            video,
            isCompleted: !!completion
        }
    } catch (error) {
        console.error("Error fetching daily workout:", error)
        return null
    }
}

export async function completeWorkout(contentId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || !user.email) return { error: "Non autorisé" }

    try {
        const dbUser = await prisma.user.findUnique({
            where: { email: user.email }
        })

        if (!dbUser) return { error: "Utilisateur non trouvé" }

        // Create log entry
        await prisma.contentLog.create({
            data: {
                userId: dbUser.id,
                contentId: contentId
            }
        })

        revalidatePath("/fitness")
        revalidatePath("/dashboard")

        return { success: true }
    } catch (error) {
        console.error("Error completing workout:", error)
        return { error: "Erreur lors de la validation" }
    }
}
