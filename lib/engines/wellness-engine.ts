import { WellnessStatus, CyclePhase } from "@prisma/client"

export class WellnessEngine {

    /**
     * Calcule le score global Bien-Être (0-100)
     */
    static calculateScore(data: {
        sleepHours?: number | null,
        sleepQuality?: string | null, // "BAD", "AVERAGE", "GOOD", "EXCELLENT"
        stressLevel?: number | null, // 1-10
        energyLevel?: number | null, // 1-10
        waterIntake?: number | null, // verres
        waterGoal?: number | null // verres
    }): number {
        let score = 50 // Base score

        // 1. Sommeil (Max +25)
        if (data.sleepQuality === "EXCELLENT") score += 25
        else if (data.sleepQuality === "GOOD") score += 15
        else if (data.sleepQuality === "AVERAGE") score += 5
        else if (data.sleepQuality === "BAD") score -= 10

        if (data.sleepHours) {
            if (data.sleepHours >= 7 && data.sleepHours <= 9) score += 5
            else if (data.sleepHours < 6) score -= 5
        }

        // 2. Stress (Max +20 / Min -20)
        // Stress 1 = Top (+10), Stress 10 = Bad (-20)
        if (data.stressLevel !== null && data.stressLevel !== undefined) {
            if (data.stressLevel <= 3) score += 15
            else if (data.stressLevel <= 6) score += 5
            else if (data.stressLevel >= 8) score -= 15
            else score -= 5 // 7
        }

        // 3. Énergie (Max +20)
        if (data.energyLevel !== null && data.energyLevel !== undefined) {
            if (data.energyLevel >= 8) score += 15
            else if (data.energyLevel >= 5) score += 5
            else if (data.energyLevel <= 3) score -= 10
        }

        // 4. Hydratation (Max +15)
        if (data.waterIntake && data.waterGoal) {
            const ratio = data.waterIntake / data.waterGoal
            if (ratio >= 1) score += 15
            else if (ratio >= 0.75) score += 10
            else if (ratio >= 0.5) score += 5
            else if (ratio < 0.3) score -= 5
        }

        // Clamp 0-100
        return Math.max(0, Math.min(100, Math.round(score)))
    }

    /**
     * Détermine le statut du jour (FRAGILE, STABLE, POWERFUL)
     */
    static determineStatus(data: {
        stressLevel?: number | null,
        sleepQuality?: string | null,
        energyLevel?: number | null,
        score: number
    }): WellnessStatus {
        const { stressLevel, sleepQuality, energyLevel, score } = data

        // Règle 1: FRAGILE si signaux d'alerte forts
        if (
            (stressLevel && stressLevel >= 8) ||
            (sleepQuality === "BAD") ||
            (energyLevel && energyLevel <= 3) ||
            score < 40
        ) {
            return "FRAGILE"
        }

        // Règle 2: POWERFUL si tout est au vert
        if (
            (stressLevel && stressLevel <= 4) &&
            (energyLevel && energyLevel >= 7) &&
            score > 75
        ) {
            return "POWERFUL"
        }

        // Sinon STABLE
        return "STABLE"
    }

    /**
     * Génère un message coach personnalisé
     */
    static generateCoachMessage(status: WellnessStatus, gender: string = 'FEMALE', data: any): string {
        const isMale = gender === 'MALE'

        if (status === "FRAGILE") {
            if (isMale) return "Ton niveau de tension est élevé. On allège la séance aujourd'hui pour mieux repartir demain."
            return "Ton corps a besoin de douceur aujourd'hui. On ralentit sans culpabiliser, c'est aussi ça avancer."
        }

        if (status === "POWERFUL") {
            if (isMale) return "Excellente énergie ! C'est le moment de pousser tes limites sur la séance du jour."
            return "Tu rayonnes aujourd'hui ! Profite de cette belle énergie pour te dépasser."
        }

        // STABLE
        if (isMale) return "Régularité maintenue. Reste focus sur tes objectifs, ça paie."
        return "Tu trouves ton équilibre. Continue ces petites actions qui te font du bien."
    }

    /**
     * Calcule l'objectif hydrique (ml)
     * Règle de base: 30-35ml par kg
     */
    static calculateWaterGoal(weight: number): number {
        if (!weight) return 2000 // Default 2L
        return Math.round(weight * 35)
    }
}
