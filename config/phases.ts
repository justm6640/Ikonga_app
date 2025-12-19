import { SubscriptionTier, PhaseType } from "@prisma/client";

// PHASE_DURATIONS is now handled by blueprints in @/config/plans.ts

/**
 * Calculates the number of consolidation days based on weight lost.
 * 10 days per kilo lost.
 */
export function calculateConsolidationDays(weightLost: number): number {
    return Math.max(0, Math.ceil(weightLost * 10));
}

/**
 * Returns the next phase in the logical sequence.
 * This is the basic sequence; actual logic may loop between Detox and Equilibre.
 */
export const NEXT_PHASE: Record<PhaseType, PhaseType | null> = {
    [PhaseType.DETOX]: PhaseType.EQUILIBRE,
    [PhaseType.EQUILIBRE]: PhaseType.CONSOLIDATION, // Conditional in engine
    [PhaseType.CONSOLIDATION]: PhaseType.ENTRETIEN,
    [PhaseType.ENTRETIEN]: null,
};
