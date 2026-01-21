/**
 * Metrics Calculation Engine for IKONGA (Partie 7)
 * Based on internal IKONGA referential and standard medical formulas.
 */

/**
 * Calculate BMI (IMC)
 * Formula: weight / height^2
 */
export function calculateBMI(weightKg: number, heightCm: number): number {
    const heightM = heightCm / 100;
    return weightKg / (heightM * heightM);
}

/**
 * Get BMI Interpretation
 */
export function getBMIInterpretation(bmi: number): { label: string; color: string } {
    if (bmi < 18.5) return { label: "Maigreur", color: "text-blue-500" };
    if (bmi < 25) return { label: "Normal", color: "text-emerald-500" };
    if (bmi < 30) return { label: "Surpoids", color: "text-yellow-500" };
    if (bmi < 35) return { label: "Obésité 1", color: "text-orange-500" };
    if (bmi < 40) return { label: "Obésité 2", color: "text-red-500" };
    return { label: "Obésité 3", color: "text-red-700" };
}

/**
 * Calculate Body Fat % (Deurenberg Formula)
 * Formula: 1.20 * BMI + 0.23 * Age - 10.8 * Sex - 5.4
 * Sexe: 0 for female, 1 for male
 */
export function calculateBodyFat(bmi: number, age: number, gender: "MALE" | "FEMALE"): number {
    const sexValue = gender === "MALE" ? 1 : 0;
    return (1.20 * bmi) + (0.23 * age) - (10.8 * sexValue) - 5.4;
}

/**
 * Get Body Fat Interpretation
 */
export function getBodyFatInterpretation(bodyFat: number, gender: "MALE" | "FEMALE"): { label: string; color: string } {
    const thresholds = gender === "MALE" ? { normal: 24 } : { normal: 34 };
    if (bodyFat <= thresholds.normal) {
        return { label: "Dans la norme", color: "text-emerald-500" };
    }
    return { label: "Trop élevée", color: "text-rose-500" };
}

/**
 * Calculate BMR (Mifflin-St Jeor Formula)
 * Female: 10 * weight + 6.25 * height - 5 * age - 161
 * Male: 10 * weight + 6.25 * height - 5 * age + 5
 */
export function calculateBMR(weightKg: number, heightCm: number, age: number, gender: "MALE" | "FEMALE"): number {
    const base = (10 * weightKg) + (6.25 * heightCm) - (5 * age);
    return gender === "MALE" ? base + 5 : base - 161;
}

/**
 * Get BMR Interpretation
 */
export function getBMRInterpretation(bmr: number): { label: string; color: string } {
    if (bmr < 1200) return { label: "Métabolisme à protéger", color: "text-orange-500" };
    return { label: "Bonne base", color: "text-emerald-500" };
}

/**
 * Calculate Metabolic Age (Internal IKONGA Formula)
 * Base: Real Age + (BodyFat% - 30) / 1.5
 * Adjusted by BMR
 */
export function calculateMetabolicAge(realAge: number, bodyFat: number, bmr: number, gender: "MALE" | "FEMALE"): number {
    const bfReference = gender === "MALE" ? 20 : 30;
    const baseMetabolicAge = realAge + (bodyFat - bfReference) / 1.5;

    // Slight adjustment based on BMR (if BMR is very low for age, add years)
    // Simple placeholder for the "internal adjustment"
    const expectedBmr = calculateBMR(70, 170, realAge, gender); // dummy reference
    const bmrRatio = bmr / expectedBmr;

    if (bmrRatio < 0.9) return Math.round(baseMetabolicAge + 2);
    if (bmrRatio > 1.1) return Math.round(baseMetabolicAge - 2);

    return Math.round(baseMetabolicAge);
}

/**
 * Get Metabolic Age Interpretation
 */
export function getMetabolicAgeInterpretation(metabolicAge: number, realAge: number): { label: string; color: string } {
    if (metabolicAge <= realAge) return { label: "Plus jeune que ton âge", color: "text-emerald-500" };
    return { label: "Un peu élevé", color: "text-orange-500" };
}

/**
 * Calculate Weight for a specific BMI
 * Weight = BMI * Height^2
 */
export function calculateWeightForBMI(bmi: number, heightCm: number): number {
    const heightM = heightCm / 100;
    return bmi * (heightM * heightM);
}

/**
 * Calculate Age from Birthdate
 */
export function calculateAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}
