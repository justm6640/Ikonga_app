/**
 * IKONGA Engine (Partie 6)
 * Mathematical logic for session generation, weight projection, and calendar management.
 */

export interface IkongaSessionPlan {
    sessionNumber: number;
    startDate: Date;
    endDate: Date;
    targetLoss: number;
    projectedWeightEnd: number;
    type: "LOSS" | "CONSOLIDATION" | "ENTRETIEN";
}

export interface IkongaEngineInput {
    startWeight: number;
    heightCm: number;
    pisi: number;
    startDate: Date;
    subscriptionTier?: string;
}

export function calculateIkongaSessions(input: IkongaEngineInput): IkongaSessionPlan[] {
    const { startWeight, heightCm, pisi, startDate } = input;

    // 1. PTP (Poids Total à Perdre)
    const ptp = startWeight - pisi;

    if (ptp <= 0) {
        // Direct to Consolidation/Entretien
        return [
            {
                sessionNumber: 1,
                startDate: new Date(startDate),
                endDate: addDays(new Date(startDate), 41),
                targetLoss: 0,
                projectedWeightEnd: startWeight,
                type: "CONSOLIDATION"
            }
        ];
    }

    // 2. Number of sessions needed (N)
    // 5kg/month rate, session = 1.5 months
    const totalMonths = ptp / 5;
    const n = Math.max(1, Math.ceil(totalMonths / 1.5));

    // 3. Average loss per session
    const averageLoss = ptp / n;

    // 4. S1 Coefficient (Intensité première session)
    let coeffS1 = 1.10;
    if (ptp > 50) coeffS1 = 1.45;
    else if (ptp > 30) coeffS1 = 1.35;
    else if (ptp > 15) coeffS1 = 1.25;

    const s1 = averageLoss * coeffS1;

    // 5. Suite Arithmétique Décroissante (L_i)
    // d = (2*S1 - 2*moy) / (N - 1)
    let d = 0;
    if (n > 1) {
        d = (2 * s1 - 2 * averageLoss) / (n - 1);
    }

    const sessions: IkongaSessionPlan[] = [];
    let currentWeight = startWeight;
    let currentDate = new Date(startDate);
    let totalAssignedLoss = 0;

    for (let i = 1; i <= n; i++) {
        let sessionLoss = s1 - (i - 1) * d;

        // Final adjustment for the last session to absorb rounding
        if (i === n) {
            sessionLoss = ptp - totalAssignedLoss;
        }

        totalAssignedLoss += sessionLoss;
        currentWeight -= sessionLoss;

        const sessionEndDate = addDays(new Date(currentDate), 41);

        sessions.push({
            sessionNumber: i,
            startDate: new Date(currentDate),
            endDate: sessionEndDate,
            targetLoss: Number(sessionLoss.toFixed(1)),
            projectedWeightEnd: Number(currentWeight.toFixed(1)),
            type: "LOSS"
        });

        // Next session starts the day after
        currentDate = addDays(new Date(sessionEndDate), 1);
    }

    return sessions;
}

/**
 * Calculate BMI thresholds converted to weights
 */
export function calculateBmiThresholds(heightCm: number) {
    const h = heightCm / 100;
    return {
        imc40: 40 * h * h,
        imc35: 35 * h * h,
        imc30: 30 * h * h,
        imc25: 25 * h * h,
        imc18_5: 18.5 * h * h
    };
}

/**
 * Determine the index of the end of the first subscription
 */
export function getSubscriptionEndIndex(tier: string): number {
    const tierMap: Record<string, number> = {
        'standard_6': 1,
        'standard_12': 2,
        'standard_24': 4,
        'standard_48': 8,
        'vip_6': 1,
        'vip_12': 2,
        'vip_24': 4,
        'vip_48': 8,
        'vip_plus_16': 3 // ceil(16/6)
    };

    // Search for a match in the keys (handling potential case differences or prefixes)
    const normalizedTier = tier.toLowerCase();
    for (const key in tierMap) {
        if (normalizedTier.includes(key)) return tierMap[key];
    }

    return 1; // Default
}

/**
 * Helper to add days to a date
 */
export function addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}
