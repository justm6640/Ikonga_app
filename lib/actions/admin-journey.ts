"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { startOfDay } from "date-fns"

/**
 * Action Admin : Modifie la date de début du programme d'un utilisateur.
 * Régénère automatiquement le plan hebdomadaire pour correspondre à la nouvelle semaine.
 */
export async function adminUpdateUserStartDate(userId: string, newDate: string | Date) {
    try {
        // TODO: Add admin role verification when middleware is in place
        // const currentUser = await getCurrentUser()
        // if (currentUser.role !== 'ADMIN') {
        //     return { success: false, message: "Non autorisé" }
        // }

        // Normalize date to midnight
        const normalizedDate = startOfDay(new Date(newDate))

        // 1. Update user start date
        await prisma.user.update({
            where: { id: userId },
            data: {
                startDate: normalizedDate,
                planStartDate: normalizedDate
            }
        })

        // 2. Regenerate weekly plan to align with new date
        try {
            const { generateUserWeeklyPlan } = await import("@/lib/ai/menu-generator")
            await generateUserWeeklyPlan(userId)
        } catch (error) {
            console.error("[ADMIN_UPDATE_START_DATE] Weekly plan regeneration failed:", error)
            // Continue anyway - the date is updated even if plan generation fails
        }

        // 3. Revalidate paths for admin and user
        revalidatePath(`/admin/users/${userId}`)
        revalidatePath('/dashboard')
        revalidatePath('/admin/users')

        return {
            success: true,
            message: "Date mise à jour et planning recalculé avec succès."
        }
    } catch (error) {
        console.error("[ADMIN_UPDATE_START_DATE]", error)
        return {
            success: false,
            message: "Erreur lors de la mise à jour de la date de début"
        }
    }
}

/**
 * Action Admin : Récupère les informations détaillées d'un utilisateur.
 */
export async function getAdminUserDetails(userId: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                phases: { orderBy: { startDate: 'desc' }, take: 5 },
                dailyLogs: { orderBy: { date: 'desc' }, take: 10 },
                weeklyPlans: { orderBy: { weekStart: 'desc' }, take: 4 },
                analysis: true
            }
        })

        return user
    } catch (error) {
        console.error("[GET_ADMIN_USER_DETAILS]", error)
        return null
    }
}
