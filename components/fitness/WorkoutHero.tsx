"use client"

import { useState } from "react"
import { VideoPlayer } from "./VideoPlayer"
import { Badge } from "@/components/ui/badge"
import { Play } from "lucide-react"
import { logWorkout } from "@/lib/actions/fitness"
import { type Workout, WorkoutIntensity, WorkoutType } from "@prisma/client"
import { cn } from "@/lib/utils"

interface WorkoutHeroProps {
    workout: Workout
    isCompletedToday?: boolean
}

export function WorkoutHero({ workout, isCompletedToday = false }: WorkoutHeroProps) {
    if (!workout) return null

    // State to toggle between Cover and Player
    const [isPlaying, setIsPlaying] = useState(false)

    const handleComplete = async (workoutId: string) => {
        return await logWorkout(workoutId)
    }

    const intensityColor = {
        [WorkoutIntensity.LOW]: "bg-[#F97316] text-white", // Orange from screenshot
        [WorkoutIntensity.MODERATE]: "bg-orange-500 text-white",
        [WorkoutIntensity.HIGH]: "bg-red-500 text-white"
    }

    const intensityLabel = {
        [WorkoutIntensity.LOW]: "DOUCE",
        [WorkoutIntensity.MODERATE]: "MODÉRÉE",
        [WorkoutIntensity.HIGH]: "INTENSE"
    }

    if (isPlaying || isCompletedToday) {
        return (
            <div className="w-full animate-in fade-in zoom-in-95 duration-500">
                <VideoPlayer
                    videoId={workout.id}
                    videoUrl={workout.videoUrl}
                    title={workout.title}
                    isCompleted={isCompletedToday}
                    onComplete={handleComplete}
                />
            </div>
        )
    }

    return (
        <div
            className="group relative w-full aspect-[16/9] md:aspect-[2.6/1] bg-slate-900 rounded-[2rem] overflow-hidden shadow-2xl shadow-slate-200/50 cursor-pointer"
            onClick={() => setIsPlaying(true)}
        >
            {/* Background Image */}
            <div className="absolute inset-0">
                {workout.thumbnailUrl ? (
                    <img
                        src={workout.thumbnailUrl}
                        alt={workout.title}
                        className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-r from-slate-600 to-slate-800 flex items-center justify-center">
                        {/* Fallback if no image */}
                        <div className="text-white/20 font-black text-6xl">IKOFITNESS</div>
                    </div>
                )}
                {/* Gradient Overlay mirroring the screenshot (darkness at bottom) */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/80" />
            </div>

            {/* Content Overlay */}
            <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-end items-start z-10">

                {/* Tags */}
                <div className="flex gap-2 mb-3">
                    <Badge className={cn("rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border-0", intensityColor[workout.intensity])}>
                        {intensityLabel[workout.intensity]}
                    </Badge>
                    <Badge className="bg-white/80 backdrop-blur-md text-slate-800 border-0 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                        {workout.duration} MIN
                    </Badge>
                </div>

                {/* Title & Description */}
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-2 drop-shadow-md">
                    {workout.title}
                </h2>
                <p className="text-white/90 text-sm md:text-base font-normal max-w-2xl mb-8 line-clamp-2 drop-shadow-sm">
                    {workout.description || "Une séance sélectionnée spécialement pour ta phase actuelle."}
                </p>

                {/* Big White Action Button */}
                <div className="w-full flex justify-center mt-auto">
                    <div className="w-full bg-white text-slate-900 h-14 rounded-full font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-transform hover:scale-[1.01] active:scale-95 shadow-xl">
                        <Play size={16} className="fill-slate-900" />
                        Démarrer la séance
                    </div>
                </div>
            </div>
        </div>
    )
}
