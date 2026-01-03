import { getOrCreateUser } from "@/lib/actions/user"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { VideoPlayer } from "@/components/fitness/VideoPlayer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle2, Play, Dumbbell } from "lucide-react"
import { cn } from "@/lib/utils"

export default async function FitnessPage() {
    const user = await getOrCreateUser()
    if (!user) redirect("/login")

    // 1. Get user's active phase
    const activePhase = user.phases[0]
    const activePhaseType = activePhase?.type || "DETOX"

    // 2. Fetch all fitness videos for this phase
    const videos = await prisma.contentLibrary.findMany({
        where: {
            category: "FITNESS",
            targetPhases: { has: activePhaseType }
        },
        orderBy: { createdAt: 'asc' },
        include: {
            logs: {
                where: { userId: user.id },
                orderBy: { completedAt: 'desc' },
                take: 1
            }
        }
    })

    if (videos.length === 0) {
        return (
            <div className="max-w-4xl mx-auto p-6 text-center py-20">
                <Dumbbell className="mx-auto text-slate-200 mb-6" size={80} strokeWidth={1} />
                <h1 className="text-3xl font-serif font-black text-slate-900 mb-4">Fitness à venir</h1>
                <p className="text-slate-500 max-w-md mx-auto italic">
                    Tes séances personnalisées sont en cours de préparation pour la phase {activePhaseType}.
                </p>
            </div>
        )
    }

    // 3. Logic for "Featured Video" (Séance à la une)
    // Find first not completed video
    let featuredVideo = videos.find(v => v.logs.length === 0)

    // If all completed, take the last one or random
    if (!featuredVideo) {
        featuredVideo = videos[videos.length - 1]
    }

    const isFeaturedCompleted = featuredVideo.logs.length > 0

    return (
        <div className="max-w-4xl mx-auto space-y-12 pb-20 animate-in fade-in duration-700">
            {/* Hero Section: Featured Workout */}
            <section className="space-y-6 pt-6 px-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <Badge variant="outline" className="mb-3 border-pillar-fitness/30 text-pillar-fitness bg-pillar-fitness/5 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                            Séance à la une
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-serif font-black text-slate-900 leading-tight">
                            {featuredVideo.title}
                        </h1>
                    </div>
                    <div className="flex items-center gap-6 text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                        <div className="flex items-center gap-2">
                            <Clock size={16} className="text-pillar-fitness" />
                            {featuredVideo.duration} MIN
                        </div>
                        <div className="flex items-center gap-2">
                            <div className={cn(
                                "w-2 h-2 rounded-full",
                                featuredVideo.difficulty === "BEGINNER" ? "bg-emerald-500" :
                                    featuredVideo.difficulty === "INTERMEDIATE" ? "bg-amber-500" : "bg-rose-500"
                            )} />
                            {featuredVideo.difficulty}
                        </div>
                    </div>
                </div>

                <VideoPlayer
                    videoId={featuredVideo.id}
                    videoUrl={featuredVideo.mediaUrl || ""}
                    isCompleted={isFeaturedCompleted}
                    title={featuredVideo.title}
                />
            </section>

            {/* Library Section: Other Videos */}
            <section className="space-y-6 px-4">
                <div className="flex items-center gap-4">
                    <div className="h-px flex-1 bg-slate-100" />
                    <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Bibliothèque {activePhaseType}</h2>
                    <div className="h-px flex-1 bg-slate-100" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {videos.map((video) => {
                        const isCompleted = video.logs.length > 0
                        const isFeatured = video.id === featuredVideo?.id

                        return (
                            <Card
                                key={video.id}
                                className={cn(
                                    "rounded-[2rem] border-none shadow-sm overflow-hidden group transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50",
                                    isFeatured && "ring-2 ring-pillar-fitness/20"
                                )}
                            >
                                <CardContent className="p-0 flex flex-col h-full">
                                    <div className="relative aspect-video bg-slate-100 overflow-hidden">
                                        {/* Simplified Thumbnail for now using a colored div or placeholder */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                                            <Play size={40} className="text-slate-400 opacity-50 group-hover:scale-110 transition-transform duration-300" />
                                        </div>

                                        {isCompleted && (
                                            <div className="absolute top-4 right-4 bg-emerald-500 text-white p-2 rounded-full shadow-lg">
                                                <CheckCircle2 size={20} />
                                            </div>
                                        )}

                                        <div className="absolute bottom-4 left-4">
                                            <Badge className="bg-white/90 backdrop-blur-sm text-slate-900 border-none font-bold uppercase tracking-tighter text-[10px]">
                                                {video.duration} MIN
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className={cn(
                                                    "w-1.5 h-1.5 rounded-full",
                                                    video.difficulty === "BEGINNER" ? "bg-emerald-500" :
                                                        video.difficulty === "INTERMEDIATE" ? "bg-amber-500" : "bg-rose-500"
                                                )} />
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{video.difficulty}</span>
                                            </div>
                                            <h3 className="text-xl font-serif font-black text-slate-900 leading-tight group-hover:text-pillar-fitness transition-colors">
                                                {video.title}
                                            </h3>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-black text-pillar-fitness uppercase tracking-widest">
                                                {video.category}
                                            </span>
                                            {isCompleted && (
                                                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                                                    <CheckCircle2 size={12} /> Fait
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </section>
        </div>
    )
}
