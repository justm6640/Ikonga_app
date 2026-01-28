import OpenAI from 'openai'
import { SYSTEM_PROMPT_API } from './prompts'
import { QuestionnaireData } from '@/lib/validators/questionnaire'
import { AnalysisResult } from '@/lib/validators/analysis'

// Initialize OpenAI Client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const FALLBACK_ANALYSIS: AnalysisResult = {
    introduction: "Hello [Prénom], ravie de t'accompagner ! Ton profil est prometteur.",
    nutrition: "Analyse nutritionnelle en cours...",
    fitness: "Analyse fitness en cours...",
    wellness: "Analyse bien-être en cours...",
    nutrition_plus: "Analyse interne en cours...",
    lifestyle: "Analyse lifestyle en cours...",
    beauty: "Analyse beauté en cours...",
    summary: "Tu as un potentiel immense. Ensemble, nous allons transformer ta vie.",
    next_steps: "Je prépare ton programme personnalisé. Signature : Rosy – IKONGA Lifestyle"
};

export async function generateUserAnalysis(userProfile: any, answers: any): Promise<AnalysisResult> {
    if (!process.env.OPENAI_API_KEY) {
        console.warn("OPENAI_API_KEY Missing - Returning Fallback");
        return FALLBACK_ANALYSIS;
    }

    try {
        const userMessage = `
      DONNÉES UTILISATRICE :
      - Nom: ${answers.lastName}
      - Prénom: ${answers.firstName}
      - Age: ${userProfile.age || 'N/A'}
      - Poids départ: ${answers.startWeight}kg
      - Poids cible: ${answers.targetWeight || 'N/A'}kg
      - Taille: ${answers.heightCm}cm
      - Sexe: ${answers.gender}
      - Allergies: ${answers.allergies.join(', ') || 'Aucune'}
      - Aliments refusés: ${answers.refusedFoods.join(', ') || 'Aucun'}
      - Repas/jour: ${answers.mealsPerDay}
      - Stress: ${answers.stressLevel}/10
      - Sommeil: ${answers.sleepQuality}/10
      - Activité physique: ${answers.fitnessLevel}
      - Douleurs: ${answers.physicalLimitations.join(', ') || 'Aucune'}
      - Engagement: ${answers.engagementLevel}
      - Pourquoi IKONGA: ${answers.whyJoin.join(', ')}
      - Commentaire: ${answers.additionalNotes || 'N/A'}
    `;

        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: SYSTEM_PROMPT_API },
                { role: "user", content: userMessage }
            ],
            model: "gpt-4o",
            response_format: { type: "json_object" },
            temperature: 0.7,
        });

        const content = completion.choices[0].message.content;
        if (!content) throw new Error("Empty content from OpenAI");

        const analysis = JSON.parse(content) as AnalysisResult;

        // Basic validation to ensure keys exist (fallback if partial)
        if (!analysis.nutrition || !analysis.fitness) return { ...FALLBACK_ANALYSIS, ...analysis };

        return analysis;

    } catch (error) {
        console.error("AI Generation Error:", error);
        return FALLBACK_ANALYSIS;
    }
}
