"use server"

import { getAllRecipes } from "@/lib/actions/admin-nutrition"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ChefHat, Flame, Clock } from "lucide-react"
import { RecipeRowActions } from "@/components/admin/RecipeRowActions"

export default async function AdminRecipesPage({
    searchParams
}: {
    searchParams: { q?: string }
}) {
    const recipes = await getAllRecipes(searchParams.q)

    return (
        <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif font-black text-slate-900 tracking-tighter uppercase">Fiches Recettes AI</h1>
                    <p className="text-slate-500 mt-1">
                        Gérez et ajustez les recettes générées par Rosy.
                    </p>
                </div>
                <Badge variant="outline" className="px-4 py-1 rounded-full border-slate-200">
                    {recipes.length} recettes indexées
                </Badge>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-xl shadow-slate-200/50">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow className="border-none">
                            <TableHead className="py-5 px-6 font-black uppercase text-[10px] tracking-widest text-slate-400">Nom & Phase</TableHead>
                            <TableHead className="py-5 px-6 font-black uppercase text-[10px] tracking-widest text-slate-400">Nutriscore (IA)</TableHead>
                            <TableHead className="py-5 px-6 font-black uppercase text-[10px] tracking-widest text-slate-400">Temps</TableHead>
                            <TableHead className="py-5 px-6 font-black uppercase text-[10px] tracking-widest text-slate-400 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {recipes.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-32 text-center text-slate-500 italic">
                                    Aucune recette trouvée.
                                </TableCell>
                            </TableRow>
                        ) : (
                            recipes.map((recipe) => (
                                <TableRow key={recipe.id} className="group hover:bg-slate-50/50 transition-colors">
                                    <TableCell className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-2xl bg-ikonga-pink/5 flex items-center justify-center text-ikonga-pink group-hover:bg-white group-hover:shadow-sm transition-all">
                                                <ChefHat size={20} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-900">{recipe.name}</span>
                                                <div className="flex gap-2 items-center mt-1">
                                                    <Badge className="bg-ikonga-pink/5 text-ikonga-pink border-none text-[8px] px-2 h-4 uppercase font-black">
                                                        {recipe.phase}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4 px-6">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-1 text-slate-600">
                                                <Flame size={14} className="text-orange-500" />
                                                <span className="text-xs font-bold">{recipe.calories || 0} cal</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-slate-400 text-[10px]">
                                                <span>P: {recipe.protein}g</span>
                                                <span>G: {recipe.carbs}g</span>
                                                <span>L: {recipe.fat}g</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4 px-6">
                                        <div className="flex items-center gap-1 text-slate-500 text-xs font-medium">
                                            <Clock size={14} />
                                            {recipe.prepTime} min
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4 px-6 text-right">
                                        <RecipeRowActions recipe={recipe} />
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
