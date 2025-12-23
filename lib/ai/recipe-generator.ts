import OpenAI from 'openai';
import prisma from '@/lib/prisma';
import { SYSTEM_PROMPT_RECIPE } from './prompts';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Fetches a recipe from the database or generates it using AI.
 * Caches the results to avoid duplicate costs.
 */
export async function getOrGenerateRecipe(mealName: string, phase: string) {
    // 1. Check Database Cache
    try {
        const existingRecipe = await prisma.recipe.findFirst({
            where: {
                name: mealName,
                phase: phase
            }
        });

        if (existingRecipe) return existingRecipe;
    } catch (dbError: any) {
        console.error("Erreur Database Cache (Recette):", dbError);
        // On continue quand même vers l'IA si c'est juste un souci de cache
    }

    // 2. Generate with AI if not found
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: SYSTEM_PROMPT_RECIPE },
                {
                    role: "user",
                    content: `Génère la recette de : ${mealName} (Phase: ${phase}).`
                }
            ],
            response_format: { type: "json_object" },
        });

        const content = completion.choices[0].message.content;
        if (!content) throw new Error("Erreur génération IA");

        const recipeData = JSON.parse(content);

        // 3. Save to Database
        const newRecipe = await prisma.recipe.create({
            data: {
                name: mealName,
                phase: phase,
                ingredients: recipeData.ingredients,
                instructions: recipeData.instructions,
                calories: recipeData.macros.calories,
                protein: recipeData.macros.protein,
                carbs: recipeData.macros.carbs,
                fat: recipeData.macros.fat,
                prepTime: recipeData.prepTime
            }
        });

        return newRecipe;

    } catch (error) {
        console.error(`Erreur Génération Recette (${mealName}):`, error);
        throw new Error("Impossible de générer la recette.");
    }
}
