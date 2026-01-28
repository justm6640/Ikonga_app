'use server'

import { z } from "zod"
import { getOrCreateUser } from "@/lib/actions/user"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { AnalysisFormData, analysisFormSchema } from "@/lib/validators/analysis"
import OpenAI from "openai"
import { SYSTEM_PROMPT_API } from "@/lib/ai/prompts"
import { AnalysisResult } from "@/lib/validators/analysis"

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

export async function generateAndSaveAnalysis(data: AnalysisFormData) {
    try {
        const user = await getOrCreateUser()
        if (!user) throw new Error("Unauthorized")

        // Validate Input
        const validatedData = analysisFormSchema.parse(data)

        // Prepare Prompt User Context
        const userContext = `
        DONNÉES UTILISATRICE :
        - Prénom: ${user.firstName}
        - Âge: ${user.birthDate ? new Date().getFullYear() - user.birthDate.getFullYear() : 'N/A'} ans
        - Taille: ${user.heightCm} cm
        - Poids Départ: ${user.startWeight} kg
        - Poids Cible: ${user.targetWeight} kg
        
        RÉPONSES QUESTIONNAIRE :
        - Allergies: ${validatedData.allergies.join(", ") || "Aucune"}
        - Intolérances: ${validatedData.intolerances.join(", ") || "Aucune"}
        - Aliments Refusés: ${validatedData.aliments_refuses.join(", ") || "Aucun"}
        - Repas/jour: ${validatedData.nb_repas_jour}
        - Grignotage: ${validatedData.grignotage}
        - Stress: ${validatedData.stress}/10
        - Sommeil: ${validatedData.sommeil}/10
        - Activité Physique: ${validatedData.activite_physique}
        - Douleurs: ${validatedData.douleurs || "Aucune"}
        - Disponibilité: ${validatedData.disponibilite_jours}
        - Motivation: ${validatedData.motivation}
        - Temps pour soi: ${validatedData.temps_pour_soi}
        - Routine Beauté: ${validatedData.routine_beaute}
        - Relation au corps: ${validatedData.relation_au_corps}
        - Objectif Principal: ${validatedData.objectif}
        - Commentaire Libre: ${validatedData.commentaire_libre || "Aucun"}
        `

        // Call OpenAI
        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: SYSTEM_PROMPT_API },
                { role: "user", content: userContext }
            ],
            model: "gpt-4o",
            response_format: { type: "json_object" },
            temperature: 0.7,
        })

        const content = completion.choices[0].message.content
        if (!content) throw new Error("IA n'a pas répondu.")

        const analysisResult = JSON.parse(content) as AnalysisResult

        // Save to DB
        await prisma.userAnalysis.upsert({
            where: { userId: user.id },
            update: {
                content: analysisResult as any, // Cast because Prisma types might be strict on Json
                inputData: validatedData as any,
                createdAt: new Date() // Force update timestamp
            },
            create: {
                userId: user.id,
                content: analysisResult as any,
                inputData: validatedData as any
            }
        })

        revalidatePath("/mon-analyse")
        return { success: true }

    } catch (error) {
        console.error("Analysis Generation Error:", error)
        return { success: false, error: "Une erreur est survenue lors de l'analyse." }
    }
}
