import OpenAI from 'openai';
import prisma from '@/lib/prisma';
import { SYSTEM_PROMPT_MENU } from './prompts';
import { nextMonday } from 'date-fns';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generates a personalized weekly meal plan using GPT-4o-mini.
 * The plan is tailored to the user's current phase and allergies.
 * It is saved for the following Monday to ensure the user has time to prep.
 */
export async function generateUserWeeklyPlan(userId: string) {
    // 1. Récupération des données utilisateur
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            analysis: true,
            phases: { where: { isActive: true }, take: 1 }
        }
    });

    if (!user) throw new Error("Utilisateur introuvable");

    const currentPhase = user.phases[0]?.type || "DETOX";
    // On récupère les allergies du JSON d'analyse s'il existe, sinon vide
    const analysisData = user.analysis?.content as any;
    const allergies = analysisData?.nutrition?.allergies || "Aucune";

    // 2. Construction du Prompt
    const userPrompt = `
    Génère le menu pour : ${user.firstName || 'Une abonnée'}
    Phase actuelle : ${currentPhase}
    Allergies/Intolérances : ${allergies}
    Objectif : Perte de poids et vitalité.
  `;

    try {
        // 3. Appel OpenAI (GPT-4o Mini)
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: SYSTEM_PROMPT_MENU },
                { role: "user", content: userPrompt }
            ],
            response_format: { type: "json_object" },
            temperature: 0.7,
        });

        const content = completion.choices[0].message.content;
        if (!content) throw new Error("Erreur génération IA");

        const menuJson = JSON.parse(content);

        // 4. Calcul de la date (Prochain Lundi)
        const today = new Date();
        const nextWeekStart = nextMonday(today);

        // 5. Sauvegarde en Base
        // On utilise upsert pour écraser l'ancien si on régénère
        await prisma.weeklyPlan.upsert({
            where: {
                userId_weekStart: {
                    userId: user.id,
                    weekStart: nextWeekStart
                }
            },
            update: {
                content: menuJson,
                phase: currentPhase
            },
            create: {
                userId: user.id,
                weekStart: nextWeekStart,
                phase: currentPhase,
                content: menuJson
            }
        });

        return { success: true, menu: menuJson };

    } catch (error) {
        console.error("Erreur génération menu:", error);
        return { success: false, error: "Impossible de générer le menu" };
    }
}
