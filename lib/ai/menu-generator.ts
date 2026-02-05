import OpenAI from 'openai';
import prisma from '@/lib/prisma';
import { SYSTEM_PROMPT_MENU } from './prompts';
import { startOfWeek, nextMonday, isFriday, isWeekend, addDays } from 'date-fns';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Simple in-memory lock to prevent parallel generations in the same process.
 * In a serverless environment, this helps for concurrent requests to the same instance.
 */
const generationLocks = new Set<string>();

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

    const lockKey = `${userId}-${targetWeekStart.getTime()}`;
    if (generationLocks.has(lockKey)) {
        console.log(`[MenuGenerator] Generation already in progress for ${lockKey}. Skipping.`);
        return { success: true, skipped: true };
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

    // 1.8 Gather Personalization Data
    const physicalData = {
        weight: user.startWeight || "Non spécifié",
        height: user.heightCm || "Non spécifié",
        pisi: user.pisi || "Non spécifié",
        bmi: user.startWeight && user.heightCm
            ? (user.startWeight / (Math.pow(user.heightCm / 100, 2))).toFixed(1)
            : "Inconnu"
    };

    const preferences = {
        allergies: user.allergies?.length ? user.allergies.join(", ") : (analysisData?.nutrition?.allergies || "Aucune"),
        diet: user.dietaryUsage || analysisData?.nutrition?.dietaryUsage || "Standard",
        country: user.countryOrigin || "Non spécifié",
        tastes: analysisData?.nutrition?.tastes || "Afro-Fusion & Varié"
    };

    // 1.9 Fetch Phase Guidelines
    const guidelines = await prisma.phaseGuideline.findMany({
        where: { phase: currentPhase as any }
    });

    const allowed = guidelines.filter(g => g.type === "ALLOWED").map(g => g.content).join(", ");
    const forbidden = guidelines.filter(g => g.type === "FORBIDDEN").map(g => g.content).join(", ");

    // 2. Prompt IA
    const userPrompt = `
    Génère le menu pour : ${user.firstName || 'Abonnée'}
    Phase Actuelle : ${currentPhase}
    
    🌍 CONTEXTE GÉOGRAPHIQUE :
    Pays d'origine : ${preferences.country}
    (Privilégie des recettes locales saines et Afro-Fusion adaptées à ce pays)

    ⚖️ PROFIL PHYSIQUE :
    Poids : ${physicalData.weight}kg
    Taille : ${physicalData.height}cm
    IMC : ${physicalData.bmi}
    Objectif (PISI) : ${physicalData.pisi}kg
    
    ⚠️ SANTÉ & RÉGIME :
    Régime : ${preferences.diet}
    Allergies : ${preferences.allergies}
    Préférences : ${preferences.tastes}

    📋 RÈGLES DE LA PHASE ${currentPhase} :
    ✅ À PRIVILÉGIER : ${allowed || "Légumes verts, protéines maigres, eau"}
    ❌ À ÉVITER : ${forbidden || "Sucre, alcool, produits transformés"}
    
    Format : JSON strict.
  `;

    try {
        generationLocks.add(lockKey);

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
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
    } finally {
        generationLocks.delete(lockKey);
    }
}
