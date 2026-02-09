import { isBefore } from 'date-fns'

/**
 * Détermine si l'utilisateur peut accéder à une section donnée en fonction de la date de début de cure.
 * 
 * Logique:
 * - "dashboard" et "mon-analyse" sont toujours accessibles
 * - Les autres sections sont accessibles uniquement si nous sommes >= planStartDate
 */
export function canAccessSection(planStartDate: Date | null, sectionPath: string): boolean {
    // Les sections toujours accessibles
    const alwaysAccessible = ['dashboard', 'mon-analyse', 'profile']

    // Vérifier si la section fait partie des sections toujours accessibles
    if (alwaysAccessible.some(path => sectionPath.includes(path))) {
        return true
    }

    // Si pas de date de début de cure définie, on autorise l'accès
    if (!planStartDate) {
        return true
    }

    // Sinon, vérifier si nous sommes après la date de début
    const now = new Date()
    return !isBefore(now, planStartDate)
}

/**
 * Détermine si nous sommes avant la date de début de cure
 */
export function isBeforeCureStart(planStartDate: Date | null): boolean {
    if (!planStartDate) {
        return false
    }

    const now = new Date()
    return isBefore(now, planStartDate)
}
