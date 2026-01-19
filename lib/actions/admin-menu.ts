"use server"

import { startOfDay } from "date-fns"
import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"
import { PhaseType } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const menuSchema = z.object({
    title: z.string().min(1, "Le titre est requis"),
    phaseCompat: z.array(z.nativeEnum(PhaseType)).min(1, "Au moins une phase requise"),
    isPremium: z.boolean(),
    content: z.object({
        breakfast: z.string().min(1, "Petit-déjeuner requis"),
        lunch: z.string().min(1, "Déjeuner requis"),
        snack: z.string().min(1, "Collation requise"),
        dinner: z.string().min(1, "Dîner requis"),
    })
})

export type MenuActionState = {
    error?: string
    success?: boolean
}

export async function createDailyMenu(prevState: MenuActionState, formData: FormData): Promise<MenuActionState> {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user || !user.email) {
        return { error: "Non authentifié" }
    }

    // 1. Verify Role ADMIN
    const dbUser = await prisma.user.findUnique({
        where: { email: user.email },
        select: { role: true }
    })

    if (!dbUser || dbUser.role !== 'ADMIN') {
        return { error: "Accès refusé : Droits Admin requis" }
    }

    // 2. Extract Data
    const title = formData.get("title") as string
    const isPremium = formData.get("isPremium") === "true"
    const phaseCompatRaw = formData.getAll("phaseCompat") as string[]
    const phaseCompat = phaseCompatRaw.map(p => p as PhaseType).filter(p => Object.values(PhaseType).includes(p))

    const content = {
        breakfast: formData.get("breakfast") as string,
        lunch: formData.get("lunch") as string,
        snack: formData.get("snack") as string,
        dinner: formData.get("dinner") as string,
    }

    // 3. Validate
    const validation = menuSchema.safeParse({
        title,
        phaseCompat,
        isPremium,
        content
    })

    if (!validation.success) {
        return { error: "Données invalides : " + validation.error.issues.map((issue) => issue.message).join(", ") }
    }

    // 4. Create in DB
    try {
        await prisma.menu.create({
            data: {
                title,
                phaseCompat,
                isPremium,
                content: content as any
            }
        })
    } catch (error: any) {
        console.error("Create Menu Error:", error)
        return { error: "Erreur lors de la création du menu en base de données" }
    }

    revalidatePath("/dashboard")
    revalidatePath("/admin/menus")
    return { success: true }
}

export async function getGlobalMenus(phase?: PhaseType) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Allow both Admin and Authenticated Users to fetch (since users need to see templates)
    if (!user) return []

    const where: any = {}
    if (phase) {
        where.phaseCompat = { has: phase }
    }

    try {
        const menus = await prisma.menu.findMany({
            where,
            orderBy: { title: 'asc' }
        })
        return menus
    } catch (error) {
        console.error("Get Menus Error:", error)
        return []
    }
}

export async function deleteMenu(menuId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: "Non authentifié" }

    const dbUser = await prisma.user.findUnique({
        where: { email: user.email! },
        select: { role: true }
    })

    if (dbUser?.role !== 'ADMIN') {
        return { error: "Accès refusé" }
    }

    try {
        await prisma.menu.delete({
            where: { id: menuId }
        })
        revalidatePath("/admin/menus")
        return { success: true }
    } catch (error) {
        console.error("Delete Menu Error:", error)
        return { error: "Impossible de supprimer le menu" }
    }
}

/**
 * Assigne un menu (contenu brut) à un utilisateur spécifique pour une date donnée.
 * Écrase tout UserCustomMenu existant pour ce jour.
 */
export async function assignMenuToUser(userIdentifier: string, date: Date, content: any) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Admin check
    if (!user) return { error: "Non authentifié" }
    const dbUser = await prisma.user.findUnique({ where: { email: user.email! }, select: { role: true } })
    if (dbUser?.role !== 'ADMIN') return { error: "Accès refusé" }

    let targetUserId = userIdentifier

    // Check if it looks like an email
    if (userIdentifier.includes('@')) {
        const targetUser = await prisma.user.findUnique({
            where: { email: userIdentifier },
            select: { id: true }
        })

        if (!targetUser) {
            return { error: `Utilisateur introuvable avec l'email : ${userIdentifier}` }
        }
        targetUserId = targetUser.id
    }

    const targetDate = startOfDay(date)

    try {
        await prisma.userCustomMenu.upsert({
            where: {
                userId_date: {
                    userId: targetUserId,
                    date: targetDate
                }
            },
            create: {
                userId: targetUserId,
                date: targetDate,
                content
            },
            update: {
                content
            }
        })

        revalidatePath("/admin/menus")
        revalidatePath("/nutrition") // Force users to see it
        return { success: true }
    } catch (error) {
        console.error("Assign User Menu Error:", error)
        return { error: "Erreur lors de l'assignation" }
    }
}

/**
 * Assigne un menu à TOUS les utilisateurs d'une phase active donnée pour une date.
 */
export async function assignMenuToGroup(phase: PhaseType, date: Date, content: any) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: "Non authentifié" }
    const dbUser = await prisma.user.findUnique({ where: { email: user.email! }, select: { role: true } })
    if (dbUser?.role !== 'ADMIN') return { error: "Accès refusé" }

    const targetDate = startOfDay(date)

    try {
        // 1. Find all users currently in this phase
        const usersInPhase = await prisma.userPhase.findMany({
            where: {
                type: phase,
                isActive: true
            },
            select: { userId: true }
        })

        if (usersInPhase.length === 0) {
            return { success: true, message: "Aucun utilisateur trouvé dans cette phase" }
        }

        // 2. Batch Upsert
        await prisma.$transaction(
            usersInPhase.map(u =>
                prisma.userCustomMenu.upsert({
                    where: { userId_date: { userId: u.userId, date: targetDate } },
                    create: { userId: u.userId, date: targetDate, content },
                    update: { content }
                })
            )
        )

        revalidatePath("/admin/menus")
        revalidatePath("/nutrition") // Force users to see it
        return { success: true, count: usersInPhase.length }
    } catch (error) {
        console.error("Assign Group Menu Error:", error)
        return { error: "Erreur lors de l'assignation de groupe" }
    }
}
