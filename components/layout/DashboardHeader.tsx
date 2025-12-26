import { Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import { StreakCounter } from "@/components/gamification/StreakCounter";
import { updateStreak } from "@/lib/actions/gamification";

import { User } from "@prisma/client";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { getUserNotifications, getUnreadCount } from "@/lib/actions/notifications";

interface DashboardHeaderProps {
    user: User;
}

export async function DashboardHeader({ user }: DashboardHeaderProps) {
    if (!user) return null;

    // Trigger streak update on visit (Server Action)
    await updateStreak(user.id);

    // Fetch initial notifications and count
    const [initialNotifications, unreadCount] = await Promise.all([
        getUserNotifications(user.id),
        getUnreadCount(user.id)
    ]);

    const userName = user.firstName || "Rosy";

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
                <StreakCounter streak={(user as any).currentStreak || 0} />

                {/* Notifications Bell */}
                <NotificationBell
                    userId={user.id}
                    initialNotifications={initialNotifications as any}
                    unreadCount={unreadCount}
                />

                {/* User Avatar */}
                <Avatar className="h-10 w-10 border-2 border-background shadow-sm cursor-pointer hover:opacity-80 transition-opacity">
                    <AvatarFallback className="bg-ikonga-gradient text-white font-bold">
                        {userName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
            </div>
        </header>
    );
}
