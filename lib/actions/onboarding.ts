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
        // Note: On suppose ici 'gender' est bien FEMALE | MALE, sinon fallback safe
        const gender = (data.gender === 'MALE' || data.gender === 'FEMALE')
            ? data.gender
            : 'FEMALE';

        // Calcul Poids Idéal Santé
        const pisi = calculatePISI(data.heightCm, gender);
        const imc = calculateIMC(data.startWeight, data.heightCm);
        const age = data.birthDate ? calculateAge(data.birthDate) : 0; // Default to 0 if missing (should not happen due to validation)

        // Si pas de targetWeight, on met le PISI par défaut
        const finalTargetWeight = data.targetWeight || pisi;

        // 2. Transaction Prisma
        // On récupère d'abord l'ID Prisma via l'email
        const prismaUser = await prisma.user.findUnique({ where: { email: user.email! } });
        if (!prismaUser) throw new Error("Utilisateur Prisma introuvable");

        await prisma.$transaction(async (tx) => {
            // A. Update User Profile
            await tx.user.update({
                where: { id: prismaUser.id },
                data: {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    gender: gender,
                    birthDate: data.birthDate,
                    heightCm: data.heightCm,
                    startWeight: data.startWeight,
                    targetWeight: finalTargetWeight,
                    pisi: pisi,
                }
            });

            // B. Create Initial Phase (DETOX)
            // Check duplication simple logic: if active phase exists, do nothing (or reset?)
            // For onboarding, we assume new start.
            const existingPhase = await tx.userPhase.findFirst({
                where: { userId: prismaUser.id, isActive: true, type: "DETOX" }
            });

            if (!existingPhase) {
                await tx.userPhase.create({
                    data: {
                        userId: prismaUser.id,
                        type: "DETOX",
                        startDate: new Date(),
                        plannedEndDate: addDays(new Date(), 14),
                        isActive: true
                    }
                });
            }

            // C. Daily Log (Initial Weight)
            const today = new Date();
            // Just create log for today. If constraint error (already logged), we catch it or use upsert if needed.
            // Using upsert for safety.
            await tx.dailyLog.upsert({
                where: {
                    userId_date: { userId: prismaUser.id, date: today } // Assuming default DateTime comparison works or handled by Prisma
                },
                create: {
                    userId: prismaUser.id,
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

        // This might take a few seconds
        const analysisResult = await generateUserAnalysis(userProfileForAI, data);

        // 4. Save Analysis
        await prisma.userAnalysis.upsert({
            where: { userId: prismaUser.id },
            update: { content: analysisResult as any, createdAt: new Date() }, // Json type casting
            create: {
                userId: prismaUser.id,
                content: analysisResult as any
            }
        });

        revalidatePath("/dashboard")
        return { success: true, nextPath: "/dashboard" }

    } catch (error) {
        console.error("Erreur onboarding:", error)
        return { success: false, error: "Une erreur est survenue lors de la sauvegarde." }
    }
}
