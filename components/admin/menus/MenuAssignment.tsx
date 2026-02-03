"use client"

import { useState, useTransition } from "react"
import { assignMenuToGroup, assignMenuToUser } from "@/lib/actions/admin-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { toast } from "sonner"
import { Loader2, CalendarIcon, Send, Users, User, ArrowRight, Sparkles, Coffee, Apple, UtensilsCrossed, Moon } from "lucide-react"
import { cn } from "@/lib/utils"

export function MenuAssignment({ globalMenus }: { globalMenus: any[] }) {
    const [targetType, setTargetType] = useState<"GROUP" | "USER">("GROUP")
    const [phase, setPhase] = useState<string>("DETOX")
    const [userEmail, setUserEmail] = useState("")
    const [date, setDate] = useState<Date | undefined>(new Date())

    const [content, setContent] = useState({
        breakfast: "",
        lunch: "",
        snack: "",
        dinner: ""
    })

    const [isPending, startTransition] = useTransition()

    const handleImportTemplate = (menuId: string) => {
        const menu = globalMenus.find(m => m.id === menuId)
        if (menu && menu.content) {
            setContent({
                breakfast: menu.content.breakfast || "",
                lunch: menu.content.lunch || "",
                snack: menu.content.snack || "",
                dinner: menu.content.dinner || ""
            })
            toast.success("✨ Modèle importé avec succès")
        }
    }

    const handleSubmit = () => {
        if (!date) return toast.error("Date requise")
        if (targetType === "USER" && !userEmail) return toast.error("Email requis")

        startTransition(async () => {
            let res;
            if (targetType === "GROUP") {
                res = await assignMenuToGroup(phase as any, date, content)
            } else {
                res = await assignMenuToUser(userEmail, date, content)
            }

            if (res.success) {
                // @ts-ignore
                const countMsg = res.count ? `${res.count} utilisateurs` : '1 utilisateur'
                toast.success(`🎉 Menu assigné avec succès (${countMsg})`)
            } else {
                toast.error(res.error)
            }
        })
    }

    const PHASE_CONFIG: Record<string, { label: string; color: string; emoji: string }> = {
        DETOX: { label: "Détox", color: "from-emerald-500 to-teal-500", emoji: "🍃" },
        EQUILIBRE: { label: "Équilibre", color: "from-orange-500 to-pink-500", emoji: "⚖️" },
        CONSOLIDATION: { label: "Consolidation", color: "from-purple-500 to-indigo-500", emoji: "💪" }
    }

    const MEAL_CONFIG = [
        { key: "breakfast", label: "Petit-déjeuner", icon: Coffee, color: "text-amber-500", bgColor: "from-amber-500/20 to-orange-500/20" },
        { key: "snack", label: "Collation", icon: Apple, color: "text-green-500", bgColor: "from-green-500/20 to-emerald-500/20" },
        { key: "lunch", label: "Déjeuner", icon: UtensilsCrossed, color: "text-orange-500", bgColor: "from-orange-500/20 to-red-500/20" },
        { key: "dinner", label: "Dîner", icon: Moon, color: "text-indigo-500", bgColor: "from-indigo-500/20 to-purple-500/20" }
    ]

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6 items-stretch">

            {/* 1. CIBLAGE - Glass Card */}
            <div className="relative overflow-hidden rounded-[2rem] bg-white/60 backdrop-blur-xl border border-white/50 shadow-2xl shadow-slate-200/50 p-6">
                {/* Decorative gradient blob */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-pink-500/20 to-orange-500/20 rounded-full blur-3xl" />

                <div className="relative space-y-6">
                    {/* Header */}
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center shadow-lg shadow-pink-500/30">
                            <span className="text-white font-black text-lg">1</span>
                        </div>
                        <div>
                            <h3 className="font-serif font-bold text-xl text-slate-900">Ciblage</h3>
                            <p className="text-xs text-slate-400 uppercase tracking-widest font-medium">Groupe ou Abonné</p>
                        </div>
                    </div>

                    {/* Target Type Toggle - Premium Segmented Control */}
                    <div className="p-1.5 bg-gradient-to-r from-slate-100 to-slate-50 rounded-2xl">
                        <div className="grid grid-cols-2 gap-1">
                            <button
                                onClick={() => setTargetType("GROUP")}
                                className={cn(
                                    "flex items-center justify-center gap-2.5 py-3 rounded-xl text-sm font-bold transition-all duration-300",
                                    targetType === "GROUP"
                                        ? "bg-white text-slate-900 shadow-lg shadow-slate-200/50"
                                        : "text-slate-400 hover:text-slate-600"
                                )}
                            >
                                <Users size={18} className={targetType === "GROUP" ? "text-pink-500" : ""} />
                                Par Phase
                            </button>
                            <button
                                onClick={() => setTargetType("USER")}
                                className={cn(
                                    "flex items-center justify-center gap-2.5 py-3 rounded-xl text-sm font-bold transition-all duration-300",
                                    targetType === "USER"
                                        ? "bg-white text-slate-900 shadow-lg shadow-slate-200/50"
                                        : "text-slate-400 hover:text-slate-600"
                                )}
                            >
                                <User size={18} className={targetType === "USER" ? "text-orange-500" : ""} />
                                Individuel
                            </button>
                        </div>
                    </div>

                    {/* Phase or Email Selection */}
                    {targetType === "GROUP" ? (
                        <div className="space-y-3">
                            <Label className="text-xs font-black text-slate-500 uppercase tracking-widest">Phase Cible</Label>
                            <div className="grid grid-cols-1 gap-2">
                                {Object.entries(PHASE_CONFIG).map(([key, config]) => (
                                    <button
                                        key={key}
                                        onClick={() => setPhase(key)}
                                        className={cn(
                                            "flex items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-300",
                                            phase === key
                                                ? `bg-gradient-to-r ${config.color} border-transparent text-white shadow-lg`
                                                : "bg-white/50 border-slate-100 text-slate-600 hover:border-slate-200 hover:bg-white"
                                        )}
                                    >
                                        <span className="text-xl">{config.emoji}</span>
                                        <span className="font-bold">{config.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <Label className="text-xs font-black text-slate-500 uppercase tracking-widest">Email de l'abonné</Label>
                            <Input
                                placeholder="client@exemple.com"
                                value={userEmail}
                                onChange={(e) => setUserEmail(e.target.value)}
                                className="h-14 rounded-2xl bg-white/80 border-slate-100 px-5 text-slate-900 placeholder:text-slate-300 focus-visible:ring-pink-500/20 focus-visible:border-pink-300 transition-all"
                            />
                        </div>
                    )}

                    {/* Date Picker */}
                    <div className="space-y-3">
                        <Label className="text-xs font-black text-slate-500 uppercase tracking-widest">Date d'application</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-full h-14 justify-start text-left font-semibold rounded-2xl bg-white/80 border-slate-100 hover:bg-white hover:border-orange-200 transition-all",
                                        !date && "text-slate-400"
                                    )}
                                >
                                    <CalendarIcon className="mr-3 h-5 w-5 text-orange-500" />
                                    {date ? format(date, "EEEE d MMMM yyyy", { locale: fr }) : "Choisir une date"}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 rounded-2xl shadow-2xl border-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    initialFocus
                                    className="rounded-2xl"
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
            </div>

            {/* ARROW - Animated */}
            <div className="flex items-center justify-center py-4 lg:py-0">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 flex items-center justify-center shadow-lg shadow-pink-500/30 animate-pulse">
                    <ArrowRight className="text-white lg:block hidden" size={24} />
                    <ArrowRight className="text-white lg:hidden rotate-90" size={24} />
                </div>
            </div>

            {/* 2. CONTENU - Glass Card */}
            <div className="relative overflow-hidden rounded-[2rem] bg-white/60 backdrop-blur-xl border border-white/50 shadow-2xl shadow-slate-200/50 p-6">
                {/* Decorative gradient blob */}
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-full blur-3xl" />

                <div className="relative space-y-5">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
                                <span className="text-white font-black text-lg">2</span>
                            </div>
                            <div>
                                <h3 className="font-serif font-bold text-xl text-slate-900">Contenu</h3>
                                <p className="text-xs text-slate-400 uppercase tracking-widest font-medium">Menu du Jour</p>
                            </div>
                        </div>

                        {/* Import Template */}
                        <Select onValueChange={handleImportTemplate}>
                            <SelectTrigger className="w-auto gap-2 h-10 px-4 text-xs font-bold rounded-full bg-gradient-to-r from-slate-100 to-slate-50 border-0 text-slate-600 hover:from-slate-50 hover:to-white transition-all">
                                <Sparkles size={14} className="text-orange-500" />
                                <SelectValue placeholder="Modèle" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                                {globalMenus.map(m => (
                                    <SelectItem key={m.id} value={m.id}>{m.title}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Meal Inputs - Premium Style */}
                    <div className="space-y-3">
                        {MEAL_CONFIG.map((meal) => {
                            const Icon = meal.icon
                            return (
                                <div key={meal.key} className="relative">
                                    <div className={cn(
                                        "absolute inset-0 rounded-2xl bg-gradient-to-r opacity-50",
                                        meal.bgColor
                                    )} />
                                    <div className="relative p-4 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Icon size={16} className={meal.color} />
                                            <Label className="text-xs font-black text-slate-600 uppercase tracking-wider">{meal.label}</Label>
                                        </div>
                                        <Textarea
                                            value={content[meal.key as keyof typeof content]}
                                            onChange={(e) => setContent({ ...content, [meal.key]: e.target.value })}
                                            placeholder={`Entrez le contenu du ${meal.label.toLowerCase()}...`}
                                            className="min-h-[70px] rounded-xl bg-white/90 border-0 shadow-inner placeholder:text-slate-300 focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:ring-pink-500/20 resize-none transition-all"
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Submit Button - Premium CTA */}
                    <Button
                        onClick={handleSubmit}
                        disabled={isPending}
                        className={cn(
                            "w-full h-16 rounded-2xl bg-gradient-to-r from-pink-500 to-orange-500 text-white font-black text-sm uppercase tracking-widest shadow-2xl shadow-pink-500/30",
                            "hover:shadow-pink-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300",
                            "disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                        )}
                    >
                        {isPending ? (
                            <Loader2 className="animate-spin" size={22} />
                        ) : (
                            <>
                                <Send size={18} className="mr-3" />
                                Envoyer le Menu
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    )
}
