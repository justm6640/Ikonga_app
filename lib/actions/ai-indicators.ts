"use server";

import OpenAI from 'openai';
import { AnalysisResult } from '@/lib/validators/analysis';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

interface BMIMetrics {
    firstName: string;
    weight: number;
    heightCm: number;
    age: number;
    gender: string;
    bmi: number;
    pisi: number;
    targetWeight: number;
}

export async function generateBMIAnalysis(metrics: BMIMetrics) {
    if (!process.env.OPENAI_API_KEY) {
        return {
            explanation: "L'analyse IA n'est pas disponible pour le moment.",
            advice: "Continuez vos efforts !",
            riskLevel: "Inconnu"
        };
    }

    const prompt = `
    Tu es Rosy, la coach experte et bienveillante du programme IKONGA.
    
    Ton objectif est d'expliquer à ${metrics.firstName} son Indice de Masse Corporelle (IMC) actuel de **${metrics.bmi.toFixed(1)}**.
    
    Contexte Utilisateur :
    - Poids actuel : ${metrics.weight}kg
    - Taille : ${metrics.heightCm}cm
    - Age : ${metrics.age} ans
    - Genre : ${metrics.gender === 'FEMALE' ? 'Femme' : 'Homme'}
    - Poids Idéal Santé IKONGA (PISI) : ${metrics.pisi}kg
    - Objectif personnel : ${metrics.targetWeight}kg
    
    Ta réponse doit être structurée en JSON strict :
    {
      "explanation": "Une explication claire et déculpabilisante de ce chiffre. Compare-le à la moyenne santé mais surtout à son objectif PISI. Explique ce que cela signifie concrètement pour son corps (énergie, articulations, métabolisme).",
      "health_impact": "Les impacts positifs ou risques potentiels liés à cet IMC spécifique, sans être alarmiste.",
      "ikonga_strategy": "Comment la méthode IKONGA (phases métaboliques) va l'aider concrètement à optimiser ce chiffre vers son PISI. Donne 2-3 actions clés immédiates.",
      "encouragement": "Une phrase finale courte et très motivante."
    }
    
    Ton : Empathique, professionnel, motivant, jamais jugeant. Utilise des emojis avec parcimonie.
    `;

    try {
        const completion = await openai.chat.completions.create({
            messages: [{ role: "system", content: prompt }],
            model: "gpt-4o",
            response_format: { type: "json_object" },
            temperature: 0.7,
        });

        const content = completion.choices[0].message.content;
        if (!content) throw new Error("Empty content");

        return JSON.parse(content);
    } catch (error) {
        console.error("Error generating BMI analysis:", error);
        return {
            explanation: "Une erreur est survenue lors de l'analyse.",
            health_impact: "Consultez votre médecin pour plus de détails.",
            ikonga_strategy: "Suivez votre programme normalement.",
            encouragement: "Courage !"
        };
    }
}
