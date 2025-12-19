import { PhaseType } from "@prisma/client";

export type PlanPhase = PhaseType | "EQUILIBRE_TRANSITION";

export interface PlanBlueprint {
    durationWeeks?: number;
    cycle?: PlanPhase[];
    fixedSchedule?: PlanPhase[];
}

export const PLAN_DETAILS: Record<string, PlanBlueprint> = {
    // STANDARD PLANS: Follow a 2/4 cycle (2 weeks DETOX, 4 weeks EQUILIBRE)
    STANDARD_6: {
        durationWeeks: 6,
        fixedSchedule: [
            ...Array(2).fill(PhaseType.DETOX),
            ...Array(4).fill(PhaseType.EQUILIBRE)
        ]
    },
    STANDARD_CYCLE: {
        cycle: [
            ...Array(2).fill(PhaseType.DETOX),
            ...Array(4).fill(PhaseType.EQUILIBRE)
        ]
    },

    // VIP PLANS: Follow a 3/3 cycle (3 weeks DETOX, 3 weeks EQUILIBRE)
    VIP_CYCLE: {
        cycle: [
            ...Array(3).fill(PhaseType.DETOX),
            ...Array(3).fill(PhaseType.EQUILIBRE)
        ]
    },

    // VIP++ 16: Specific Fixed Schedule
    VIP_PLUS_16: {
        durationWeeks: 16,
        fixedSchedule: [
            ...Array(3).fill(PhaseType.DETOX),
            ...Array(3).fill(PhaseType.EQUILIBRE),
            ...Array(4).fill(PhaseType.EQUILIBRE), // Prolonged Equilibre
            ...Array(6).fill("EQUILIBRE" as PhaseType) // Simple mapping to EQUILIBRE for now as per schema
        ]
    }
};

/**
 * Returns the expected phase for a user based on their plan and current week since start.
 */
export function getExpectedPhaseAtWeek(plan: string, weekIndex: number): PlanPhase {
    const details = PLAN_DETAILS[plan];
    if (!details) return PhaseType.DETOX;

    // 1. Check fixed schedule
    if (details.fixedSchedule) {
        if (weekIndex < details.fixedSchedule.length) {
            return details.fixedSchedule[weekIndex];
        }
        return PhaseType.ENTRETIEN; // End of program
    }

    // 2. Check cycle logic (Alternance)
    const cycle = plan.startsWith("VIP") ? PLAN_DETAILS.VIP_CYCLE.cycle : PLAN_DETAILS.STANDARD_CYCLE.cycle;
    if (cycle) {
        return cycle[weekIndex % cycle.length];
    }

    return PhaseType.DETOX;
}
