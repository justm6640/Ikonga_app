import OpenAI from 'openai'
import { SYSTEM_PROMPT_API } from './prompts'
import { QuestionnaireData } from '@/lib/validators/questionnaire'

// Initialize OpenAI Client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export interface AnalysisResult {
    introduction: string;
    nutrition: { analysis: string; tips: string[] };
    fitness: { analysis: string; tips: string[] };
    wellness: { analysis: string; tips: string[] };
    // beauty: { analysis: string; tips: string[] }; // Optional if user strictly wanted 3 pillars, but let's keep it if possible or remove if strict.
    // User request example didn't have it. I'll omit it to be safe and strictly follow the USER prompt structure request.
    conclusion: string;
}

const FALLBACK_ANALYSIS: AnalysisResult = {
    introduction: "Coucou ! C'est Rosy. Ravie de te compter parmi nous ! Ton profil est très intéressant et j'ai hâte de t'aider.",
    nutrition: {
        analysis: "Je vois que tu as de bonnes bases, mais quelques ajustements feront la différence.",
        tips: ["Mise sur l'hydratation", "Structure tes repas"]
    },
    fitness: {
        analysis: "L'important est de bouger avec plaisir, sans te faire mal.",
        tips: ["Marche 30min par jour", "Écoute ton corps"]
    },
    wellness: {
        analysis: "Le stress peut bloquer la perte de poids, on va travailler là-dessus.",
        tips: ["Respiration consciente le soir"]
    },
    conclusion: "Fais-moi confiance, on commence la DÉTOX ensemble dès maintenant ! 💪✨"
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

        // Basic validation to ensure keys exist (fallback if partial)
        if (!analysis.nutrition || !analysis.fitness) return { ...FALLBACK_ANALYSIS, ...analysis };

        return analysis;

    } catch (error) {
        console.error("AI Generation Error:", error);
        return FALLBACK_ANALYSIS;
    }
}
