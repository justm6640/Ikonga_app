"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/config/navigation";

import { useSubscription } from "@/components/providers/SubscriptionProvider";

export function Sidebar() {
    const pathname = usePathname();
    const { hasAccess, isBeforeCureStart } = useSubscription();

    const filteredNavItems = NAV_ITEMS.filter(item =>
        !item.requiredFeature || hasAccess(item.requiredFeature)
    );

    const mainItems = filteredNavItems.filter(item => item.href !== '/profile' && item.href !== '/admin');
    const bottomItems = filteredNavItems.filter(item => item.href === '/profile' || item.href === '/admin');

    const NavLink = ({ item }: { item: any }) => {
        const isActive = item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(item.href);
        const Icon = item.icon;

        // Check if this section is locked (before cure start)
        const alwaysAccessible = ['/dashboard', '/mon-analyse', '/profile', '/admin'];
        const isAccessible = alwaysAccessible.some(path => item.href.startsWith(path));
        const isLocked = isBeforeCureStart && !isAccessible;

        return (
            <Link
                key={item.href}
                href={isLocked ? '#' : item.href}
                className={cn(
                    "flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative",
                    isLocked && "opacity-40 pointer-events-none cursor-not-allowed",
                    isActive && !isLocked
                        ? "bg-ikonga-coral text-white shadow-lg shadow-pink-500/20 font-bold"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                )}
                title={isLocked ? "Disponible après le début de votre cure" : ""}
            >
                <div className={cn(
                    "p-2 rounded-xl transition-colors",
                    isActive && !isLocked ? "bg-white/20 text-white" : "text-slate-400 group-hover:text-slate-900"
                )}>
                    <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className="text-sm">
                    {item.label}
                </span>
                {isLocked && (
                    <div className="ml-auto">
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                )}
            </Link>
        )
    }

    return (
        <div className="hidden md:flex flex-col w-64 h-full bg-card border-r border-border">
            {/* Logo Area */}
            <div className="flex h-20 items-center px-6 border-b border-border/50">
                <h1 className="text-2xl font-serif font-bold text-transparent bg-clip-text bg-ikonga-gradient">
                    IKONGA
                </h1>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 flex flex-col gap-1 p-4 overflow-y-auto mt-4">
                {mainItems.map((item) => (
                    <NavLink key={item.href} item={item} />
                ))}

                <div className="mt-auto pt-4 flex flex-col gap-1 border-t border-border/50">
                    {bottomItems.map((item) => (
                        <NavLink key={item.href} item={item} />
                    ))}
                </div>
            </nav>

            {/* User Section (Optional - Bottom Sidebar) */}
            <div className="p-4 border-t border-border/50">
                <div className="text-xs text-muted-foreground text-center">
                    © 2024 IKONGA App
                </div>
            </div>
        </div>
    );
}
