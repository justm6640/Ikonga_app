"use client"

import { ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

interface NutritionHeaderProps {
    subscriptionTier: string
    phase: string
    showTitle?: boolean
}

export function NutritionHeader({ subscriptionTier, phase, showTitle = true }: NutritionHeaderProps) {
    const router = useRouter()

    return (
        <div className="space-y-6">
            {showTitle && (
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors"
                    >
                        <ArrowLeft size={18} className="text-slate-600" />
                    </button>
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-serif font-black text-slate-900 tracking-tight leading-none uppercase">
                            IKONUTRITION
                        </h1>
                        <p className="text-xs text-slate-500 font-medium">
                            Menus, recettes et courses adaptés.
                        </p>
                    </div>
                </div>
            )}

            <div className="flex gap-2">
                <Badge className="bg-orange-50 text-orange-600 border-none px-3 py-1 rounded-md font-bold text-[10px] uppercase tracking-wider">
                    {subscriptionTier}
                </Badge>
                <Badge className="bg-orange-500 text-white border-none px-3 py-1 rounded-md font-bold text-[10px] uppercase tracking-wider">
                    PHASE {phase}
                </Badge>
            </div>
        </div>
    )
}
