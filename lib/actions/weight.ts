"use server"

import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { awardBadge } from "./gamification"

export type LogWeightResult = {
    status: "success" | "neutral" | "info" | "error";
    message: string;
}

export async function saveWeightLog(
    weight: number,
    date: Date,
    photoUrl?: string
): Promise<LogWeightResult> {
    try {
        const supabase = await createClient()
        const { data: { user }, error } = await supabase.auth.getUser()

        if (error || !user || !user.email) {
            throw new Error("Utilisateur non connecté")
        }

        // Find Prisma User
        const prismaUser = await prisma.user.findUnique({ where: { email: user.email! } });
        if (!prismaUser) throw new Error("Utilisateur Prisma introuvable");

        // 1. Chercher le dernier poids enregistré (avant la date actuelle)
        // Pour comparer et donner du feedback.
        const lastLog = await prisma.dailyLog.findFirst({
            where: {
                userId: prismaUser.id,
                date: { lt: date }, // Logs before this date
                weight: { not: null }
            },
            orderBy: { date: 'desc' }
        });

        const previousWeight = lastLog?.weight;

        // 2. Upsert le Log
        // Normalize date to midnight to avoid duplicate entries for same day if timing differs?
        // Usually standard practice.
        const logDate = new Date(date);
        logDate.setHours(0, 0, 0, 0);

        const savedLog = await prisma.dailyLog.upsert({
            where: {
                userId_date: { userId: prismaUser.id, date: logDate }
            },
            create: {
                userId: prismaUser.id,
                date: logDate,
                weight: weight,
                photoUrl: photoUrl
            },
            update: {
                weight: weight,
                photoUrl: photoUrl // Update photo if provided
            }
        });

        revalidatePath("/dashboard");
        revalidatePath("/weigh-in");

        // 3. Algorithme Zero Guilt Feedback
        if (!previousWeight) {
            await awardBadge(prismaUser.id, "FIRST_WEIGH_IN")
            return { status: "success", message: "Premier pas validé ! Bienvenue dans ton suivi. 🚀" };
        }

        // Calcul différence avec tolérance micro (floating point)
        const diff = weight - previousWeight;

        if (diff < -0.1) {
            return { status: "success", message: "Bravo ! Tu as perdu du poids ! 🎉" };
        } else if (Math.abs(diff) <= 0.1) {
            return { status: "neutral", message: "La stabilité est une victoire ! ⚓️" };
        } else {
            return { status: "info", message: "L'hydratation joue beaucoup. Continue tes efforts ! 💪" };
        }

    } catch (error) {
        console.error("Erreur saveWeightLog:", error);
        return { status: "error", message: "Une erreur est survenue lors de l'enregistrement." };
    }
}
