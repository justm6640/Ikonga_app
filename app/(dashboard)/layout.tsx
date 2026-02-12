import { PartialLockDialog } from "@/components/dashboard/PartialLockDialog";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // 🔒 NEW: Calculate if we are before cure start (for section locking)
    // This is used to gray out sections that are not yet accessible
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
