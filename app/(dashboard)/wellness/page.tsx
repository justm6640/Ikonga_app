import { redirect } from "next/navigation"
import { getOrCreateUser } from "@/lib/actions/user"
import { getWellnessDashboardData } from "@/lib/actions/wellness"
import { WellnessClient } from "@/components/wellness/WellnessClient"

export default async function WellnessPage() {
    // 1. Authentication & User Verification
    const user = await getOrCreateUser()
    if (!user) redirect("/login")

    // 2. Fetch Dashboard Data
    const data = await getWellnessDashboardData()

    // Fallback if data fetch fails (though it handles nulls inside)
    if (!data) {
        return <div className="p-8 text-center text-slate-400">Impossible de charger les données bien-être.</div>
    }

    const { log, waterGoal, message, gender } = data

    return (
        <div className="w-full min-h-screen bg-slate-50/50 pb-24">
            {/* Wrapper removed specific width constraints to allow full width */}
            <div className="w-full mx-auto p-4 md:p-8 bg-white min-h-[90vh] shadow-sm md:rounded-[2.5rem] md:my-8 md:border border-slate-100">
                <WellnessClient
                    initialData={log}
                    waterGoal={waterGoal}
                    initialMessage={message}
                    gender={gender}
                />
            </div>
        </div>
    )
}
