"use server"

import prisma from "@/lib/prisma";
import { generateUserWeeklyPlan } from "../ai/menu-generator";
import { revalidatePath } from "next/cache";

/**
 * Helper triggered after a successful payment/subscription event.
 * Activates the user profile and triggers immediate AI menu generation.
 */
export async function onSubscriptionSuccess(userId: string) {
    try {
        console.log(`[Subscription] Activating profile for user: ${userId}`);

        // 1. Activate User in Database
        await prisma.user.update({
            where: { id: userId },
            data: {
                isActive: true,
                planStartDate: new Date()
            }
        });

        // 2. Immediate Initial Menu Generation (Rosy works fast!)
        // We do this so the user has content immediately upon first login.
        console.log(`[Subscription] Triggering initial menu generation...`);
        const generation = await generateUserWeeklyPlan(userId);

        if (!generation.success) {
            console.error(`[Subscription] Initial menu generation failed: ${generation.error}`);
            // We don't throw here to avoid breaking the subscription flow success response,
            // but we log it for admin tracking.
        }

        // 3. Revalidate Dashboard for instant UI updates
        revalidatePath("/dashboard");
        revalidatePath("/shopping-list");

        return { success: true };

    } catch (error) {
        console.error("[Subscription] Error in onSubscriptionSuccess:", error);
        return { success: false, error: "Profile activation failed" };
    }
}
