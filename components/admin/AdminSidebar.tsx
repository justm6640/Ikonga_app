"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    Users,
    Utensils,
    Video,
    LogOut,
    ChevronRight
} from "lucide-react"

const ADMIN_NAV_ITEMS = [
    {
        label: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
    },
    {
        label: "Utilisateurs",
        href: "/admin/users",
        icon: Users,
    },
    {
        label: "Menus",
        href: "/admin/menus",
        icon: Utensils,
    },
    {
        label: "Contenus",
        href: "/admin/content",
        icon: Video,
    },
]

export function AdminSidebar() {
    const pathname = usePathname()

    return (
        <aside className="w-72 bg-slate-950 text-slate-300 flex-shrink-0 flex flex-col border-r border-slate-800 shadow-2xl h-full hidden lg:flex">
            {/* Header */}
            <div className="p-8 pb-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-ikonga-gradient flex items-center justify-center shadow-lg shadow-pink-500/20">
                        <span className="text-white font-black text-xl">I</span>
                    </div>
                    <div>
                        <h1 className="text-white font-bold tracking-tight text-lg leading-none">IKONGA</h1>
                        <p className="text-[10px] uppercase font-black tracking-[0.2em] text-ikonga-coral mt-1">Admin Panel</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-2">
                {ADMIN_NAV_ITEMS.map((item) => {
                    // Logic: exact match for /admin, startsWith for others
                    const isActive = item.href === "/admin"
                        ? pathname === "/admin"
                        : pathname.startsWith(item.href)

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "group flex items-center justify-between gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300",
                                isActive
                                    ? "bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-inner border border-white/5"
                                    : "hover:bg-slate-900/50 hover:text-slate-100"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "p-2 rounded-xl transition-colors",
                                    isActive ? "bg-ikonga-coral/20 text-ikonga-coral" : "text-slate-500 group-hover:text-slate-300"
                                )}>
                                    <item.icon size={20} />
                                </div>
                                <span className="font-semibold text-sm">{item.label}</span>
                            </div>
                            {isActive && <ChevronRight size={14} className="text-ikonga-coral animate-pulse" />}
                        </Link>
                    )
                })}
            </nav>

            {/* Footer */}
            <div className="p-6 mt-auto">
                <div className="p-4 rounded-3xl bg-slate-900/50 border border-slate-800 space-y-4">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest text-center">Navigation</p>
                    <Link
                        href="/dashboard"
                        className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-2xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white transition-all border border-white/5"
                    >
                        <LogOut size={16} />
                        Retour au site
                    </Link>
                </div>
            </div>
        </aside>
    )
}
