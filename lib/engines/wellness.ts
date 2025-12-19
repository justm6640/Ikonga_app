import { DailyLog } from "@prisma/client"

export enum WellnessTrend {
    IMPROVING = "IMPROVING",
    STABLE = "STABLE",
    DECLINING = "DECLINING",
    CRITICAL = "CRITICAL",
}

export interface AnalysisResult {
    status: WellnessTrend
    message: string
    averageScore: number
}

/**
 * Formula: (Energy + (10 - Stress) + (Sleep / 8 * 10)) / 3
 * Normalizes to a score out of 10.
 */
export function calculateDailyScore(
    stress: number,
    energy: number,
    sleep: number
): number {
    // Edge cases normalization
    const normalizedStress = Math.min(10, Math.max(0, stress))
    const normalizedEnergy = Math.min(10, Math.max(0, energy))

    // Sleep target is 8h for a score of 10
    const sleepScore = (Math.min(12, Math.max(0, sleep)) / 8) * 10

    const score = (normalizedEnergy + (10 - normalizedStress) + sleepScore) / 3
    return Number(score.toFixed(1))
}

/**
 * Sliding Window Trend Analysis (Last 3 days)
 */
export function analyzeTrend(recentLogs: DailyLog[]): AnalysisResult {
    if (recentLogs.length === 0) {
        return { status: WellnessTrend.STABLE, message: "Commencez à remplir votre journal pour voir vos tendances.", averageScore: 0 }
    }

    // Ensure logs are sorted by date (descending: J-1, J-2, J-3)
    const sorted = [...recentLogs]
        .filter(l => l.wellnessScore !== null)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 3)

    const scores = sorted.map(l => l.wellnessScore as number)
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length

    // Rule 1: Average < 4/10 is Critical
    if (avg < 4) {
        return {
            status: WellnessTrend.CRITICAL,
            message: "⚠️ Alerte : Signes de fatigue intense. Pensez à lever le pied.",
            averageScore: Number(avg.toFixed(1))
        }
    }

    // Rule 2: Negative slope over 3 days (declining)
    // J-3 > J-2 > J-1 (but our array is [J-1, J-2, J-3])
    if (scores.length === 3 && scores[0] < scores[1] && scores[1] < scores[2]) {
        return {
            status: WellnessTrend.DECLINING,
            message: "📉 Attention : Votre énergie décline depuis 3 jours. Dormez un peu plus.",
            averageScore: Number(avg.toFixed(1))
        }
    }

    // Rule 3: Improvement
    if (scores.length >= 2 && scores[0] > scores[1]) {
        return {
            status: WellnessTrend.IMPROVING,
            message: "📈 Bravo : Votre bien-être est en hausse ! Continuez ainsi.",
            averageScore: Number(avg.toFixed(1))
        }
    }

    return {
        status: WellnessTrend.STABLE,
        message: "✨ Stable : Vous maintenez un bon équilibre.",
        averageScore: Number(avg.toFixed(1))
    }
}
