import { getNutritionData, getPhaseDays } from "@/lib/actions/nutrition"
import { getOrCreateUser } from "@/lib/actions/user"
import { redirect } from "next/navigation"
import { NutritionClient } from "@/components/nutrition/NutritionClient"

export default async function NutritionPage() {
    const user = await getOrCreateUser()
    if (!user) redirect("/login")

    // 🔒 Pre-Cure Access Control: Redirect if before cure start date
    const { isBeforeCureStart } = await import('@/lib/utils/access-control')
    if (user.role !== 'ADMIN' && isBeforeCureStart(user.planStartDate)) {
        redirect("/dashboard")
    }

    const [nutritionData, phaseDays] = await Promise.all([
        getNutritionData(),
        getPhaseDays()
    ])

    const activePhase = user.phases[0]?.type || "DETOX"

    // Prepare data with defaults to always show UI
    const safeData = {
        menu: nutritionData?.menu || null,
        guidelines: nutritionData?.guidelines || { allowed: [], forbidden: [] },
        phase: nutritionData?.phase || activePhase,
        isCompleted: nutritionData?.isCompleted || false,
        locked: nutritionData?.locked || false
    }

    return (
        <div className="bg-slate-50 min-h-screen p-0 sm:p-8">
            <NutritionClient
                initialData={safeData}
                subscriptionTier={user.subscriptionTier.replace('_', ' ') + " SEM."}
                phaseDays={phaseDays}
            />
        </div>
    )
}
