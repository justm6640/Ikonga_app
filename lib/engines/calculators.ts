import { DailyLog, Gender } from "@prisma/client"
import { differenceInYears } from "date-fns"

export interface BMIResult {
    value: number
    status: string
    color: string
}

export function calculateBMI(weightKg: number, heightCm: number): BMIResult {
    if (!weightKg || !heightCm) return { value: 0, status: "N/A", color: "text-slate-400" }

    const heightM = heightCm / 100
    const bmi = weightKg / (heightM * heightM)
    const value = Number(bmi.toFixed(1))

    if (value < 18.5) return { value, status: "Insuffisance", color: "text-blue-500" }
    if (value < 25) return { value, status: "Poids normal", color: "text-emerald-500" }
    if (value < 30) return { value, status: "Surpoids", color: "text-orange-500" }
    return { value, status: "Obésité", color: "text-red-500" }
}

// ALIAS for IMC (Indice de Masse Corporelle)
export const calculateIMC = calculateBMI

export function calculatePISI(heightCm: number, gender: Gender): number {
    if (!heightCm) return 0
    // Lorentz Formula for Ideal Weight (Poids Idéal Santé Ikonga)
    // MALE: (H - 100) - ((H - 150) / 4)
    // FEMALE: (H - 100) - ((H - 150) / 2)
    const factor = gender === Gender.MALE ? 4 : 2
    const pisi = (heightCm - 100) - ((heightCm - 150) / factor)
    return Math.round(pisi)
}

export function calculateBodyFat(bmi: number, age: number, gender: Gender): number {
    if (!bmi || !age) return 0

    // Deurenberg formula: (1.20 * BMI) + (0.23 * Age) - (10.8 * genderFactor) - 5.4
    // MALE = 1, FEMALE = 0
    const genderFactor = gender === Gender.MALE ? 1 : 0
    const bodyFat = (1.20 * bmi) + (0.23 * age) - (10.8 * genderFactor) - 5.4

    return Number(Math.max(0, bodyFat).toFixed(1))
}

export function calculateBodyBattery(lastLog: DailyLog | null): number {
    if (!lastLog || (lastLog as any).wellnessScore === null) {
        return 50 // Default/Fallback
    }

    // Transform wellnessScore (0-10) to 0-100 scale
    return Math.round((lastLog as any).wellnessScore * 10)
}

export function getAge(birthDate: Date | null): number {
    if (!birthDate) return 30 // Default if unknown
    return differenceInYears(new Date(), new Date(birthDate))
}

// ALIAS for calculateAge
export const calculateAge = getAge
