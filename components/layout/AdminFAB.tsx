"use client"

import Link from "next/link"
import { Shield } from "lucide-react"
import { useSubscription } from "@/components/providers/SubscriptionProvider"

/**
 * AdminFAB - A floating action button exclusively for Admin users on mobile.
 * It provides quick access to the admin dashboard.
 */
export function AdminFAB() {
    const { role } = useSubscription()

    // Only render for ADMIN role
    if (role !== "ADMIN") return null

    return (
        <div className="fixed bottom-24 right-5 z-50 md:hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Link
                href="/admin"
                aria-label="Accéder à l'administration"
                className="flex items-center justify-center w-14 h-14 rounded-full bg-slate-900/90 text-white shadow-[0_8px_30px_rgb(0,0,0,0.3)] hover:scale-110 active:scale-95 transition-all duration-300 border border-white/10 backdrop-blur-xl group"
            >
                <Shield
                    size={24}
                    className="text-ikonga-pink group-hover:drop-shadow-[0_0_8px_rgba(229,72,138,0.5)] transition-all duration-300"
                />
            </Link>
        </div>
    )
}
