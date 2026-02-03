import { PrismaClient, PhaseType, BeautyCategory, SkinType, WorkoutGender } from "@prisma/client"

const prisma = new PrismaClient()

export class BeautyEngine {
    /**
     * Recommande des contenus Beauté basés sur la phase, le sexe et le profil
     */
    static async getRecommendations(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                beautyProfile: true,
                phases: { where: { isActive: true }, take: 1 }
            }
        })

        if (!user) return []

        const currentPhase = user.phases[0]?.type || PhaseType.DETOX
        const gender = user.gender === "MALE" ? WorkoutGender.MALE : WorkoutGender.FEMALE

        // 1. Recherche de contenus adaptés à la phase et au sexe
        const contents = await prisma.beautyContent.findMany({
            where: {
                targetPhases: { has: currentPhase },
                OR: [
                    { targetGender: gender },
                    { targetGender: WorkoutGender.ALL }
                ]
            }
        })

        // 2. Filtrage intelligent basé sur le profil questionnaire
        // Ex: Si peau grasse (OILY), on privilégie les contenus de catégorie SKIN_CARE adaptés
        const skinType = user.beautyProfile?.skinType
        const concerns = user.beautyProfile?.concerns as string[] || []

        const scoredContents = contents.map(content => {
            let score = 0

            // Match catégorie vs Profil
            if (content.category === BeautyCategory.SKIN_CARE && skinType) {
                // Logic to match skinType with content (e.g. via title or description keywords for now)
                // In a more advanced version, we'd have explicit tags on BeautyContent
                score += 10
            }

            // Match préoccupations (concerns)
            concerns.forEach(concern => {
                if (content.title.toLowerCase().includes(concern.toLowerCase()) ||
                    content.description.toLowerCase().includes(concern.toLowerCase())) {
                    score += 20
                }
            })

            return { ...content, score }
        })

        // Tri par score décroissant
        return scoredContents.sort((a, b) => b.score - a.score)
    }

    /**
     * Détection automatique de moments pour déclencher des messages coach
     */
    static async detectMoments(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                weighIns: { orderBy: { date: 'desc' }, take: 3 },
                wellnessLogs: { orderBy: { date: 'desc' }, take: 7 }
            }
        })

        if (!user) return []

        const triggers: string[] = []

        // 1. Détection de stagnation (ex: pas de perte sur les 3 dernières pesées)
        if (user.weighIns.length >= 3) {
            const weights = user.weighIns.map(w => w.weight)
            if (weights[0] >= weights[1] && weights[1] >= weights[2]) {
                triggers.push("STAGNATION")
            }
        }

        // 2. Détection de stress élevé
        const avgStress = user.wellnessLogs.reduce((acc, log) => acc + (log.stressLevel || 0), 0) / user.wellnessLogs.length
        if (avgStress > 7) {
            triggers.push("HIGH_STRESS")
        }

        // 3. Détection de fatigue
        const avgEnergy = user.wellnessLogs.reduce((acc, log) => acc + (log.energyLevel || 0), 0) / user.wellnessLogs.length
        if (avgEnergy < 4) {
            triggers.push("LOW_ENERGY")
        }

        return triggers
    }
}
