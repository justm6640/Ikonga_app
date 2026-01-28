import { getUsers } from "@/lib/actions/admin-users"
import { UsersTable } from "@/components/admin/UsersTable"
import { Input } from "@/components/ui/input"
import { Search, UserPlus } from "lucide-react"

interface AdminUsersPageProps {
    searchParams: Promise<{
        q?: string
    }>
}

export default async function AdminUsersPage({ searchParams }: AdminUsersPageProps) {
    const resolvedSearchParams = await searchParams
    const query = resolvedSearchParams.q || ""
    const users = await getUsers(query)

    return (
        <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Utilisateurs</h1>
                    <p className="text-slate-500 mt-1">Gérez les comptes clients et les accès administrateur.</p>
                </div>

                {/* Stats or Action could go here */}
                <div className="bg-white px-4 py-2 rounded-xl border shadow-sm flex items-center gap-4">
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-bold text-slate-400 leading-none">Total</span>
                        <span className="text-xl font-bold text-slate-900">{users.length}</span>
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="flex items-center gap-4">
                <form className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <Input
                        name="q"
                        defaultValue={query}
                        placeholder="Rechercher par email ou prénom..."
                        className="pl-10 h-11 rounded-xl bg-white border-slate-200 focus:ring-ikonga-pink focus:border-ikonga-pink"
                    />
                </form>
            </div>

            {/* Table */}
            <UsersTable users={users} />
        </div>
    )
}
