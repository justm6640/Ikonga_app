"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Edit2 } from "lucide-react"
import { RecipeEditorModal } from "./RecipeEditorModal"

export function RecipeRowActions({ recipe }: { recipe: any }) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)

    return (
        <>
            <Button
                size="sm"
                variant="outline"
                className="rounded-full border-slate-200 hover:border-ikonga-coral hover:text-ikonga-coral font-bold"
                onClick={() => setIsEditModalOpen(true)}
            >
                <Edit2 size={14} className="mr-2" />
                Éditer
            </Button>

            <RecipeEditorModal
                recipe={recipe}
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
            />
        </>
    )
}
