"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/config/navigation";

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="hidden md:flex flex-col w-64 h-full bg-card border-r border-border">
            {/* Logo Area */}
            <div className="flex h-20 items-center px-6 border-b border-border/50">
                <h1 className="text-2xl font-serif font-bold text-transparent bg-clip-text bg-ikonga-gradient">
                    IKONGA
                </h1>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 flex flex-col gap-1 p-4 overflow-y-auto">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group hover:bg-secondary/50",
                                isActive
                                    ? "bg-secondary text-foreground font-medium shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <Icon
                                size={20}
                                className={cn(
                                    "transition-colors",
                                    isActive ? "text-ikonga-pink" : "text-muted-foreground group-hover:text-foreground"
                                )}
                            />
                            <span className={cn(
                                isActive ? "text-foreground" : ""
                            )}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
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
