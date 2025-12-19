import { getAdminMenus } from "@/lib/actions/admin-data"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Utensils, Plus, Calendar } from "lucide-react"
import Link from "next/link"

export default async function AdminMenusPage() {
    const menus = await getAdminMenus()

    return (
        <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Menus Quotidiens</h1>
                    <p className="text-slate-500 mt-1 text-sm">Gérez les plans alimentaires par phase.</p>
                </div>
                <Button asChild className="bg-ikonga-gradient rounded-2xl font-bold shadow-lg shadow-pink-500/20 w-full sm:w-auto">
                    <Link href="/admin/menus/new">
                        <Plus className="mr-2" size={18} /> Nouveau Menu
                    </Link>
                </Button>
            </div>

            {menus.length === 0 ? (
                <Card className="border-dashed border-2 border-slate-200 p-10 md:p-20 text-center rounded-[2.5rem] bg-slate-50/50">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Utensils className="text-slate-300" size={32} />
                    </div>
                    <p className="text-slate-400 font-medium">Aucun menu créé pour le moment.</p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {menus.map((menu) => (
                        <Card key={menu.id} className="border-none shadow-xl shadow-slate-200/50 rounded-[2rem] overflow-hidden bg-white hover:scale-[1.02] transition-transform">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 bg-pink-50 text-ikonga-pink rounded-xl">
                                        <Calendar size={20} />
                                    </div>
                                    <div className="flex gap-1">
                                        {(menu.phaseCompat as string[]).map(phase => (
                                            <span key={phase} className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-1 rounded-md uppercase">
                                                {phase}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <h3 className="font-bold text-slate-900 mb-1">{menu.title}</h3>
                                <p className="text-xs text-slate-500 line-clamp-2 italic mb-4">
                                    {JSON.stringify(menu.content).substring(0, 100)}...
                                </p>
                                <Button variant="outline" size="sm" className="w-full rounded-xl border-slate-100 text-slate-600 font-bold">
                                    Modifier
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
