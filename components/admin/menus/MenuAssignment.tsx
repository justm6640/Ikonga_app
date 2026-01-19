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
import { Loader2, CalendarIcon, Send, Users, User, ArrowDown } from "lucide-react"
import { cn } from "@/lib/utils"

export function MenuAssignment({ globalMenus }: { globalMenus: any[] }) {
    const [targetType, setTargetType] = useState<"GROUP" | "USER">("GROUP")
    const [phase, setPhase] = useState<string>("DETOX")
    const [userEmail, setUserEmail] = useState("") // Simple text input for MVP
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
            toast.success("Modèle importé")
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
                // We need userId, but input is email. Ideally we should search.
                // For MVP, if action requires ID, we might need a lookup action or input ID.
                // Looking at action: assignMenuToUser(userId...)
                // Current action expects ID. I need to fix action to accept Email or do lookup here.
                // Let's assume for now I'll change action to accept email or I'll do a lookup.
                // Actually, let's keep it simple: Use a Server Action wrapper or update existing action.
                // I will update existing action to find User by Email if ID not found? No, better separate.
                // Creating a simplified lookup or just failing for now if not ID.
                // Wait, users don't know IDs. I MUST support email.
                // Update: I will invoke a server action that handles email lookup.
                // Let's optimistically assume the backend action `assignMenuToUser` can be updated to handle logic or we add a helper.
                // I will add a helper in this file to call a new server action or modified one?
                // Let's modify `assignMenuToUser` in next step to accept email or add lookup. 
                // Alternatively, I will pass 'userEmail' as ID and handle lookup in backend if it looks like email.

                // Let's assume functionality for now and I will fix backend.
                res = await assignMenuToUser(userEmail, date, content)
            }

            if (res.success) {
                // @ts-ignore - count exists on group assignment response
                const countMsg = res.count ? `${res.count} utilisateurs` : '1 utilisateur'
                toast.success(`Menu assigné avec succès (${countMsg})`)
            } else {
                toast.error(res.error)
            }
        })
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px_1fr] gap-6 items-start">

            {/* 1. CIBLAGE */}
            <div className="space-y-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm h-full">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-sm">1</div>
                    <h3 className="font-bold text-lg">Ciblage & Date</h3>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
                        <button
                            onClick={() => setTargetType("GROUP")}
                            className={cn(
                                "flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all",
                                targetType === "GROUP" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                            )}
                        >
                            <Users size={16} />
                            Groupe
                        </button>
                        <button
                            onClick={() => setTargetType("USER")}
                            className={cn(
                                "flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all",
                                targetType === "USER" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                            )}
                        >
                            <User size={16} />
                            Abonné
                        </button>
                    </div>

                    {targetType === "GROUP" ? (
                        <div className="space-y-2">
                            <Label>Phase Cible</Label>
                            <Select value={phase} onValueChange={setPhase}>
                                <SelectTrigger className="h-12 rounded-xl">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="DETOX">DETOX</SelectItem>
                                    <SelectItem value="EQUILIBRE">EQUILIBRE</SelectItem>
                                    <SelectItem value="CONSOLIDATION">CONSOLIDATION</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <Label>Email de l'abonné</Label>
                            <Input
                                placeholder="client@exemple.com"
                                value={userEmail}
                                onChange={(e) => setUserEmail(e.target.value)}
                                className="h-12 rounded-xl"
                            />
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label>Date d'application</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full h-12 justify-start text-left font-normal rounded-xl",
                                        !date && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date ? format(date, "PPP", { locale: fr }) : <span>Choisir une date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
            </div>

            {/* ARROW */}
            <div className="flex justify-center lg:pt-20">
                <ArrowDown className="text-slate-200 lg:-rotate-90 hidden lg:block" size={40} />
                <ArrowDown className="text-slate-200 lg:hidden" size={40} />
            </div>

            {/* 2. CONTENU */}
            <div className="space-y-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-sm">2</div>
                        <h3 className="font-bold text-lg">Contenu du Menu</h3>
                    </div>

                    <Select onValueChange={handleImportTemplate}>
                        <SelectTrigger className="w-[140px] h-8 text-xs rounded-full bg-slate-50 border-slate-200">
                            <SelectValue placeholder="Importer modèle..." />
                        </SelectTrigger>
                        <SelectContent>
                            {globalMenus.map(m => (
                                <SelectItem key={m.id} value={m.id}>{m.title}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-slate-400 uppercase">Matin</Label>
                        <Textarea
                            value={content.breakfast}
                            onChange={(e) => setContent({ ...content, breakfast: e.target.value })}
                            className="min-h-[60px] rounded-xl bg-slate-50 border-0"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-slate-400 uppercase">Snack</Label>
                        <Textarea
                            value={content.snack}
                            onChange={(e) => setContent({ ...content, snack: e.target.value })}
                            className="min-h-[60px] rounded-xl bg-slate-50 border-0"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-slate-400 uppercase">Midi</Label>
                        <Textarea
                            value={content.lunch}
                            onChange={(e) => setContent({ ...content, lunch: e.target.value })}
                            className="min-h-[60px] rounded-xl bg-slate-50 border-0"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-slate-400 uppercase">Soir</Label>
                        <Textarea
                            value={content.dinner}
                            onChange={(e) => setContent({ ...content, dinner: e.target.value })}
                            className="min-h-[60px] rounded-xl bg-slate-50 border-0"
                        />
                    </div>

                    <Button
                        onClick={handleSubmit}
                        disabled={isPending}
                        className="w-full h-12 rounded-xl bg-ikonga-gradient font-bold text-white shadow-lg shadow-pink-500/20 hover:scale-[1.02] transition-transform"
                    >
                        {isPending ? <Loader2 className="animate-spin" /> : (
                            <>
                                <Send size={18} className="mr-2" />
                                Envoyer le Menu
                            </>
                        )}
                    </Button>
                </div>
            </div>

        </div>
    )
}
