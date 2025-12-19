import { Sidebar } from "@/components/layout/Sidebar";
import { BottomNav } from "@/components/layout/BottomNav";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { getOrCreateUser } from "@/lib/actions/user";
import { SubscriptionProvider } from "@/components/providers/SubscriptionProvider";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getOrCreateUser();
    const tier = user?.subscriptionTier ?? null;
    const role = user?.role ?? null;

    return (
        <SubscriptionProvider tier={tier} role={role}>
            <div className="flex h-screen bg-background overflow-hidden font-sans">
                {/* Sidebar - Desktop Only */}
                <Sidebar />

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col overflow-hidden relative">
                    {/* Header - Global */}
                    <DashboardHeader />

                    {/* Page Content - Scrollable */}
                    {/* pb-24 ensures content isn't hidden behind BottomNav on Mobile */}
                    <main className="flex-1 overflow-y-auto p-4 pb-24 md:p-8 md:pb-8">
                        {children}
                    </main>

                    {/* Bottom Nav - Mobile Only */}
                    <BottomNav />
                </div>
            </div>
        </SubscriptionProvider>
    );
}
