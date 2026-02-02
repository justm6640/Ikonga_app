"use client"

import { useState, useTransition } from "react"
import { PhaseType } from "@prisma/client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { toggleManualMode, forcePhase } from "@/lib/actions/admin-phases"
import { Lock, Unlock, RefreshCw, Save } from "lucide-react"

interface PhaseControlPanelProps {
    user: {
        id: string
        firstName: string | null
        lastName: string | null
        isPhaseManual: boolean
        manualPhaseReason: string | null
        phases: { type: PhaseType }[]
    }
}

export function PhaseControlPanel({ user }: PhaseControlPanelProps) {
    const [isPending, startTransition] = useTransition()
    const [isManual, setIsManual] = useState(user.isPhaseManual)
    const [reason, setReason] = useState(user.manualPhaseReason || "")
    const [selectedPhase, setSelectedPhase] = useState<PhaseType>(user.phases[0]?.type || PhaseType.DETOX)

    const currentPhase = user.phases[0]?.type || "N/A"

    const handleSaveManualSettings = async () => {
        startTransition(async () => {
            const result = await toggleManualMode(user.id, isManual, reason)
            if (result.success) {
                toast.success("Paramètres manuels mis à jour")
            } else {
                toast.error(result.error)
            }
        })
    }

    const handleForcePhase = async () => {
        startTransition(async () => {
            const result = await forcePhase(user.id, selectedPhase)
            if (result.success) {
                toast.success(`Utilisateur forcé en phase ${selectedPhase}`)
                setIsManual(true) // forcePhase automatically enables manual mode
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
                            <Lock className="text-slate-400" size={20} /> Contrôle des Phases
                        </CardTitle>
                        <CardDescription>
                            Gérez manuellement l'évolution du programme de {user.firstName || "l'utilisateur"}.
                        </CardDescription>
                    </div>
                    {isManual ? (
                        <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                            <Lock size={12} /> Mode Manuel Actif
                        </div>
                    ) : (
                        <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                            <RefreshCw size={12} /> Automatique
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
                {/* Manual Mode Toggle */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="space-y-0.5">
                        <Label className="text-sm font-bold text-slate-900">Activer le Mode Manuel</Label>
                        <p className="text-xs text-slate-500">Bloque l'évolution automatique par le Cron Job.</p>
                    </div>
                    <Switch
                        checked={isManual}
                        onCheckedChange={setIsManual}
                    />
                </div>

                {/* Reason Field */}
                {isManual && (
                    <div className="space-y-3">
                        <Label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            Raison du forçage
                        </Label>
                        <Textarea
                            placeholder="Ex: Arrêt maladie, Prolongation de phase, Écart pendant les fêtes..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="rounded-2xl border-slate-200 focus:ring-ikonga-coral focus:border-ikonga-coral min-h-[100px]"
                        />
                        <Button
                            onClick={handleSaveManualSettings}
                            disabled={isPending}
                            className="w-full bg-slate-900 text-white rounded-xl font-bold gap-2"
                        >
                            <Save size={18} /> Sauvegarder le mode
                        </Button>
                    </div>
                )}

                <div className="pt-4 border-t border-slate-100">
                    <h4 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Changement Direct de Phase</h4>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <Select
                                value={selectedPhase}
                                onValueChange={(val) => setSelectedPhase(val as PhaseType)}
                            >
                                <SelectTrigger className="h-12 rounded-xl border-slate-200">
                                    <SelectValue placeholder="Choisir une phase" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                                    <SelectItem value={PhaseType.DETOX}>DÉTOX</SelectItem>
                                    <SelectItem value={PhaseType.EQUILIBRE}>ÉQUILIBRE</SelectItem>
                                    <SelectItem value={PhaseType.CONSOLIDATION}>CONSOLIDATION</SelectItem>
                                    <SelectItem value={PhaseType.ENTRETIEN}>ENTRETIEN</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button
                            onClick={handleForcePhase}
                            disabled={isPending}
                            variant="destructive"
                            className="rounded-xl px-8 h-12 font-black uppercase tracking-widest text-[10px] gap-2"
                        >
                            <RefreshCw size={16} /> Forcer la phase
                        </Button>
                    </div>
                    <p className="mt-4 text-[11px] text-slate-400 font-medium italic">
                        * Le forçage d'une phase active automatiquement le mode manuel.
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
