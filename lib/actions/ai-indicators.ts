"use server";

import OpenAI from 'openai';
import { AnalysisResult } from '@/lib/validators/analysis';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

interface MetricContext {
    firstName: string;
    weight: number;
    heightCm: number;
    age: number;
    gender: string;
    bmi: number;
    pisi: number;
    targetWeight: number;
    bodyFat?: number;
    bmr?: number;
    metabolicAge?: number;
}

export type IndicatorType = "imc" | "masse-grasse" | "bmr" | "age-metabolique";

export async function generateMetricAnalysis(metrics: MetricContext, type: IndicatorType) {
    if (!process.env.OPENAI_API_KEY) {
        return {
            explanation: "L'analyse IA n'est pas disponible pour le moment.",
            health_impact: "Indisponible",
            ikonga_strategy: "Indisponible",
            encouragement: "Continuez vos efforts !"
        };
    }

    const indicatorLabels: Record<IndicatorType, string> = {
        "imc": "Indice de Masse Corporelle (IMC)",
        "masse-grasse": "Taux de Masse Grasse",
        "bmr": "Métabolisme de Base (BMR)",
        "age-metabolique": "Âge Métabolique"
    };

    const specificValues: Record<IndicatorType, string> = {
        "imc": `**${metrics.bmi.toFixed(1)}**`,
        "masse-grasse": `**${metrics.bodyFat?.toFixed(1)}%**`,
        "bmr": `**${Math.round(metrics.bmr || 0)} kcal/jour**`,
        "age-metabolique": `**${metrics.metabolicAge} ans** (contre un âge réel de ${metrics.age} ans)`
    };

    const prompt = `
    Tu es Rosy, la coach experte et bienveillante du programme IKONGA.
    
    Ton objectif est d'expliquer à ${metrics.firstName} son indicateur : **${indicatorLabels[type]}** actuel qui est de ${specificValues[type]}.
    
    Contexte Utilisateur :
    - Poids actuel : ${metrics.weight}kg
    - Taille : ${metrics.heightCm}cm
    - Age réel : ${metrics.age} ans
    - Genre : ${metrics.gender === 'FEMALE' ? 'Femme' : 'Homme'}
    - Poids Idéal Santé IKONGA (PISI) : ${metrics.pisi}kg
    - Objectif personnel : ${metrics.targetWeight}kg
    - Autres métriques : IMC: ${metrics.bmi.toFixed(1)}, Masse Grasse: ${metrics.bodyFat?.toFixed(1)}%, BMR: ${Math.round(metrics.bmr || 0)}, Âge Métabolique: ${metrics.metabolicAge}
    
    Instructions spécifiques pour le type "${type}" :
    ${type === 'imc' ? "Analyse le rapport poids/taille et la distance par rapport au PISI." : ""}
    ${type === 'masse-grasse' ? "Explique la différence entre poids et composition corporelle. Parle de l'inflammation si le taux est élevé." : ""}
    ${type === 'bmr' ? "Explique que c'est la chaudière interne. Ne pas descendre en dessous pour éviter le mode survie." : ""}
    ${type === 'age-metabolique' ? "C'est l'indicateur de vitalité. S'il est plus vieux que l'âge réel, motive à rajeunir les cellules via le sport et la Détox." : ""}

    Ta réponse doit être structurée en JSON strict :
    {
      "explanation": "Une explication claire et déculpabilisante de ce chiffre. Explique ce que cela signifie concrètement pour son corps (énergie, articulations, métabolisme).",
      "health_impact": "Les impacts positifs ou risques potentiels liés à ce chiffre spécifique, sans être alarmiste.",
      "ikonga_strategy": "Comment la méthode IKONGA (phases métaboliques, nutrition, sport) va l'aider concrètement à optimiser ce chiffre. Donne 2-3 actions clés immédiates.",
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
        console.error(`Error generating ${type} analysis:`, error);
        return {
            explanation: "Une erreur est survenue lors de l'analyse.",
            health_impact: "Consultez votre programme pour plus de détails.",
            ikonga_strategy: "Suivez votre programme normalement.",
            encouragement: "Courage !"
        };
    }
}
