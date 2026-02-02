"use client"

import { Bell, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion } from "framer-motion"

interface DashboardHeaderProps {
    firstName?: string
    avatarUrl?: string
    notificationsCount?: number
}

export function DashboardHeader({ firstName, avatarUrl, notificationsCount = 0 }: DashboardHeaderProps) {
    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between py-4 mb-2"
        >
            <div className="space-y-1">
                <h1 className="text-3xl md:text-4xl font-serif font-black text-slate-900 tracking-tight">
                    Hello <span className="bg-gradient-to-r from-ikonga-coral to-orange-400 bg-clip-text text-transparent">{firstName || "Championne"}</span>
                </h1>
                <p className="text-xs md:text-sm font-hand text-slate-400 italic pl-0.5">
                    « Petit pas + Petit pas = Grande Victoire »
                </p>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative h-10 w-10 md:h-12 md:w-12 text-slate-400 hover:text-ikonga-coral hover:bg-pink-50 transition-all rounded-2xl group"
                >
                    <Bell size={20} className="group-hover:scale-110 transition-transform" />
                    {notificationsCount > 0 && (
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-ikonga-coral rounded-full border-2 border-white shadow-md"
                        />
                    )}
                </Button>

                <Avatar className="h-10 w-10 md:h-12 md:w-12 border-2 border-slate-100 ring-4 ring-white shadow-lg cursor-pointer hover:border-ikonga-coral hover:scale-105 transition-all">
                    <AvatarImage src={avatarUrl} />
                    <AvatarFallback className="bg-ikonga-gradient text-white font-black text-sm">
                        {firstName?.[0] || "U"}
                    </AvatarFallback>
                </Avatar>
            </div>
        </motion.header>
    )
}
