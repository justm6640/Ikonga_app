import OpenAI from 'openai'
import { SYSTEM_PROMPT_API } from './prompts'
import { QuestionnaireData } from '@/lib/validators/questionnaire'

// Initialize OpenAI Client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export interface AnalysisResult {
    introduction: string;
    nutrition: { analysis: string; objectives: string[] };
    fitness: { analysis: string; objectives: string[] };
    wellness: { analysis: string; objectives: string[] };
    beauty: { analysis: string; objectives: string[] };
    conclusion: string;
}

const FALLBACK_ANALYSIS: AnalysisResult = {
    introduction: "Bienvenue chez IKONGA. Ton profil a bien été pris en compte et nous allons construire ensemble ton succès.",
    nutrition: { analysis: "Nous allons rééquilibrer ton assiette.", objectives: ["Manger régulierement", "Hydratation"] },
    fitness: { analysis: "Bouger est essentiel.", objectives: ["Marche quotidienne"] },
    wellness: { analysis: "Prenons soin de ton esprit.", objectives: ["Sommeil réparateur"] },
    beauty: { analysis: "Tu es unique.", objectives: ["Bienveillance"] },
    conclusion: "C'est parti pour la Detox !"
};

export async function generateUserAnalysis(userProfile: any, answers: QuestionnaireData): Promise<AnalysisResult> {
    if (!process.env.OPENAI_API_KEY) {
        console.warn("OPENAI_API_KEY Missing - Returning Fallback");
        return FALLBACK_ANALYSIS;
    }

    try {
        const userMessage = `
      PROFIL UTILISATRICE :
      - Prénom: ${answers.firstName}
      - Age: ${userProfile.age || 'N/A'}
      - Objectif: ${answers.targetWeight ? `Perdre du poids (Cible: ${answers.targetWeight}kg)` : 'Remise en forme'}
      - IMC: ${userProfile.imc || 'N/A'}
      
      REPONSES QUESTIONNAIRE :
      - Nutrition: ${answers.mealsPerDay} repas/jour, Allergies: ${answers.allergies.join(', ') || 'Aucune'}, Habitudes: ${answers.habits.join(', ')}
      - Fitness: Niveau ${answers.activityLevel}, Blessures: ${answers.injuries.join(', ') || 'Aucune'}
      - Wellness: Stress ${answers.stressLevel}/10, Sommeil ${answers.sleepQuality}/10
      - Confiance Corps: ${answers.bodyConfidence}
    `;

        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: SYSTEM_PROMPT_API },
                { role: "user", content: userMessage }
            ],
            model: "gpt-4o", // Or gpt-3.5-turbo if cost concern
            response_format: { type: "json_object" },
            temperature: 0.7,
        });

        const content = completion.choices[0].message.content;
        if (!content) throw new Error("Empty content from OpenAI");

        const analysis = JSON.parse(content) as AnalysisResult;
        return analysis;

    } catch (error) {
        console.error("AI Generation Error:", error);
        return FALLBACK_ANALYSIS;
    }
}
