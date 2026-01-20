import OpenAI from 'openai';
import prisma from '@/lib/prisma';
import { SYSTEM_PROMPT_RECIPE } from './prompts';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generates an AI recipe for a specific dish and phase if it doesn't exist.
 * Saves it to the database.
 */
export async function generateAndSaveRecipe(name: string, phase: string) {
    if (!name || name === "Repas Libre") return null;

    try {
        // 1. Check if already exists
        const existing = await prisma.recipe.findUnique({
            where: {
                name_phase: { name, phase }
            }
        });

        if (existing) return existing;

        console.log(`[AI Recipe] Generating: ${name} (${phase})`);

        // 2. IA Call
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: SYSTEM_PROMPT_RECIPE },
                {
                    role: "user",
                    content: `Plat: ${name}\nPhase: ${phase}\nObjectif: Santé et Perte de poids.`
                }
            ],
            response_format: { type: "json_object" },
        });

        const content = completion.choices[0].message.content;
        if (!content) throw new Error("Réponse IA vide");

        const recipeJson = JSON.parse(content);

        // 3. Save to DB
        const newRecipe = await prisma.recipe.create({
            data: {
                name: name,
                phase: phase,
                ingredients: recipeJson.ingredients || [],
                instructions: recipeJson.instructions || [],
                calories: recipeJson.macros?.calories || 0,
                protein: recipeJson.macros?.protein || 0,
                carbs: recipeJson.macros?.carbs || 0,
                fat: recipeJson.macros?.fat || 0,
                prepTime: recipeJson.prepTime || 20,
                isPremium: false
            }
        });

        return newRecipe;

    } catch (error) {
        console.error(`[AI Recipe Error] ${name}:`, error);
        return null;
    }
}

/**
 * Batch generate recipes for a list of names.
 */
export async function batchGenerateRecipes(names: string[], phase: string) {
    const uniqueNames = Array.from(new Set(names)).filter(n => n && n !== "Repas Libre");
    const results = [];

    for (const name of uniqueNames) {
        const recipe = await generateAndSaveRecipe(name, phase);
        results.push(recipe);
    }

    return results;
}
