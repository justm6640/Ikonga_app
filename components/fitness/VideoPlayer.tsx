"use client"

import { useTransition } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle2, PlayCircle, Loader2 } from "lucide-react"
import { completeWorkout } from "@/lib/actions/fitness"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface VideoPlayerProps {
    videoId: string
    videoUrl: string
    isCompleted: boolean
}

export function VideoPlayer({ videoId, videoUrl, isCompleted }: VideoPlayerProps) {
    const [isPending, startTransition] = useTransition()

    // Extract YouTube ID if not provided (fallback)
    const getYouTubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }

    const id = getYouTubeId(videoUrl) || "dQw4w9WgXcQ" // Fallback to safe placeholder

    const handleComplete = () => {
        startTransition(async () => {
            const res = await completeWorkout(videoId)
            if (res.success) {
                toast.success("Séance validée ! Bravo pour tes efforts. ✨")
            } else {
                toast.error(res.error || "Une erreur est survenue")
            }
        })
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Aspect Ratio Container for YouTube */}
            <div className="relative aspect-video w-full rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200/50 border-4 border-white group">
                <iframe
                    src={`https://www.youtube.com/embed/${id}?autoplay=0&rel=0&modestbranding=1`}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                />
            </div>

            {/* Completion Section */}
            <div className="flex flex-col items-center gap-4 py-8">
                {isCompleted ? (
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 shadow-inner">
                            <CheckCircle2 size={40} />
                        </div>
                        <div className="text-center">
                            <h3 className="text-xl font-serif font-black text-emerald-600 uppercase tracking-tight">Séance terminée</h3>
                            <p className="text-slate-500 text-sm italic mt-1 font-medium">Tes efforts payent, continue comme ça ! ✨</p>
                        </div>
                        <Button
                            disabled
                            variant="outline"
                            className="mt-4 rounded-2xl bg-emerald-50 border-emerald-100 text-emerald-600 h-12 px-8 font-bold"
                        >
                            Validé aujourd'hui ✅
                        </Button>
                    </div>
                ) : (
                    <div className="w-full max-w-sm flex flex-col items-center gap-6">
                        <div className="w-16 h-1 bg-ikonga-pink/20 rounded-full" />

                        <Button
                            onClick={handleComplete}
                            disabled={isPending}
                            className={cn(
                                "w-full h-16 rounded-[2rem] text-lg font-black uppercase tracking-widest transition-all duration-300 shadow-xl shadow-pink-500/20 active:scale-95",
                                "bg-ikonga-gradient hover:opacity-90 text-white border-b-4 border-pink-700"
                            )}
                        >
                            {isPending ? (
                                <Loader2 className="animate-spin" />
                            ) : (
                                <>
                                    <PlayCircle className="mr-3" />
                                    J'ai fini ma séance
                                </>
                            )}
                        </Button>

                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] text-center">
                            Clique pour enregistrer ta progression
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
