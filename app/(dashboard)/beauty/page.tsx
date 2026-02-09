import { BeautyClient } from "@/components/beauty/BeautyClient"
import { getBeautyProfile } from "@/lib/actions/beauty"
import { getOrCreateUser } from "@/lib/actions/user"
import { redirect } from "next/navigation"

export default async function BeautyPage() {
    const user = await getOrCreateUser()
    if (!user) redirect("/login")

    // 🔒 Pre-Cure Access Control: Redirect if before cure start date
    const { isBeforeCureStart } = await import('@/lib/utils/access-control')
    if (user.role !== 'ADMIN' && isBeforeCureStart(user.planStartDate)) {
        redirect("/dashboard")
    }

    const profile = await getBeautyProfile()

    return (
        <div className="w-full px-4 py-8">
            <BeautyClient initialProfile={profile} />
        </div>
    )
}
