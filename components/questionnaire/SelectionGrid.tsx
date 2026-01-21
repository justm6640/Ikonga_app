"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

interface Option {
    id: string
    label: string
    icon?: React.ElementType
}

interface SelectionGridProps {
    options: Option[]
    selected: string[]
    onChange: (selected: string[]) => void
    multi?: boolean
}

export function SelectionGrid({ options, selected, onChange, multi = true }: SelectionGridProps) {
    const handleToggle = (id: string) => {
        if (!multi) {
            onChange([id])
            return
        }

        if (selected.includes(id)) {
            onChange(selected.filter(s => s !== id))
        } else {
            onChange([...selected, id])
        }
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {options.map((option) => {
                const isSelected = selected.includes(option.id)
                const Icon = option.icon

                return (
                    <button
                        key={option.id}
                        type="button"
                        onClick={() => handleToggle(option.id)}
                        className={cn(
                            "flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left",
                            isSelected
                                ? "border-ikonga-pink bg-pink-50 text-ikonga-pink shadow-md"
                                : "border-slate-100 bg-white text-slate-600 hover:border-slate-200 hover:bg-slate-50"
                        )}
                    >
                        <div className={cn(
                            "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
                            isSelected ? "border-ikonga-pink bg-ikonga-pink text-white" : "border-slate-200"
                        )}>
                            {isSelected && <Check size={12} strokeWidth={4} />}
                        </div>
                        {Icon && <Icon size={20} className={cn(isSelected ? "text-ikonga-pink" : "text-slate-400")} />}
                        <span className="font-medium">{option.label}</span>
                    </button>
                )
            })}
        </div>
    )
}
