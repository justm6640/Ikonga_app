import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"
import { WeighInForm } from "@/components/weigh-in/WeighInForm"
import { WeightChartFull } from "@/components/weigh-in/WeightChartFull"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Card } from "@/components/ui/card"

export default async function WeighInPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || !user.email) return <div>Accès non autorisé</div>

    // Fetch User & Logs
    const dbUser = await prisma.user.findUnique({
        where: { email: user.email },
        include: {
            dailyLogs: {
                where: { weight: { not: null } },
                orderBy: { date: 'asc' },
                // Limit? Maybe last 30 for chart, or all? "History complete" requested.
                // Keeping all for now, Recharts handles reasonable amounts well in Area.
            }
        }
    });

    if (!dbUser) return <div>Utilisateur introuvable</div>

    // Recent History (Reverse order for list)
    const recentLogs = [...dbUser.dailyLogs].reverse().slice(0, 5);

    return (
        <div className="max-w-2xl mx-auto space-y-8 pb-10">
            {/* Header */}
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-serif text-foreground">Ma Pesée</h1>
                <p className="text-muted-foreground">Suis ta progression en toute bienveillance.</p>
            </div>

            {/* Form */}
            <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 border border-border/50 shadow-sm">
                <WeighInForm />
            </div>

            {/* Chart */}
            <WeightChartFull
                data={dbUser.dailyLogs as any[]} // logs have Date objects, need serialization if passed to client component? 
                // In App Router, Date objects can be passed to Client Components if they are not plain objects? 
                // Actually Next.js serializes args to Client Components.
                // Date objects are serialized to strings (ISO) usually, but Recharts might need parsing.
                // WeightChartFull handles `new Date(log.date)` so strings are fine.
                targetWeight={dbUser.targetWeight || undefined}
            />

            {/* Recent History List */}
            <div className="space-y-4">
                <h3 className="text-lg font-medium px-2">Historique récent</h3>
                <div className="grid gap-3">
                    {recentLogs.map((log) => (
                        <Card key={log.id} className="flex justify-between items-center p-4 rounded-2xl border-none shadow-sm hover:bg-card/80 transition-colors">
                            <div className="flex flex-col">
                                <span className="font-medium text-foreground">
                                    {format(log.date, "EEEE d MMMM", { locale: fr })}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    {format(log.date, "HH:mm")}
                                </span>
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-xl font-bold text-ikonga-pink">{log.weight}</span>
                                <span className="text-sm text-muted-foreground">kg</span>
                            </div>
                        </Card>
                    ))}
                    {recentLogs.length === 0 && (
                        <p className="text-center text-muted-foreground py-4">Aucune pesée enregistrée.</p>
                    )}
                </div>
            </div>
        </div>
    )
}
