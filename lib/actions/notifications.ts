"use server"

import { getOrCreateUser } from "./user"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { NotificationCategory, NotificationType, NotificationPriority } from "@prisma/client"
import { NotificationEngine } from "@/lib/engines/notification-engine"

/**
 * RÉCUPÉRATION DES NOTIFICATIONS
 */
export async function getUserNotifications() {
    try {
        const user = await getOrCreateUser()
        if (!user) return []

        const notifications = await prisma.notification.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' },
            take: 50
        })

        return notifications
    } catch (error) {
        console.error("Error fetching notifications:", error)
        return []
    }
}

/**
 * GESTION STATUT LECTURE
 */
export async function markNotificationAsRead(id: string) {
    try {
        const user = await getOrCreateUser()
        if (!user) throw new Error("Unauthorized")

        await prisma.notification.update({
            where: { id, userId: user.id },
            data: { isRead: true }
        })

        revalidatePath("/")
        return { success: true }
    } catch (error) {
        console.error("Error marking notification as read:", error)
        return { success: false }
    }
}

export async function markAllNotificationsAsRead() {
    try {
        const user = await getOrCreateUser()
        if (!user) throw new Error("Unauthorized")

        await prisma.notification.updateMany({
            where: { userId: user.id, isRead: false },
            data: { isRead: true }
        })

        revalidatePath("/")
        return { success: true }
    } catch (error) {
        console.error("Error marking all as read:", error)
        return { success: false }
    }
}

/**
 * PRÉFÉRENCES
 */
export async function getNotificationPreferences() {
    try {
        const user = await getOrCreateUser()
        if (!user) return null

        let prefs = await prisma.userNotificationPreference.findUnique({
            where: { userId: user.id }
        })

        // Initialisation si inexistant
        if (!prefs) {
            prefs = await prisma.userNotificationPreference.create({
                data: { userId: user.id }
            })
        }

        return prefs
    } catch (error) {
        console.error("Error fetching preferences:", error)
        return null
    }
}

export async function updateNotificationPreferences(data: {
    enablePhases?: boolean
    enableFollowup?: boolean
    enableLifestyle?: boolean
    enableWellness?: boolean
    enableCommunity?: boolean
    quietHoursEnabled?: boolean
    quietHoursStart?: string
    quietHoursEnd?: string
}) {
    try {
        const user = await getOrCreateUser()
        if (!user) throw new Error("Unauthorized")

        await prisma.userNotificationPreference.upsert({
            where: { userId: user.id },
            update: data,
            create: { userId: user.id, ...data }
        })

        revalidatePath("/profile")
        return { success: true }
    } catch (error) {
        console.error("Error updating preferences:", error)
        return { success: false }
    }
}

/**
 * CRÉATION D'UNE NOTIFICATION
 * Wrapper pour NotificationEngine.send
 */
export async function createNotification(
    userId: string,
    title: string,
    message: string,
    type: NotificationType = "INFO",
    link?: string,
    category: NotificationCategory = "LIFESTYLE",
    priority: NotificationPriority = "LOW"
) {
    try {
        return await NotificationEngine.send({
            userId,
            title,
            message,
            category,
            priority,
            type,
            link
        })
    } catch (error) {
        console.error("[CREATE_NOTIFICATION_ERROR]", error)
        return { success: false, error: "Failed to create notification" }
    }
}
