"use client"

import { useState, useTransition } from "react"
import { SubscriptionTier } from "@prisma/client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { updateSubscriptionTier } from "@/lib/actions/admin-phases"
import { CreditCard, ShieldCheck } from "lucide-react"

interface SubscriptionControlPanelProps {
    user: {
        id: string
        subscriptionTier: SubscriptionTier
    }
}

export function SubscriptionControlPanel({ user }: SubscriptionControlPanelProps) {
    const [isPending, startTransition] = useTransition()
    const [selectedTier, setSelectedTier] = useState<SubscriptionTier>(user.subscriptionTier)

    const handleUpdateTier = async () => {
        startTransition(async () => {
            const result = await updateSubscriptionTier(user.id, selectedTier)
            if (result.success) {
                toast.success("Abonnement mis à jour avec succès")
            } else {
                toast.error(result.error)
            }
        })
    }

    return (
        <Card className="rounded-[2rem] border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-xl font-serif font-bold text-slate-900 flex items-center gap-2">
                            <CreditCard className="text-slate-400" size={20} /> Gestion de l'Abonnement
                        </CardTitle>
                        <CardDescription>
                            Modifiez l'offre commerciale active pour cet utilisateur.
                        </CardDescription>
                    </div>
                    <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                        <ShieldCheck size={12} /> Gestion Admin
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
                <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-slate-700">Sélectionner une nouvelle offre</label>
                        <Select
                            value={selectedTier}
                            onValueChange={(val) => setSelectedTier(val as SubscriptionTier)}
                        >
                            <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-white">
                                <SelectValue placeholder="Choisir un abonnement" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                                <SelectItem value={SubscriptionTier.STANDARD_6}>Standard 6</SelectItem>
                                <SelectItem value={SubscriptionTier.STANDARD_12}>Standard 12</SelectItem>
                                <SelectItem value={SubscriptionTier.STANDARD_24}>Standard 24</SelectItem>
                                <SelectItem value={SubscriptionTier.STANDARD_48}>Standard 48</SelectItem>
                                <SelectItem value={SubscriptionTier.VIP_12}>VIP 12</SelectItem>
                                <SelectItem value={SubscriptionTier.VIP_PLUS_16}>VIP++ 16</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Button
                        onClick={handleUpdateTier}
                        disabled={isPending || selectedTier === user.subscriptionTier}
                        className="w-full bg-ikonga-gradient text-white rounded-xl font-bold h-12 shadow-lg shadow-pink-200 transition-all hover:scale-[1.02] active:scale-95"
                    >
                        Appliquer le changement d'offre
                    </Button>

                    <p className="text-[11px] text-slate-400 font-medium italic text-center">
                        * Le changement d'offre impacte immédiatement les fonctionnalités accessibles par l'utilisateur.
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
