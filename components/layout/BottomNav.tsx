"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/config/navigation";

export function BottomNav() {
    const pathname = usePathname();

    return (
        <div className="fixed bottom-0 z-50 w-full block md:hidden">
            {/* Glassmorphism Background */}
            <div className="absolute inset-x-0 bottom-0 h-20 bg-white/80 backdrop-blur-md border-t border-border/50" />

            <div className="relative flex justify-around items-center h-16 pt-2">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex flex-col items-center justify-center w-full h-full space-y-1"
                        >
                            <div className="relative flex flex-col items-center">
                                {/* Indicator Bar for Active State */}
                                {isActive && (
                                    <span className="absolute -top-3 w-8 h-1 bg-ikonga-gradient rounded-full" />
                                )}

                                <Icon
                                    size={24}
                                    className={cn(
                                        "transition-colors duration-200",
                                        isActive ? "text-ikonga-pink" : "text-muted-foreground"
                                    )}
                                // Hack for gradient text on icon if supported by Icon lib, else use color. 
                                // Lucide icons use stroke, so text-transparent bg-clip-text applies to text usually.
                                // For stroke, we use text-color. We set 'text-ikonga-pink' for active.
                                />

                                <span
                                    className={cn(
                                        "text-[10px] font-medium transition-colors duration-200",
                                        isActive
                                            ? "text-transparent bg-clip-text bg-ikonga-gradient font-bold"
                                            : "text-muted-foreground"
                                    )}
                                >
                                    {item.label}
                                </span>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
