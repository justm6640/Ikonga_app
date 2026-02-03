"use client"

import { useState, useEffect, useCallback } from "react"
import { Play, Pause, RotateCcw, Square, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface WorkoutTimerProps {
    workout: {
        id: string
        title: string
        duration: number // en minutes
        estimatedCalories?: number
    }
    onComplete: (duration: number) => void
    onCancel: () => void
}

export function WorkoutTimer({ workout, onComplete, onCancel }: WorkoutTimerProps) {
    const [isRunning, setIsRunning] = useState(false)
    const [elapsedSeconds, setElapsedSeconds] = useState(0)
    const [mode, setMode] = useState<"countdown" | "stopwatch">("countdown")

    const targetSeconds = workout.duration * 60

    // Timer effect
    useEffect(() => {
        let interval: NodeJS.Timeout | null = null

        if (isRunning) {
            interval = setInterval(() => {
                setElapsedSeconds((prev) => prev + 1)
            }, 1000)
        }

        return () => {
            if (interval) clearInterval(interval)
        }
    }, [isRunning])

    const formatTime = (totalSeconds: number) => {
        const hours = Math.floor(totalSeconds / 3600)
        const minutes = Math.floor((totalSeconds % 3600) / 60)
        const seconds = totalSeconds % 60

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
        }
        return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
    }

    const getDisplayTime = () => {
        if (mode === "countdown") {
            const remaining = Math.max(0, targetSeconds - elapsedSeconds)
            return formatTime(remaining)
        }
        return formatTime(elapsedSeconds)
    }

    const getProgress = () => {
        return Math.min(100, (elapsedSeconds / targetSeconds) * 100)
    }

    const handlePlayPause = () => {
        setIsRunning(!isRunning)
    }

    const handleReset = () => {
        setIsRunning(false)
        setElapsedSeconds(0)
    }

    const handleComplete = () => {
        setIsRunning(false)
        const durationMinutes = Math.ceil(elapsedSeconds / 60)
        onComplete(durationMinutes)
    }

    const isOvertime = elapsedSeconds > targetSeconds

    return (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-6">
            {/* Header */}
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">{workout.title}</h2>
                <p className="text-white/60">Durée cible : {workout.duration} min</p>
            </div>

            {/* Timer Circle */}
            <div className="relative w-64 h-64 mb-8">
                {/* Background circle */}
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="128"
                        cy="128"
                        r="120"
                        fill="none"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="8"
                    />
                    {/* Progress circle */}
                    <circle
                        cx="128"
                        cy="128"
                        r="120"
                        fill="none"
                        stroke={isOvertime ? "#22c55e" : "#f97316"}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 120}
                        strokeDashoffset={(1 - getProgress() / 100) * 2 * Math.PI * 120}
                        className="transition-all duration-500"
                    />
                </svg>

                {/* Time display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={cn(
                        "text-5xl font-bold font-mono",
                        isOvertime ? "text-green-400" : "text-white"
                    )}>
                        {getDisplayTime()}
                    </span>
                    <span className="text-white/40 text-sm mt-2">
                        {mode === "countdown" ? "Restant" : "Écoulé"}
                    </span>
                </div>
            </div>

            {/* Mode toggle */}
            <div className="flex gap-2 mb-8">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setMode("countdown")}
                    className={cn(
                        "text-white/60 hover:text-white",
                        mode === "countdown" && "bg-white/10 text-white"
                    )}
                >
                    Compte à rebours
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setMode("stopwatch")}
                    className={cn(
                        "text-white/60 hover:text-white",
                        mode === "stopwatch" && "bg-white/10 text-white"
                    )}
                >
                    Chronomètre
                </Button>
            </div>

            {/* Controls */}
            <div className="flex gap-4">
                <Button
                    variant="outline"
                    size="lg"
                    onClick={handleReset}
                    className="w-14 h-14 rounded-full border-white/20 text-white hover:bg-white/10"
                >
                    <RotateCcw className="w-6 h-6" />
                </Button>

                <Button
                    size="lg"
                    onClick={handlePlayPause}
                    className={cn(
                        "w-20 h-20 rounded-full",
                        isRunning
                            ? "bg-orange-500 hover:bg-orange-600"
                            : "bg-green-500 hover:bg-green-600"
                    )}
                >
                    {isRunning ? (
                        <Pause className="w-10 h-10 text-white" />
                    ) : (
                        <Play className="w-10 h-10 text-white ml-1" />
                    )}
                </Button>

                <Button
                    variant="outline"
                    size="lg"
                    onClick={onCancel}
                    className="w-14 h-14 rounded-full border-white/20 text-white hover:bg-white/10"
                >
                    <Square className="w-6 h-6" />
                </Button>
            </div>

            {/* Complete button */}
            {elapsedSeconds > 60 && (
                <Button
                    onClick={handleComplete}
                    className="mt-8 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-8 py-6 text-lg"
                >
                    <Check className="w-5 h-5 mr-2" />
                    Terminer la séance
                </Button>
            )}

            {/* Stats */}
            <div className="mt-8 flex gap-8 text-center">
                <div>
                    <p className="text-2xl font-bold text-orange-400">
                        {Math.ceil(elapsedSeconds / 60)}
                    </p>
                    <p className="text-white/40 text-sm">Minutes</p>
                </div>
                {workout.estimatedCalories && (
                    <div>
                        <p className="text-2xl font-bold text-orange-400">
                            ~{Math.round((workout.estimatedCalories / workout.duration) * (elapsedSeconds / 60))}
                        </p>
                        <p className="text-white/40 text-sm">Calories</p>
                    </div>
                )}
            </div>
        </div>
    )
}
