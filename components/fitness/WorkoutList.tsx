"use client"

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { PlayCircle, Clock } from "lucide-react"
import { type Workout, WorkoutIntensity } from "@prisma/client"
import { cn } from "@/lib/utils"

interface WorkoutListProps {
    title: string
    workouts: Workout[]
    onSelectWorkout: (workout: Workout) => void
}

export function WorkoutList({ title, workouts, onSelectWorkout }: WorkoutListProps) {
    if (!workouts || workouts.length === 0) return null

    const intensityColor = {
        [WorkoutIntensity.LOW]: "bg-emerald-100 text-emerald-800",
        [WorkoutIntensity.MODERATE]: "bg-orange-100 text-orange-800",
        [WorkoutIntensity.HIGH]: "bg-red-100 text-red-800"
    }

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-serif font-black text-slate-900">{title}</h3>

            <ScrollArea className="w-full whitespace-nowrap rounded-2xl">
                <div className="flex w-max space-x-4 pb-4">
                    {workouts.map((workout) => (
                        <div
                            key={workout.id}
                            onClick={() => onSelectWorkout(workout)}
                            className="w-[280px] bg-white border border-slate-100 rounded-2xl overflow-hidden cursor-pointer hover:shadow-lg transition-all group hover:-translate-y-1"
                        >
                            {/* Thumbnail Area */}
                            <div className="relative h-40 bg-slate-900 overflow-hidden">
                                {workout.thumbnailUrl ? (
                                    <img
                                        src={workout.thumbnailUrl}
                                        alt={workout.title}
                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                                        <span className="text-4xl">💪</span>
                                    </div>
                                )}

                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                                    <PlayCircle size={48} className="text-white drop-shadow-lg" />
                                </div>

                                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs font-bold px-2 py-1 rounded-md flex items-center">
                                    <Clock size={12} className="mr-1" />
                                    {workout.duration} min
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4 whitespace-normal">
                                <div className="flex justify-between items-start mb-2">
                                    <Badge variant="secondary" className={cn("text-[10px] h-5", intensityColor[workout.intensity])}>
                                        {workout.intensity}
                                    </Badge>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                        {workout.type}
                                    </span>
                                </div>
                                <h4 className="font-bold text-slate-900 line-clamp-2 leading-tight">
                                    {workout.title}
                                </h4>
                            </div>
                        </div>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>
    )
}
