import OpenAI from 'openai';
import prisma from '@/lib/prisma';
import { SYSTEM_PROMPT_MENU } from './prompts';
import { startOfWeek, nextMonday, isFriday, isWeekend, addDays } from 'date-fns';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generates a personalized weekly meal plan using GPT-4o-mini.
 */
export async function generateUserWeeklyPlan(userId: string, forceCurrentWeek: boolean = false, startDateOverride?: Date) {
    // 1. Récupération User + Analyse
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            analysis: true,
            phases: { where: { isActive: true }, take: 1 }
        }
    });

    if (!user) throw new Error("Utilisateur introuvable");

    // 1.5 Determine Target Date and check existence
    const today = new Date();
    let targetWeekStart: Date;

    if (startDateOverride) {
        targetWeekStart = startOfWeek(startDateOverride, { weekStartsOn: 1 });
    } else if (forceCurrentWeek) {
        targetWeekStart = startOfWeek(today, { weekStartsOn: 1 });
    } else {
        if (isFriday(today) || isWeekend(today)) {
            targetWeekStart = nextMonday(today);
        } else {
            targetWeekStart = startOfWeek(today, { weekStartsOn: 1 });
        }
    }

    // Safeguard check: Does a plan or custom menu coverage already exist?
    const existingPlan = await prisma.weeklyPlan.findUnique({
        where: {
            userId_weekStart: {
                userId: user.id,
                weekStart: targetWeekStart
            }
        }
    });

    if (existingPlan) {
        console.log(`[MenuGenerator] Plan already exists for week ${targetWeekStart.toISOString().split('T')[0]}. Skipping AI generation.`);
        return { success: true, skipped: true };
    }

    // Also check if user has custom menus for most of the week
    const customCount = await prisma.userCustomMenu.count({
        where: {
            userId: user.id,
            date: {
                gte: targetWeekStart,
                lte: addDays(targetWeekStart, 6)
            }
        }
    });

    if (customCount >= 4) { // If more than half the week is planned by user
        console.log(`[MenuGenerator] User already has ${customCount} custom days. Skipping AI generation.`);
        return { success: true, skipped: true };
    }

    const currentPhase = user.phases[0]?.type || "DETOX";
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

        // 4. Sauvegarde (Upsert)
        const plan = await prisma.weeklyPlan.upsert({
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

        // 5. AUTO-GENERATE MISSING RECIPES (Batch)
        try {
            const mealItems: { name: string, mealType: string }[] = []

            const addMeal = (name: string, type: string) => {
                if (name && name !== "Repas Libre") {
                    mealItems.push({ name, mealType: type })
                }
            }

            const extractFromDay = (d: any) => {
                if (d.breakfast) addMeal(d.breakfast, "BREAKFAST")
                if (d.lunch) addMeal(d.lunch, "LUNCH")
                if (d.snack) addMeal(d.snack, "SNACK")
                if (d.dinner) addMeal(d.dinner, "DINNER")
            }

            if (menuJson.days && Array.isArray(menuJson.days)) {
                menuJson.days.forEach(extractFromDay)
            } else {
                const dayKeys = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
                dayKeys.forEach(k => {
                    const d = menuJson[k]
                    if (d) extractFromDay(d)
                })
            }

            if (mealItems.length > 0) {
                const { batchGenerateRecipes } = await import("./recipe-generator")
                await batchGenerateRecipes(mealItems, currentPhase)
                console.log(`[MenuGenerator] Batch generated ${mealItems.length} recipes for phase ${currentPhase}`)
            }
        } catch (err) {
            console.error("[MenuGenerator] Failed to batch generate recipes:", err)
        }

        return { success: true, plan };

    } catch (error) {
        console.error(`Erreur Menu (User ${userId}):`, error);
        return { success: false, error: "Erreur IA" };
    }
}
