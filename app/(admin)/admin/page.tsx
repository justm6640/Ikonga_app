import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Utensils, Video, Activity, ArrowRight } from "lucide-react"
import Link from "next/link"
import prisma from "@/lib/prisma"

export default async function AdminDashboardPage() {
    // Fetch some quick stats
    const [userCount, recipeCount, menuCount] = await Promise.all([
        prisma.user.count(),
        prisma.recipe.count(),
        prisma.menu.count()
    ])

    const stats = [
        { label: "Utilisateurs", value: userCount, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10", href: "/admin/users" },
        { label: "Recettes", value: recipeCount, icon: Utensils, color: "text-orange-500", bg: "bg-orange-500/10", href: "/admin/content" },
        { label: "Menus", value: menuCount, icon: Activity, color: "text-pink-500", bg: "bg-pink-500/10", href: "/admin/menus" },
    ]

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-700">
            <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Admin Dashboard</h1>
                <p className="text-slate-500 font-medium">Gestion globale de la plateforme IKONGA.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat) => (
                    <Card key={stat.label} className="border-none shadow-xl shadow-slate-200/50 rounded-[2rem] overflow-hidden group">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-6">
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400">
                                {stat.label}
                            </CardTitle>
                            <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-110`}>
                                <stat.icon size={20} />
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 pt-0">
                            <div className="text-4xl font-black text-slate-900 mb-4">{stat.value}</div>
                            <Link
                                href={stat.href}
                                className="inline-flex items-center text-xs font-bold text-slate-400 hover:text-ikonga-pink transition-colors gap-2"
                            >
                                Gérer <ArrowRight size={14} />
                            </Link>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2rem] p-8 bg-slate-900 text-white">
                    <h3 className="text-xl font-bold mb-4">Besoin d'aide ?</h3>
                    <p className="text-slate-400 text-sm mb-6">
                        L'interface d'administration vous permet de gérer les utilisateurs, de créer des plans de repas et de mettre à jour le catalogue de vidéos fitness.
                    </p>
                    <div className="flex gap-4">
                        <Link
                            href="/admin/content/new"
                            className="bg-ikonga-gradient px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-pink-500/20"
                        >
                            Ajouter du contenu
                        </Link>
                        <Link
                            href="/admin/menus/new"
                            className="bg-slate-800 px-6 py-3 rounded-2xl font-bold text-sm border border-white/5"
                        >
                            Créer un menu
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    )
}
