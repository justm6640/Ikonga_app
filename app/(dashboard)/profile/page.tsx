import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"
import { ProfileForm } from "@/components/dashboard/ProfileForm"
import { redirect } from "next/navigation"

export default async function ProfilePage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || !user.email) {
        redirect("/login")
    }

    const dbUser = await prisma.user.findUnique({
        where: { email: user.email }
    })

    if (!dbUser) {
        // Handle edge case where session exists but prisma user doesn't
        redirect("/login")
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6 pt-4 px-4">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-serif font-bold text-slate-900">Mon Compte</h1>
                <p className="text-slate-500">Gérez vos informations personnelles et votre abonnement.</p>
            </div>

            <ProfileForm user={dbUser} />
        </div>
    )
}
