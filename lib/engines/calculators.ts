/**
 * Moteur de calculs métaboliques et indicateurs santé.
 */

export const calculateIMC = (weight: number, heightCm: number): number => {
    if (heightCm === 0) return 0;
    const heightM = heightCm / 100;
    const imc = weight / (heightM * heightM);
    return parseFloat(imc.toFixed(1));
};

/**
 * Formule de Lorentz pour le Poids Idéal Santé
 * Femme : (Height - 100) - ((Height - 150) / 2.5)
 * Homme : (Height - 100) - ((Height - 150) / 4)
 */
export const calculatePISI = (heightCm: number, gender: 'FEMALE' | 'MALE' | 'OTHER'): number => {
    // Fallback 'OTHER' to 'FEMALE' formula or average? Usually Lorentz is specific. 
    // We will default to FEMALE for OTHER as safer lower bound, or average. 
    // Given the context of "detox", conservative is safer. Let's strict to binary gender for formula or use FEMALE default.
    const isMale = gender === 'MALE';

    const factor = isMale ? 4 : 2.5;
    const pisi = (heightCm - 100) - ((heightCm - 150) / factor);

    return parseFloat(pisi.toFixed(1));
};

/**
 * Formule de Mifflin-St Jeor pour le BMR (Basal Metabolic Rate)
 * Femme : 10*W + 6.25*H - 5*A - 161
 * Homme : 10*W + 6.25*H - 5*A + 5
 */
export const calculateBMR = (
    weight: number,
    heightCm: number,
    age: number,
    gender: 'FEMALE' | 'MALE' | 'OTHER'
): number => {
    const s = gender === 'MALE' ? 5 : -161;
    const bmr = (10 * weight) + (6.25 * heightCm) - (5 * age) + s;
    return Math.round(bmr);
};

export const calculateAge = (birthDate: Date): number => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}
