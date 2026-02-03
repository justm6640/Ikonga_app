"use server"

import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { Mood, Digestion } from "@prisma/client"
import { startOfDay, subDays } from "date-fns"
import { calculateDailyScore } from "@/lib/engines/wellness"
import { getOrCreateUser } from "./user"
import { NotificationEngine } from "@/lib/engines/notification-engine"

export async function saveJournalEntry(data: {
    mood?: Mood;
    digestion?: Digestion;
    hydration?: number;
    sleepHours?: number;
    stressLevel?: number;
    energyLevel?: number;
    notes?: string;
}) {
    try {
        const dbUser = await getOrCreateUser()

        if (!dbUser) {
            throw new Error("Utilisateur non authentifié")
        }

        const today = startOfDay(new Date())

        // Calculate score if metrics are provided
        let wellnessScore = undefined
        if (data.stressLevel !== undefined && data.energyLevel !== undefined && data.sleepHours !== undefined) {
            wellnessScore = calculateDailyScore(data.stressLevel, data.energyLevel, data.sleepHours)
        }

        const entry = await prisma.dailyLog.upsert({
            where: {
                userId_date: {
                    userId: dbUser.id,
                    date: today
                }
            },
            update: {
                mood: data.mood,
                digestion: data.digestion,
                hydration: data.hydration,
                sleepHours: data.sleepHours,
                stressLevel: data.stressLevel,
                energyLevel: data.energyLevel,
                wellnessScore: wellnessScore,
                notes: data.notes
            },
            create: {
                userId: dbUser.id,
                date: today,
                mood: data.mood,
                digestion: data.digestion,
                hydration: data.hydration ?? 0,
                sleepHours: data.sleepHours,
                stressLevel: data.stressLevel,
                energyLevel: data.energyLevel,
                wellnessScore: wellnessScore,
                notes: data.notes
            }
        })

        revalidatePath("/dashboard")
        revalidatePath("/journal")

        // 4. Déclencher des notifications intelligentes selon l'état
        if (data.stressLevel && data.stressLevel >= 7) {
            await NotificationEngine.send({
                userId: dbUser.id,
                title: "🧘 Un moment pour toi ?",
                message: "Ton niveau de stress est élevé aujourd’hui. Et si tu prenais 5 min pour respirer ?",
                category: "WELLNESS",
                priority: "MEDIUM",
                type: "WARNING"
            })
        }

        if (data.energyLevel && data.energyLevel <= 3) {
            await NotificationEngine.send({
                userId: dbUser.id,
                title: "🔋 Batteries à plat ?",
                message: "C’est ok d’être fatiguée. Écoute ton corps, repose-toi ce soir.",
                category: "WELLNESS",
                priority: "LOW",
                type: "INFO"
            })
        }

        return { success: true, entry }
    } catch (err: any) {
        console.error("saveJournalEntry error:", err)
        return { success: false, error: err.message }
    }
}

export async function getRecentWellnessLogs(days: number = 7) {
    try {
        const dbUser = await getOrCreateUser()

        if (!dbUser) return []

        const startDate = subDays(startOfDay(new Date()), days - 1)

        return await prisma.dailyLog.findMany({
            where: {
                userId: dbUser.id,
                date: { gte: startDate }
            },
            orderBy: { date: 'asc' }
        })
    } catch (err) {
        console.error("getRecentWellnessLogs error:", err)
        return []
    }
}

export async function getTodayJournalEntry() {
    try {
        const dbUser = await getOrCreateUser()

        if (!dbUser) return null

        const today = startOfDay(new Date())

        const entry = await prisma.dailyLog.findUnique({
            where: {
                userId_date: {
                    userId: dbUser.id,
                    date: today
                }
            }
        })

        return entry
    } catch (err) {
        console.error("getTodayJournalEntry error:", err)
        return null
    }
}
