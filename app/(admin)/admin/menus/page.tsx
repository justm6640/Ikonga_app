"use server"

import { startOfWeek } from "date-fns"
import { getAllWeeklyPlans } from "@/lib/actions/admin-nutrition"
import { getGlobalMenus } from "@/lib/actions/admin-menu"
import { WeeklyPlansTable } from "@/components/admin/menus/WeeklyPlansTable"
import { GlobalMenuManager } from "@/components/admin/menus/GlobalMenuManager"
import { MenuAssignment } from "@/components/admin/menus/MenuAssignment"
import { AdminMenuTabs } from "@/components/admin/menus/AdminMenuTabs"

export default async function AdminMenusPage() {
    const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 })

    // Parallel fetching
    const [plans, globalMenus] = await Promise.all([
        getAllWeeklyPlans(currentWeekStart),
        getGlobalMenus()
    ])

    return (
        <div className="p-8 space-y-8">
            <h1 className="text-3xl font-serif font-black text-slate-900 tracking-tighter uppercase mb-8">
                Gestion Nutrition
            </h1>

            <AdminMenuTabs
                weeklyPlansNode={<WeeklyPlansTable plans={plans} weekStart={currentWeekStart} />}
                globalMenusNode={<GlobalMenuManager initialMenus={globalMenus} />}
                assignmentNode={<MenuAssignment globalMenus={globalMenus} />}
            />
        </div>
    )
}

