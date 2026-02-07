"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from "date-fns"

interface WaitingCountdownProps {
    targetDate: Date
    onComplete?: () => void
}

export function WaitingCountdown({ targetDate, onComplete }: WaitingCountdownProps) {
    const [timeLeft, setTimeLeft] = useState<{ days: number, hours: number, minutes: number, seconds: number } | null>(null)

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date()
            const diff = targetDate.getTime() - now.getTime()

            if (diff <= 0) {
                setTimeLeft(null)
                if (onComplete) onComplete()
                return false
            }

            setTimeLeft({
                days: differenceInDays(targetDate, now),
                hours: differenceInHours(targetDate, now) % 24,
                minutes: differenceInMinutes(targetDate, now) % 60,
                seconds: differenceInSeconds(targetDate, now) % 60
            })
            return true
        }

        const hasTimeLeft = calculateTimeLeft()
        if (!hasTimeLeft) return

        const timer = setInterval(() => {
            const stillHasTime = calculateTimeLeft()
            if (!stillHasTime) clearInterval(timer)
        }, 1000)

        return () => clearInterval(timer)
    }, [targetDate, onComplete])

    if (!timeLeft) return null

    return (
        <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
            {[
                { label: 'Jours', value: timeLeft.days },
                { label: 'Heures', value: timeLeft.hours },
                { label: 'Min', value: timeLeft.minutes },
                { label: 'Sec', value: timeLeft.seconds },
            ].map((item, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col items-center">
                    <span className="text-2xl font-black text-slate-900">{item.value.toString().padStart(2, '0')}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{item.label}</span>
                </div>
            ))}
        </div>
    )
}
