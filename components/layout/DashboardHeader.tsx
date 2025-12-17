import { Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

export async function DashboardHeader() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch User Profile to get First Name (Assuming we have a getProfile logic or direct DB access)
    // For now, we'll try to get it from metadata or fallback. 
    // In a real scenario, fetch from Prisma User table here.
    // Placeholder logic:
    const userName = user?.user_metadata?.first_name || "Rosy";

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
            <div className="flex items-center gap-4">
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
