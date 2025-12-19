import { getDailyWorkout } from "@/lib/actions/fitness"
import { VideoPlayer } from "@/components/fitness/VideoPlayer"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Clock, Dumbbell, Sparkles, ChevronLeft } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export const metadata = {
    title: "Ma Séance Fitness | IKONGA",
    description: "Votre programmation sportive quotidienne adaptée à votre phase.",
}

import { protectFeature } from "@/lib/security/permissions"

export default async function FitnessPage() {
    await protectFeature("FITNESS")
    const data = await getDailyWorkout()

    if (!data) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center space-y-6">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-slate-300">
                    <Dumbbell size={48} />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-serif font-black text-slate-900 uppercase">Repos aujourd'hui</h2>
                    <p className="text-slate-500 max-w-sm mx-auto italic">
                        Aucune séance de sport programmée pour aujourd'hui. Profitez-en pour vous reposer ou faire une marche douce.
                    </p>
                </div>
                <Link href="/dashboard" className="text-ikonga-pink font-bold uppercase tracking-widest text-sm flex items-center gap-2">
                    <ChevronLeft size={16} />
                    Retour au tableau de bord
                </Link>
            </div>
        )
    }

    const { video, isCompleted } = data

    return (
        <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-700">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-ikonga-pink/10 text-ikonga-pink font-bold border-none uppercase tracking-widest text-[10px] px-3">
                            <Sparkles size={12} className="mr-1" />
                            Programmation
                        </Badge>
                        <Badge variant="outline" className="text-slate-400 font-bold border-slate-200 uppercase tracking-widest text-[10px] px-3">
                            {(video as any).difficulty}
                        </Badge>
                    </div>
                    <div>
                        <h1 className="text-5xl font-serif font-black text-slate-900 uppercase tracking-tighter leading-none">
                            {video.title}
                        </h1>
                        <p className="text-slate-500 mt-3 text-lg font-medium italic">
                            "{(video as any).description}"
                        </p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-[2rem] border shadow-xl shadow-slate-200/50 flex items-center gap-6 min-w-[200px]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                            <Clock size={20} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase font-bold text-slate-400 leading-none mb-1">Durée</span>
                            <span className="text-lg font-black text-slate-900">{(video as any).duration} min</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Video Player Section */}
            <VideoPlayer
                videoId={video.id}
                videoUrl={video.mediaUrl || ""}
                isCompleted={isCompleted}
            />

            {/* Tips/Bonus Card */}
            <Card className="rounded-[2.5rem] border-none bg-ikonga-gradient p-1 text-white shadow-2xl shadow-pink-500/20">
                <div className="bg-slate-900/10 backdrop-blur-sm rounded-[2.3rem] p-8 flex flex-col md:flex-row items-center gap-6">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Dumbbell size={32} />
                    </div>
                    <div>
                        <h4 className="text-xl font-black uppercase tracking-tight mb-2">Conseil de Rosy</h4>
                        <p className="text-white/80 leading-relaxed italic">
                            "N'oublie pas de bien t'hydrater pendant ta séance. Écoute ton corps et va à ton rythme, le plus important est la régularité, pas l'intensité extrême !"
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    )
}
