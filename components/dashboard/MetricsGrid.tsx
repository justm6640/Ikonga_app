"use client"

import { User, DailyLog, Gender } from "@prisma/client"
import { AnimatedGauge } from "./AnimatedGauge"
import { calculateBMI, calculateBodyFat, calculateBodyBattery, getAge } from "@/lib/engines/calculators"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface MetricsGridProps {
    user: User
    currentWeight: number
    lastLog: DailyLog | null
}

export function MetricsGrid({ user, currentWeight, lastLog }: MetricsGridProps) {
    if (!user) return null;

    // 1. Calculate Metrics
    const bmiResult = calculateBMI(currentWeight, user.heightCm || 0)
    const age = getAge(user.birthDate)
    const bodyFat = calculateBodyFat(bmiResult.value, age, user.gender as Gender)
    const bodyBattery = calculateBodyBattery(lastLog)

    // 2. Color Logic
    const getBatteryColor = (val: number) => {
        if (val > 80) return "text-emerald-500"
        if (val > 50) return "text-yellow-500"
        return "text-red-500"
    }

    const getBodyFatColor = (val: number, gender: string) => {
        if (gender === "MALE") {
            if (val < 20) return "text-emerald-500"
            if (val < 25) return "text-orange-500"
            return "text-red-500"
        } else {
            if (val < 30) return "text-emerald-500"
            if (val < 35) return "text-orange-500"
            return "text-red-500"
        }
    }

    const metrics = [
        {
            label: "IMC (BMI)",
            value: bmiResult.value,
            unit: "Index",
            color: bmiResult.color,
            status: bmiResult.status,
            max: 40
        },
        {
            label: "Masse Grasse",
            value: bodyFat,
            unit: "% Est.",
            color: getBodyFatColor(bodyFat, user.gender),
            status: "Basé sur Deurenberg",
            max: 50
        },
        {
            label: "Body Battery",
            value: bodyBattery,
            unit: "% Vitalité",
            color: getBatteryColor(bodyBattery),
            status: "Score Bien-être",
            max: 100
        }
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {metrics.map((m, idx) => (
                <motion.div
                    key={m.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                >
                    <Card className="border-none shadow-xl shadow-slate-100/50 rounded-[2.5rem] bg-white overflow-hidden hover:shadow-2xl transition-shadow duration-500">
                        <CardContent className="p-4 flex flex-col items-center">
                            <AnimatedGauge
                                value={m.value}
                                max={m.max}
                                label={m.label}
                                unit={m.unit}
                                color={m.color}
                            />
                            <p className={cn("text-[9px] font-black uppercase tracking-tight opacity-50 -mt-2", m.color)}>
                                {m.status}
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </div>
    )
}
