"use server"

import { getOrGenerateRecipe } from "../ai/recipe-generator";

export async function getRecipeAction(mealName: string, phase: string) {
    try {
        const recipe = await getOrGenerateRecipe(mealName, phase);
        return { success: true, data: recipe };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
