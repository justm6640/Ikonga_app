"use client"

import { useState, useTransition, useMemo } from "react"
import { saveCustomMenu } from "@/lib/actions/nutrition"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { toast } from "sonner"
import { Loader2, CalendarIcon, Check, Copy, Search, Sparkles, ChefHat, Coffee, Sun, Moon, Apple } from "lucide-react"
import { cn } from "@/lib/utils"

interface GlobalMenusViewProps {
    menus: any[]
    currentPhase: string
}

export function GlobalMenusView({ menus, currentPhase }: GlobalMenusViewProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState<"all" | "complete" | "light" | "vegetarian">("all")
    const [selectedPhase, setSelectedPhase] = useState<string>(currentPhase)

    // Filter menus
    const filteredMenus = useMemo(() => {
        return menus.filter(menu => {
            // Phase filter
            if (!menu.phaseCompat.includes(selectedPhase)) return false

            // Search filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase()
                const titleMatch = menu.title.toLowerCase().includes(query)
                const contentMatch = Object.values(menu.content).some((value: any) =>
                    typeof value === 'string' && value.toLowerCase().includes(query)
                )
                if (!titleMatch && !contentMatch) return false
            }

            // Category filter
            if (selectedCategory !== "all") {
                const category = menu.category || "complete"
                if (category !== selectedCategory) return false
            }

            return true
        })
    }, [menus, selectedPhase, searchQuery, selectedCategory])

    const categories = [
        { id: "all", label: "Tous", icon: Sparkles },
        { id: "complete", label: "Complets", icon: ChefHat },
        { id: "light", label: "Légers", icon: Apple },
        { id: "vegetarian", label: "Végétarien", icon: Coffee },
    ]

    return (
        <div className="space-y-6 pb-8">
            {/* Header */}
            <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6 sm:p-8 rounded-[2rem] border border-indigo-100/50 shadow-sm relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/30 rounded-full blur-3xl" />
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-2xl bg-white/80 flex items-center justify-center shadow-sm">
                            <ChefHat size={20} className="text-indigo-600" />
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 uppercase tracking-tighter">
                            Bibliothèque
                        </h2>
                    </div>
                    <p className="text-slate-600 text-sm font-medium">
                        Découvrez des menus types créés pour la phase <Badge className="bg-indigo-600 text-white border-none ml-1">{selectedPhase}</Badge>
                    </p>
                </div>
            </div>

            {/* Search & Filters */}
            <div className="space-y-4">
                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <Input
                        placeholder="Rechercher un menu ou un ingrédient..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-12 h-12 rounded-2xl border-slate-200 focus-visible:ring-indigo-500/20 text-sm font-medium"
                    />
                </div>

                {/* Category Filters */}
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                    {categories.map((cat) => (
                        <Button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id as any)}
                            variant={selectedCategory === cat.id ? "default" : "outline"}
                            className={cn(
                                "rounded-full px-4 sm:px-6 h-10 shrink-0 font-bold text-xs uppercase tracking-wider transition-all",
                                selectedCategory === cat.id
                                    ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200"
                                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                            )}
                        >
                            <cat.icon size={14} className="mr-2" />
                            {cat.label}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between px-2">
                <p className="text-sm text-slate-500 font-medium">
                    {filteredMenus.length} menu{filteredMenus.length > 1 ? 's' : ''} trouvé{filteredMenus.length > 1 ? 's' : ''}
                </p>
            </div>

            {/* Menu Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredMenus.map((menu) => (
                    <MenuTemplateCard key={menu.id} menu={menu} />
                ))}

                {filteredMenus.length === 0 && (
                    <div className="col-span-full py-16 text-center">
                        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                            <ChefHat size={32} className="text-slate-300" />
                        </div>
                        <p className="text-slate-400 font-medium">
                            Aucun menu ne correspond à vos critères
                        </p>
                        <p className="text-slate-300 text-sm mt-1">
                            Essayez de modifier vos filtres
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

function MenuTemplateCard({ menu }: { menu: any }) {
    const [date, setDate] = useState<Date | undefined>(new Date())
    const [isOpen, setIsOpen] = useState(false)
    const [isPending, startTransition] = useTransition()

    const handleApply = () => {
        if (!date) return toast.error("Date requise")

        startTransition(async () => {
            try {
                await saveCustomMenu(date, {
                    breakfast: menu.content.breakfast,
                    snack: menu.content.snack,
                    lunch: menu.content.lunch,
                    dinner: menu.content.dinner,
                    snack_afternoon: menu.content.snack_afternoon || ""
                })
                toast.success("Menu appliqué avec succès ✨")
                setIsOpen(false)
            } catch (e) {
                toast.error("Erreur lors de l'application")
            }
        })
    }

    const mealIcons = {
        breakfast: Coffee,
        lunch: Sun,
        snack: Apple,
        dinner: Moon
    }

    return (
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group">
            {/* Header */}
            <div className="bg-gradient-to-br from-slate-50 to-white p-5 border-b border-slate-100">
                <div className="flex justify-between items-start mb-3">
                    <Badge className="bg-indigo-50 text-indigo-600 border-none text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {menu.phaseCompat.join(', ')}
                    </Badge>
                    {menu.category && (
                        <Badge variant="outline" className="border-slate-200 text-slate-500 text-[9px] font-bold px-2 py-0.5 rounded-full">
                            {menu.category}
                        </Badge>
                    )}
                </div>
                <h3 className="font-serif font-black text-slate-900 text-lg leading-tight line-clamp-2 group-hover:text-indigo-600 transition-colors">
                    {menu.title}
                </h3>
            </div>

            {/* Meals Preview */}
            <div className="p-5 space-y-3">
                {Object.entries(mealIcons).map(([key, Icon]) => {
                    const content = menu.content[key]
                    if (!content) return null

                    const labels = {
                        breakfast: "Petit-déj",
                        lunch: "Déjeuner",
                        snack: "Collation",
                        dinner: "Dîner"
                    }

                    return (
                        <div key={key} className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-indigo-50 transition-colors">
                                <Icon size={14} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <span className="font-black text-slate-400 block text-[9px] uppercase tracking-wider mb-0.5">
                                    {labels[key as keyof typeof labels]}
                                </span>
                                <span className="text-slate-600 text-xs line-clamp-1 font-medium">
                                    {content}
                                </span>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Action Button */}
            <div className="p-5 pt-0">
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button className="w-full rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-sm h-11 shadow-lg shadow-indigo-200/50 group/btn">
                            <Copy size={14} className="mr-2 group-hover/btn:scale-110 transition-transform" />
                            Utiliser ce menu
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:rounded-[2rem] border-none shadow-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-serif font-black">Appliquer le menu</DialogTitle>
                            <DialogDescription className="text-slate-500 font-medium">
                                Choisissez la date à laquelle vous souhaitez appliquer "{menu.title}".
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Date d'application</label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full justify-start text-left font-medium rounded-2xl h-12 border-slate-200",
                                                !date && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {date ? format(date, "PPP", { locale: fr }) : <span>Choisir une date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0 rounded-2xl">
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            onSelect={setDate}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <Button
                                onClick={handleApply}
                                disabled={isPending}
                                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-2xl h-12 shadow-lg"
                            >
                                {isPending ? <Loader2 className="animate-spin" /> : "Valider et Appliquer"}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}
