"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import {
    ShoppingBasket,
    CheckCircle2,
    Copy,
    Carrot,
    Beef,
    Milk,
    Wheat,
    Fish,
    Box,
    ChevronRight,
    Search
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface ShoppingItem {
    name: string
    amount: string
    checked: boolean
}

interface ShoppingCategory {
    name: string
    items: ShoppingItem[]
}

interface ShoppingListViewProps {
    categories: ShoppingCategory[]
    phaseName: string
}

export function ShoppingListView({ categories, phaseName }: ShoppingListViewProps) {
    const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})

    // Initialize/Load checked items from local storage if desired, 
    // but for now let's just use local state as requested "état local"

    const toggleItem = (categoryName: string, itemName: string) => {
        const key = `${categoryName}-${itemName}`
        setCheckedItems(prev => ({
            ...prev,
            [key]: !prev[key]
        }))
    }

    const copyToClipboard = () => {
        const text = categories
            .map(cat => `${cat.name.toUpperCase()}\n${cat.items.map(item => `- ${item.name} (${item.amount})`).join("\n")}`)
            .join("\n\n")
        navigator.clipboard.writeText(text)
        toast.success("Liste copiée !")
    }

    if (categories.length === 0) {
        return (
            <Card className="rounded-[3rem] border-dashed border-slate-200 bg-white/50 p-16 text-center max-w-2xl mx-auto shadow-none">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                    <ShoppingBasket className="text-slate-300" size={48} />
                </div>
                <h2 className="text-2xl font-serif font-black text-slate-800 uppercase tracking-widest mb-4">Votre liste est vide</h2>
                <p className="text-slate-500 mb-10 max-w-sm mx-auto leading-relaxed">
                    Il semble que vous n'ayez pas encore généré de menu pour cette semaine. Commencez par là pour voir vos ingrédients s'afficher ici.
                </p>
                <Button asChild className="rounded-full px-10 py-6 bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest text-[11px] h-auto shadow-xl shadow-slate-200">
                    <Link href="/dashboard">
                        Générer mes menus
                        <ChevronRight size={16} className="ml-2" />
                    </Link>
                </Button>
            </Card>
        )
    }

    const getIcon = (cat: string) => {
        const name = cat.toUpperCase()
        if (name.includes("FRUITS")) return Carrot
        if (name.includes("BOUCHERIE")) return Beef
        if (name.includes("CRÉMERIE")) return Milk
        if (name.includes("ÉPICERIE")) return Wheat
        if (name.includes("POISSON")) return Fish
        return Box
    }

    return (
        <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Premium Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-8 bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 gap-6">
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-ikonga-coral text-white flex items-center justify-center shadow-lg shadow-pink-500/30">
                        <ShoppingBasket size={28} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-serif font-black text-slate-900 tracking-tighter uppercase leading-none">Panier de Courses</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-ikonga-coral animate-pulse" />
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Semaine active • {phaseName}</p>
                        </div>
                    </div>
                </div>

                <Button
                    onClick={copyToClipboard}
                    variant="outline"
                    className="rounded-full px-8 border-slate-200 hover:border-ikonga-coral hover:bg-pink-50 text-slate-600 hover:text-ikonga-coral font-black uppercase tracking-widest text-[10px] h-14 transition-all duration-300 group"
                >
                    <Copy size={16} className="mr-3 group-hover:scale-110 transition-transform" />
                    Copier la liste
                </Button>
            </div>

            {/* Categorized Content */}
            <div className="space-y-6">
                <Accordion type="multiple" defaultValue={categories.map(c => c.name)} className="space-y-6">
                    {categories.map((category) => {
                        const Icon = getIcon(category.name)
                        const items = category.items
                        const checkedCount = items.filter(i => checkedItems[`${category.name}-${i.name}`]).length
                        const isAllChecked = checkedCount === items.length

                        return (
                            <AccordionItem
                                key={category.name}
                                value={category.name}
                                className="border-none bg-white rounded-[3rem] shadow-xl shadow-slate-200/40 overflow-hidden border border-slate-50"
                            >
                                <AccordionTrigger className="px-10 py-8 hover:no-underline group transition-all">
                                    <div className="flex items-center justify-between w-full pr-4">
                                        <div className="flex items-center gap-5">
                                            <div className={cn(
                                                "p-4 rounded-2xl transition-all duration-500",
                                                isAllChecked ? "bg-emerald-50 text-emerald-500" : "bg-slate-50 text-slate-400 group-hover:bg-ikonga-coral/10 group-hover:text-ikonga-coral"
                                            )}>
                                                <Icon size={24} />
                                            </div>
                                            <div className="text-left">
                                                <span className="block text-sm font-black uppercase tracking-widest text-slate-900 leading-none">
                                                    {category.name}
                                                </span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1 block">
                                                    {checkedCount} / {items.length} articles récupérés
                                                </span>
                                            </div>
                                        </div>
                                        {isAllChecked && <CheckCircle2 size={20} className="text-emerald-500 animate-in zoom-in" />}
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="px-10 pb-10">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-3 pt-4">
                                        {items.map((item, idx) => {
                                            const itemKey = `${category.name}-${item.name}`
                                            const isChecked = checkedItems[itemKey]

                                            return (
                                                <div
                                                    key={idx}
                                                    onClick={() => toggleItem(category.name, item.name)}
                                                    className={cn(
                                                        "group flex items-center justify-between p-5 rounded-[2rem] border-2 transition-all duration-300 cursor-pointer",
                                                        isChecked
                                                            ? "bg-slate-50/80 border-transparent opacity-60"
                                                            : "bg-white border-slate-50 hover:border-ikonga-coral/20 hover:shadow-lg hover:shadow-slate-200/50"
                                                    )}
                                                >
                                                    <div className="flex items-center gap-5">
                                                        <Checkbox
                                                            id={itemKey}
                                                            checked={isChecked}
                                                            onCheckedChange={() => toggleItem(category.name, item.name)}
                                                            className="rounded-xl border-slate-200 data-[state=checked]:bg-ikonga-coral data-[state=checked]:border-ikonga-coral w-6 h-6 shadow-sm"
                                                        />
                                                        <div>
                                                            <p className={cn(
                                                                "text-sm font-black transition-all",
                                                                isChecked ? "line-through text-slate-400" : "text-slate-800"
                                                            )}>
                                                                {item.name}
                                                            </p>
                                                            {item.amount && (
                                                                <span className={cn(
                                                                    "text-[10px] uppercase font-bold tracking-widest mt-0.5 block",
                                                                    isChecked ? "text-slate-300" : "text-ikonga-coral"
                                                                )}>
                                                                    {item.amount}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {isChecked && <CheckCircle2 size={16} className="text-emerald-500" />}
                                                </div>
                                            )
                                        })}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        )
                    })}
                </Accordion>
            </div>
        </div>
    )
}
