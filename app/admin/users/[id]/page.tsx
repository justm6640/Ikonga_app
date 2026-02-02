import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import { PhaseControlPanel } from "@/components/admin/PhaseControlPanel"
import { SubscriptionControlPanel } from "@/components/admin/SubscriptionControlPanel"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { User, Mail, Calendar, Info } from "lucide-react"

interface UserDetailPageProps {
    params: Promise<{
        id: string
    }>
}

export default async function UserDetailPage({ params }: UserDetailPageProps) {
    const resolvedParams = await params;
    const user = await prisma.user.findUnique({
        where: { id: resolvedParams.id },
        include: {
            phases: {
                where: { isActive: true },
                take: 1
            }
        }
    })

    if (!user) {
        notFound()
    }

    const initials = `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() || "?"

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
            {/* Header / Profile Info */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <Avatar className="h-24 w-24 border-4 border-slate-50 shadow-lg">
                    <AvatarFallback className="bg-ikonga-gradient text-white text-2xl font-black">
                        {initials}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-serif font-black text-slate-900 leading-none">
                            {user.firstName} {user.lastName}
                        </h1>
                        <Badge className={user.role === 'ADMIN' ? "bg-rose-500" : "bg-emerald-500"}>
                            {user.role}
                        </Badge>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-500 font-medium">
                        <div className="flex items-center gap-1">
                            <Mail size={14} className="text-slate-400" />
                            {user.email}
                        </div>
                        <div className="flex items-center gap-1">
                            <Calendar size={14} className="text-slate-400" />
                            Inscrit le {format(new Date(user.createdAt), "dd MMMM yyyy", { locale: fr })}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* User Stats/Summary Card */}
                <Card className="rounded-[2.5rem] border-slate-100 shadow-md">
                    <CardHeader className="p-8 pb-4">
                        <CardTitle className="text-lg font-serif font-bold text-slate-800 flex items-center gap-2">
                            <Info size={18} className="text-ikonga-coral" /> État Actuel
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 pt-0 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <span className="text-[10px] uppercase font-black text-slate-400 tracking-widest block mb-1">Abonnement</span>
                                <span className="font-bold text-slate-900">{user.subscriptionTier}</span>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <span className="text-[10px] uppercase font-black text-slate-400 tracking-widest block mb-1">Phase</span>
                                <span className="font-bold text-slate-900 uppercase">{user.phases[0]?.type || "Indéterminée"}</span>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <span className="text-[10px] uppercase font-black text-slate-400 tracking-widest block mb-1">Poids Départ</span>
                                <span className="font-bold text-slate-900">{user.startWeight ? `${user.startWeight} kg` : "N/A"}</span>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <span className="text-[10px] uppercase font-black text-slate-400 tracking-widest block mb-1">PISI (Cible)</span>
                                <span className="font-bold text-slate-900 text-ikonga-coral">{user.pisi || user.targetWeight ? `${user.pisi || user.targetWeight} kg` : "N/A"}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Subscription Control */}
                <SubscriptionControlPanel user={user as any} />
            </div>

            {/* Phase Management */}
            <div className="pt-4">
                <PhaseControlPanel user={user as any} />
            </div>
        </div>
    )
}
