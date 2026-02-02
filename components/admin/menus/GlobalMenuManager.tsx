"use client"

import { useState, useTransition } from "react"
import { createDailyMenu, deleteMenu, getGlobalMenus } from "@/lib/actions/admin-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { Loader2, Plus, Trash2, Edit2 } from "lucide-react"

export function GlobalMenuManager({ initialMenus }: { initialMenus: any[] }) {
    const [menus, setMenus] = useState(initialMenus)
    const [isPending, startTransition] = useTransition()
    const [isOpen, setIsOpen] = useState(false)

    const handleDelete = async (id: string) => {
        if (!confirm("Supprimer ce modèle ?")) return
        startTransition(async () => {
            const res = await deleteMenu(id)
            if (res.success) {
                toast.success("Modèle supprimé")
                setMenus(menus.filter(m => m.id !== id))
            } else {
                toast.error(res.error)
            }
        })
    }

    // Refresh function for after create
    const refreshMenus = async () => {
        const newMenus = await getGlobalMenus()
        setMenus(newMenus)
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                <div>
                    <h2 className="text-xl font-serif font-black text-slate-900">Bibliothèque de Modèles</h2>
                    <p className="text-sm text-slate-500">Gérez les menus types utilisables par tous.</p>
                </div>
                <CreateMenuDialog
                    onSuccess={() => { refreshMenus(); setIsOpen(false); }}
                    open={isOpen}
                    onOpenChange={setIsOpen}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menus.map((menu) => (
                    <div key={menu.id} className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-all">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {(menu.phaseCompat as string[]).map(p => (
                                        <span key={p} className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">
                                            {p}
                                        </span>
                                    ))}
                                </div>
                                <h3 className="font-bold text-slate-900 line-clamp-1">{menu.title}</h3>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(menu.id)}
                                className="text-slate-400 hover:text-red-500 -mt-2 -mr-2"
                            >
                                <Trash2 size={16} />
                            </Button>
                        </div>

                        <div className="space-y-2 flex-1">
                            <MenuPreviewLine label="Matin" content={menu.content?.breakfast} />
                            <MenuPreviewLine label="Midi" content={menu.content?.lunch} />
                            <MenuPreviewLine label="Soir" content={menu.content?.dinner} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

function MenuPreviewLine({ label, content }: { label: string, content: string }) {
    if (!content) return null
    return (
        <div className="flex gap-2 text-xs">
            <span className="font-bold text-slate-400 w-10 shrink-0">{label}</span>
            <span className="text-slate-600 truncate">{content}</span>
        </div>
    )
}

function CreateMenuDialog({ onSuccess, open, onOpenChange }: { onSuccess: () => void, open: boolean, onOpenChange: (Open: boolean) => void }) {
    const [isSubmitting, setIsSubmitting] = useState(false)

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true)
        try {
            // Mock state for server action call if needed, or direct call
            // Using direct action call wrapper for simplicity in client component
            const res = await createDailyMenu({}, formData)
            if (res.error) {
                toast.error(res.error)
            } else {
                toast.success("Menu créé avec succès")
                onSuccess()
            }
        } catch (e) {
            toast.error("Erreur inconnue")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button className="rounded-full bg-slate-900 text-white font-bold px-6">
                    <Plus size={16} className="mr-2" />
                    Nouveau Modèle
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="font-serif font-black text-2xl">Nouveau Menu Type</DialogTitle>
                </DialogHeader>
                <form action={handleSubmit} className="space-y-6 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Titre du menu</Label>
                            <Input name="title" placeholder="Ex: Detox Semaine 1 - Lundi" required className="rounded-xl" />
                        </div>
                        <div className="space-y-2">
                            <Label>Phase Compatible</Label>
                            <Select name="phaseCompat" defaultValue="DETOX" required>
                                <SelectTrigger className="rounded-xl">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="DETOX">DETOX</SelectItem>
                                    <SelectItem value="EQUILIBRE">EQUILIBRE</SelectItem>
                                    <SelectItem value="CONSOLIDATION">CONSOLIDATION</SelectItem>
                                </SelectContent>
                            </Select>
                            {/* Note: Ideally multi-select, simplifying to single select for MVP dialog input or handling via hidden logic */}
                            <input type="hidden" name="phaseCompat" value="DETOX" />
                        </div>
                    </div>

                    <div className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Contenu du menu</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs">Petit-déjeuner</Label>
                                <Textarea name="breakfast" required className="rounded-xl min-h-[80px]" placeholder="Recette ou description..." />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs">Snack Matin</Label>
                                <Textarea name="snack" required className="rounded-xl min-h-[80px]" placeholder="..." />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs">Déjeuner</Label>
                                <Textarea name="lunch" required className="rounded-xl min-h-[80px]" placeholder="..." />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs">Dîner</Label>
                                <Textarea name="dinner" required className="rounded-xl min-h-[80px]" placeholder="..." />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Annuler</Button>
                        <Button type="submit" disabled={isSubmitting} className="bg-ikonga-coral text-white hover:bg-pink-600 rounded-full px-8">
                            {isSubmitting && <Loader2 className="animate-spin mr-2" />}
                            Créer le menu
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
