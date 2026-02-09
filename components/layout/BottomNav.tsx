"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/config/navigation";

import { useSubscription } from "@/components/providers/SubscriptionProvider";

export function BottomNav() {
    const pathname = usePathname();
    const { hasAccess, isBeforeCureStart } = useSubscription();

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

                    // Check if this section is locked (before cure start)
                    const alwaysAccessible = ['/dashboard', '/mon-analyse', '/profile', '/admin'];
                    const isAccessible = alwaysAccessible.some(path => item.href.startsWith(path));
                    const isLocked = isBeforeCureStart && !isAccessible;

                    return (
                        <Link
                            key={item.href}
                            href={isLocked ? '#' : item.href}
                            className={cn(
                                "flex flex-col items-center justify-center min-w-[3.5rem] w-full h-full space-y-1 relative group",
                                isLocked && "opacity-40 pointer-events-none"
                            )}
                        >
                            <div className={cn(
                                "p-1.5 rounded-xl transition-all duration-300 relative",
                                isActive && !isLocked ? "bg-ikonga-orange/10 text-ikonga-orange scale-110" : "text-slate-400 group-hover:text-slate-600"
                            )}>
                                <Icon
                                    size={20}
                                    strokeWidth={isActive ? 2.5 : 2}
                                />
                                {isLocked && (
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-slate-300 rounded-full flex items-center justify-center">
                                        <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                            </div>

                            <span
                                className={cn(
                                    "text-[9px] uppercase tracking-tight font-black transition-colors duration-200 truncate max-w-full px-0.5",
                                    isActive && !isLocked
                                        ? "text-ikonga-orange"
                                        : "text-slate-400"
                                )}
                            >
                                {displayLabel}
                            </span>

                            {/* Dot indicator */}
                            {isActive && !isLocked && (
                                <span className="absolute bottom-[-2px] w-1.5 h-1.5 bg-ikonga-gradient rounded-full shadow-premium" />
                            )}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
