import { Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import { StreakCounter } from "@/components/gamification/StreakCounter";
import { updateStreak } from "@/lib/actions/gamification";

import { User } from "@prisma/client";

interface DashboardHeaderProps {
    user: User;
}

export async function DashboardHeader({ user }: DashboardHeaderProps) {
    if (!user) return null;

    // Trigger streak update on visit (Server Action)
    // We keep this to ensure streaks increment correctly on daily visits
    await updateStreak(user.id);

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

                {/* Notifications */}
                <Button variant="ghost" size="icon" className="rounded-full relative">
                    <Bell size={20} className="text-muted-foreground" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-ikonga-orange rounded-full border border-background" />
                </Button>

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
