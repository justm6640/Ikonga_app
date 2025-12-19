"use server"

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
