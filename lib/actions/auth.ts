"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"
import { z } from "zod"

// 1. Schémas de validation Zod
const EmailSchema = z.object({
    email: z.string().email("Format d'email invalide"),
})

const SignUpSchema = EmailSchema.extend({
    password: z
        .string()
        .min(8, "Le mot de passe doit contenir au moins 8 caractères")
        .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre"),
    firstName: z.string().min(2, "Le prénom est trop court"),
    lastName: z.string().optional(),
    gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
    birthDate: z.string().optional(),
    phone: z.string().optional(),
    heightCm: z.coerce.number().min(100).max(250).optional(),
    startWeight: z.coerce.number().min(30).max(300).optional(),
    startDate: z.string().optional(),
})

export async function login(prevState: any, formData: FormData) {
    console.log("[AUTH_ACTION] Login attempt started")
    const supabase = await createClient()

    const email = formData.get("email") as string
    const password = formData.get("password") as string
    console.log("[AUTH_ACTION] Attempting sign-in for:", email)

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        console.error("[AUTH_ACTION] Login error:", error.message)
        return { success: false, error: "Identifiants invalides ou compte non vérifié." }
    }

    console.log("[AUTH_ACTION] Login successful for user:", data.user?.id)

    revalidatePath("/", "layout")
    console.log("[AUTH_ACTION] Redirecting to /dashboard")
    redirect("/dashboard")
}

/**
 * Action d'inscription robuste avec validation Zod et synchronisation Prisma.
 */
export async function signup(prevState: any, formData: FormData) {
    const supabase = await createClient()
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

    // A. Extraction et Validation des données
    const rawData = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        firstName: formData.get("firstName") as string,
        lastName: formData.get("lastName") as string || undefined,
        gender: formData.get("gender") as string || undefined,
        birthDate: formData.get("birthDate") as string || undefined,
        phone: formData.get("phone") as string || undefined,
        heightCm: formData.get("heightCm") as string || undefined,
        startWeight: formData.get("startWeight") as string || undefined,
        startDate: formData.get("startDate") as string || undefined,
    }

    const validatedFields = SignUpSchema.safeParse(rawData)

    if (!validatedFields.success) {
        // Renvoie la première erreur trouvée pour le front
        const firstError = Object.values(validatedFields.error.flatten().fieldErrors)[0]?.[0]
        return { success: false, error: firstError || "Données invalides" }
    }

    const { email, password, firstName, lastName, gender, birthDate, phone, heightCm, startWeight, startDate } = validatedFields.data

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
                    role: "USER", // Rôle par défaut
                    gender: gender as any,
                    birthDate: birthDate ? new Date(birthDate) : undefined,
                    phoneNumber: phone || undefined,
                    heightCm: heightCm || undefined,
                    startWeight: startWeight || undefined,
                    startDate: startDate ? new Date(startDate) : undefined,
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

/**
 * Action pour réinitialiser le mot de passe.
 * Utilise la redirection vers /auth/callback?next=/update-password
 */
export async function forgotPassword(formData: FormData) {
    const supabase = await createClient()
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

    const email = formData.get("email") as string
    const validatedFields = EmailSchema.safeParse({ email })

    if (!validatedFields.success) {
        return { success: false, error: "Email invalide" }
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${appUrl}/auth/callback?next=/update-password`,
    })

    if (error) {
        console.error("Forgot Password Error:", error.message)
        // On retourne quand même success ou un message générique pour éviter l'énumération d'emails
        return { success: false, error: "Une erreur est survenue lors de l'envoi." }
    }

    return { success: true }
}

export async function signout() {
    const supabase = await createClient()
    await supabase.auth.signOut()

    revalidatePath("/", "layout")
    redirect("/login")
}
