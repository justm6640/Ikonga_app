import { getAdminDashboardStats, getAdminAlerts } from "@/lib/actions/admin"
import { Users, AlertTriangle, PlayCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export default async function AdminDashboardPage() {
    const { totalActive, phaseDistribution, pendingAlertsCount } = await getAdminDashboardStats()
    const alerts = await getAdminAlerts()

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-serif font-black text-slate-900">Poste de Pilotage</h1>
                    <p className="text-slate-500">Vue d'ensemble de l'activité IKONGA.</p>
                </div>
                <div className="flex gap-2">
                    <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-full border border-amber-200">
                        {totalActive} Abonnés Actifs
                    </span>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Alertes en Attente</p>
                        <p className="text-3xl font-black text-slate-900">{pendingAlertsCount}</p>
                    </div>
                    <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", pendingAlertsCount > 0 ? "bg-red-50 text-red-500" : "bg-green-50 text-green-500")}>
                        <AlertTriangle size={24} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm col-span-2">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Répartition par Phase</p>
                    <div className="grid grid-cols-4 gap-4 text-center">
                        <PhaseStat label="Détox" count={phaseDistribution.DETOX} color="bg-emerald-100 text-emerald-700" />
                        <PhaseStat label="Équilibre" count={phaseDistribution.EQUILIBRE} color="bg-blue-100 text-blue-700" />
                        <PhaseStat label="Conso." count={phaseDistribution.CONSOLIDATION} color="bg-purple-100 text-purple-700" />
                        <PhaseStat label="Entretien" count={phaseDistribution.ENTRETIEN} color="bg-amber-100 text-amber-700" />
                    </div>
                </div>
            </div>

            {/* Alerts Section */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <AlertTriangle size={20} className="text-amber-500" />
                    Vigilance Requise
                </h2>

                {alerts.length === 0 ? (
                    <div className="bg-white p-12 rounded-3xl border border-slate-100 text-center">
                        <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <PlayCircle size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">Tout est calme</h3>
                        <p className="text-slate-500">Aucune alerte critique détectée pour le moment.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                        {alerts.map((alert) => (
                            <div key={alert.id} className="p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                                        {alert.user.firstName?.[0] || "?"}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900">
                                            {alert.user.firstName} {alert.user.lastName}
                                        </p>
                                        <p className="text-sm text-red-500 font-medium">
                                            {alert.type}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs text-slate-400">
                                        {new Date(alert.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

function PhaseStat({ label, count, color }: { label: string, count: number, color: string }) {
    return (
        <div className="flex flex-col items-center">
            <span className={cn("px-3 py-1 rounded-full text-xs font-bold mb-2", color)}>
                {count}
            </span>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{label}</span>
        </div>
    )
}
