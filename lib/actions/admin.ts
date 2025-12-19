"use server"

import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"
import { PhaseType } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { z } from "zod"

// Input Schema for Validation
const contentItemSchema = z.object({
    category: z.string().min(1, "La catégorie est requise"),
    title: z.string().min(3, "Le titre est requis"),
    mediaUrl: z.string().url("URL invalide").optional().or(z.literal("")),
    targetPhases: z.array(z.nativeEnum(PhaseType)).min(1, "Au moins une phase requise"),
    emotionalTags: z.string().optional() // String comma separated from UI, to be processed
})

export type CreateContentState = {
    error?: string;
    success?: boolean;
}

export async function createContentItem(prevState: CreateContentState, formData: FormData): Promise<CreateContentState> {
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

    // 2. Parse Data
    const category = formData.get("category") as string
    const title = formData.get("title") as string
    const mediaUrl = formData.get("mediaUrl") as string

    // Checkbox groups in FormData usually return multiple values for same key if multiple selected,
    // but React Hook Form usually handles it via hidden inputs or we parse manually.
    // Here we will expect `targetPhases` to be passed (likely JSON stringified if complex, or handle logic).
    // Simplification: We will trust the Client Action to pass formatted data? 
    // No, standard FormData from a native form with checkboxes:
    // checkboxes with name="targetPhases" will appear multiple times.
    const targetPhasesRaw = formData.getAll("targetPhases") as string[]

    // Map strings to Enums (Validation)
    const targetPhases = targetPhasesRaw.map(p => p as PhaseType).filter(p => Object.values(PhaseType).includes(p))

    const emotionalTagsRaw = formData.get("emotionalTags") as string
    const emotionalTags = emotionalTagsRaw
        ? emotionalTagsRaw.split(',').map(t => t.trim()).filter(t => t.length > 0)
        : []

    // 3. Create
    try {
        await prisma.contentLibrary.create({
            data: {
                category,
                title,
                mediaUrl: mediaUrl || null,
                targetPhases,
                emotionalTags,
                targetGender: ["FEMALE"], // Default for now
                metadata: {} // Empty JSON
            }
        })
    } catch (e) {
        console.error("Create Content Error:", e)
        return { error: "Erreur base de données" }
    }

    revalidatePath("/dashboard")
    return { success: true }
}
