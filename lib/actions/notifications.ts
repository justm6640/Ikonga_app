"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { NotificationType } from "@prisma/client"

/**
 * Récupère les 20 dernières notifications pour un utilisateur.
 */
export async function getUserNotifications(userId: string) {
    try {
        return await prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 20
        })
    } catch (error) {
        console.error("[GET_USER_NOTIFICATIONS]", error)
        return []
    }
}

/**
 * Renvoie le nombre de notifications non lues.
 */
export async function getUnreadCount(userId: string) {
    try {
        return await prisma.notification.count({
            where: {
                userId,
                isRead: false
            }
        })
    } catch (error) {
        console.error("[GET_UNREAD_COUNT]", error)
        return 0
    }
}

/**
 * Marque une notification spécifique comme lue.
 */
export async function markAsRead(notificationId: string) {
    try {
        await prisma.notification.update({
            where: { id: notificationId },
            data: { isRead: true }
        })
        revalidatePath("/") // Revalidate dashboard/header for the bell icon
    } catch (error) {
        console.error("[MARK_AS_READ]", error)
    }
}

/**
 * Marque toutes les notifications d'un utilisateur comme lues.
 */
export async function markAllAsRead(userId: string) {
    try {
        await prisma.notification.updateMany({
            where: {
                userId,
                isRead: false
            },
            data: { isRead: true }
        })
        revalidatePath("/")
    } catch (error) {
        console.error("[MARK_ALL_AS_READ]", error)
    }
}

/**
 * Crée une notification pour un utilisateur.
 * Utilité interne pour les autres actions serveurs.
 */
export async function createNotification(
    userId: string,
    title: string,
    message: string,
    type: NotificationType = NotificationType.INFO,
    link?: string
) {
    try {
        const notif = await prisma.notification.create({
            data: {
                userId,
                title,
                message,
                type,
                link
            }
        })
        revalidatePath("/")
        return notif
    } catch (error) {
        console.error("[CREATE_NOTIFICATION]", error)
        return null
    }
}
