"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Copy, Printer, ShoppingBasket, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface ShoppingListViewProps {
    initialIngredients: string[]
    phaseName: string
}

export function ShoppingListView({ initialIngredients, phaseName }: ShoppingListViewProps) {
    const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})

    const toggleItem = (item: string) => {
        setCheckedItems(prev => ({
            ...prev,
            [item]: !prev[item]
        }))
    }

    const copyToClipboard = () => {
        const text = initialIngredients.join("\n")
        navigator.clipboard.writeText(text)
        toast.success("Liste copiée dans le presse-papier !")
    }

    const handlePrint = () => {
        window.print()
    }

    if (initialIngredients.length === 0) {
        return (
            <Card className="rounded-[2.5rem] border-dashed border-slate-200 bg-white/50 p-12 text-center">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShoppingBasket className="text-slate-300" size={40} />
                </div>
                <h2 className="text-xl font-serif font-bold text-slate-400 uppercase tracking-widest">Liste vide</h2>
                <p className="text-slate-400 mt-2 max-w-xs mx-auto">
                    Aucune recette n'est disponible pour générer votre liste de courses pour le moment.
                </p>
            </Card>
        )
    }

    return (
        <div className="space-y-6 print:space-y-0 print:p-0">
            {/* Action Bar (Hidden on print) */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white/80 backdrop-blur-md rounded-[2rem] border border-white shadow-xl shadow-slate-200/50 print:hidden">
                <div className="flex items-center gap-3 ml-2">
                    <div className="w-10 h-10 rounded-full bg-ikonga-pink/10 flex items-center justify-center text-ikonga-pink">
                        <ShoppingBasket size={20} />
                    </div>
                    <div>
                        <h2 className="text-sm font-black uppercase tracking-tighter text-slate-800">Ma Liste</h2>
                        <p className="text-[10px] font-bold text-ikonga-pink uppercase tracking-widest">{phaseName}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={copyToClipboard}
                        className="rounded-xl border-slate-200 hover:bg-slate-50 gap-2"
                    >
                        <Copy size={16} />
                        Copier
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePrint}
                        className="rounded-xl border-slate-200 hover:bg-slate-50 gap-2"
                    >
                        <Printer size={16} />
                        Imprimer
                    </Button>
                </div>
            </div>

            {/* List Content */}
            <Card className="rounded-[2.5rem] border-none bg-white shadow-2xl shadow-slate-200/40 overflow-hidden print:shadow-none print:border-none">
                <CardHeader className="p-8 pb-4">
                    <CardTitle className="text-3xl font-serif font-bold text-slate-900 tracking-tight flex items-center gap-4">
                        Shopping List
                        <Badge variant="secondary" className="bg-slate-100 text-slate-500 font-bold border-none">
                            {initialIngredients.length} articles
                        </Badge>
                    </CardTitle>
                    <CardDescription className="text-slate-500 text-base">
                        Tous les ingrédients nécessaires pour vos recettes de la phase {phaseName}.
                    </CardDescription>
                </CardHeader>

                <CardContent className="p-8 pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1">
                        {initialIngredients.map((item, index) => (
                            <div
                                key={index}
                                className={cn(
                                    "flex items-center gap-4 py-4 border-b border-slate-50 last:border-0 group transition-all duration-300",
                                    checkedItems[item] && "opacity-50"
                                )}
                            >
                                <div className="relative flex items-center justify-center">
                                    <Checkbox
                                        id={`item-${index}`}
                                        checked={!!checkedItems[item]}
                                        onCheckedChange={() => toggleItem(item)}
                                        className="h-6 w-6 rounded-lg border-2 border-slate-200 data-[state=checked]:bg-ikonga-pink data-[state=checked]:border-ikonga-pink transition-all"
                                    />
                                </div>
                                <label
                                    htmlFor={`item-${index}`}
                                    className={cn(
                                        "text-base font-medium cursor-pointer transition-all flex-1",
                                        checkedItems[item] ? "line-through text-slate-400" : "text-slate-700 group-hover:text-slate-950"
                                    )}
                                >
                                    {item}
                                </label>
                                {checkedItems[item] && (
                                    <CheckCircle2 size={16} className="text-emerald-500" />
                                )}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Print styles */}
            <style jsx global>{`
                @media print {
                    @page { margin: 2cm; }
                    body { background: white !important; }
                    .print\\:hidden { display: none !important; }
                    .print\\:shadow-none { shadow: none !important; box-shadow: none !important; }
                    .print\\:p-0 { padding: 0 !important; }
                }
            `}</style>
        </div>
    )
}

function Badge({ children, className, variant = "default" }: any) {
    return (
        <span className={cn(
            "px-2.5 py-0.5 rounded-full text-xs font-semibold",
            variant === "secondary" ? "bg-secondary text-secondary-foreground" : "bg-primary text-primary-foreground",
            className
        )}>
            {children}
        </span>
    )
}
