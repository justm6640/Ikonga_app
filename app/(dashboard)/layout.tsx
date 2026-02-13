import { PartialLockDialog } from "@/components/dashboard/PartialLockDialog";
import { SubscriptionProvider } from "@/components/providers/SubscriptionProvider";
import { Sidebar } from "@/components/layout/Sidebar";
import { BottomNav } from "@/components/layout/BottomNav";
import { AdminFAB } from "@/components/layout/AdminFAB";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { getOrCreateUser } from "@/lib/actions/user";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getOrCreateUser();
    if (!user) redirect("/login");

    const tier = user.subscriptionTier || null;
    const role = user.role || null;

    // 🔒 Calculate if we are before cure start (for section locking)
    const { isBeforeCureStart: checkBeforeCureStart } = await import('@/lib/utils/access-control');

    // Raw check based purely on dates (used for Popup, so Admins can see it too for testing)
    const isBeforeCureStartRaw = checkBeforeCureStart(user.planStartDate);

    // Flag for restriction (Admins are NEVER restricted)
    const isBeforeCureStartFlag = role !== 'ADMIN' && isBeforeCureStartRaw;

    return (
        <SubscriptionProvider tier={tier} role={role} isBeforeCureStart={isBeforeCureStartFlag}>
            <PartialLockDialog isBeforeCureStart={isBeforeCureStartRaw} planStartDate={user.planStartDate} />
            <div className="flex h-screen bg-background overflow-hidden font-sans">
                {/* Sidebar - Desktop Only */}
                <Sidebar />

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col overflow-hidden relative">
                    {/* Header - Global */}
                    <DashboardHeader user={user} />

                    {/* Page Content - Scrollable */}
                    {/* pb-24 ensures content isn't hidden behind BottomNav on Mobile */}
                    <main className="flex-1 overflow-y-auto p-0 pb-24 md:p-8 md:pb-8">
                        {children}
                    </main>

                    {/* Bottom Nav - Mobile Only */}
                    <BottomNav />

                    {/* Admin FAB - Mobile Only, Role Protected */}
                    <AdminFAB />
                </div>
            </div>
        </SubscriptionProvider>
    );
}
