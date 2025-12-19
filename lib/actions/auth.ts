"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"

export async function login(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get("email") as string
    const password = formData.get("password") as string

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return { error: error.message }
    }

    revalidatePath("/", "layout")
    redirect("/dashboard")
}

import { headers } from "next/headers"

export async function signup(formData: FormData) {
    const supabase = await createClient()
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string

    const { data: authData, error } = await supabase.auth.signUp({
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

    if (error) {
        return { error: error.message }
    }

    // Create User in Prisma immediately to sync
    if (authData.user && authData.user.email) {
        try {
            await prisma.user.create({
                data: {
                    id: authData.user.id, // Sync ID is good practice if Supabase ID is UUID
                    email: authData.user.email,
                    firstName: firstName,
                    lastName: lastName,
                    // defaults for others
                }
            })
        } catch (e) {
            console.error("Error creating Prisma user:", e)
            // If already exists (race condition or previous attempt), ignore
        }
    }

    revalidatePath("/", "layout")
    redirect("/verify-email")
}

export async function signout() {
    const supabase = await createClient()
    await supabase.auth.signOut()

    revalidatePath("/", "layout")
    redirect("/login")
}
