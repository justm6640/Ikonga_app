"use server"

import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { awardBadge } from "./gamification"

export type LogWeightResult = {
    status: "success" | "neutral" | "info" | "error" | "confirmation_needed";
    message: string;
    data?: any;
}

export async function saveWeightLog(
    weight: number,
    date: Date,
    photoUrl?: string,
    behavior: "CHECK" | "REPLACE" | "ADD" = "CHECK"
): Promise<LogWeightResult> {
    try {
        const supabase = await createClient()
        const { data: { user }, error } = await supabase.auth.getUser()

        if (error || !user || !user.email) {
            throw new Error("Utilisateur non connecté")
        }

        const prismaUser = await prisma.user.findUnique({ where: { email: user.email! } });
        if (!prismaUser) throw new Error("Utilisateur Prisma introuvable");

        // Date boundaries for the day
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        // 1. CHECK for duplicates if requested
        if (behavior === "CHECK") {
            const existing = await prisma.weighIn.findFirst({
                where: {
                    userId: prismaUser.id,
                    date: {
                        gte: startOfDay,
                        lte: endOfDay
                    }
                }
            });

            if (existing) {
                return {
                    status: "confirmation_needed",
                    message: "Une pesée existe déjà pour cette date.",
                    data: { date: existing.date }
                };
            }
        }

        // 2. Handle REPLACE (Delete existing for this day)
        if (behavior === "REPLACE") {
            await prisma.weighIn.deleteMany({
                where: {
                    userId: prismaUser.id,
                    date: {
                        gte: startOfDay,
                        lte: endOfDay
                    }
                }
            });
        }

        // 3. Create new WeighIn entry (History)
        // We use the exact provided date (with time) for the history log
        await prisma.weighIn.create({
            data: {
                userId: prismaUser.id,
                date: date,
                weight: weight,
                photoUrl: photoUrl
            }
        });

        // 4. Update DailyLog (Dashboard Cache - Always latest)
        // We normalize to midnight for DailyLog to ensure one entry per day
        await prisma.dailyLog.upsert({
            where: {
                userId_date: { userId: prismaUser.id, date: startOfDay }
            },
            create: {
                userId: prismaUser.id,
                date: startOfDay,
                weight: weight, // Updated with latest
                photoUrl: photoUrl
            },
            update: {
                weight: weight, // Updated with latest
                photoUrl: photoUrl // Updated with latest
            }
        });

        // 5. Calculate Variation & Motivation
        // Find previous weigh-in (strictly before this weigh-in's date)
        const lastLog = await prisma.weighIn.findFirst({
            where: {
                userId: prismaUser.id,
                date: { lt: date }
            },
            orderBy: { date: 'desc' }
        });

        revalidatePath("/dashboard");
        revalidatePath("/weigh-in");

        // First weigh-in logic
        if (!lastLog) {
            await awardBadge(prismaUser.id, "FIRST_WEIGH_IN")
            return { status: "success", message: "Premier pas validé ! Bienvenue dans ton suivi. 🚀" };
        }

        const diff = weight - lastLog.weight;

        // Feedback Logic
        if (diff < -0.1) {
            return { status: "success", message: "Super baisse ! Tu continues de rayonner ✨" };
        } else if (Math.abs(diff) <= 0.1) {
            return { status: "neutral", message: "Les plateaux sont normaux, tu tiens bon 👊" };
        } else {
            // Gain
            return { status: "info", message: "Rien de grave ! On ajuste ensemble 💪" };
        }

    } catch (error) {
        console.error("Erreur saveWeightLog:", error);
        return { status: "error", message: "Une erreur est survenue lors de l'enregistrement." };
    }
}

export async function getWeightHistory(page: number = 1, pageSize: number = 10) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user || !user.email) return null;

        const prismaUser = await prisma.user.findUnique({ where: { email: user.email! } });
        if (!prismaUser) return null;

        const skip = (page - 1) * pageSize;

        const logs = await prisma.weighIn.findMany({
            where: { userId: prismaUser.id },
            orderBy: { date: 'desc' },
            take: pageSize,
            skip: skip
        });

        const totalCount = await prisma.weighIn.count({
            where: { userId: prismaUser.id }
        });

        // Calculate variations for each log compared to the one immediately before it
        // Optimally, we fetch one extra item or fetch previous individually. 
        // For list view, user wants to see "Variation vs PREVIOUS pesée".
        // We can do this on client or fetch efficiently here.
        // Let's fetch the item *after* the current page window to calc the last item's diff?
        // Actually, variation is usually stored or calculated. Simpler to calculate on read.

        // For accurate variation in a paginated list, for each item we need the item immediately preceding it in time.
        // This is expensive (N queries). 
        // Optimization: Fetch pageSize + 1 and chain? No, that only links within page.
        // Let's just return the raw logs and let the client or a specialized query handle it. 
        // Or better: attach the variation.

        const logsWithVariation = await Promise.all(logs.map(async (log) => {
            const prev = await prisma.weighIn.findFirst({
                where: {
                    userId: prismaUser.id,
                    date: { lt: log.date }
                },
                orderBy: { date: 'desc' },
                select: { weight: true }
            });

            return {
                ...log,
                variation: prev ? log.weight - prev.weight : 0,
                isFirst: !prev
            }
        }));

        return {
            logs: logsWithVariation,
            totalPages: Math.ceil(totalCount / pageSize),
            currentPage: page
        };

    } catch (error) {
        console.error("Error getting history:", error);
        return null;
    }
}

export async function getWeightStats() {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user || !user.email) return null;

        const prismaUser = await prisma.user.findUnique({ where: { email: user.email! } });
        if (!prismaUser) return null;

        // Fetch all weigh-ins for chart
        // Limit to reasonable amount (e.g. 1 year?) or fetch all if not huge.
        const logs = await prisma.weighIn.findMany({
            where: { userId: prismaUser.id },
            orderBy: { date: 'asc' },
            select: { date: true, weight: true }
        });

        return {
            logs,
            startWeight: prismaUser.startWeight,
            targetWeight: prismaUser.targetWeight
        };

    } catch (error) {
        return null;
    }
}
