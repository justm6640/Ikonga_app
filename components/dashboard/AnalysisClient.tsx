"use client"

import { useState } from "react"
import { AnalysisForm } from "@/components/dashboard/AnalysisForm"
import { Button } from "@/components/ui/button"
import { RefreshCw, Edit } from "lucide-react"
import { AnalysisResult, AnalysisFormData } from "@/lib/validators/analysis"
import { AnalysisWidget } from "@/components/dashboard/AnalysisWidget"

interface AnalysisClientProps {
    initialAnalysis: AnalysisResult | null
    existingFormData?: Partial<AnalysisFormData>
}

export function AnalysisClient({ initialAnalysis, existingFormData }: AnalysisClientProps) {
    const [isEditing, setIsEditing] = useState(!initialAnalysis)

    // If we have an analysis but user wants to edit, we show the form
    // If we don't have analysis, we force show the form (handled by state init)

    if (isEditing) {
        return (
            <AnalysisForm
                existingData={existingFormData}
                onCancel={initialAnalysis ? () => setIsEditing(false) : undefined}
            />
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <Button
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                    className="gap-2 rounded-xl text-slate-600"
                >
                    <Edit size={16} />
                    Mettre à jour mon profil
                </Button>
            </div>

            <AnalysisWidget analysis={initialAnalysis} />
        </div>
    )
}
