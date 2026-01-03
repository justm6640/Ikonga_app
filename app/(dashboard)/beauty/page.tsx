import { redirect } from "next/navigation"
import { getOrCreateUser } from "@/lib/actions/user"
import prisma from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, ExternalLink } from "lucide-react"

export default async function BeautyPage() {
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

    // 3. Fetch beauty tips for current phase
    const beautyTips = await prisma.contentLibrary.findMany({
        where: {
            category: "BEAUTY",
            targetPhases: { has: userPhase }
        },
        orderBy: { createdAt: 'desc' },
        take: 5
    })

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="space-y-2 pt-6">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-pink-100 rounded-xl">
                        <Sparkles className="text-pink-600" size={28} />
                    </div>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-serif text-slate-900 tracking-tight">
                            Beauty
                        </h1>
                        <p className="text-slate-500 font-light">
                            Tes rituels beauté personnalisés
                        </p>
                    </div>
                </div>
            </div>

            {/* Phase Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-50 border border-pink-100 rounded-full">
                <Sparkles className="text-pink-500" size={14} />
                <span className="text-sm font-medium text-pink-700">
                    Phase {userPhase}
                </span>
            </div>

            {/* Beauty Tips List */}
            <div className="space-y-4">
                <h2 className="text-xl font-serif text-slate-900">
                    Tes conseils beauté
                </h2>

                {beautyTips.length === 0 ? (
                    <Card className="border-slate-100">
                        <CardContent className="p-8 text-center">
                            <Sparkles className="mx-auto mb-3 text-slate-300" size={40} strokeWidth={1} />
                            <p className="text-slate-500 font-medium">
                                Aucun conseil disponible pour le moment
                            </p>
                            <p className="text-sm text-slate-400 mt-1">
                                Reviens bientôt pour découvrir de nouveaux rituels beauté
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {beautyTips.map((tip) => (
                            <Card
                                key={tip.id}
                                className="border-slate-100 shadow-sm hover:shadow-md transition-all group"
                            >
                                <CardHeader>
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-start gap-3 flex-1">
                                            <div className="p-2 bg-pink-50 rounded-lg flex-shrink-0">
                                                <Sparkles className="text-pink-500" size={20} />
                                            </div>
                                            <div className="flex-1">
                                                <CardTitle className="text-lg font-serif">
                                                    {tip.title}
                                                </CardTitle>
                                                {tip.duration && (
                                                    <CardDescription className="mt-1">
                                                        ⏱️ {tip.duration} min
                                                    </CardDescription>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                {tip.description && (
                                    <CardContent className="pt-0">
                                        <p className="text-slate-600 leading-relaxed mb-4">
                                            {tip.description}
                                        </p>
                                        {tip.mediaUrl && (
                                            <a
                                                href={tip.mediaUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 text-sm font-medium text-pink-600 hover:text-pink-700 transition-colors group-hover:gap-3"
                                            >
                                                Voir la ressource
                                                <ExternalLink size={14} />
                                            </a>
                                        )}
                                    </CardContent>
                                )}
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
