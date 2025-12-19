"use server"

import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"

async function verifyAdmin() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || !user.email) throw new Error("Non authentifié")

    const dbUser = await prisma.user.findUnique({
        where: { email: user.email },
        select: { role: true }
    })

    if (!dbUser || dbUser.role !== 'ADMIN') throw new Error("Accès refusé")

    return dbUser
}

export async function getAdminMenus() {
    await verifyAdmin()
    return await prisma.menu.findMany({
        orderBy: { title: 'asc' }
    })
}

export async function getAdminContent() {
    await verifyAdmin()
    const [videos, recipes] = await Promise.all([
        prisma.contentLibrary.findMany({
            orderBy: { createdAt: 'desc' }
        }),
        prisma.recipe.findMany({
            orderBy: { createdAt: 'desc' }
        })
    ])

    return { videos, recipes }
}
