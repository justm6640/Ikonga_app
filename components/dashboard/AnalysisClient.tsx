"use client"

import { useState } from "react"
import { AnalysisFormSlides } from "@/components/dashboard/AnalysisFormSlides"
import { Button } from "@/components/ui/button"
import { RefreshCw, Edit } from "lucide-react"
import { AnalysisResult, AnalysisFormData } from "@/lib/validators/analysis"
import { AnalysisWidget } from "@/components/dashboard/AnalysisWidget"

interface AnalysisClientProps {
    initialAnalysis: AnalysisResult | null
    existingFormData?: Partial<AnalysisFormData>
}

export function AnalysisClient({ initialAnalysis, existingFormData }: AnalysisClientProps) {
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(initialAnalysis)
    const [isEditing, setIsEditing] = useState(!initialAnalysis)
    const [lastFormData, setLastFormData] = useState<Partial<AnalysisFormData> | undefined>(undefined)

    // Handle initialAnalysis updates from server (revalidatePath)
    if (initialAnalysis && !analysis) {
        setAnalysis(initialAnalysis)
        if (isEditing && initialAnalysis) setIsEditing(false)
    }

    if (isEditing) {
        return (
            <AnalysisFormSlides
                existingData={lastFormData ?? existingFormData}
                onCancel={analysis ? () => setIsEditing(false) : undefined}
                onComplete={(result, submittedData) => {
                    setAnalysis(result)
                    setLastFormData(submittedData)
                    setIsEditing(false)
                }}
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

            <AnalysisWidget analysis={analysis} />
        </div>
    )
}
