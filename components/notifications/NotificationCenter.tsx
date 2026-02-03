"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Bell,
    CheckCheck,
    Filter,
    Calendar,
    Scale,
    Heart,
    Sparkles,
    Users,
    ChevronRight,
    Circle,
    CheckCircle2,
    X
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import {
    getUserNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead
} from "@/lib/actions/notifications"
import { NotificationCategory, NotificationPriority } from "@prisma/client"
import { cn } from "@/lib/utils"

interface Notification {
    id: string
    title: string
    message: string
    category: NotificationCategory
    priority: NotificationPriority
    isRead: boolean
    link?: string | null
    createdAt: Date
}

const CATEGORY_MAP: Record<NotificationCategory, { icon: any, label: string, color: string }> = {
    PHASE: { icon: Calendar, label: "Programme", color: "text-blue-400" },
    FOLLOWUP: { icon: Scale, label: "Suivi", color: "text-orange-400" },
    LIFESTYLE: { icon: Sparkles, label: "Lifestyle", color: "text-purple-400" },
    WELLNESS: { icon: Heart, label: "Bien-être", color: "text-pink-400" },
    HUMAN: { icon: Users, label: "Coach", color: "text-emerald-400" }
}

const PRIORITY_COLORS: Record<NotificationPriority, string> = {
    HIGH: "border-l-red-500 bg-red-500/5",
    MEDIUM: "border-l-orange-500 bg-orange-500/5",
    LOW: "border-l-yellow-500 bg-yellow-500/5",
    GENTLE: "border-l-emerald-500 bg-emerald-500/5"
}

export const NotificationCenter = () => {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<NotificationCategory | "ALL">("ALL")
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        loadNotifications()
    }, [])

    const loadNotifications = async () => {
        setLoading(true)
        const data = await getUserNotifications()
        setNotifications(data as any)
        setLoading(false)
    }

    const handleRead = async (id: string) => {
        await markNotificationAsRead(id)
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
    }

    const handleReadAll = async () => {
        await markAllNotificationsAsRead()
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
    }

    const filteredNotifications = filter === "ALL"
        ? notifications
        : notifications.filter(n => n.category === filter)

    const unreadCount = notifications.filter(n => !n.isRead).length

    return (
        <div className="relative">
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full hover:bg-white/10 transition-colors"
            >
                <Bell className="w-6 h-6 text-white/80" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#09090b]">
                        {unreadCount}
                    </span>
                )}
            </button>

            {/* Notification Panel */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 z-40 lg:hidden"
                            onClick={() => setIsOpen(false)}
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="absolute right-0 mt-4 w-[380px] md:w-[450px] max-h-[600px] overflow-hidden rounded-2xl border border-white/10 bg-[#09090b]/90 backdrop-blur-xl shadow-2xl z-50 flex flex-col"
                        >
                            {/* Header */}
                            <div className="p-4 border-b border-white/10 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-semibold text-white">Notifications</h3>
                                    {unreadCount > 0 && (
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/60">
                                            {unreadCount} nouvelles
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleReadAll}
                                        className="p-2 hover:bg-white/10 rounded-lg transition-colors group"
                                        title="Tout marquer comme lu"
                                    >
                                        <CheckCheck className="w-4 h-4 text-white/40 group-hover:text-white/80" />
                                    </button>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                    >
                                        <X className="w-4 h-4 text-white/40" />
                                    </button>
                                </div>
                            </div>

                            {/* Filters */}
                            <div className="px-4 py-2 border-b border-white/10 flex items-center gap-2 overflow-x-auto no-scrollbar">
                                <button
                                    onClick={() => setFilter("ALL")}
                                    className={cn(
                                        "px-3 py-1.5 rounded-full text-xs transition-all whitespace-nowrap",
                                        filter === "ALL" ? "bg-white text-black font-medium" : "bg-white/5 text-white/60 hover:bg-white/10"
                                    )}
                                >
                                    Tout
                                </button>
                                {(Object.keys(CATEGORY_MAP) as NotificationCategory[]).map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setFilter(cat)}
                                        className={cn(
                                            "px-3 py-1.5 rounded-full text-xs transition-all whitespace-nowrap flex items-center gap-1.5",
                                            filter === cat ? "bg-white text-black font-medium" : "bg-white/5 text-white/60 hover:bg-white/10"
                                        )}
                                    >
                                        {React.createElement(CATEGORY_MAP[cat].icon, { className: "w-3 h-3" })}
                                        {CATEGORY_MAP[cat].label}
                                    </button>
                                ))}
                            </div>

                            {/* List */}
                            <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth p-2 space-y-2">
                                {loading ? (
                                    <div className="py-20 flex flex-col items-center justify-center gap-3">
                                        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                        <p className="text-sm text-white/40">Chargement...</p>
                                    </div>
                                ) : filteredNotifications.length === 0 ? (
                                    <div className="py-20 flex flex-col items-center justify-center gap-4 text-center">
                                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                                            <Bell className="w-6 h-6 text-white/20" />
                                        </div>
                                        <p className="text-sm text-white/40 px-10">
                                            Aucune notification {filter !== "ALL" ? `dans la catégorie ${CATEGORY_MAP[filter].label}` : "pour le moment"}.
                                        </p>
                                    </div>
                                ) : (
                                    filteredNotifications.map((notif) => {
                                        const CatDetails = CATEGORY_MAP[notif.category]
                                        return (
                                            <motion.div
                                                layout
                                                key={notif.id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className={cn(
                                                    "group relative flex gap-4 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-all cursor-pointer border-l-4 overflow-hidden",
                                                    PRIORITY_COLORS[notif.priority],
                                                    !notif.isRead && "bg-white/[0.03]"
                                                )}
                                                onClick={() => handleRead(notif.id)}
                                            >
                                                {/* Icon */}
                                                <div className={cn(
                                                    "w-10 h-10 rounded-full flex items-center justify-center shrink-0 border border-white/5",
                                                    CatDetails.color.replace('text', 'bg') + "/10"
                                                )}>
                                                    <CatDetails.icon className={cn("w-5 h-5", CatDetails.color)} />
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between gap-2 mb-1">
                                                        <h4 className={cn(
                                                            "text-sm font-semibold truncate",
                                                            notif.isRead ? "text-white/60" : "text-white"
                                                        )}>
                                                            {notif.title}
                                                        </h4>
                                                        <span className="text-[10px] text-white/40 whitespace-nowrap">
                                                            {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true, locale: fr })}
                                                        </span>
                                                    </div>
                                                    <p className={cn(
                                                        "text-xs leading-relaxed line-clamp-2 transition-all",
                                                        notif.isRead ? "text-white/30" : "text-white/60"
                                                    )}>
                                                        {notif.message}
                                                    </p>
                                                </div>

                                                {/* Status Dot */}
                                                {!notif.isRead && (
                                                    <div className="absolute top-4 right-4 group-hover:block">
                                                        <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                                                    </div>
                                                )}

                                                <ChevronRight className="w-4 h-4 text-white/10 group-hover:text-white/40 transition-colors shrink-0 self-center" />
                                            </motion.div>
                                        )
                                    })
                                )}
                            </div>

                            {/* Footer */}
                            {notifications.length > 0 && (
                                <div className="p-4 border-t border-white/10 bg-white/[0.02]">
                                    <button
                                        className="w-full py-2.5 rounded-lg text-xs font-semibold text-white/60 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center gap-2"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Fermer le centre de notifications
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}
