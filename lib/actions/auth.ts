"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"
import { z } from "zod"

// 1. Schéma de validation Zod pour l'inscription
const SignUpSchema = z.object({
    email: z.string().email("Format d'email invalide"),
    password: z
        .string()
        .min(8, "Le mot de passe doit contenir au moins 8 caractères")
        .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre"),
    firstName: z.string().min(2, "Le prénom est trop court"),
    lastName: z.string().optional(),
})

export async function login(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get("email") as string
    const password = formData.get("password") as string

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return { success: false, error: "Identifiants invalides ou compte non vérifié." }
    }

    revalidatePath("/", "layout")
    redirect("/dashboard")
}

/**
 * Action d'inscription robuste avec validation Zod et synchronisation Prisma.
 */
export async function signup(formData: FormData) {
    const supabase = await createClient()
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

    // A. Extraction et Validation des données
    const rawData = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        firstName: formData.get("firstName") as string,
        lastName: formData.get("lastName") as string || undefined,
    }

    const validatedFields = SignUpSchema.safeParse(rawData)

    if (!validatedFields.success) {
        // Renvoie la première erreur trouvée pour le front
        const firstError = Object.values(validatedFields.error.flatten().fieldErrors)[0]?.[0]
        return { success: false, error: firstError || "Données invalides" }
    }

    const { email, password, firstName, lastName } = validatedFields.data

    // B. Inscription Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                first_name: firstName,
                last_name: lastName
            },
            emailRedirectTo: `${appUrl}/auth/callback?next=/onboarding`
        }
    })

    if (authError) {
        return { success: false, error: authError.message }
    }

    // C. Synchronisation immédiate avec Prisma
    // Si l'utilisateur est retourné, nous créons son profil dans notre DB
    if (authData.user) {
        try {
            await prisma.user.create({
                data: {
                    id: authData.user.id,
                    email: authData.user.email!,
                    firstName: firstName,
                    lastName: lastName,
                    role: "USER" // Rôle par défaut
                }
            })
        } catch (prismaError: any) {
            console.error("Critical Prisma Sync Error:", prismaError)

            // P2002 est le code d'erreur Prisma pour les contraintes d'unicité (email/ID déjà présent)
            if (prismaError.code === 'P2002') {
                return { success: false, error: "Un compte avec cet email existe déjà." }
            }

            return { success: false, error: "Erreur technique lors de la création du profil." }
        }
    }

    revalidatePath("/", "layout")

    // On retourne success pour permettre au front d'afficher un message ou de rediriger
    // NOTE: redirect() jette une erreur interne Next.js, on le place après toute autre logique
    redirect("/verify-email")
}

export async function signout() {
    const supabase = await createClient()
    await supabase.auth.signOut()

    revalidatePath("/", "layout")
    redirect("/login")
}
