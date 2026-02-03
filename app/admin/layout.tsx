import { checkAdminAccess } from "@/lib/actions/admin"
import { Users, BarChart2, BookOpen, Settings, Shield, Sparkles } from "lucide-react"
import Link from "next/link"

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    await checkAdminAccess() // Security: protect entire route group

    return (
        <div className="flex h-screen bg-slate-50">
            {/* Admin Sidebar */}
            <aside className="w-64 bg-slate-900 text-white flex-shrink-0 hidden md:flex flex-col">
                <div className="p-6 border-b border-slate-800 flex items-center gap-3">
                    <Shield className="text-amber-400" />
                    <div>
                        <h1 className="font-serif font-bold text-lg">IKONGA</h1>
                        <p className="text-xs text-slate-400 uppercase tracking-wider">Admin Space</p>
                    </div>
                </div>

                <nav className="p-4 space-y-2 flex-1">
                    <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800 text-white font-medium hover:bg-slate-700 transition-colors">
                        <BarChart2 size={20} className="text-amber-400" />
                        Dashboard
                    </Link>
                    <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
                        <Users size={20} />
                        Abonnés
                    </Link>
                    <Link href="/admin/content" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
                        <BookOpen size={20} />
                        Contenus
                    </Link>
                    <Link href="/admin/beauty" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
                        <Sparkles size={20} className="text-amber-400" />
                        Beauté
                    </Link>
                    <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
                        <Settings size={20} />
                        Paramètres
                    </Link>
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <Link href="/dashboard" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
                        Retour App Abonné
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto p-4 md:p-8">
                {children}
            </main>
        </div>
    )
}
