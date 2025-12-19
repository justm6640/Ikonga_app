"use server"

import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"
import { calculateProjection } from "@/lib/engines/projection"
import { format, eachDayOfInterval, addDays, isSameDay } from "date-fns"

export async function getWeightAnalytics() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || !user.email) return null

    const dbUser = await prisma.user.findUnique({
        where: { email: user.email },
        include: {
            dailyLogs: {
                where: { weight: { not: null } },
                orderBy: { date: 'asc' }
            }
        }
    })

    if (!dbUser || !dbUser.startWeight || !dbUser.targetWeight) return null

    // 1. Current Stats
    const logs = dbUser.dailyLogs
    const latestWeight = logs.length > 0 ? logs[logs.length - 1].weight! : dbUser.startWeight
    const projection = calculateProjection(
        dbUser.startWeight,
        latestWeight,
        dbUser.targetWeight,
        dbUser.startDate
    )

    // Update goalDate if needed (optional but good for persistence)
    // We do it asynchronously or just keep it in memory for the chart.

    // 2. Chart Data Generation
    // We want a range from startDate to estimatedEndDate
    const startDate = dbUser.startDate
    const endDate = projection.estimatedEndDate

    // Safety check: if end date is in the past (already done), use today
    const chartEnd = endDate < new Date() ? new Date() : endDate

    const days = eachDayOfInterval({
        start: startDate,
        end: addDays(chartEnd, 7) // Add a week for padding
    })

    // Prepare Projected Line Formula: 
    // Weight(t) = startWeight - (0.8 / 7) * daysSinceStart
    const dailyLossRate = 0.8 / 7

    const chartData = days.map((day, index) => {
        const dateStr = format(day, "dd/MM")

        // Linear projection
        const projectedWeight = Math.max(
            dbUser.targetWeight!,
            dbUser.startWeight! - (dailyLossRate * index)
        )

        // Actual weight if log exists for this day
        const actualLog = logs.find(l => isSameDay(l.date, day))

        return {
            date: dateStr,
            projected: Number(projectedWeight.toFixed(1)),
            actual: actualLog ? actualLog.weight : null
        }
    })

    return {
        projection,
        chartData,
        currentWeight: latestWeight,
        targetWeight: dbUser.targetWeight,
        startWeight: dbUser.startWeight
    }
}
