import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { AdminMobileHeader } from "@/components/admin/AdminMobileHeader"

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // 1. Authentification Check
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || !user.email) {
        redirect("/login")
    }

    // 2. Role Check (Database)
    const dbUser = await prisma.user.findUnique({
        where: { email: user.email },
        select: { role: true }
    })

    if (!dbUser || dbUser.role !== 'ADMIN') {
        redirect("/dashboard")
    }

    return (
        <div className="flex flex-col lg:flex-row h-screen bg-slate-50 overflow-hidden">
            {/* Mobile Header (Sticky) */}
            <AdminMobileHeader />

            {/* Dedicated Admin Sidebar (Desktop Only) */}
            <AdminSidebar />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
