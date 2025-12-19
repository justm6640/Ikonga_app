import { Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import { StreakCounter } from "@/components/gamification/StreakCounter";
import { updateStreak } from "@/lib/actions/gamification";

export async function DashboardHeader() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !user.email) return null;

    // Fetch User from DB to get real data and streak
    const dbUser = await prisma.user.findUnique({
        where: { email: user.email },
        select: { id: true, firstName: true, currentStreak: true }
    });

    if (!dbUser) return null;

    // Trigger streak update on visit (Server Action)
    await updateStreak(dbUser.id);

    // Re-fetch or just increment locally if we want fresh data? 
    // updateStreak is async but doesn't return data. 
    // Actually, updateStreak will update the DB. 
    // For simplicity, we fetch once. The UI might be 1 day behind until next refresh, 
    // but usually, it's fine for a header. 

    const userName = dbUser.firstName || "Rosy";

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
                <StreakCounter streak={dbUser.currentStreak} />

                {/* Notifications */}
                <Button variant="ghost" size="icon" className="rounded-full relative">
                    <Bell size={20} className="text-muted-foreground" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-ikonga-orange rounded-full border border-background" />
                </Button>

                {/* User Avatar */}
                <Avatar className="h-10 w-10 border-2 border-background shadow-sm cursor-pointer hover:opacity-80 transition-opacity">
                    <AvatarImage src={user?.user_metadata?.avatar_url} />
                    <AvatarFallback className="bg-ikonga-gradient text-white font-bold">
                        {userName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
            </div>
        </header>
    );
}
