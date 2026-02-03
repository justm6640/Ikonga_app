"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
    Bell,
    Calendar,
    Scale,
    Sparkles,
    Heart,
    Users,
    Clock,
    CheckCircle2,
    Settings2,
    Moon
} from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
    getNotificationPreferences,
    updateNotificationPreferences
} from "@/lib/actions/notifications"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface Preferences {
    enablePhases: boolean
    enableFollowup: boolean
    enableLifestyle: boolean
    enableWellness: boolean
    enableCommunity: boolean
    quietHoursEnabled: boolean
    quietHoursStart: string
    quietHoursEnd: string
}

const CATEGORIES = [
    { id: "enablePhases", icon: Calendar, label: "Programmes & Phases", description: "Notifications concernant ton cycle et tes changements de phases." },
    { id: "enableFollowup", icon: Scale, label: "Suivi & Pesées", description: "Bilan des pesées, milestones et rappels de suivi." },
    { id: "enableLifestyle", icon: Sparkles, label: "Lifestyle & Beauté", description: "Conseils mode, rituels beauté et astuces quotidiennes." },
    { id: "enableWellness", icon: Heart, label: "Bien-être & Émotions", description: "Soutien émotionnel, gestion du stress et de la fatigue." },
    { id: "enableCommunity", icon: Users, label: "Messages de la Coach", description: "Communications directes et ajustements personnalisés." }
]

export const NotificationSettings = () => {
    const [preferences, setPreferences] = useState<Preferences | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadPreferences()
    }, [])

    const loadPreferences = async () => {
        setLoading(true)
        const data = await getNotificationPreferences()
        if (data) {
            setPreferences({
                enablePhases: data.enablePhases,
                enableFollowup: data.enableFollowup,
                enableLifestyle: data.enableLifestyle,
                enableWellness: data.enableWellness,
                enableCommunity: data.enableCommunity,
                quietHoursEnabled: data.quietHoursEnabled,
                quietHoursStart: data.quietHoursStart || "22:00",
                quietHoursEnd: data.quietHoursEnd || "08:00"
            })
        }
        setLoading(false)
    }

    const handleToggle = async (key: keyof Preferences) => {
        if (!preferences) return
        const newPrefs = { ...preferences, [key]: !preferences[key] }
        setPreferences(newPrefs)

        try {
            await updateNotificationPreferences(newPrefs)
            toast.success("Préférences mises à jour")
        } catch (error) {
            toast.error("Erreur lors de la mise à jour")
        }
    }

    const handleTimeChange = async (field: 'quietHoursStart' | 'quietHoursEnd', val: string) => {
        if (!preferences) return
        const newPrefs = { ...preferences, [field]: val }
        setPreferences(newPrefs)

        try {
            await updateNotificationPreferences(newPrefs)
        } catch (error) { }
    }

    if (loading) return (
        <div className="p-8 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-slate-200 border-t-ikonga-coral rounded-full animate-spin" />
        </div>
    )

    if (!preferences) return null

    return (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex items-center gap-3 bg-slate-50/50">
                <div className="w-10 h-10 rounded-xl bg-ikonga-coral/10 flex items-center justify-center">
                    <Settings2 className="w-5 h-5 text-ikonga-coral" />
                </div>
                <div>
                    <h3 className="text-lg font-serif font-bold text-slate-900">Notifications</h3>
                    <p className="text-xs text-slate-500">Personnalise la manière dont Rosy communique avec toi.</p>
                </div>
            </div>

            <div className="p-6 space-y-6">
                {/* Categories */}
                <div className="space-y-4">
                    {CATEGORIES.map((cat) => (
                        <div key={cat.id} className="flex items-start justify-between gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                            <div className="flex gap-4">
                                <div className="mt-1 w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center shrink-0">
                                    <cat.icon className="w-4 h-4 text-slate-400" />
                                </div>
                                <div>
                                    <Label className="text-sm font-bold text-slate-900 cursor-pointer">{cat.label}</Label>
                                    <p className="text-xs text-slate-500 leading-relaxed max-w-[250px]">{cat.description}</p>
                                </div>
                            </div>
                            <Switch
                                checked={preferences[cat.id as keyof Preferences] as boolean}
                                onCheckedChange={() => handleToggle(cat.id as keyof Preferences)}
                            />
                        </div>
                    ))}
                </div>

                {/* Quiet Hours */}
                <div className="pt-6 border-t border-slate-100">
                    <div className="flex items-center justify-between gap-4 mb-4">
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                                <Moon className="w-4 h-4 text-blue-500" />
                            </div>
                            <div>
                                <Label className="text-sm font-bold text-slate-900">Heures de repos</Label>
                                <p className="text-xs text-slate-500">Rosy restera discrète pendant ces horaires.</p>
                            </div>
                        </div>
                        <Switch
                            checked={preferences.quietHoursEnabled}
                            onCheckedChange={() => handleToggle('quietHoursEnabled')}
                        />
                    </div>

                    <AnimatePresence>
                        {preferences.quietHoursEnabled && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="grid grid-cols-2 gap-4 ml-12 pb-2">
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Début</Label>
                                        <select
                                            value={preferences.quietHoursStart}
                                            onChange={(e) => handleTimeChange('quietHoursStart', e.target.value)}
                                            className="w-full h-10 px-3 rounded-xl border border-slate-100 bg-white text-sm focus:ring-2 focus:ring-ikonga-coral transition-all"
                                        >
                                            {Array.from({ length: 24 }).map((_, i) => {
                                                const h = i < 10 ? `0${i}:00` : `${i}:00`
                                                return <option key={i} value={h}>{h}</option>
                                            })}
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Fin</Label>
                                        <select
                                            value={preferences.quietHoursEnd}
                                            onChange={(e) => handleTimeChange('quietHoursEnd', e.target.value)}
                                            className="w-full h-10 px-3 rounded-xl border border-slate-100 bg-white text-sm focus:ring-2 focus:ring-ikonga-coral transition-all"
                                        >
                                            {Array.from({ length: 24 }).map((_, i) => {
                                                const h = i < 10 ? `0${i}:00` : `${i}:00`
                                                return <option key={i} value={h}>{h}</option>
                                            })}
                                        </select>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <div className="p-4 bg-slate-50/50 text-center">
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    Tes préférences sont enregistrées automatiquement
                </p>
            </div>
        </div>
    )
}
