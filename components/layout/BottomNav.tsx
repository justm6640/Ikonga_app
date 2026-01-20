"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/config/navigation";

import { useSubscription } from "@/components/providers/SubscriptionProvider";

export function BottomNav() {
    const pathname = usePathname();
    const { hasAccess } = useSubscription();

    // Select items for mobile view (Exclude Admin and Profil)
    const MOBILE_NAV_ITEMS = NAV_ITEMS.filter(item =>
        item.label !== "Admin" &&
        item.label !== "Profil" &&
        (!item.requiredFeature || hasAccess(item.requiredFeature))
    );

    return (
        <div className="fixed bottom-0 z-50 w-full block md:hidden">
            {/* Glassmorphism Background */}
            <div className="absolute inset-x-0 bottom-0 h-20 bg-white/95 backdrop-blur-xl border-t border-slate-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]" />

            <div className="relative flex justify-between items-center h-20 px-4 pb-4 overflow-x-auto no-scrollbar">
                {MOBILE_NAV_ITEMS.map((item) => {
                    const isActive = item.href === "/dashboard"
                        ? pathname === "/dashboard"
                        : pathname.startsWith(item.href);
                    const Icon = item.icon;

                    // Shorten label for mobile (Remove IKO- prefix)
                    const displayLabel = item.label.replace("IKO-", "");

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex flex-col items-center justify-center min-w-[3.5rem] w-full h-full space-y-1 relative group"
                        >
                            <div className={cn(
                                "p-1.5 rounded-xl transition-all duration-300",
                                isActive ? "bg-ikonga-pink/10 text-ikonga-pink scale-110" : "text-slate-400 group-hover:text-slate-600"
                            )}>
                                <Icon
                                    size={20}
                                    strokeWidth={isActive ? 2.5 : 2}
                                />
                            </div>

                            <span
                                className={cn(
                                    "text-[9px] uppercase tracking-tight font-black transition-colors duration-200 truncate max-w-full px-0.5",
                                    isActive
                                        ? "text-ikonga-pink"
                                        : "text-slate-400"
                                )}
                            >
                                {displayLabel}
                            </span>

                            {/* Dot indicator */}
                            {isActive && (
                                <span className="absolute bottom-[-2px] w-1 h-1 bg-ikonga-pink rounded-full shadow-lg shadow-pink-500/50" />
                            )}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
