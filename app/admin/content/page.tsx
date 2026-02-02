import { getAdminContent } from "@/lib/actions/admin-data"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Video, Plus, Utensils, Info } from "lucide-react"
import Link from "next/link"

export default async function AdminContentPage() {
    const { videos, recipes } = await getAdminContent()

    return (
        <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Contenus & Recettes</h1>
                    <p className="text-slate-500 mt-1 text-sm">Gérez la bibliothèque de ressources et la base culinaire.</p>
                </div>
                <div className="flex flex-col xs:flex-row gap-4">
                    <Button asChild variant="outline" className="rounded-2xl font-bold border-slate-200 w-full sm:w-auto">
                        <Link href="/admin/content/new">
                            <Plus className="mr-2" size={18} /> Article
                        </Link>
                    </Button>
                    <Button asChild className="bg-ikonga-gradient rounded-2xl font-bold shadow-lg shadow-pink-500/20 w-full sm:w-auto">
                        <Link href="/admin/content/new">
                            <Plus className="mr-2" size={18} /> Recette
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Videos Section */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                        <Video size={20} className="text-ikonga-coral" />
                        <h2 className="text-xl font-bold text-slate-900">Bibliothèque Multimédia ({videos.length})</h2>
                    </div>
                    {videos.length === 0 ? (
                        <div className="p-12 border-2 border-dashed border-slate-200 rounded-[2rem] text-center bg-slate-50/50">
                            <p className="text-slate-400 text-sm font-medium">Aucun contenu multimédia.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {videos.map(item => (
                                <Card key={item.id} className="border-none shadow-sm rounded-2xl bg-white overflow-hidden">
                                    <div className="flex p-4 items-center gap-4">
                                        <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                                            <Video size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                                            <div className="flex gap-2 mt-1">
                                                <span className="text-[10px] font-black uppercase text-slate-400">{item.category}</span>
                                                <span className="text-[10px] font-black uppercase text-ikonga-coral">• {(item.targetPhases as string[]).join(", ")}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </section>

                {/* Recipes Section */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                        <Utensils size={20} className="text-orange-500" />
                        <h2 className="text-xl font-bold text-slate-900">Base de Recettes ({recipes.length})</h2>
                    </div>
                    {recipes.length === 0 ? (
                        <div className="p-12 border-2 border-dashed border-slate-200 rounded-[2rem] text-center bg-slate-50/50">
                            <p className="text-slate-400 text-sm font-medium">Aucune recette enregistrée.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {recipes.map(recipe => (
                                <Card key={recipe.id} className="border-none shadow-sm rounded-2xl bg-white overflow-hidden">
                                    <div className="flex p-4 items-center gap-4">
                                        <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500">
                                            <Utensils size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-bold text-slate-900">{recipe.title}</h4>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">
                                                {recipe.calories} kcal • P:{recipe.protein}g C:{recipe.carbs}g F:{recipe.fat}g
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    )
}
