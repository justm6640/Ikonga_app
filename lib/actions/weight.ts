"use server"

import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { awardBadge } from "./gamification"
import { NotificationType } from "@prisma/client"
import { createNotification } from "./notifications"

export type LogWeightResult = {
    status: "success" | "neutral" | "info" | "error" | "confirmation_needed" | "warning";
    message: string;
    motivationalMessage?: string;
    data?: {
        weighInId?: string;
        variation?: number;
        existingDate?: Date;
        warnings?: string[];
    };
}

const MOTIVATION_MESSAGES = {
    loss: [
        "Super baisse ! Tu continues de rayonner ✨",
        "Bravo ! Chaque kilo compte 🎉",
        "Magnifique progression ! Continue comme ça 💪",
        "Tu es sur la bonne voie ! Fière de toi 🌟",
        "Quel parcours incroyable ! Keep going 🚀"
    ],
    stable: [
        "Les plateaux sont normaux, tu tiens bon 👊",
        "La patience est la clé du succès. Reste focus ✨",
        "Ton corps s'adapte, c'est positif ! 💪",
        "Stabilité validée ! On continue le processus 🚀",
        "L'important c'est de ne pas lâcher. Courage ! 🌟"
    ],
    gain: [
        "Rien de grave ! On ajuste ensemble 💪",
        "Le poids fluctue, garde le moral ! ✨",
        "Une petite hausse n'efface pas tes efforts 🏔️",
        "On reste motivé(e), demain est un autre jour ! 🚀",
        "Focus sur tes habitudes, les chiffres suivront 👊"
    ],
    first: [
        "Premier pas validé ! Bienvenue dans ton suivi. 🚀",
        "C'est le début d'une belle aventure ! ✨",
        "Heureuse de t'accompagner dans ce voyage 💪",
        "Ta transformation commence maintenant ! 🌟",
        "Bienvenue ! On va faire de grandes choses 🎯"
    ]
}

function getMotivationalMessage(type: 'loss' | 'stable' | 'gain' | 'first'): string {
    const messages = MOTIVATION_MESSAGES[type];
    return messages[Math.floor(Math.random() * messages.length)];
}

function validateWeight(weight: number, previousWeight?: number): string[] {
    const warnings: string[] = [];
    if (weight < 30 || weight > 250) {
        warnings.push("Vérifie pour être sûr(e) 👍");
    }
    if (previousWeight && Math.abs(weight - previousWeight) > 5) {
        warnings.push("Cette variation semble importante...");
    }
    return warnings;
}

export async function saveWeightLog(
    weight: number,
    date: Date,
    photoUrl?: string,
    behavior: "CHECK" | "REPLACE" | "ADD" = "CHECK"
): Promise<LogWeightResult> {
    try {
        console.log("[saveWeightLog] Starting...");
        const supabase = await createClient()
        console.log("[saveWeightLog] Supabase client created");

        const { data: { user }, error } = await supabase.auth.getUser()
        console.log("[saveWeightLog] User retrieved:", user?.id, "Error:", error);

        if (error || !user || !user.email) {
            console.error("[saveWeightLog] Auth error or missing user");
            throw new Error("Utilisateur non connecté")
        }

        console.log("[saveWeightLog] Finding Prisma user for:", user.email);
        const prismaUser = await prisma.user.findUnique({
            where: { email: user.email! },
            include: { phases: true }
        });
        console.log("[saveWeightLog] Prisma user found:", prismaUser?.id);

        if (!prismaUser) throw new Error("Utilisateur Prisma introuvable");

        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        if (behavior === "CHECK") {
            const existing = await prisma.weighIn.findFirst({
                where: {
                    userId: prismaUser.id,
                    date: { gte: startOfDay, lte: endOfDay }
                }
            });

            if (existing) {
                return {
                    status: "confirmation_needed",
                    message: "Une pesée existe déjà pour cette date.",
                    data: { existingDate: existing.date }
                };
            }
        }

        if (behavior === "REPLACE") {
            const oldLogs = await prisma.weighIn.findMany({
                where: {
                    userId: prismaUser.id,
                    date: { gte: startOfDay, lte: endOfDay }
                }
            });
            for (const old of oldLogs) {
                if (old.photoUrl) {
                    const path = old.photoUrl.split('/').pop();
                    if (path) await supabase.storage.from('weigh-in-photos').remove([`${prismaUser.id}/${path}`]);
                }
            }
            await prisma.weighIn.deleteMany({
                where: {
                    userId: prismaUser.id,
                    date: { gte: startOfDay, lte: endOfDay }
                }
            });
        }

        const weighIn = await prisma.weighIn.create({
            data: {
                userId: prismaUser.id,
                date: date,
                weight: weight,
                photoUrl: photoUrl
            }
        });

        await prisma.dailyLog.upsert({
            where: { userId_date: { userId: prismaUser.id, date: startOfDay } },
            create: { userId: prismaUser.id, date: startOfDay, weight, photoUrl },
            update: { weight, photoUrl }
        });

        const lastLog = await prisma.weighIn.findFirst({
            where: { userId: prismaUser.id, date: { lt: date } },
            orderBy: { date: 'desc' }
        });

        const warnings = validateWeight(weight, lastLog?.weight);

        // Notification checks (async)
        Promise.all([
            checkMilestones(prismaUser.id, weight),
            checkGoalAchievement(prismaUser.id, weight)
        ]).catch(err => console.error('Notification check failed:', err));

        revalidatePath("/dashboard");
        revalidatePath("/weigh-in");

        if (!lastLog) {
            await awardBadge(prismaUser.id, "FIRST_WEIGH_IN");
            return {
                status: "success",
                message: "Pesée enregistrée avec succès !",
                motivationalMessage: getMotivationalMessage('first'),
                data: { weighInId: weighIn.id, warnings: warnings.length > 0 ? warnings : undefined }
            };
        }

        const diff = weight - lastLog.weight;
        let motivationalMessage = "";
        let status: "success" | "neutral" | "info" = "neutral";

        if (diff < -0.1) {
            motivationalMessage = getMotivationalMessage('loss');
            status = "success";
        } else if (Math.abs(diff) <= 0.1) {
            motivationalMessage = getMotivationalMessage('stable');
            status = "neutral";
        } else {
            motivationalMessage = getMotivationalMessage('gain');
            status = "info";
        }

        return {
            status,
            message: "Pesée enregistrée avec succès !",
            motivationalMessage,
            data: {
                weighInId: weighIn.id,
                variation: diff,
                warnings: warnings.length > 0 ? warnings : undefined
            }
        };

    } catch (error) {
        console.error("Erreur saveWeightLog:", error);
        return { status: "error", message: "Une erreur est survenue lors de l'enregistrement." };
    }
}

export async function uploadWeighInPhoto(file: File): Promise<string | null> {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Non autorisé");

        // Simple moderation
        if (file.size > 5 * 1024 * 1024) throw new Error("Fichier trop lourd (max 5MB)");
        if (!file.type.startsWith("image/")) throw new Error("Format invalide");

        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('weigh-in-photos')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
            .from('weigh-in-photos')
            .getPublicUrl(filePath);

        return publicUrl;
    } catch (error) {
        console.error("Error uploading photo:", error);
        return null;
    }
}

export async function deleteWeighIn(weighInId: string) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || !user.email) throw new Error("Non autorisé");

        const prismaUser = await prisma.user.findUnique({ where: { email: user.email! } });
        if (!prismaUser) throw new Error("Profil introuvable");

        const weighIn = await prisma.weighIn.findUnique({ where: { id: weighInId } });
        if (!weighIn || weighIn.userId !== prismaUser.id) throw new Error("Pesée introuvable ou non autorisée");

        if (weighIn.photoUrl) {
            const path = weighIn.photoUrl.split('/').pop();
            if (path) await supabase.storage.from('weigh-in-photos').remove([`${prismaUser.id}/${path}`]);
        }

        await prisma.weighIn.delete({ where: { id: weighInId } });

        const startOfDay = new Date(weighIn.date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(weighIn.date);
        endOfDay.setHours(23, 59, 59, 999);

        const latestRemaining = await prisma.weighIn.findFirst({
            where: { userId: prismaUser.id, date: { gte: startOfDay, lte: endOfDay } },
            orderBy: { date: 'desc' }
        });

        if (latestRemaining) {
            await prisma.dailyLog.update({
                where: { userId_date: { userId: prismaUser.id, date: startOfDay } },
                data: { weight: latestRemaining.weight, photoUrl: latestRemaining.photoUrl }
            });
        } else {
            await prisma.dailyLog.deleteMany({
                where: { userId: prismaUser.id, date: startOfDay }
            });
        }

        revalidatePath("/dashboard");
        revalidatePath("/weigh-in");
        return { success: true };
    } catch (error) {
        console.error("Error deleting weigh-in:", error);
        return { success: false, error: "Une erreur est survenue" };
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
        const [logs, totalCount] = await Promise.all([
            prisma.weighIn.findMany({
                where: { userId: prismaUser.id },
                orderBy: { date: 'desc' },
                take: pageSize,
                skip: skip
            }),
            prisma.weighIn.count({ where: { userId: prismaUser.id } })
        ]);

        const logsWithVariation = await Promise.all(logs.map(async (log) => {
            const prev = await prisma.weighIn.findFirst({
                where: { userId: prismaUser.id, date: { lt: log.date } },
                orderBy: { date: 'desc' },
                select: { weight: true }
            });
            return {
                ...log,
                variation: prev ? log.weight - prev.weight : 0,
                isFirst: !prev
            }
        }));

        return { logs: logsWithVariation, totalPages: Math.ceil(totalCount / pageSize), currentPage: page };
    } catch (error) { return null; }
}

export async function getWeightStats() {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user || !user.email) return null;
        const prismaUser = await prisma.user.findUnique({ where: { email: user.email! } });
        if (!prismaUser) return null;

        const logs = await prisma.weighIn.findMany({
            where: { userId: prismaUser.id },
            orderBy: { date: 'asc' },
            select: { date: true, weight: true }
        });

        return { logs, startWeight: prismaUser.startWeight || 0, targetWeight: prismaUser.targetWeight || 0 };
    } catch (error) { return null; }
}

// Phase 7: Notification Logic
export async function checkAndSendWeighInReminder(userId: string) {
    try {
        const lastLog = await prisma.weighIn.findFirst({ where: { userId }, orderBy: { date: 'desc' } });
        if (!lastLog) return;
        const diffMs = Date.now() - new Date(lastLog.date).getTime();
        const daysSince = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        if (daysSince >= 3) {
            await createNotification(userId, "📊 Rappel Pesée", `Cela fait ${daysSince} jours depuis ta dernière pesée. On reste sur le coup ? 💪`, NotificationType.INFO, "/weigh-in");
        }
    } catch (e) { console.error(e); }
}

const milestones = [
    { kg: 5, emoji: "🎉", message: "Premier palier franchi ! -5kg déjà !" },
    { kg: 10, emoji: "🎊", message: "Double digits ! 10kg de moins, incroyable !" },
    { kg: 15, emoji: "🌟", message: "15kg perdus ! Tu rayonnes de plus en plus !" },
    { kg: 20, emoji: "💎", message: "Transformation extraordinaire ! -20kg, tu es un modèle !" },
    { kg: 25, emoji: "👑", message: "Championne absolue ! -25kg atteints !" }
];

async function checkMilestones(userId: string, currentWeight: number) {
    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user || !user.startWeight) return;
        const totalLost = user.startWeight - currentWeight;
        for (const m of milestones) {
            if (totalLost >= m.kg) {
                const existing = await prisma.notification.findFirst({ where: { userId, title: { contains: `${m.kg}kg` } } });
                if (!existing) {
                    await createNotification(userId, `${m.emoji} Milestone : -${m.kg}kg`, m.message, NotificationType.SUCCESS, "/weigh-in");
                }
            }
        }
    } catch (e) { console.error(e); }
}

async function checkGoalAchievement(userId: string, currentWeight: number) {
    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user || !user.targetWeight) return;
        if (Math.abs(currentWeight - user.targetWeight) <= 0.5) {
            const existing = await prisma.notification.findFirst({ where: { userId, title: "🏆 OBJECTIF ATTEINT !" } });
            if (!existing) {
                await createNotification(userId, "🏆 OBJECTIF ATTEINT !", `Félicitations ! Tu as atteint ton objectif de ${user.targetWeight} kg ! Quel parcours incroyable ! 💖`, NotificationType.SUCCESS, "/weigh-in");
            }
        }
    } catch (e) { console.error(e); }
}

export async function sendWeeklySummary(userId: string) {
    try {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const logs = await prisma.weighIn.findMany({ where: { userId, date: { gte: weekAgo } }, orderBy: { date: 'asc' } });
        if (logs.length < 2) return;
        const weeklyChange = logs[logs.length - 1].weight - logs[0].weight;
        let message = "";
        let type: NotificationType = NotificationType.INFO;
        if (weeklyChange < -0.5) {
            message = `Une superbe semaine ! ${Math.abs(weeklyChange).toFixed(1)} kg de perdus. Continue comme ça ! 🚀`;
            type = NotificationType.SUCCESS;
        } else if (weeklyChange > 0.5) {
            message = `Semaine un peu plus chargée (+${weeklyChange.toFixed(1)} kg). Pas de panique, on se ressaisit ensemble ! 💪`;
        } else {
            message = `Une semaine stable ! La constance est la clé de ta réussite. ✨`;
        }
        await createNotification(userId, "📈 Bilan Hebdomadaire", message, type, "/weigh-in");
    } catch (e) { console.error(e); }
}
