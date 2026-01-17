"use client"

import { useState } from "react"
import { Printer, Download, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

interface ShoppingListViewProps {
    shoppingData: {
        weekNumber: number
        weekStartDate: Date
        categories: Array<{
            category: string
            items: Array<{
                name: string
                quantity: string
            }>
        }>
        totalItems: number
    } | null
    availableWeeks: number
    onWeekChange: (weekNum: number) => void
}

export function ShoppingListView({ shoppingData, availableWeeks, onWeekChange }: ShoppingListViewProps) {
    const [selectedWeek, setSelectedWeek] = useState(shoppingData?.weekNumber || 1)
    const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set())

    // Create default structure if no data
    const displayData = shoppingData || {
        weekNumber: 1,
        weekStartDate: new Date(),
        categories: [],
        totalItems: 0
    }

    const handleWeekChange = (weekNum: number) => {
        setSelectedWeek(weekNum)
        setCheckedItems(new Set()) // Reset checked items
        onWeekChange(weekNum)
    }

    const handleToggleItem = (itemKey: string) => {
        const newChecked = new Set(checkedItems)
        if (newChecked.has(itemKey)) {
            newChecked.delete(itemKey)
        } else {
            newChecked.add(itemKey)
        }
        setCheckedItems(newChecked)
    }

    const handlePrint = () => {
        window.print()
    }

    const handleDownload = () => {
        // Generate text content
        let content = `Liste de courses - Semaine ${selectedWeek}\n\n`

        displayData.categories.forEach(category => {
            content += `${category.category.toUpperCase()}\n`
            category.items.forEach(item => {
                content += `  ☐ ${item.name} - ${item.quantity}\n`
            })
            content += '\n'
        })

        // Create blob and download
        const blob = new Blob([content], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `liste-courses-semaine-${selectedWeek}.txt`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    const checkedCount = checkedItems.size
    const progressPercentage = displayData.totalItems > 0
        ? Math.round((checkedCount / displayData.totalItems) * 100)
        : 0

    return (
        <div className="space-y-6">
            {/* Header with Week Selector and Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <span className="text-sm font-black uppercase tracking-wider text-slate-500">
                        Semaine :
                    </span>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl flex items-center gap-2 cursor-pointer hover:border-slate-300 transition-colors">
                                <span className="text-slate-700 font-bold text-sm">
                                    Semaine {selectedWeek}
                                </span>
                                <ChevronDown size={16} className="text-slate-400" />
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-40">
                            {Array.from({ length: availableWeeks }, (_, i) => i + 1).map((weekNum) => (
                                <DropdownMenuItem
                                    key={weekNum}
                                    onClick={() => handleWeekChange(weekNum)}
                                    className="cursor-pointer font-bold text-sm"
                                >
                                    Semaine {weekNum}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="flex gap-3">
                    <Button
                        onClick={handlePrint}
                        className="h-10 px-6 rounded-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs uppercase tracking-wider"
                    >
                        <Printer size={16} className="mr-2" />
                        Imprimer
                    </Button>
                    <Button
                        onClick={handleDownload}
                        className="h-10 px-6 rounded-full bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg"
                    >
                        <Download size={16} className="mr-2" />
                        Télécharger
                    </Button>
                </div>
            </div>

            {/* Progress Bar */}
            {displayData.totalItems > 0 && (
                <div className="bg-white rounded-2xl border border-slate-100 p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-slate-700">
                            Progression
                        </span>
                        <span className="text-sm font-black text-orange-600">
                            {checkedCount}/{displayData.totalItems} articles
                        </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-500"
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Shopping List */}
            {displayData.categories.length === 0 ? (
                <div className="text-center py-20">
                    <div className="mb-4 text-5xl">🛒</div>
                    <h3 className="text-xl font-serif font-black text-slate-900 mb-2">
                        Aucun article
                    </h3>
                    <p className="text-sm text-slate-500">
                        Aucun menu trouvé pour cette semaine.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {displayData.categories.map((category) => (
                        <div key={category.category} className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-orange-50 to-pink-50 p-4 border-b border-slate-100">
                                <h3 className="text-sm font-black uppercase tracking-widest text-slate-700">
                                    {category.category}
                                </h3>
                            </div>
                            <div className="p-4 space-y-3">
                                {category.items.map((item, idx) => {
                                    const itemKey = `${category.category}-${item.name}-${idx}`
                                    const isChecked = checkedItems.has(itemKey)

                                    return (
                                        <div
                                            key={itemKey}
                                            onClick={() => handleToggleItem(itemKey)}
                                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                                        >
                                            <Checkbox
                                                checked={isChecked}
                                                onCheckedChange={() => handleToggleItem(itemKey)}
                                                className="h-5 w-5"
                                            />
                                            <div className="flex-1">
                                                <span className={`font-bold text-slate-900 ${isChecked ? 'line-through text-slate-400' : ''}`}>
                                                    {item.name}
                                                </span>
                                                <span className={`ml-2 text-sm text-slate-500 ${isChecked ? 'line-through' : ''}`}>
                                                    {item.quantity}
                                                </span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
