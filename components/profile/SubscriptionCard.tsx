"use client"

import { User } from "@prisma/client"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Crown, Calendar, CheckCircle, Zap } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface SubscriptionCardProps {
    user: User
    currentPhaseLabel: string
}

export function SubscriptionCard({ user, currentPhaseLabel }: SubscriptionCardProps) {
    const isPremium = user.subscriptionTier !== "STANDARD_6" // Adjust logic based on real enum eventually
    const planName = user.subscriptionTier === "VIP_PLUS" ? "Programme VIP+"
        : user.subscriptionTier === "VIP" ? "Programme VIP"
            : "Standard";

    const startDate = user.planStartDate
        ? format(new Date(user.planStartDate), "d MMMM yyyy", { locale: fr })
        : "Non définie";

    return (
        <Card className="bg-slate-50/50 border-slate-100 shadow-sm overflow-hidden relative">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none">
                <Crown size={120} className="text-slate-900 -rotate-12" />
            </div>

            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-xl font-serif flex items-center gap-2">
                            <Crown className="w-5 h-5 text-ikonga-pink" />
                            Ton Abonnement
                        </CardTitle>
                        <CardDescription>Détails de ton accompagnement</CardDescription>
                    </div>
                    <Badge variant={user.isActive ? "default" : "secondary"} className={
                        user.isActive
                            ? "bg-emerald-500 hover:bg-emerald-600 border-none text-white"
                            : "bg-slate-200 text-slate-500"
                    }>
                        {user.isActive ? "Actif" : "Inactif"}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Plan Info */}
                <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500">
                            <Zap size={20} />
                        </div>
                        <div>
                            <p className="font-bold text-slate-900">{planName}</p>
                            <p className="text-xs text-slate-500 font-medium">Offre actuelle</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Start Date */}
                    <div className="p-4 bg-white rounded-xl border border-slate-100 flex flex-col items-start gap-2">
                        <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                            <Calendar size={12} /> Début
                        </div>
                        <p className="font-bold text-slate-700">{startDate}</p>
                    </div>

                    {/* Phase */}
                    <div className="p-4 bg-white rounded-xl border border-slate-100 flex flex-col items-start gap-2">
                        <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                            <CheckCircle size={12} /> Phase
                        </div>
                        <p className="font-bold text-slate-700 truncate w-full" title={currentPhaseLabel}>
                            {currentPhaseLabel}
                        </p>
                    </div>
                </div>

            </CardContent>
        </Card>
    )
}
