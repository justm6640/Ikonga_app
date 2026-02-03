import { PrismaClient, NotificationCategory, NotificationPriority, NotificationType } from "@prisma/client"
import { isAfter, isBefore, setHours, setMinutes, parse } from "date-fns"

const prisma = new PrismaClient()

interface NotificationInput {
    userId: string
    title: string
    message: string
    category: NotificationCategory
    priority: NotificationPriority
    type?: NotificationType
    link?: string
    metadata?: any
}

export class NotificationEngine {
    /**
     * Envoie une notification intelligente en respectant les préférences et limites
     */
    static async send(input: NotificationInput) {
        const { userId, category, priority } = input

        // 1. Récupérer l'utilisateur et ses préférences
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                notificationPreferences: true,
                _count: {
                    select: {
                        notifications: {
                            where: {
                                createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
                            }
                        }
                    }
                }
            }
        })

        if (!user) return { success: false, error: "User not found" }

        // 2. Vérifier si la catégorie est activée
        const prefs = user.notificationPreferences
        if (prefs) {
            const isEnabled =
                (category === "PHASE" && prefs.enablePhases) ||
                (category === "FOLLOWUP" && prefs.enableFollowup) ||
                (category === "LIFESTYLE" && prefs.enableLifestyle) ||
                (category === "WELLNESS" && prefs.enableWellness) ||
                (category === "HUMAN" && prefs.enableCommunity)

            if (!isEnabled) return { success: false, error: "Category disabled by user" }

            // 3. Vérifier les Quiet Hours (Sauf pour les priorités HIGH / HUMAN)
            if (prefs.quietHoursEnabled && priority !== "HIGH" && category !== "HUMAN") {
                if (this.isInQuietHours(prefs.quietHoursStart, prefs.quietHoursEnd)) {
                    return { success: false, error: "Quiet hours active" }
                }
            }
        }

        // 4. Limites Anti-Spam (Exemple: Max 8 notifications par 24h glissantes pour les catégories non-critiques)
        if (priority === "LOW" || priority === "GENTLE") {
            if (user._count.notifications > 8) {
                return { success: false, error: "Daily limit reached for low priority" }
            }
        }

        // 5. Création de la notification
        const notification = await prisma.notification.create({
            data: {
                userId,
                title: input.title,
                message: input.message,
                category: input.category,
                priority: input.priority,
                type: input.type || "INFO",
                link: input.link,
                metadata: input.metadata
            }
        })

        return { success: true, notification }
    }

    /**
     * Vérifie si l'heure actuelle est dans la plage de repos
     */
    private static isInQuietHours(start: string | null, end: string | null): boolean {
        if (!start || !end) return false

        const now = new Date()
        const currentTime = now.getHours() * 60 + now.getMinutes()

        const [startH, startM] = start.split(':').map(Number)
        const [endH, endM] = end.split(':').map(Number)

        const startTime = startH * 60 + startM
        const endTime = endH * 60 + endM

        if (startTime < endTime) {
            return currentTime >= startTime && currentTime < endTime
        } else {
            // Plage à cheval sur minuit (ex: 22:00 -> 08:00)
            return currentTime >= startTime || currentTime < endTime
        }
    }

    /**
     * Notification spécifique : Rappel de pesée intelligent
     */
    static async triggerWeighInReminder(userId: string, phase: string) {
        // Logique basée sur la phase (48h ou 7j)
        // Sera appelé par un cron ou lors de l'activité
        return this.send({
            userId,
            title: "⚖️ Repère de parcours",
            message: "Quand tu veux, tu peux noter ta dernière pesée. C’est un repère, pas un jugement.",
            category: "FOLLOWUP",
            priority: "MEDIUM",
            link: "/dashboard/weight"
        })
    }
}
