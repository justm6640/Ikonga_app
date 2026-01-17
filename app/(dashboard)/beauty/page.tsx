import { BeautyClient } from "@/components/beauty/BeautyClient"
import { getBeautyProfile } from "@/lib/actions/beauty"

export default async function BeautyPage() {
    const profile = await getBeautyProfile()

    return (
        <div className="w-full px-4 py-8">
            <BeautyClient initialProfile={profile} />
        </div>
    )
}
