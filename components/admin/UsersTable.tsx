"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Shield, Trash2, UserPlus, UserMinus } from "lucide-react"
import { toggleUserRole, deleteUser } from "@/lib/actions/admin-users"
import { toast } from "sonner"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface UsersTableProps {
    users: any[]
}

export function UsersTable({ users }: UsersTableProps) {
    const handleToggleRole = async (userId: string, currentRole: string) => {
        const confirmMsg = currentRole === 'ADMIN'
            ? "Rétrograder cet utilisateur en simple USER ?"
            : "Promouvoir cet utilisateur au rang d'ADMIN ?"

        if (!confirm(confirmMsg)) return

        const res = await toggleUserRole(userId, currentRole)
        if (res.success) {
            toast.success("Rôle mis à jour")
        } else {
            toast.error(res.error)
        }
    }

    const handleDelete = async (userId: string) => {
        if (!confirm("Supprimer cet utilisateur DEFINITIVEMENT ? Cette action est irréversible.")) return

        const res = await deleteUser(userId)
        if (res.success) {
            toast.success("Utilisateur supprimé")
        } else {
            toast.error(res.error)
        }
    }

    const getSubscriptionBadge = (tier: string) => {
        switch (tier) {
            case 'VIP_PLUS':
                return <Badge className="bg-amber-500 hover:bg-amber-600">VIP +</Badge>
            case 'VIP':
                return <Badge className="bg-blue-500 hover:bg-blue-600">VIP</Badge>
            default:
                return <Badge variant="secondary">Standard</Badge>
        }
    }

    return (
        <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
            <Table>
                <TableHeader className="bg-slate-50">
                    <TableRow>
                        <TableHead>Identité</TableHead>
                        <TableHead>Phase</TableHead>
                        <TableHead>Abonnement</TableHead>
                        <TableHead>Rôle</TableHead>
                        <TableHead>Inscription</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                                Aucun utilisateur trouvé.
                            </TableCell>
                        </TableRow>
                    ) : (
                        users.map((user) => {
                            const initials = `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() || "?"
                            const activePhase = user.phases?.[0]?.type || "Aucune"

                            return (
                                <TableRow key={user.id} className="hover:bg-slate-50/50 transition-colors">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9">
                                                <AvatarFallback className="bg-slate-100 text-slate-600 text-xs font-bold">
                                                    {initials}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="font-medium text-slate-900 leading-none mb-1">
                                                    {user.firstName} {user.lastName}
                                                </span>
                                                <span className="text-xs text-slate-500">{user.email}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="font-medium uppercase tracking-wider text-[10px]">
                                            {activePhase}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {getSubscriptionBadge(user.subscriptionTier)}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            className={user.role === 'ADMIN'
                                                ? "bg-rose-500/10 text-rose-600 hover:bg-rose-500/10 border-rose-200"
                                                : "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10 border-emerald-200"
                                            }
                                        >
                                            {user.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-slate-500 text-sm">
                                        {format(new Date(user.createdAt), "dd MMM yyyy", { locale: fr })}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                                                    <MoreHorizontal size={18} />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-56 rounded-xl">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={() => handleToggleRole(user.id, user.role)}
                                                    className="flex items-center gap-2 cursor-pointer"
                                                >
                                                    {user.role === 'ADMIN' ? <UserMinus size={16} /> : <UserPlus size={16} />}
                                                    {user.role === 'ADMIN' ? "Rétrograder en User" : "Promouvoir Admin"}
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={() => handleDelete(user.id)}
                                                    className="flex items-center gap-2 text-rose-600 focus:text-rose-600 focus:bg-rose-50 cursor-pointer"
                                                >
                                                    <Trash2 size={16} />
                                                    Supprimer l'utilisateur
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            )
                        })
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
