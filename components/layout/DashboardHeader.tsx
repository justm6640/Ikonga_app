import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import prisma from "@/lib/prisma";
import { StreakCounter } from "@/components/gamification/StreakCounter";
import { updateStreak } from "@/lib/actions/gamification";
import { User } from "@prisma/client";
import { NotificationsPopover } from "../dashboard/NotificationsPopover";
import Link from "next/link";

interface DashboardHeaderProps {
    user: User;
}

export async function DashboardHeader({ user }: DashboardHeaderProps) {
    if (!user) return null;

    // Trigger streak update on visit (Server Action)
    await updateStreak(user.id);

    // Fetch user with notifications specifically for the header
    const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
            id: true,
            firstName: true,
            currentStreak: true,
            notifications: {
                orderBy: { createdAt: 'desc' },
                take: 5
            }
        }
    });

    if (!dbUser) return null;

    const userName = dbUser.firstName || "Rosy";
    const notifications = dbUser.notifications || [];
    const currentStreak = dbUser.currentStreak || 0;

    return (
        <header className="flex h-20 items-center justify-between px-6 py-4 bg-background/50 backdrop-blur-sm sticky top-0 z-40">
            {/* Left: Greeting */}
            <div>
                <h2 className="text-2xl font-serif text-foreground">
                    Hello <span className="text-ikonga-pink">{userName}</span>
                </h2>
                <p className="text-sm text-muted-foreground font-hand hidden sm:block">
                    Prête pour une belle journée ?
                </p>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
                {/* Streak Counter */}
                <StreakCounter streak={currentStreak} />

                {/* Notifications Popover (Interactive) */}
                <NotificationsPopover notifications={notifications as any} />

                {/* User Avatar - Redirects to Profile */}
                <Link href="/profile">
                    <Avatar className="h-10 w-10 border-2 border-background shadow-sm cursor-pointer hover:ring-2 hover:ring-ikonga-pink/20 transition-all">
                        <AvatarFallback className="bg-ikonga-gradient text-white font-bold">
                            {userName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                </Link>
            </div>
        </header>
    );
}
