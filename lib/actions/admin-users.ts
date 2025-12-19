"use server"

import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

/**
 * Utility to verify if the current user is an admin.
 */
async function checkAdmin() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || !user.email) return false

    const dbUser = await prisma.user.findUnique({
        where: { email: user.email },
        select: { role: true }
    })

    return dbUser?.role === 'ADMIN'
}

export async function getUsers(query?: string) {
    if (!(await checkAdmin())) {
        throw new Error("Non autorisé")
    }

    return await prisma.user.findMany({
        where: query ? {
            OR: [
                { email: { contains: query, mode: 'insensitive' } },
                { firstName: { contains: query, mode: 'insensitive' } },
            ]
        } : undefined,
        include: {
            phases: {
                where: { isActive: true },
                take: 1
            }
        },
        orderBy: { createdAt: 'desc' },
        take: 50
    })
}

export async function toggleUserRole(userId: string, currentRole: string) {
    if (!(await checkAdmin())) {
        return { error: "Non autorisé" }
    }

    const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN'

    try {
        await prisma.user.update({
            where: { id: userId },
            data: { role: newRole }
        })
        revalidatePath("/admin/users")
        return { success: true }
    } catch (e) {
        return { error: "Erreur lors du changement de rôle" }
    }
}

export async function deleteUser(userId: string) {
    if (!(await checkAdmin())) {
        return { error: "Non autorisé" }
    }

    try {
        await prisma.user.delete({
            where: { id: userId }
        })
        revalidatePath("/admin/users")
        return { success: true }
    } catch (e) {
        return { error: "Erreur lors de la suppression" }
    }
}
