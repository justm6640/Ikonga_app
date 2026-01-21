import { z } from "zod";

// Enum Definitions
const GenderEnum = z.enum(["FEMALE", "MALE", "OTHER"]);
const ActivityLevelEnum = z.enum(["SEDENTARY", "MODERATE", "ACTIVE", "VERY_ACTIVE"]);
const BodyConfidenceEnum = z.enum(["LOW", "MEDIUM", "HIGH"]);
const DayStatusEnum = z.enum(["FRAGILE", "STABLE", "STRONG"]);

// --- SCHEMA COMPLET DU QUESTIONNAIRE ---
export const questionnaireSchema = z.object({
    // 1. GENERAL
    firstName: z.string().min(2, "Prénom requis."),
    lastName: z.string().min(2, "Nom requis."),
    email: z.string().email("Email invalide."),
    birthDate: z.date({ message: "Date requise." }),
    gender: z.string().min(1, "Sexe requis."),
    countryOrigin: z.string().min(1, "Pays d'origine requis."),
    countryResidence: z.string().min(1, "Pays de résidence requis."),
    city: z.string().min(1, "Ville requise."),
    whatsapp: z.string().min(1, "WhatsApp requis."),
    heightCm: z.number().min(100).max(250),
    startWeight: z.number().min(30).max(300),
    targetWeight: z.number().optional(),
    referralSource: z.string().min(1, "Source requise."),

    // 2. NUTRITION
    allergies: z.array(z.string()).min(1, "Sélectionne au moins une option."),
    refusedFoods: z.array(z.string()).min(1, "Sélectionne au moins une option."),
    eatingHabits: z.array(z.string()).min(1, "Sélectionne au moins une option."),
    mealsPerDay: z.string().min(1, "Requis."),
    kitchenEquipment: z.array(z.string()).min(1, "Sélectionne au moins une option."),
    nutritionGoals: z.array(z.string()).min(1, "Sélectionne au moins une option."),
    favoriteFoods: z.string().optional(),

    // 3. FITNESS
    fitnessLevel: z.string().min(1, "Requis."),
    currentActivity: z.array(z.string()).min(1, "Sélectionne au moins une option."),
    availableWorkoutDays: z.array(z.string()).min(1, "Sélectionne au moins une option."),
    availableTimePerDay: z.string().min(1, "Requis."),
    preferredExercises: z.array(z.string()).min(1, "Sélectionne au moins une option."),
    physicalLimitations: z.array(z.string()).min(1, "Sélectionne au moins une option."),

    // 4. WELLNESS
    stressLevel: z.number().min(1).max(10),
    sleepQuality: z.number().min(1).max(10),
    energyLevel: z.number().min(1).max(10),
    morningPosture: z.string().min(1, "Requis."),
    dominantEmotions: z.array(z.string()).min(1, "Sélectionne au moins une option."),
    preferredRelaxation: z.array(z.string()).min(1, "Sélectionne au moins une option."),

    // 5. NUTRITION+ (Santé)
    supplements: z.array(z.string()).min(1, "Sélectionne au moins une option."),
    recentBloodTest: z.string().min(1, "Requis."),
    healthIssues: z.array(z.string()).min(1, "Sélectionne au moins une option."),

    // 6. LIFESTYLE
    timeForSelf: z.string().min(1, "Requis."),
    familyOrganization: z.string().min(1, "Requis."),
    mainChallenges: z.array(z.string()).min(1, "Sélectionne au moins une option."),

    // 7. BEAUTY
    bodyRelation: z.string().min(1, "Requis."),
    aestheticConcerns: z.array(z.string()).min(1, "Sélectionne au moins une option."),
    currentBeautyRoutine: z.string().min(1, "Requis."),

    // 8. MOTIVATION
    whyJoin: z.array(z.string()).min(1, "Sélectionne au moins une option."),
    engagementLevel: z.string().min(1, "Requis."),
    additionalNotes: z.string().optional(),
    programStartDate: z.date().optional(),
});

export type QuestionnaireData = z.infer<typeof questionnaireSchema>;

// Step-specific schemas
export const step1GeneralSchema = questionnaireSchema.pick({
    firstName: true, lastName: true, email: true, birthDate: true, gender: true,
    countryOrigin: true, countryResidence: true, city: true, whatsapp: true,
    heightCm: true, startWeight: true, targetWeight: true, referralSource: true
});

export const step2NutritionSchema = questionnaireSchema.pick({
    allergies: true, refusedFoods: true, eatingHabits: true,
    mealsPerDay: true, kitchenEquipment: true, nutritionGoals: true, favoriteFoods: true
});

export const step3FitnessSchema = questionnaireSchema.pick({
    fitnessLevel: true, currentActivity: true, availableWorkoutDays: true,
    availableTimePerDay: true, preferredExercises: true, physicalLimitations: true
});

export const step4WellnessSchema = questionnaireSchema.pick({
    stressLevel: true, sleepQuality: true, energyLevel: true,
    morningPosture: true, dominantEmotions: true, preferredRelaxation: true
});

export const step5HealthSchema = questionnaireSchema.pick({
    supplements: true, recentBloodTest: true, healthIssues: true
});

export const step6LifestyleSchema = questionnaireSchema.pick({
    timeForSelf: true, familyOrganization: true, mainChallenges: true
});

export const step7BeautySchema = questionnaireSchema.pick({
    bodyRelation: true, aestheticConcerns: true, currentBeautyRoutine: true
});

export const step8MotivationSchema = questionnaireSchema.pick({
    whyJoin: true, engagementLevel: true, additionalNotes: true
});
