"use client"

import { useState } from "react"
import {
    Search,
    Filter,
    MoreVertical,
    ArrowUpRight,
    User as UserIcon,
    AlertCircle,
    CheckCircle2,
    Calendar,
    ChevronRight,
    MessageSquare,
    Settings2
} from "lucide-react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import Link from "next/link"

interface Subscriber {
    id: string
    email: string
    name: string
    firstName: string | null
    lastName: string | null
    imc: number
    pisi: number
    startDate: Date | null
    hasCompletedOnboarding: boolean
    createdAt: Date
    subscriptionTier: string | null
    currentPhase: string
}

interface NewSubscribersClientProps {
    initialData: Subscriber[]
}

export function NewSubscribersClient({ initialData }: NewSubscribersClientProps) {
    const [search, setSearch] = useState("")

    const filteredData = initialData.filter(sub =>
        sub.name.toLowerCase().includes(search.toLowerCase()) ||
        sub.email.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="space-y-6">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                        placeholder="Rechercher un abonné..."
                        className="pl-10 rounded-2xl bg-white border-slate-200"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <Button variant="outline" className="rounded-2xl border-slate-200 gap-2 flex-1 md:flex-none">
                        <Filter className="w-4 h-4" />
                        Filtres
                    </Button>
                    <Button className="bg-slate-900 rounded-2xl gap-2 flex-1 md:flex-none">
                        Exporter (CSV)
                    </Button>
                </div>
            </div>

            {/* List */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow className="border-slate-100 hover:bg-transparent">
                            <TableHead className="w-[300px] py-6 font-bold text-slate-500 px-8 text-[10px] uppercase tracking-widest">
                                Abonné & Contact
                            </TableHead>
                            <TableHead className="font-bold text-slate-500 text-[10px] uppercase tracking-widest">
                                Date Début
                            </TableHead>
                            <TableHead className="font-bold text-slate-500 text-[10px] uppercase tracking-widest">
                                Metrics (IMC/PISI)
                            </TableHead>
                            <TableHead className="font-bold text-slate-500 text-[10px] uppercase tracking-widest">
                                Statut
                            </TableHead>
                            <TableHead className="text-right px-8 font-bold text-slate-500 text-[10px] uppercase tracking-widest">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="py-20 text-center space-y-3">
                                    <div className="bg-slate-50 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4">
                                        <UserIcon className="text-slate-300 w-8 h-8" />
                                    </div>
                                    <p className="text-slate-900 font-bold">Aucun abonné trouvé</p>
                                    <p className="text-slate-400 text-sm">Essaie avec un autre nom ou attends les nouvelles arrivées.</p>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredData.map((sub) => (
                                <TableRow key={sub.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors group">
                                    <TableCell className="py-6 px-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center shrink-0 border border-slate-100 text-slate-500 font-bold group-hover:scale-105 transition-transform">
                                                {sub.firstName?.[0]}{sub.lastName?.[0]}
                                            </div>
                                            <div className="flex flex-col gap-0.5 min-w-0">
                                                <p className="font-bold text-slate-900 truncate">
                                                    {sub.name}
                                                </p>
                                                <p className="text-xs text-slate-400 truncate font-medium">
                                                    {sub.email}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1">
                                            {sub.startDate ? (
                                                <div className="flex items-center gap-2 text-slate-700 font-bold text-sm">
                                                    <Calendar className="w-4 h-4 text-ikonga-coral" />
                                                    {format(new Date(sub.startDate), "d MMMM yyyy", { locale: fr })}
                                                </div>
                                            ) : (
                                                <span className="text-slate-400 text-xs font-medium italic">Non définie</span>
                                            )}
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                                Inscrit le {format(new Date(sub.createdAt), "dd/MM")}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-4">
                                            <div className="flex flex-col items-center gap-1 min-w-[50px]">
                                                <span className={`text-sm font-black ${sub.imc > 30 ? 'text-ikonga-coral' : sub.imc > 25 ? 'text-amber-500' : 'text-slate-900'}`}>{sub.imc}</span>
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">IMC</span>
                                            </div>
                                            <div className="w-px h-8 bg-slate-100" />
                                            <div className="flex flex-col items-center gap-1 min-w-[50px]">
                                                <span className="text-sm font-black text-slate-900">{sub.pisi}</span>
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">PISI</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-2">
                                            <Badge variant="secondary" className={`w-fit rounded-full px-3 py-1 font-bold text-[10px] uppercase tracking-wider border-none ${sub.hasCompletedOnboarding ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                                {sub.hasCompletedOnboarding ? 'Onboarding OK' : 'En cours'}
                                            </Badge>
                                            <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                                                <ChevronRight className="w-3 h-3" />
                                                {sub.currentPhase}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right px-8">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="icon" className="rounded-xl text-slate-400 hover:text-ikonga-coral hover:bg-ikonga-coral/5">
                                                <MessageSquare className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100">
                                                <Settings2 className="w-4 h-4" />
                                            </Button>
                                            <Link href={`/admin/users/${sub.id}`}>
                                                <Button size="icon" className="rounded-xl bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-200">
                                                    <ArrowUpRight className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                        </div>
                                        <MoreVertical className="w-4 h-4 text-slate-300 group-hover:hidden inline-block" />
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
