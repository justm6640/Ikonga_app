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

        // 1. Get basic user data that's already in database (from signup)
        let prismaUser = await prisma.user.findUnique({ where: { email: user.email! } });

        if (!prismaUser) {
            console.log("SubmitOnboarding: User Prisma introuvable, création à la volée...");
            try {
                // Utilisation des métadonnées de la session courante
                const firstName = user.user_metadata?.first_name || "User";
                const lastName = user.user_metadata?.last_name;

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

        // 2. Calculs Métaboliques using data from questionnaire + database
        const gender = prismaUser.gender || 'FEMALE'; // From signup
        const birthDate = prismaUser.birthDate; // From signup

        const pisi = calculatePISI(data.heightCm, gender);
        const imc = calculateIMC(data.startWeight, data.heightCm);
        const age = birthDate ? calculateAge(birthDate) : 0;
        const finalTargetWeight = data.targetWeight || pisi;

        await prisma.$transaction(async (tx) => {
            // A. Update User Profile (keep firstName, lastName, gender, birthDate from signup)
            await tx.user.update({
                where: { id: prismaUser!.id },
                data: {
                    // firstName, lastName, gender, birthDate already set from signup - don't overwrite
                    heightCm: data.heightCm,
                    startWeight: data.startWeight,
                    targetWeight: finalTargetWeight,
                    pisi: pisi,
                    startDate: data.programStartDate || new Date(),
                }
            });

            // B. Création des 4 Phases (DETOX, ÉQUILIBRE, CONSOLIDATION, ENTRETIEN)
            const startDate = data.programStartDate || new Date();

            // On vérifie si les phases existent déjà pour éviter les doublons
            const existingPhases = await tx.userPhase.findMany({
                where: { userId: prismaUser!.id }
            });

            if (existingPhases.length === 0) {
                // Phase 1: DETOX (14 jours)
                const detoxEnd = addDays(startDate, 14);
                // Phase 2: ÉQUILIBRE (28 jours par défaut, peut être ajusté par le coach)
                const equilibreStart = detoxEnd;
                const equilibreEnd = addDays(equilibreStart, 28);
                // Phase 3: CONSOLIDATION (28 jours par défaut)
                const consolidationStart = equilibreEnd;
                const consolidationEnd = addDays(consolidationStart, 28);
                // Phase 4: ENTRETIEN (Jusqu'à la fin de l'abonnement ou 1 an)
                const entretienStart = consolidationEnd;
                const entretienEnd = addDays(entretienStart, 365);

                await tx.userPhase.createMany({
                    data: [
                        { userId: prismaUser!.id, type: "DETOX", startDate: startDate, plannedEndDate: detoxEnd, isActive: true },
                        { userId: prismaUser!.id, type: "EQUILIBRE", startDate: equilibreStart, plannedEndDate: equilibreEnd, isActive: false },
                        { userId: prismaUser!.id, type: "CONSOLIDATION", startDate: consolidationStart, plannedEndDate: consolidationEnd, isActive: false },
                        { userId: prismaUser!.id, type: "ENTRETIEN", startDate: entretienStart, plannedEndDate: entretienEnd, isActive: false },
                    ]
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

        // 5. Finalize Onboarding & Generate First Menu & Send Coach Message
        const { generateUserWeeklyPlan } = await import("@/lib/ai/menu-generator");
        const { createNotification } = await import("./notifications");

        await Promise.all([
            prisma.user.update({
                where: { id: prismaUser!.id },
                data: { hasCompletedOnboarding: true }
            }),
            generateUserWeeklyPlan(prismaUser!.id),
            createNotification(
                prismaUser!.id,
                "Bienvenue chez IKONGA ! 🌸",
                "Je vais t’accompagner pas à pas. Tu n’as rien à réussir aujourd’hui, juste à commencer.",
                "INFO",
                "/dashboard",
                "HUMAN",
                "HIGH"
            )
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
 * User data (firstName, lastName, email, etc.) is already in database from signup.
 */
export async function skipOnboarding() {
    try {
        const supabase = await createClient()
        const { data: { user }, error } = await supabase.auth.getUser()

        if (error || !user) throw new Error("Utilisateur non connecté")

        // 1. Récupérer les données utilisateur existantes
        const existingUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: {
                heightCm: true,
                gender: true,
                startWeight: true,
                pisi: true,
                targetWeight: true,
            }
        })

        if (!existingUser) {
            throw new Error("Utilisateur introuvable en base de données")
        }

        // 2. Calculer le PISI si les informations nécessaires sont disponibles
        let calculatedPISI = existingUser.pisi // Garde la valeur existante si déjà calculée
        let targetWeight = existingUser.targetWeight

        if (existingUser.heightCm && existingUser.gender && !existingUser.pisi) {
            calculatedPISI = calculatePISI(existingUser.heightCm, existingUser.gender)
            console.log(`[SKIP_ONBOARDING] PISI calculé: ${calculatedPISI} kg pour taille ${existingUser.heightCm} cm et genre ${existingUser.gender}`)
        }

        // 3. Si targetWeight n'est pas défini, utiliser le PISI comme objectif par défaut
        if (!targetWeight && calculatedPISI) {
            targetWeight = calculatedPISI
        }

        // 4. Mark onboarding as completed and update PISI + targetWeight
        await prisma.user.update({
            where: { id: user.id },
            data: {
                hasCompletedOnboarding: true,
                startDate: new Date(),
                isActive: true,
                ...(calculatedPISI && { pisi: calculatedPISI }),
                ...(targetWeight && { targetWeight }),
            }
        })

        // 5. Notification de bienvenue rapide
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

