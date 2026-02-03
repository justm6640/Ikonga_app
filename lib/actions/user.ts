"use server"

import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"
import { SubscriptionTier } from "@prisma/client"

/**
 * Robustly retrieves the current user's Prisma profile.
 * If the user is authenticated in Supabase but lacks a Prisma profile,
 * it creates one immediately to prevent "Profil introuvable" errors (Self-healing).
 */
export async function getOrCreateUser() {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user || !user.email) {
        return null
    }

    // 1. Try to find by ID (UUID match)
    let dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        include: {
            analysis: true,
            phases: { where: { isActive: true }, take: 1 }
        }
    })

    // 2. Try to find by Email (Sync/Legacy cases)
    if (!dbUser) {
        dbUser = await prisma.user.findUnique({
            where: { email: user.email },
            include: {
                analysis: true,
                phases: { where: { isActive: true }, take: 1 }
            }
        })

        // If found by email but ID is different, update ID to match Supabase
        if (dbUser && dbUser.id !== user.id) {
            console.log(`Syncing user ID for ${user.email} from ${dbUser.id} to ${user.id}`)
            try {
                dbUser = await prisma.user.update({
                    where: { email: user.email },
                    data: { id: user.id },
                    include: {
                        analysis: true,
                        phases: { where: { isActive: true }, take: 1 }
                    }
                })
            } catch (updateError) {
                console.error("Error syncing user ID:", updateError)
            }
        }
    }

    // 3. Self-healing creation if still missing
    if (!dbUser) {
        console.log(`Self-healing: Creating missing Prisma profile for ${user.email}`)
        try {
            // Create user without phases first
            dbUser = await prisma.user.create({
                data: {
                    id: user.id,
                    email: user.email,
                    firstName: user.user_metadata?.first_name || "",
                    lastName: user.user_metadata?.last_name || "",
                    gender: "FEMALE",
                    subscriptionTier: SubscriptionTier.STANDARD_6
                },
                include: {
                    analysis: true,
                    phases: { where: { isActive: true }, take: 1 }
                }
            })

            // Generate all phases based on subscription tier
            const { generatePhasesForSubscription } = await import("@/lib/nutrition/phase-generator")
            await generatePhasesForSubscription(dbUser.id, dbUser.subscriptionTier)

            // Re-fetch user with phases
            dbUser = await prisma.user.findUnique({
                where: { id: dbUser.id },
                include: {
                    analysis: true,
                    phases: { where: { isActive: true }, take: 1 }
                }
            })
            console.log(`Created user with subscription-based phases for ${user.email}`)
        } catch (creationError) {
            console.error("Critical error in getOrCreateUser:", creationError)
            return null
        }
    }

    // 4. Self-healing: Create phases if user exists but has no active phase
    if (dbUser && (!dbUser.phases || dbUser.phases.length === 0)) {
        console.log(`Self-healing: Generating phases for user ${user.email} based on ${dbUser.subscriptionTier}`)
        try {
            const { generatePhasesForSubscription } = await import("@/lib/nutrition/phase-generator")
            await generatePhasesForSubscription(dbUser.id, dbUser.subscriptionTier)

            // Re-fetch user with the new phases
            dbUser = await prisma.user.findUnique({
                where: { id: dbUser.id },
                include: {
                    analysis: true,
                    phases: { where: { isActive: true }, take: 1 }
                }
            })
            console.log(`Generated subscription-based phases for existing user ${user.email}`)
        } catch (phaseError) {
            console.error("Error generating phases:", phaseError)
        }
    }

    return dbUser
}
