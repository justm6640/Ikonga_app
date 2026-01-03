"use client"

import { useState } from "react"
import { PlayCircle, CheckCircle, Clock, Dumbbell } from "lucide-react"
import { completeWorkout } from "@/lib/actions/fitness"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface FitnessVideo {
    id: string
    title: string
    description?: string | null
    videoUrl: string
    thumbnailUrl?: string | null
    duration: number
    difficulty: string
    category: string
}

interface WorkoutCardProps {
    userId: string
    video: FitnessVideo | null
    isCompleted: boolean
}

export function WorkoutCard({ userId, video, isCompleted: initialIsCompleted }: WorkoutCardProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isCompleted, setIsCompleted] = useState(initialIsCompleted)
    const [isSubmitting, setIsSubmitting] = useState(false)

    if (!video) {
        return (
            <Card className="border-slate-100 shadow-sm overflow-hidden">
                <CardContent className="p-8 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                        <Dumbbell size={40} strokeWidth={1} />
                        <p className="text-sm font-medium">Aucune séance disponible</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    const handleComplete = async () => {
        setIsSubmitting(true)
        try {
            const result = await completeWorkout(userId, video.id)
            if (result.success) {
                setIsCompleted(true)
                setIsOpen(false)
                toast.success(result.message)
            } else {
                toast.error(result.message)
            }
        } catch (error) {
            toast.error("Erreur lors de la validation")
        } finally {
            setIsSubmitting(false)
        }
    }

    // Extract YouTube video ID
    const getYouTubeEmbedUrl = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
        const match = url.match(regExp)
        const videoId = match && match[2].length === 11 ? match[2] : null
        return videoId ? `https://www.youtube.com/embed/${videoId}` : url
    }

    const difficultyColor = {
        BEGINNER: "bg-emerald-500",
        INTERMEDIATE: "bg-amber-500",
        ADVANCED: "bg-rose-500"
    }[video.difficulty] || "bg-slate-500"

    return (
        <>
            <Card
                className={cn(
                    "border-slate-100 shadow-lg overflow-hidden relative group cursor-pointer transition-all",
                    isCompleted ? "ring-2 ring-emerald-400" : "hover:shadow-xl"
                )}
                onClick={() => !isCompleted && setIsOpen(true)}
            >
                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: `url(${video.thumbnailUrl || 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800'})`
                    }}
                />

                {/* Overlay */}
                <div className={cn(
                    "absolute inset-0 transition-all",
                    isCompleted
                        ? "bg-gradient-to-br from-emerald-500/90 to-emerald-600/90"
                        : "bg-gradient-to-br from-slate-900/70 to-slate-900/90 group-hover:from-slate-900/60 group-hover:to-slate-900/80"
                )} />

                <CardContent className="relative z-10 p-6 h-full flex flex-col justify-between min-h-[280px]">
                    {isCompleted ? (
                        // Completed State
                        <div className="flex flex-col items-center justify-center h-full gap-4 text-white">
                            <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
                                <CheckCircle size={60} strokeWidth={2} />
                            </div>
                            <div className="text-center space-y-2">
                                <h3 className="text-2xl font-black">Bravo !</h3>
                                <p className="text-sm font-medium opacity-90">Séance terminée</p>
                                <p className="text-xs opacity-75">{video.title}</p>
                            </div>
                        </div>
                    ) : (
                        // Active State
                        <>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Badge className={cn(difficultyColor, "text-white border-none")}>
                                        {video.difficulty}
                                    </Badge>
                                    <Badge variant="outline" className="text-white border-white/30 bg-white/10 backdrop-blur-sm">
                                        {video.category}
                                    </Badge>
                                </div>
                                <h3 className="text-2xl md:text-3xl font-black text-white leading-tight">
                                    {video.title}
                                </h3>
                                {video.description && (
                                    <p className="text-sm text-white/80 line-clamp-2">
                                        {video.description}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-white/90">
                                    <Clock size={16} />
                                    <span className="text-sm font-bold">{video.duration} min</span>
                                </div>
                                <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm group-hover:bg-white/30 transition-all group-hover:scale-110">
                                    <PlayCircle size={32} className="text-white" strokeWidth={2} />
                                </div>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Video Modal */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-4xl p-0 overflow-hidden">
                    <DialogHeader className="p-6 pb-4">
                        <DialogTitle className="text-2xl font-serif">{video.title}</DialogTitle>
                        {video.description && (
                            <DialogDescription className="text-base">
                                {video.description}
                            </DialogDescription>
                        )}
                    </DialogHeader>

                    {/* Video Player */}
                    <div className="aspect-video w-full bg-slate-900">
                        <iframe
                            src={getYouTubeEmbedUrl(video.videoUrl)}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>

                    {/* Action Footer */}
                    <div className="p-6 bg-slate-50 space-y-3">
                        <Button
                            onClick={handleComplete}
                            disabled={isSubmitting}
                            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-6 text-base shadow-lg"
                        >
                            {isSubmitting ? (
                                "Validation..."
                            ) : (
                                <>
                                    <CheckCircle className="mr-2 h-5 w-5" />
                                    J'ai terminé ma séance
                                </>
                            )}
                        </Button>
                        <p className="text-xs text-slate-500 text-center">
                            Clique ici une fois ta séance terminée pour la valider
                        </p>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
