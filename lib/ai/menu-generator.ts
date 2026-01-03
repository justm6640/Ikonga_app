import OpenAI from 'openai';
import prisma from '@/lib/prisma';
import { SYSTEM_PROMPT_MENU } from './prompts';
import { startOfWeek, nextMonday, isFriday, isWeekend } from 'date-fns';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generates a personalized weekly meal plan using GPT-4o-mini.
 * Smart Date Logic:
 * - forceCurrentWeek=true: Always generates for CURRENT week (useful for onboarding).
 * - forceCurrentWeek=false (default):
 *   - Mon-Thu: Generates for CURRENT week (startOfWeek).
 *   - Fri-Sun: Generates for NEXT week (nextMonday).
 */
export async function generateUserWeeklyPlan(userId: string, forceCurrentWeek: boolean = false) {
    // 1. Récupération User + Analyse
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            analysis: true,
            phases: { where: { isActive: true }, take: 1 }
        }
    });

    if (!user) throw new Error("Utilisateur introuvable");

    const currentPhase = user.phases[0]?.type || "DETOX";
    // Gestion sécurisée si l'analyse n'existe pas encore
    const analysisData = user.analysis?.content ? (user.analysis.content as any) : {};
    const allergies = analysisData?.nutrition?.allergies || "Aucune";

    // 2. Prompt IA
    const userPrompt = `
    Génère le menu pour : ${user.firstName || 'Abonnée'}
    Phase : ${currentPhase}
    Allergies : ${allergies}
    Objectif : Perte de poids.
  `;

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: SYSTEM_PROMPT_MENU },
                { role: "user", content: userPrompt }
            ],
            response_format: { type: "json_object" },
        });

        const content = completion.choices[0].message.content;
        if (!content) throw new Error("Erreur génération IA");

        const menuJson = JSON.parse(content);

        // 3. LOGIQUE DE DATE INTELLIGENTE
        const today = new Date();
        let targetWeekStart;

        if (forceCurrentWeek) {
            // Force la génération pour la semaine EN COURS (ex: onboarding le week-end)
            targetWeekStart = startOfWeek(today, { weekStartsOn: 1 });
        } else {
            // Logique standard : Si Vendredi ou Weekend -> semaine prochaine
            if (isFriday(today) || isWeekend(today)) {
                targetWeekStart = nextMonday(today);
            } else {
                // Sinon (Lundi-Jeudi) -> semaine EN COURS
                targetWeekStart = startOfWeek(today, { weekStartsOn: 1 });
            }
        }

        // 4. Sauvegarde (Upsert)
        await prisma.weeklyPlan.upsert({
            where: {
                userId_weekStart: {
                    userId: user.id,
                    weekStart: targetWeekStart
                }
            },
            update: {
                content: menuJson,
                phase: currentPhase
            },
            create: {
                userId: user.id,
                weekStart: targetWeekStart,
                phase: currentPhase,
                content: menuJson
            }
        });

        return { success: true };

    } catch (error) {
        console.error(`Erreur Menu (User ${userId}):`, error);
        return { success: false, error: "Erreur IA" };
    }
}
