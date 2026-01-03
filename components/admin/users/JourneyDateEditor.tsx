"use client"

import { useState } from "react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Calendar, Loader2, Save } from "lucide-react"
import { adminUpdateUserStartDate } from "@/lib/actions/admin-journey"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

interface JourneyDateEditorProps {
    userId: string
    currentStartDate: Date | null
}

export function JourneyDateEditor({ userId, currentStartDate }: JourneyDateEditorProps) {
    const [newDate, setNewDate] = useState(
        currentStartDate ? format(new Date(currentStartDate), "yyyy-MM-dd") : ""
    )
    const [isPending, setIsPending] = useState(false)

    const handleUpdate = async () => {
        if (!newDate) {
            toast.error("Veuillez sélectionner une date")
            return
        }

        setIsPending(true)
        try {
            const result = await adminUpdateUserStartDate(userId, newDate)

            if (result.success) {
                toast.success(result.message)
            } else {
                toast.error(result.message)
            }
        } catch (error) {
            toast.error("Une erreur est survenue")
        } finally {
            setIsPending(false)
        }
    }

    return (
        <Card className="border-amber-200 bg-amber-50/50">
            <CardHeader>
                <CardTitle className="text-xl font-serif flex items-center gap-2">
                    <Calendar className="text-amber-600" size={20} />
                    Pilotage du Parcours
                </CardTitle>
                <CardDescription>
                    Gérer la date de démarrage du programme utilisateur
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Current Date Display */}
                {currentStartDate && (
                    <div className="p-4 bg-white rounded-xl border border-amber-100">
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">
                            Date actuelle
                        </p>
                        <p className="text-2xl font-black text-slate-900">
                            {format(new Date(currentStartDate), "EEEE d MMMM yyyy", { locale: fr })}
                        </p>
                    </div>
                )}

                {/* Date Editor */}
                <div className="space-y-3">
                    <Label htmlFor="start-date" className="text-slate-700 font-medium">
                        Nouvelle date de démarrage
                    </Label>
                    <Input
                        id="start-date"
                        type="date"
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        className="bg-white border-slate-200"
                    />
                </div>

                {/* Action Button */}
                <Button
                    onClick={handleUpdate}
                    disabled={isPending || !newDate}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold"
                >
                    {isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Mise à jour...
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-4 w-4" />
                            Mettre à jour la date
                        </>
                    )}
                </Button>

                {/* Warning */}
                <div className="p-3 bg-amber-100 border border-amber-200 rounded-lg">
                    <p className="text-xs text-amber-800 font-medium">
                        ⚠️ Cette action recalculera automatiquement le plan alimentaire hebdomadaire
                        de l'utilisateur pour correspondre à la nouvelle semaine.
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
