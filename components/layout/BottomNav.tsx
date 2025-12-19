"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/config/navigation";

import { useSubscription } from "@/components/providers/SubscriptionProvider";

export function BottomNav() {
    const pathname = usePathname();
    const { hasAccess } = useSubscription();

    // Select top 5 essential items for mobile view AND check access
    const MOBILE_NAV_ITEMS = NAV_ITEMS.filter(item =>
        ["Accueil", "Fitness", "Pesée", "Courses", "Profil"].includes(item.label) &&
        (!item.requiredFeature || hasAccess(item.requiredFeature))
    );

    return (
        <div className="fixed bottom-0 z-50 w-full block md:hidden">
            {/* Glassmorphism Background */}
            <div className="absolute inset-x-0 bottom-0 h-20 bg-white/90 backdrop-blur-xl border-t border-slate-100" />

            <div className="relative flex justify-around items-center h-20 px-2 pb-4">
                {MOBILE_NAV_ITEMS.map((item) => {
                    const isActive = item.href === "/dashboard"
                        ? pathname === "/dashboard"
                        : pathname.startsWith(item.href);
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex flex-col items-center justify-center w-full h-full space-y-1 relative"
                        >
                            <div className={cn(
                                "p-2 rounded-2xl transition-all duration-300",
                                isActive ? "bg-ikonga-pink/10 text-ikonga-pink scale-110" : "text-slate-400"
                            )}>
                                <Icon
                                    size={22}
                                    strokeWidth={isActive ? 2.5 : 2}
                                />
                            </div>

                            <span
                                className={cn(
                                    "text-[10px] uppercase tracking-widest font-black transition-colors duration-200",
                                    isActive
                                        ? "text-ikonga-pink"
                                        : "text-slate-400"
                                )}
                            >
                                {item.label}
                            </span>

                            {/* Dot indicator */}
                            {isActive && (
                                <span className="absolute bottom-[-4px] w-1.5 h-1.5 bg-ikonga-pink rounded-full shadow-lg shadow-pink-500/50" />
                            )}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
