"use client"

import React from "react"
import { Bell, Check, Sparkles } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Notification } from "@prisma/client"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface NotificationsPopoverProps {
    notifications: Notification[]
}

export function NotificationsPopover({ notifications }: NotificationsPopoverProps) {
    const hasUnread = notifications.some(n => !n.isRead)

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full relative group">
                    <Bell size={20} className={cn(
                        "transition-all duration-300",
                        hasUnread ? "text-ikonga-pink" : "text-muted-foreground"
                    )} />
                    {hasUnread && (
                        <>
                            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-ikonga-orange rounded-full border-2 border-background animate-pulse" />
                            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-ikonga-orange rounded-full border-2 border-background animate-ping opacity-75" />
                        </>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 rounded-[1.5rem] border-ikonga-pink/10 shadow-2xl shadow-pink-500/5 overflow-hidden" align="end">
                <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-gradient-to-r from-white to-pink-50/20">
                    <div className="flex items-center gap-2">
                        <Sparkles size={16} className="text-ikonga-pink" />
                        <h4 className="font-serif font-bold text-slate-900">Notifications</h4>
                    </div>
                    {hasUnread && (
                        <Button variant="ghost" size="sm" className="h-8 text-[10px] font-black uppercase tracking-widest text-ikonga-pink hover:text-ikonga-pink hover:bg-ikonga-pink/5">
                            Tout lire
                        </Button>
                    )}
                </div>

                <ScrollArea className="h-[350px]">
                    {notifications.length > 0 ? (
                        <div className="divide-y divide-slate-50">
                            {notifications.map((notif) => (
                                <div
                                    key={notif.id}
                                    className={cn(
                                        "p-4 transition-colors hover:bg-slate-50/50 cursor-pointer relative group",
                                        !notif.isRead && "bg-ikonga-pink/[0.02]"
                                    )}
                                >
                                    {!notif.isRead && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-ikonga-pink" />
                                    )}
                                    <div className="flex flex-col gap-0.5">
                                        <div className="flex justify-between items-start gap-2">
                                            <span className={cn(
                                                "font-bold text-sm leading-tight",
                                                !notif.isRead ? "text-slate-950" : "text-slate-600"
                                            )}>
                                                {notif.title}
                                            </span>
                                            <span className="text-[10px] text-slate-400 whitespace-nowrap mt-0.5">
                                                {format(new Date(notif.createdAt), "dd MMM", { locale: fr })}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                                            {notif.body}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-white">
                            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-3">
                                <Bell className="text-slate-200" size={20} />
                            </div>
                            <p className="text-sm font-medium text-slate-400 italic">
                                Aucune nouvelle notification
                            </p>
                        </div>
                    )}
                </ScrollArea>

                {notifications.length > 0 && (
                    <div className="p-2 border-t border-slate-50 bg-slate-50/30">
                        <Button variant="ghost" className="w-full h-8 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-ikonga-pink transition-colors">
                            Voir tout l'historique
                        </Button>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    )
}
