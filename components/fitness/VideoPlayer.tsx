"use client"

import { useTransition } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle2, PlayCircle, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface VideoPlayerProps {
    videoId: string
    videoUrl: string
    isCompleted: boolean
    title?: string
    onComplete?: (id: string) => Promise<any>
}

export function VideoPlayer({ videoId, videoUrl, isCompleted, title, onComplete }: VideoPlayerProps) {
    const [isPending, startTransition] = useTransition()

    // Extract YouTube ID if not provided (fallback)
    const getYouTubeId = (url: string) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }

    const id = getYouTubeId(videoUrl) || "dQw4w9WgXcQ" // Fallback to safe placeholder

    const handleToggle = () => {
        if (!onComplete) return

        startTransition(async () => {
            try {
                const res = await onComplete(videoId)
                if (res?.success || res === undefined) {
                    toast.success(isCompleted ? "Séance retirée de ton historique." : "Séance validée ! Bravo pour tes efforts. ✨")
                } else {
                    toast.error("Une erreur est survenue")
                }
            } catch (e) {
                toast.error("Une erreur est survenue")
            }
        })
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Aspect Ratio Container for YouTube */}
            <div className="relative aspect-video w-full rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200/50 border-4 border-white group bg-slate-100">
                <iframe
                    src={`https://www.youtube.com/embed/${id}?autoplay=0&rel=0&modestbranding=1`}
                    title={title || "YouTube video player"}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                />
            </div>

            {/* Completion Section */}
            <div className="flex flex-col items-center gap-4 py-4">
                <div className="w-full max-w-sm flex flex-col items-center gap-6">
                    <div className="w-16 h-1 bg-ikonga-coral/20 rounded-full" />

                    <Button
                        onClick={handleToggle}
                        disabled={isPending}
                        className={cn(
                            "w-full h-16 rounded-[2rem] text-lg font-black uppercase tracking-widest transition-all duration-300 shadow-xl active:scale-95",
                            isCompleted
                                ? "bg-emerald-50 text-emerald-600 border-2 border-emerald-200 hover:bg-emerald-100 shadow-emerald-500/10"
                                : "bg-ikonga-gradient hover:opacity-90 text-white border-b-4 border-pink-700 shadow-pink-500/20"
                        )}
                    >
                        {isPending ? (
                            <Loader2 className="animate-spin" />
                        ) : (
                            <>
                                {isCompleted ? (
                                    <>
                                        <CheckCircle2 className="mr-3" />
                                        Séance validée ✅
                                    </>
                                ) : (
                                    <>
                                        <PlayCircle className="mr-3" />
                                        J'ai fini ma séance
                                    </>
                                )}
                            </>
                        )}
                    </Button>

                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] text-center">
                        {isCompleted ? "Clique pour annuler la validation" : "Clique pour enregistrer ta progression"}
                    </p>
                </div>
            </div>
        </div>
    )
}
