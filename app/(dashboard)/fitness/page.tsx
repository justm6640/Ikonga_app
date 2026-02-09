
import { getFitnessHubData } from "@/lib/actions/fitness"
import { WorkoutHero } from "@/components/fitness/WorkoutHero"
import { WorkoutList } from "@/components/fitness/WorkoutList" // Assuming I'll make this client component active
import { FitnessClient } from "@/components/fitness/FitnessClient" // I should probably make a client wrapper for interactivity
import { getOrCreateUser } from "@/lib/actions/user"
import { redirect } from "next/navigation"

export const metadata = {
    title: "Fitness Hub | IKONGA",
    description: "Ton espace d'entraînement personnalisé"
}

export default async function FitnessPage() {
    const user = await getOrCreateUser()
    if (!user) redirect("/auth/sign-in")

    // 🔒 Pre-Cure Access Control: Redirect if before cure start date
    const { isBeforeCureStart } = await import('@/lib/utils/access-control')
    if (user.role !== 'ADMIN' && isBeforeCureStart(user.planStartDate)) {
        redirect("/dashboard")
    }

    const data = await getFitnessHubData()

    // If data is null, we construct a partial object to allow rendering the "No workout" state within the main layout
    const safeData = data || {
        user: user,
        recommendedWorkout: null,
        alternatives: [],
        todayLog: null
    }

    return (
        <FitnessClient
            initialData={safeData}
        />
    )
}
