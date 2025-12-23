import { z } from "zod";

// Enum Definitions
const GenderEnum = z.enum(["FEMALE", "MALE", "OTHER"]);
const ActivityLevelEnum = z.enum(["SEDENTARY", "MODERATE", "ACTIVE", "VERY_ACTIVE"]);
const BodyConfidenceEnum = z.enum(["LOW", "MEDIUM", "HIGH"]);
const DayStatusEnum = z.enum(["FRAGILE", "STABLE", "STRONG"]);

// --- SCHEMA COMPLET DU QUESTIONNAIRE ---
export const questionnaireSchema = z.object({
    // 1. GENERAL
    firstName: z.string().min(2, "Ton prénom doit contenir au moins 2 caractères."),
    lastName: z.string().min(2, "Ton nom doit contenir au moins 2 caractères."),
    birthDate: z.date({
        required_error: "Ta date de naissance est requise pour adapter le programme.",
        invalid_type_error: "Format de date invalide.",
    }).max(new Date(), "Tu ne peux pas être né(e) dans le futur !"),
    gender: GenderEnum,
    heightCm: z.number({ invalid_type_error: "Indique ta taille en cm." })
        .min(100, "La taille doit être supérieure à 100 cm.")
        .max(250, "La taille doit être inférieure à 250 cm."),
    startWeight: z.number({ invalid_type_error: "Indique ton poids actuel." })
        .min(30, "Le poids doit être supérieur à 30 kg."),
    targetWeight: z.number().optional(),
    programStartDate: z.date({
        required_error: "Choisis ta date de début de cure.",
        invalid_type_error: "Format de date invalide.",
    }).min(new Date(new Date().setHours(0, 0, 0, 0)), "La date ne peut pas être dans le passé."),

    // 2. NUTRITION
    allergies: z.array(z.string()).default([]),
    mealsPerDay: z.number().min(1).max(8).default(3),
    habits: z.array(z.string()).default([]), // ex: "SNACKING", "LATE_DINNER"

    // 3. FITNESS
    activityLevel: ActivityLevelEnum.default("MODERATE"),
    injuries: z.array(z.string()).default([]),

    // 4. WELLNESS
    stressLevel: z.number().min(1).max(10),
    sleepQuality: z.number().min(1).max(10),

    // 5. BEAUTY (Body Confidence)
    bodyConfidence: BodyConfidenceEnum.default("MEDIUM"),
});

// Type inféré pour TypeScript
export type QuestionnaireData = z.infer<typeof questionnaireSchema>;

// Partial schema for Step 1 (General)
export const stepGeneralSchema = questionnaireSchema.pick({
    firstName: true,
    lastName: true,
    birthDate: true,
    gender: true,
    heightCm: true,
    startWeight: true,
    targetWeight: true,
    programStartDate: true,
});

// Partial schema for Step 2 (Nutrition)
export const stepNutritionSchema = questionnaireSchema.pick({
    allergies: true,
    mealsPerDay: true,
    habits: true,
});

// Partial schema for Step 3 (Fitness)
export const stepFitnessSchema = questionnaireSchema.pick({
    activityLevel: true,
    injuries: true,
});

// Partial schema for Step 4 (Wellness)
export const stepWellnessSchema = questionnaireSchema.pick({
    stressLevel: true,
    sleepQuality: true,
});

// Partial schema for Step 5 (Beauty)
export const stepBeautySchema = questionnaireSchema.pick({
    bodyConfidence: true,
});
