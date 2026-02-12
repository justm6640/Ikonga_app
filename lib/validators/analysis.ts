import { z } from "zod"

export const analysisFormSchema = z.object({
    // Nutrition
    allergies: z.array(z.string()).default([]),
    intolerances: z.array(z.string()).default([]),
    aliments_refuses: z.array(z.string()).default([]),
    nb_repas_jour: z.string().min(1, "Requis"), // "1", "2", "3", "3+grignotage"
    grignotage: z.string().min(1, "Requis"), // "Jamais", "Parfois (stress)", "Souvent", "Tout le temps"

    // Wellness
    stress: z.number().min(0).max(10),
    sommeil: z.number().min(0).max(10), // Qualité 0-10

    // Fitness
    activite_physique: z.string().min(1, "Requis"), // "Sédentaire", "Léger", "Modéré", "Intense"
    douleurs: z.string().optional(), // Champs libre ou tags

    // Lifestyle
    disponibilite_jours: z.string().min(1, "Requis"), // "15min", "30min", "1h", "Illimité"
    motivation: z.string().min(1, "Requis"), // "Faible", "Moyenne", "Élevée", "Maximale"
    temps_pour_soi: z.string().min(1, "Requis"), // "Jamais", "Rarement", "Parfois", "Régulièrement"

    // Beauty
    routine_beaute: z.string().min(1, "Requis"), // "Inexistante", "Basique", "Complète"
    relation_au_corps: z.string().min(1, "Requis"), // "Mauvaise", "Difficile", "Neutre", "Bonne", "Excellente"

    // General
    objectif: z.string().min(1, "Requis"), // "Perte de poids", "Santé", "Énergie", "Confiance"
    commentaire_libre: z.string().optional(),
    autres_infos: z.string().optional(),

    // Profile updates (optional but collected in form)
    startWeight: z.coerce.number().min(30).optional(),
    targetWeight: z.coerce.number().min(30).optional(),
    heightCm: z.coerce.number().min(100).optional(),
    countryOrigin: z.string().optional(),
})

export type AnalysisFormData = z.infer<typeof analysisFormSchema>

export interface AnalysisResult {
    introduction: string;
    nutrition: string;
    fitness: string;
    wellness: string;
    nutrition_plus: string;
    lifestyle: string;
    beauty: string;
    summary: string;
    next_steps: string;
}

