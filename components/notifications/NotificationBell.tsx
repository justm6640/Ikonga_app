"use client"

import { useState, useEffect } from "react"
import { Bell, Check, Info, AlertTriangle, Ghost, Sparkles } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { markAsRead, markAllAsRead } from "@/lib/actions/notifications"
import { Notification, NotificationType } from "@prisma/client"

interface NotificationBellProps {
    userId: string
    initialNotifications: Notification[]
    unreadCount: number
}

export function NotificationBell({ userId, initialNotifications, unreadCount: initialUnreadCount }: NotificationBellProps) {
    const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
    const [unreadCount, setUnreadCount] = useState(initialUnreadCount)

    // Update state when props change
    useEffect(() => {
        setNotifications(initialNotifications)
        setUnreadCount(initialUnreadCount)
    }, [initialNotifications, initialUnreadCount])

    const handleMarkAsRead = async (id: string) => {
        // Optimistic update
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, isRead: true } : n)
        )
        setUnreadCount(prev => Math.max(0, prev - 1))
        await markAsRead(id)
    }

    const handleMarkAllAsRead = async () => {
        // Optimistic update
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
        setUnreadCount(0)
        await markAllAsRead(userId)
    }

    const getIcon = (type: NotificationType) => {
        switch (type) {
            case NotificationType.SUCCESS:
                return <Check className="text-emerald-500" size={16} />
            case NotificationType.WARNING:
                return <AlertTriangle className="text-amber-500" size={16} />
            case NotificationType.ERROR:
                return <AlertTriangle className="text-rose-500" size={16} />
            case NotificationType.COACH:
                return <Sparkles className="text-ikonga-coral" size={16} />
            default:
                return <Info className="text-blue-500" size={16} />
        }
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full relative hover:bg-slate-100 transition-colors">
                    <Bell size={20} className="text-slate-600" />
                    {unreadCount > 0 && (
                        <span className="absolute top-2 right-2 flex h-4 w-4 transform translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-ikonga-coral text-[10px] font-bold text-white border-2 border-white animate-in zoom-in-50">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 md:w-96 p-0 bg-white/95 backdrop-blur-md rounded-2xl border-slate-100 shadow-xl overflow-hidden" align="end">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h3 className="font-serif font-bold text-slate-900">Notifications</h3>
                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkAllAsRead}
                            className="text-[11px] font-black uppercase tracking-wider text-ikonga-coral hover:opacity-70 transition-opacity"
                        >
                            Tout marquer comme lu
                        </button>
                    )}
                </div>

                <ScrollArea className="h-[350px]">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-[300px] p-8 text-center space-y-4">
                            <div className="p-4 rounded-full bg-slate-50">
                                <Ghost className="text-slate-400" size={40} strokeWidth={1} />
                            </div>
                            <div>
                                <p className="text-slate-900 font-bold">Rien pour l'instant</p>
                                <p className="text-slate-500 text-sm font-light">
                                    Nous te préviendrons dès qu'il y aura du nouveau sur ton parcours.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {notifications.map((notif) => (
                                <button
                                    key={notif.id}
                                    onClick={() => !notif.isRead && handleMarkAsRead(notif.id)}
                                    className={cn(
                                        "flex gap-4 p-4 text-left transition-all hover:bg-slate-50 relative border-b border-slate-50 last:border-0",
                                        !notif.isRead && "bg-ikonga-coral/5"
                                    )}
                                >
                                    {/* Type Indicator Dot for Coach */}
                                    {notif.type === NotificationType.COACH && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-ikonga-coral" />
                                    )}

                                    <div className={cn(
                                        "shrink-0 w-10 h-10 rounded-xl flex items-center justify-center",
                                        notif.type === NotificationType.COACH ? "bg-ikonga-coral/10" : "bg-slate-100"
                                    )}>
                                        {getIcon(notif.type)}
                                    </div>

                                    <div className="space-y-1 overflow-hidden">
                                        <div className="flex items-center justify-between gap-2">
                                            <p className={cn(
                                                "text-sm font-bold truncate",
                                                notif.isRead ? "text-slate-600" : "text-slate-900"
                                            )}>
                                                {notif.title}
                                            </p>
                                            <span className="text-[10px] text-slate-400 whitespace-nowrap">
                                                {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true, locale: fr })}
                                            </span>
                                        </div>
                                        <p className={cn(
                                            "text-xs leading-relaxed line-clamp-2",
                                            notif.isRead ? "text-slate-400" : "text-slate-600"
                                        )}>
                                            {notif.message}
                                        </p>
                                    </div>

                                    {!notif.isRead && (
                                        <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-ikonga-coral" />
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </ScrollArea>

                <div className="p-3 bg-slate-50/50 border-t border-slate-100 text-center">
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">
                        IKONGA &bull; Ton Coach Digital
                    </p>
                </div>
            </PopoverContent>
        </Popover>
    )
}
