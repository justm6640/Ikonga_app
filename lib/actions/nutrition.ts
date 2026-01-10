"use server"

import prisma from "@/lib/prisma"
import { getOrCreateUser } from "./user"
import { startOfDay, startOfWeek, format } from "date-fns"
import { fr } from "date-fns/locale"
import { revalidatePath } from "next/cache"

/**
 * Retrieves the menu for the current day and the completion status.
 */
export async function getDailyNutritionData() {
    try {
        const user = await getOrCreateUser()
        if (!user) return null

        const today = startOfDay(new Date())
        const weekStart = startOfWeek(today, { weekStartsOn: 1 }) // Monday

        // 1. Get current weekly plan
        const weeklyPlan = await prisma.weeklyPlan.findUnique({
            where: {
                userId_weekStart: {
                    userId: user.id,
                    weekStart: weekStart
                }
            }
        })

        if (!weeklyPlan) return null

        // 2. Identify current day (index 0-6 where 0 is Monday for our system if weekStartsOn: 1)
        // However, format(date, 'EEEE') gives the day name in French.
        const dayName = format(today, 'EEEE', { locale: fr }).toLowerCase()
        // dayName will be "lundi", "mardi", etc.

        // 3. Extract day menu from JSON
        const content = weeklyPlan.content as any
        const dayMenu = content.days?.[dayName] || content[dayName]

        if (!dayMenu) return null

        // 4. Check DailyLog for completion
        const dailyLog = await prisma.dailyLog.findUnique({
            where: {
                userId_date: {
                    userId: user.id,
                    date: today
                }
            },
            select: { nutritionDone: true }
        })

        return {
            menu: dayMenu,
            isCompleted: dailyLog?.nutritionDone || false,
            phase: weeklyPlan.phase,
            weekStart: weeklyPlan.weekStart
        }

    } catch (error) {
        console.error("[GET_DAILY_NUTRITION_DATA_ERROR]", error)
        return null
    }
}

/**
 * Validates the daily nutrition intake.
 */
export async function validateDailyNutrition() {
    try {
        const user = await getOrCreateUser()
        if (!user) throw new Error("Non autorisé")

        const today = startOfDay(new Date())

        await prisma.dailyLog.upsert({
            where: {
                userId_date: {
                    userId: user.id,
                    date: today
                }
            },
            create: {
                userId: user.id,
                date: today,
                nutritionDone: true
            },
            update: {
                nutritionDone: true
            }
        })

        revalidatePath('/nutrition')
        revalidatePath('/dashboard')

        return { success: true }

    } catch (error) {
        console.error("[VALIDATE_DAILY_NUTRITION_ERROR]", error)
        return { success: false, error: "Impossible de valider le menu." }
    }
}
