import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { startOfDay } from "date-fns"

/**
 * Cron Job route to send weigh-in reminders.
 * Targeted by Dokploy or any CRON service.
 */
export async function GET(request: Request) {
    // 1. Security Check
    const authHeader = request.headers.get("authorization")
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const today = startOfDay(new Date())

        // 2. Fetch active users
        const activeUsers = await prisma.user.findMany({
            where: { isActive: true },
            select: { id: true, firstName: true }
        })

        // 3. Fetch users who have already logged weight today
        const logsToday = await prisma.dailyLog.findMany({
            where: {
                date: today,
                weight: { not: null }
            },
            select: { userId: true }
        })

        const usersWhoLogged = new Set(logsToday.map(log => log.userId))

        // 4. Filter users who need a reminder
        const usersToRemind = activeUsers.filter(user => !usersWhoLogged.has(user.id))

        if (usersToRemind.length === 0) {
            return NextResponse.json({ message: "No reminders to send today." })
        }

        // 5. Batch create notifications
        const notificationData = usersToRemind.map(user => ({
            userId: user.id,
            title: "C'est l'heure de la pesée ! ⚖️",
            message: `Bonjour ${user.firstName || "Champion(ne)"}, n'oublie pas d'enregistrer ton poids pour suivre ta progression.`,
            type: "INFO" as const,
            link: "/weigh-in",
            isRead: false
        }))

        const result = await prisma.notification.createMany({
            data: notificationData,
            skipDuplicates: true
        })

        return NextResponse.json({
            success: true,
            remindersSent: result.count,
            message: `${result.count} reminders successfully created.`
        })

    } catch (error) {
        console.error("[CRON_WEIGH_IN_ERROR]", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
