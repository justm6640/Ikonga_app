"use server"

import { generateAndSaveRecipe } from "../ai/recipe-generator";

export async function getRecipeAction(mealName: string, phase: string) {
    try {
        const recipe = await generateAndSaveRecipe(mealName, phase);
        return { success: true, data: recipe };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
