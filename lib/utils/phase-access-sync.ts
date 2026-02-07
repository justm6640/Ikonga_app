import { differenceInDays, isBefore, addDays } from "date-fns"

/**
 * Synchronous version of phase access logic to avoid multiple DB calls in dashboard.
 * Assumes phases are already included in the user object.
 */
export function getUserAccessiblePhasesSync(user: any) {
    const phases = user.phases || []
    const today = new Date()

    // 1. Current Phase (marked as active)
    const currentPhase = phases.find((p: any) => p.isActive) || null

    // 2. Upcoming Phase (Next one if within 2 days)
    const upcomingPhase = phases.find((p: any) => {
        if (p.isActive || p.actualEndDate) return false
        if (!p.startDate) return false
        // A phase is upcoming if it starts in the next 2 days
        return isBefore(new Date(p.startDate), addDays(today, 2)) &&
            !isBefore(new Date(p.startDate), today)
    })

    // 3. Past Phases
    const pastPhases = phases.filter((p: any) =>
        !p.isActive && (p.actualEndDate || (p.plannedEndDate && isBefore(new Date(p.plannedEndDate), today)))
    )

    return {
        current: currentPhase,
        upcoming: upcomingPhase,
        past: pastPhases,
        all: phases.sort((a: any, b: any) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    }
}
