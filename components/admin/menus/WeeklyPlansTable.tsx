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
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit2, User, Calendar } from "lucide-react"
import { WeeklyPlanEditor } from "@/components/admin/WeeklyPlanEditor"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

export function WeeklyPlansTable({ plans, weekStart }: { plans: any[], weekStart: Date }) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold font-serif text-slate-900">Suivi Hebdomadaire</h2>
                    <p className="text-slate-500 text-sm flex items-center gap-2 mt-1">
                        <Calendar size={14} />
                        Semaine du {format(weekStart, "d MMMM yyyy", { locale: fr })}
                    </p>
                </div>
                <Badge variant="outline" className="px-4 py-1 rounded-full border-slate-200">
                    {plans.length} plans actifs
                </Badge>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-slate-50">
                            <TableRow className="border-none">
                                <TableHead className="py-5 px-6 font-black uppercase text-[10px] tracking-widest text-slate-400">Abonnée</TableHead>
                                <TableHead className="py-5 px-6 font-black uppercase text-[10px] tracking-widest text-slate-400 hidden sm:table-cell">Phase</TableHead>
                                <TableHead className="py-5 px-6 font-black uppercase text-[10px] tracking-widest text-slate-400 hidden lg:table-cell">Offre</TableHead>
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
                                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:shadow-sm transition-all flex-shrink-0">
                                                    <User size={18} />
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="font-bold text-slate-900 truncate text-sm sm:text-base">{plan.user.firstName || "Inconnue"}</span>
                                                    <span className="text-[10px] text-slate-400 font-medium truncate hidden sm:block">{plan.user.email}</span>
                                                    <Badge variant="outline" className="sm:hidden w-fit mt-1 rounded-full bg-ikonga-coral/5 text-ikonga-coral border-ikonga-coral/20 font-bold uppercase text-[8px] px-1 h-3.5">
                                                        {plan.phase}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4 px-6 hidden sm:table-cell">
                                            <Badge variant="outline" className="rounded-full bg-ikonga-coral/5 text-ikonga-coral border-ikonga-coral/20 font-bold uppercase text-[9px]">
                                                {plan.phase}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="py-4 px-6 hidden lg:table-cell">
                                            <span className="text-xs font-bold text-slate-600 uppercase tracking-tighter">
                                                {plan.user.subscriptionTier || "Gratuit"}
                                            </span>
                                        </TableCell>
                                        <TableCell className="py-4 px-6 text-right">
                                            <Sheet>
                                                <SheetTrigger asChild>
                                                    <Button size="sm" variant="outline" className="rounded-full border-slate-200 hover:border-ikonga-coral hover:text-ikonga-coral group/btn px-3 sm:px-4">
                                                        <Edit2 size={14} className="sm:mr-2" />
                                                        <span className="hidden sm:inline">Modifier</span>
                                                    </Button>
                                                </SheetTrigger>
                                                <SheetContent side="right" className="w-full sm:max-w-[800px] border-none sm:rounded-l-[2.5rem] bg-white p-0">
                                                    <div className="h-full flex flex-col pt-10 sm:pt-0">
                                                        <SheetHeader className="p-6 sm:p-8 pb-4">
                                                            <SheetTitle className="text-xl sm:text-2xl font-serif font-black text-slate-900 uppercase tracking-tighter">
                                                                Menu : {plan.user.firstName}
                                                            </SheetTitle>
                                                            <SheetDescription>
                                                                Personnalisation du plan pour la semaine du {format(weekStart, "d MMMM", { locale: fr })}
                                                            </SheetDescription>
                                                        </SheetHeader>
                                                        <div className="flex-1 overflow-y-auto px-6 sm:px-8 pb-8">
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
        </div>
    )
}
