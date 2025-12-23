"use server"

import prisma from "@/lib/prisma"
import { startOfWeek, format } from "date-fns"
import { fr } from "date-fns/locale"
import { getAllWeeklyPlans } from "@/lib/actions/admin-nutrition"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Edit2, User } from "lucide-react"
import { WeeklyPlanEditor } from "@/components/admin/WeeklyPlanEditor"

export default async function AdminMenusPage() {
    const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
    const plans = await getAllWeeklyPlans(currentWeekStart)

    return (
        <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif font-black text-slate-900 tracking-tighter uppercase">Plans Hebdomadaires</h1>
                    <p className="text-slate-500 flex items-center gap-2 mt-1">
                        <Calendar size={16} />
                        Semaine du {format(currentWeekStart, "d MMMM yyyy", { locale: fr })}
                    </p>
                </div>
                <Badge variant="outline" className="px-4 py-1 rounded-full border-slate-200">
                    {plans.length} abonnées actives
                </Badge>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-xl shadow-slate-200/50">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow className="border-none">
                            <TableHead className="py-5 px-6 font-black uppercase text-[10px] tracking-widest text-slate-400">Abonnée</TableHead>
                            <TableHead className="py-5 px-6 font-black uppercase text-[10px] tracking-widest text-slate-400">Phase</TableHead>
                            <TableHead className="py-5 px-6 font-black uppercase text-[10px] tracking-widest text-slate-400">Offre</TableHead>
                            <TableHead className="py-5 px-6 font-black uppercase text-[10px] tracking-widest text-slate-400 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {plans.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-32 text-center text-slate-500 italic">
                                    Aucun plan généré pour cette semaine.
                                </TableCell>
                            </TableRow>
                        ) : (
                            plans.map((plan) => (
                                <TableRow key={plan.id} className="group hover:bg-slate-50/50 transition-colors">
                                    <TableCell className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:shadow-sm transition-all">
                                                <User size={20} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-900">{plan.user.firstName || "Inconnue"}</span>
                                                <span className="text-[10px] text-slate-400 font-medium">{plan.user.email}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4 px-6">
                                        <Badge variant="outline" className="rounded-full bg-ikonga-pink/5 text-ikonga-pink border-ikonga-pink/20 font-bold uppercase text-[9px]">
                                            {plan.phase}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="py-4 px-6">
                                        <span className="text-xs font-bold text-slate-600 uppercase tracking-tighter">
                                            {plan.user.subscriptionTier || "Gratuit"}
                                        </span>
                                    </TableCell>
                                    <TableCell className="py-4 px-6 text-right">
                                        <Sheet>
                                            <SheetTrigger asChild>
                                                <Button size="sm" variant="outline" className="rounded-full border-slate-200 hover:border-ikonga-pink hover:text-ikonga-pink group/btn">
                                                    <Edit2 size={14} className="mr-2" />
                                                    Modifier
                                                </Button>
                                            </SheetTrigger>
                                            <SheetContent className="w-full sm:max-w-[800px] border-none rounded-l-[2.5rem] bg-white p-0 overflow-hidden">
                                                <div className="h-full flex flex-col">
                                                    <SheetHeader className="p-8 pb-4">
                                                        <SheetTitle className="text-2xl font-serif font-black text-slate-900 uppercase tracking-tighter">
                                                            Menu : {plan.user.firstName}
                                                        </SheetTitle>
                                                        <SheetDescription>
                                                            Personnalisation du plan pour la semaine du {format(currentWeekStart, "d MMMM", { locale: fr })}
                                                        </SheetDescription>
                                                    </SheetHeader>
                                                    <div className="flex-1 overflow-y-auto px-8 pb-8">
                                                        <WeeklyPlanEditor plan={plan} />
                                                    </div>
                                                </div>
                                            </SheetContent>
                                        </Sheet>
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
