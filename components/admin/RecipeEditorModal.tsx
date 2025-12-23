"use client"

import { useState, useTransition } from "react"
import { updateRecipe } from "@/lib/actions/admin-nutrition"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, Loader2, Save } from "lucide-react"
import { toast } from "sonner"

interface RecipeEditorModalProps {
    isOpen: boolean
    onClose: () => void
    recipe: any
}

export function RecipeEditorModal({ isOpen, onClose, recipe }: RecipeEditorModalProps) {
    const [isPending, startTransition] = useTransition()
    const [formData, setFormData] = useState({
        name: recipe.name,
        phase: recipe.phase,
        calories: recipe.calories || 0,
        protein: recipe.protein || 0,
        carbs: recipe.carbs || 0,
        fat: recipe.fat || 0,
        prepTime: recipe.prepTime || 15,
        ingredients: Array.isArray(recipe.ingredients) ? [...recipe.ingredients] : [],
        instructions: Array.isArray(recipe.instructions) ? [...recipe.instructions] : [],
    })

    const addIngredient = () => setFormData({ ...formData, ingredients: [...formData.ingredients, ""] })
    const removeIngredient = (index: number) => {
        const newIngs = formData.ingredients.filter((_, i) => i !== index)
        setFormData({ ...formData, ingredients: newIngs })
    }
    const updateIngredient = (index: number, val: string) => {
        const newIngs = [...formData.ingredients]
        newIngs[index] = val
        setFormData({ ...formData, ingredients: newIngs })
    }

    const addInstruction = () => setFormData({ ...formData, instructions: [...formData.instructions, ""] })
    const removeInstruction = (index: number) => {
        const newInst = formData.instructions.filter((_, i) => i !== index)
        setFormData({ ...formData, instructions: newInst })
    }
    const updateInstruction = (index: number, val: string) => {
        const newInst = [...formData.instructions]
        newInst[index] = val
        setFormData({ ...formData, instructions: newInst })
    }

    const handleSave = () => {
        startTransition(async () => {
            try {
                await updateRecipe(recipe.id, formData)
                toast.success("Recette mise à jour !")
                onClose()
            } catch (error) {
                toast.error("Erreur lors de la sauvegarde")
            }
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto border-none rounded-[2.5rem] bg-white p-8">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-serif font-black text-slate-900 uppercase tracking-tighter">
                        Éditer la Recette
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-8 mt-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase text-slate-400">Nom du Plat</Label>
                            <Input
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="rounded-2xl border-slate-100 bg-slate-50"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase text-slate-400">Phase</Label>
                            <Input
                                value={formData.phase}
                                onChange={(e) => setFormData({ ...formData, phase: e.target.value })}
                                className="rounded-2xl border-slate-100 bg-slate-50"
                            />
                        </div>
                    </div>

                    {/* Macros */}
                    <div className="grid grid-cols-5 gap-3">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase text-slate-400">Cal</Label>
                            <Input type="number" value={formData.calories} onChange={(e) => setFormData({ ...formData, calories: parseInt(e.target.value) })} />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase text-slate-400">Prot</Label>
                            <Input type="number" value={formData.protein} onChange={(e) => setFormData({ ...formData, protein: parseInt(e.target.value) })} />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase text-slate-400">Gluc</Label>
                            <Input type="number" value={formData.carbs} onChange={(e) => setFormData({ ...formData, carbs: parseInt(e.target.value) })} />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase text-slate-400">Lip</Label>
                            <Input type="number" value={formData.fat} onChange={(e) => setFormData({ ...formData, fat: parseInt(e.target.value) })} />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase text-slate-400">Temps</Label>
                            <Input type="number" value={formData.prepTime} onChange={(e) => setFormData({ ...formData, prepTime: parseInt(e.target.value) })} />
                        </div>
                    </div>

                    {/* Ingredients */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-serif font-bold text-slate-900">Ingrédients</h3>
                            <Button size="sm" onClick={addIngredient} className="rounded-full bg-slate-900">
                                <Plus size={14} className="mr-2" /> Ajouter
                            </Button>
                        </div>
                        <div className="space-y-2">
                            {formData.ingredients.map((ing, i) => (
                                <div key={i} className="flex gap-2">
                                    <Input value={ing} onChange={(e) => updateIngredient(i, e.target.value)} className="flex-1 rounded-xl" />
                                    <Button size="icon" variant="ghost" onClick={() => removeIngredient(i)} className="text-rose-500">
                                        <Trash2 size={16} />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Instructions */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-serif font-bold text-slate-900">Préparation</h3>
                            <Button size="sm" onClick={addInstruction} className="rounded-full bg-slate-900">
                                <Plus size={14} className="mr-2" /> Ajouter
                            </Button>
                        </div>
                        <div className="space-y-2">
                            {formData.instructions.map((inst, i) => (
                                <div key={i} className="flex gap-2">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold pt-1">{i + 1}</div>
                                    <Input value={inst} onChange={(e) => updateInstruction(i, e.target.value)} className="flex-1 rounded-xl" />
                                    <Button size="icon" variant="ghost" onClick={() => removeInstruction(i)} className="text-rose-500">
                                        <Trash2 size={16} />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-6 flex justify-end gap-3">
                        <Button variant="ghost" onClick={onClose} className="rounded-full">Annuler</Button>
                        <Button onClick={handleSave} disabled={isPending} className="rounded-full bg-ikonga-pink hover:bg-ikonga-pink/90 text-white px-8">
                            {isPending ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />}
                            Sauvegarder
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
