import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { IdentityCard } from "@/components/profile/IdentityCard"
import { PhysicalCard } from "@/components/profile/PhysicalCard"
import { SignOutButton } from "@/components/auth/SignOutButton"
import { NotificationSettings } from "@/components/notifications/NotificationSettings"

export default async function ProfilePage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || !user.email) {
        redirect("/login")
    }

    const dbUser = await prisma.user.findUnique({
        where: { email: user.email },
    })

    if (!dbUser) {
        return <div>Profil introuvable</div>
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="space-y-2 pt-6">
                <h1 className="text-3xl md:text-4xl font-serif text-slate-900 tracking-tight">Mon Profil</h1>
                <p className="text-slate-500 font-light">
                    Gère tes informations personnelles et tes objectifs.
                </p>
            </div>

            {/* Grid Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                {/* Column 1: Identity */}
                <div className="space-y-6">
                    <IdentityCard user={dbUser} />
                </div>

                {/* Column 2: Physical */}
                <div className="space-y-6">
                    <PhysicalCard user={dbUser} />
                </div>
            </div>

            {/* Notification Settings Section */}
            <div className="max-w-3xl mx-auto">
                <NotificationSettings />
            </div>

            {/* Footer Action */}
            <div className="flex justify-center pt-8 border-t border-slate-100">
                <SignOutButton />
            </div>
        </div>
    )
}
