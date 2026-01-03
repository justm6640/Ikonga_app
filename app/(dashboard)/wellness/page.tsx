import { redirect } from "next/navigation"
import { getOrCreateUser } from "@/lib/actions/user"
import { getRecentWellnessLogs } from "@/lib/actions/wellness"
import prisma from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { WellnessChart } from "@/components/dashboard/WellnessChart"
import { Moon, Sparkles } from "lucide-react"
import { format } from "date-fns"
import { analyzeTrend } from "@/lib/engines/wellness"

export default async function WellnessPage() {
    // 1. Authentication & User Fetch
    const user = await getOrCreateUser()
    if (!user) redirect("/login")

    // 2. Get active phase
    const activePhase = await prisma.userPhase.findFirst({
        where: {
            userId: user.id,
            isActive: true
        },
        orderBy: { startDate: 'desc' }
    })

    const userPhase = activePhase?.type || "DETOX"

    // 3. Fetch today's wellness content
    const wellnessContent = await prisma.contentLibrary.findFirst({
        where: {
            category: "WELLNESS",
            targetPhases: { has: userPhase }
        },
        orderBy: { createdAt: 'desc' }
    })

    // 4. Fetch wellness logs for analytics
    const logs = await getRecentWellnessLogs(user.id, 14)
    const analysis = analyzeTrend(logs as any)

    const chartData = logs.map(l => ({
        date: format(l.date, "dd/MM"),
        score: (l as any).wellnessScore || 0
    }))

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="space-y-2 pt-6">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-100 rounded-xl">
                        <Moon className="text-purple-600" size={28} />
                    </div>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-serif text-slate-900 tracking-tight">
                            Wellness
                        </h1>
                        <p className="text-slate-500 font-light">
                            Ton espace bien-être et sérénité
                        </p>
                    </div>
                </div>
            </div>

            {/* Daily Wellness Tip */}
            {wellnessContent && (
                <Card className="border-purple-100 bg-gradient-to-br from-purple-50 to-indigo-50 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-xl font-serif flex items-center gap-2">
                            <Sparkles className="text-purple-500" size={20} />
                            Conseil du jour
                        </CardTitle>
                        <CardDescription>
                            Phase {userPhase}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <h3 className="text-lg font-bold text-slate-900">
                            {wellnessContent.title}
                        </h3>
                        {wellnessContent.description && (
                            <p className="text-slate-700 leading-relaxed">
                                {wellnessContent.description}
                            </p>
                        )}
                        {wellnessContent.mediaUrl && (
                            <a
                                href={wellnessContent.mediaUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
                            >
                                <Sparkles size={14} />
                                Découvrir la ressource
                            </a>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Wellness Analytics Chart */}
            <div className="space-y-3">
                <h2 className="text-xl font-serif text-slate-900">
                    Ton évolution bien-être
                </h2>
                <WellnessChart data={chartData} analysis={analysis} />
            </div>
        </div>
    )
}
