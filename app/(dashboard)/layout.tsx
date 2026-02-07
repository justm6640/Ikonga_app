import { Sidebar } from "@/components/layout/Sidebar";
import { BottomNav } from "@/components/layout/BottomNav";
import { AdminFAB } from "@/components/layout/AdminFAB";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { startOfWeek, nextMonday, isFriday, isWeekend, addDays, differenceInCalendarDays } from 'date-fns';
import { getOrCreateUser } from "@/lib/actions/user";
import { SubscriptionProvider } from "@/components/providers/SubscriptionProvider";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // 🔒 CRITICAL: Redirect if user authentication fails
    const user = await getOrCreateUser();

    if (!user) {
        console.error("[DashboardLayout] User not authenticated - redirecting to login");
        redirect("/login");
    }

    const tier = user.subscriptionTier ?? null;
    const role = user.role ?? null;

    // 🚀 NEW: Reward/Redirect logic - If onboarding is NOT completed, force redirect
    // (Except for ADMINs who might want to bypass for testing - but let's be strict for now)
    if (!user.hasCompletedOnboarding && role !== 'ADMIN') {
        console.log(`[DashboardLayout] User ${user.id} hasn't completed onboarding - redirecting`);
        redirect("/onboarding");
    }

    // 🔒 NEW: Access Lock JJ-2
    // If currentDate < (DETOX startDate - 48H), redirect to /waiting
    // Except for ADMIN users
    if (role !== 'ADMIN') {
        const { subHours, isBefore } = await import('date-fns');
        const now = new Date();

        // Priority: DETOX phase start date > user profile start date > now
        const detoxPhase = user.phases?.find(p => p.type === 'DETOX');
        const referenceDate = detoxPhase?.startDate
            ? new Date(detoxPhase.startDate)
            : (user.startDate ? new Date(user.startDate) : new Date());

        const unlockDate = subHours(referenceDate, 48);

        if (isBefore(now, unlockDate)) {
            console.log(`[DashboardLayout] Access locked until ${unlockDate.toISOString()}. Redirecting to /waiting`);
            redirect("/waiting");
        }
    }

    return (
        <SubscriptionProvider tier={tier} role={role}>
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
