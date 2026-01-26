"use server"

import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"
import { QuestionnaireData } from "@/lib/validators/questionnaire"
import { calculatePISI, calculateIMC, calculateAge } from "@/lib/engines/calculators"
import { generateUserAnalysis } from "@/lib/ai/generator"
import { revalidatePath } from "next/cache"
import { addDays } from "date-fns"

export async function submitOnboarding(data: QuestionnaireData) {
    try {
        const supabase = await createClient()
        const { data: { user }, error } = await supabase.auth.getUser()

        if (error || !user || !user.email) {
            throw new Error("Utilisateur non connecté")
        }

        // 1. Calculs Métaboliques
        const gender = (data.gender === 'MALE' || data.gender === 'FEMALE')
            ? data.gender
            : 'FEMALE';

        const pisi = calculatePISI(data.heightCm, gender);
        const imc = calculateIMC(data.startWeight, data.heightCm);
        const age = data.birthDate ? calculateAge(data.birthDate) : 0;
        const finalTargetWeight = data.targetWeight || pisi;

        // 2. Récupération / Création User Prisma (Self-healing)
        let prismaUser = await prisma.user.findUnique({ where: { email: user.email! } });

        if (!prismaUser) {
            console.log("SubmitOnboarding: User Prisma introuvable, création à la volée...");
            try {
                // Utilisation des métadonnées de la session courante (pas besoin d'admin)
                const firstName = user.user_metadata?.first_name || data.firstName;
                const lastName = user.user_metadata?.last_name || data.lastName;

                prismaUser = await prisma.user.create({
                    data: {
                        id: user.id,
                        email: user.email!,
                        firstName: firstName,
                        lastName: lastName,
                    }
                });
            } catch (creationError) {
                console.error("Erreur création user self-healing:", creationError);
                throw new Error("Impossible de créer le profil utilisateur en base de données.");
            }
        }

        await prisma.$transaction(async (tx) => {
            // A. Update User Profile
            await tx.user.update({
                where: { id: prismaUser!.id }, // prismaUser is asserted existing now
                data: {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    gender: gender,
                    birthDate: data.birthDate,
                    heightCm: data.heightCm,
                    startWeight: data.startWeight,
                    targetWeight: finalTargetWeight,
                    pisi: pisi,
                    startDate: data.programStartDate || new Date(),
                }
            });

            // B. Create Initial Phase (DETOX)
            const startDate = data.programStartDate || new Date();
            const existingPhase = await tx.userPhase.findFirst({
                where: { userId: prismaUser!.id, isActive: true, type: "DETOX" }
            });

            if (!existingPhase) {
                await tx.userPhase.create({
                    data: {
                        userId: prismaUser!.id,
                        type: "DETOX",
                        startDate: startDate,
                        plannedEndDate: addDays(startDate, 14),
                        isActive: true
                    }
                });
            }

            // C. Daily Log (Initial Weight) - Normalized to midnight
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            await tx.dailyLog.upsert({
                where: {
                    userId_date: { userId: prismaUser!.id, date: today }
                },
                create: {
                    userId: prismaUser!.id,
                    date: today,
                    weight: data.startWeight
                },
                update: {
                    weight: data.startWeight
                }
            });
        });

        // 3. AI Generation (Outside transaction)
        const userProfileForAI = {
            age: age,
            imc: imc,
            pisi: pisi
        };

        const analysisResult = await generateUserAnalysis(userProfileForAI, data);

        // 4. Save Analysis
        await prisma.userAnalysis.upsert({
            where: { userId: prismaUser!.id },
            update: { content: analysisResult as any, createdAt: new Date() },
            create: {
                userId: prismaUser!.id,
                content: analysisResult as any
            }
        });

        // 5. Finalize Onboarding & Generate First Menu
        const { generateUserWeeklyPlan } = await import("@/lib/ai/menu-generator");

        await Promise.all([
            prisma.user.update({
                where: { id: prismaUser!.id },
                data: { hasCompletedOnboarding: true }
            }),
            generateUserWeeklyPlan(prismaUser!.id)
        ]);

        revalidatePath("/dashboard")
        return { success: true, nextPath: "/dashboard" }

    } catch (error) {
        console.error("Erreur onboarding détaillée:", error)
        const errorMessage = error instanceof Error ? error.message : "Une erreur inconnue est survenue";
        return { success: false, error: errorMessage }
    }
}

/**
 * Définit la date de début du parcours et envoie une notification de bienvenue.
 */
export async function setJourneyStartDate(userId: string, date: Date | 'NOW') {
    try {
        const startDate = date === 'NOW' ? new Date() : date;

        await prisma.user.update({
            where: { id: userId },
            data: {
                startDate,
                isActive: true
            }
        });

        // Add the welcome notification
        const { createNotification } = await import("./notifications");
        await createNotification(
            userId,
            "C'est parti ! 🚀",
            "Ton programme Ikonga commence. Prépare-toi à transformer ta vie !",
            "SUCCESS",
            "/dashboard"
        );

        revalidatePath("/dashboard");
        revalidatePath("/onboarding");

        return { success: true };
    } catch (error) {
        console.error("[SET_JOURNEY_START_DATE]", error);
        return { success: false, error: "Impossible de définir la date de début." };
    }
}

/**
 * Permet de sauter l'onboarding détaillé et d'aller directement au dashboard.
 * Ne génère pas de bilan AI.
 */
export async function skipOnboarding(data: { firstName?: string, lastName?: string, email?: string }) {
    try {
        const supabase = await createClient()
        const { data: { user }, error } = await supabase.auth.getUser()

        if (error || !user) throw new Error("Utilisateur non connecté")

        // 1. Mise à jour minimale du profil
        await prisma.user.update({
            where: { id: user.id },
            data: {
                firstName: data.firstName || undefined,
                lastName: data.lastName || undefined,
                // On s'assure que hasCompletedOnboarding reste à false (il l'est par défaut)
                hasCompletedOnboarding: false,
                // On définit une date de début pour que le dashboard ne redirige pas vers l'onboarding
                startDate: new Date(),
                isActive: true
            }
        })

        // 2. Notification de bienvenue rapide
        const { createNotification } = await import("./notifications");
        await createNotification(
            user.id,
            "Bienvenue chez IKONGA ! 🌸",
            "Tu as choisi de compléter ton profil plus tard. Tu peux accéder à tes outils dès maintenant.",
            "INFO",
            "/dashboard"
        );

        revalidatePath("/dashboard")
        revalidatePath("/onboarding")

        return { success: true }
    } catch (error) {
        console.error("[SKIP_ONBOARDING]", error)
        return { success: false, error: "Une erreur est survenue lors de l'enregistrement." }
    }
}
