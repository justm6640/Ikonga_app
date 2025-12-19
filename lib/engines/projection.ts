import { addWeeks, differenceInDays } from "date-fns"

export interface ProjectionResult {
    estimatedEndDate: Date;
    weeksRemaining: number;
    percentageDone: number;
    totalToLose: number;
    lostSoFar: number;
}

/**
 * Pure mathematical engine for weight loss projection.
 * Standard IKONGA speed: 0.8kg / week
 */
export function calculateProjection(
    startWeight: number,
    currentWeight: number,
    targetWeight: number,
    startDate: Date
): ProjectionResult {
    const totalToLose = Math.max(0, startWeight - targetWeight)
    const lostSoFar = Math.max(0, startWeight - currentWeight)
    const remainingToLose = Math.max(0, currentWeight - targetWeight)

    // Percentage of progress (linear between start and target)
    const percentageDone = totalToLose > 0
        ? Math.min(100, Math.max(0, (lostSoFar / totalToLose) * 100))
        : 100

    // Algorithm: 0.8kg per week
    const weeksRemaining = remainingToLose / 0.8
    const estimatedEndDate = addWeeks(new Date(), weeksRemaining)

    return {
        estimatedEndDate,
        weeksRemaining: Math.ceil(weeksRemaining),
        percentageDone: Math.round(percentageDone),
        totalToLose: Number(totalToLose.toFixed(1)),
        lostSoFar: Number(lostSoFar.toFixed(1))
    }
}
