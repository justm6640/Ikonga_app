"use server"

import prisma from "@/lib/prisma";
import { getOrCreateUser } from "./user";
import { revalidatePath } from "next/cache";

/**
 * Security helper to verify admin role
 */
async function ensureAdmin() {
    const user = await getOrCreateUser();
    if (!user || user.role !== 'ADMIN') {
        throw new Error("Accès non autorisé : Droits administrateur requis.");
    }
    return user;
}

/**
 * Weekly Plans Actions
 */
export async function getAllWeeklyPlans(weekStart: Date) {
    await ensureAdmin();

    return await prisma.weeklyPlan.findMany({
        where: {
            weekStart: weekStart
        },
        include: {
            user: {
                select: {
                    id: true,
                    firstName: true,
                    email: true,
                    subscriptionTier: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
}

export async function updateUserMeal(
    planId: string,
    day: string,
    mealType: string,
    newValue: string
) {
    await ensureAdmin();

    const plan = await prisma.weeklyPlan.findUnique({
        where: { id: planId }
    });

    if (!plan) throw new Error("Plan introuvable");

    const content = (plan.content as any) || {};
    if (!content[day]) content[day] = {};
    content[day][mealType] = newValue;

    const updatedPlan = await prisma.weeklyPlan.update({
        where: { id: planId },
        data: { content }
    });

    revalidatePath("/dashboard");
    revalidatePath("/shopping-list");
    revalidatePath("/admin/menus");

    return { success: true, data: updatedPlan };
}

export async function regenerateWeeklyPlanAction(userId: string) {
    await ensureAdmin();

    const { generateUserWeeklyPlan } = await import("../ai/menu-generator");
    const result = await generateUserWeeklyPlan(userId);

    revalidatePath("/admin/menus");
    return result;
}

/**
 * Recipes Actions
 */
export async function getAllRecipes(search?: string) {
    await ensureAdmin();

    return await prisma.recipe.findMany({
        where: search ? {
            OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { phase: { contains: search, mode: 'insensitive' } }
            ]
        } : {},
        orderBy: { name: 'asc' }
    });
}

export async function updateRecipe(id: string, data: any) {
    await ensureAdmin();

    const updated = await prisma.recipe.update({
        where: { id },
        data: {
            name: data.name,
            phase: data.phase,
            ingredients: data.ingredients,
            instructions: data.instructions,
            calories: parseInt(data.calories) || 0,
            protein: parseInt(data.protein) || 0,
            carbs: parseInt(data.carbs) || 0,
            fat: parseInt(data.fat) || 0,
            prepTime: parseInt(data.prepTime) || 0,
        }
    });

    revalidatePath("/admin/recipes");

    return { success: true, data: updated };
}
