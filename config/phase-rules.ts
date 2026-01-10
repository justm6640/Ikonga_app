import { SubscriptionTier } from "@prisma/client"

/**
 * Durations of phases in days according to subscription tiers.
 */
export const PHASE_DURATIONS = {
    STANDARD: {
        DETOX: 14,
        EQUILIBRE: 28,
    },
    VIP: {
        DETOX: 21,
        EQUILIBRE: 21,
    }
}

export const CONSOLIDATION_DAYS_PER_KG = 10

/**
 * Determine if a subscription tier follows VIP or STANDARD rules.
 */
export function getDurationRule(tier: SubscriptionTier): "VIP" | "STANDARD" {
    if (tier.startsWith("VIP")) {
        return "VIP"
    }
    return "STANDARD"
}
