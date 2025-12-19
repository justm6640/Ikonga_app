"use server"

import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"
import { ProfileSchema } from "@/lib/validators/profile"
import { revalidatePath } from "next/cache"
import { calculatePISI } from "@/lib/engines/calculators"

export async function updateProfile(data: ProfileSchema) {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user || !user.email) {
        return { error: "Non authentifié" }
    }

    try {
        // Fetch current user to get gender/birthDate for PISI recalculation if needed
        const currentUser = await prisma.user.findUnique({
            where: { email: user.email },
            select: { gender: true, birthDate: true }
        })

        if (!currentUser) return { error: "Utilisateur non trouvé" }

        // Recalculate PISI if height is provided
        let pisi = undefined
        if (data.heightCm) {
            pisi = calculatePISI(data.heightCm, currentUser.gender)
        }

        await prisma.user.update({
            where: { email: user.email },
            data: {
                firstName: data.firstName,
                lastName: data.lastName,
                heightCm: data.heightCm,
                targetWeight: typeof data.targetWeight === 'number' ? data.targetWeight : null,
                pisi: pisi ?? undefined
            }
        })

        revalidatePath("/profile")
        revalidatePath("/dashboard")

        return { success: true }
    } catch (e) {
        console.error("Update Profile Error:", e)
        return { error: "Une erreur est survenue lors de la mise à jour du profil" }
    }
}
