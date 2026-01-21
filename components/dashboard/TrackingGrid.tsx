"use client"

import { Card } from "@/components/ui/card"
import { ClipboardCheck, Activity, CalendarDays, MessageSquare, ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const TRACKING_ITEMS = [
    {
        id: "analyse",
        title: "Mon Analyse",
        description: "Profil Rosy & Conseils",
        icon: ClipboardCheck,
        href: "/mon-analyse",
        color: "bg-blue-50",
        iconColor: "text-blue-600",
        gradient: "from-blue-50 to-indigo-50"
    },
    {
        id: "indicateurs",
        title: "Indicateurs",
        description: "Bilan Métabolique Live",
        icon: Activity,
        href: "/indicateurs",
        color: "bg-emerald-50",
        iconColor: "text-emerald-600",
        gradient: "from-emerald-50 to-teal-50"
    },
    {
        id: "phases",
        title: "Phases",
        description: "Calendrier & Sessions",
        icon: CalendarDays,
        href: "/phases",
        color: "bg-violet-50",
        iconColor: "text-violet-600",
        gradient: "from-violet-50 to-purple-50"
    },
    {
        id: "community",
        title: "Groupes",
        description: "Coach & Communauté",
        icon: MessageSquare,
        href: "/groupes",
        color: "bg-pink-50",
        iconColor: "text-pink-600",
        gradient: "from-pink-50 to-rose-50"
    }
]

export function TrackingGrid() {
    return (
        <section className="space-y-4">
            <h3 className="text-lg font-serif font-black text-slate-800 ml-1">Suivi & Programme IKONGA</h3>
            <div className="grid grid-cols-2 gap-4">
                {TRACKING_ITEMS.map((item, index) => (
                    <Link key={item.id} href={item.href}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Card className={cn(
                                "border-none shadow-sm p-6 rounded-[2rem] hover:shadow-lg transition-all group cursor-pointer h-full relative overflow-hidden",
                                `bg-gradient-to-br ${item.gradient}`
                            )}>
                                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ArrowUpRight size={18} className="text-slate-400" />
                                </div>

                                <div className="flex flex-col gap-4">
                                    <div className={cn(
                                        "w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-all duration-300",
                                        item.iconColor
                                    )}>
                                        <item.icon size={24} strokeWidth={2.5} />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-black text-sm text-slate-900 leading-tight group-hover:text-ikonga-pink transition-colors">
                                            {item.title}
                                        </h4>
                                        <p className="text-[10px] font-semibold text-slate-500/80 leading-tight">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    </Link>
                ))}
            </div>
        </section>
    )
}
