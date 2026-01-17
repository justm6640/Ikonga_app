import { PrismaClient, PhaseType } from "@prisma/client"
import { startOfWeek, startOfDay } from "date-fns"

const prisma = new PrismaClient()

async function main() {
    console.log("--- RE-ALIGNING WEEKLY PLANS ---")

    const users = await prisma.user.findMany()
    // Force set to Monday Jan 12, 2026
    const weekStart = new Date("2026-01-12T00:00:00Z")

    console.log(`Target Week Start: ${weekStart.toISOString()}`)

    const dayMenu = {
        breakfast: "Porridge Avoine Coco",
        snack: "Fruit & Noix",
        lunch: "Salade Quinoa Avocat",
        dinner: "Soupe Détox Verte"
    }
    const content = {
        days: Array(7).fill(dayMenu)
    }

    for (const user of users) {
        console.log(`Updating user ${user.email}...`)

        // Ensure phase is DETOX and active
        await prisma.userPhase.upsert({
            where: { id: `phase-${user.id}` }, // Controlled ID
            update: { type: PhaseType.DETOX, isActive: true, startDate: weekStart },
            create: {
                id: `phase-${user.id}`,
                userId: user.id,
                type: PhaseType.DETOX,
                isActive: true,
                startDate: weekStart
            }
        })

        // Force create/update WeeklyPlan for THIS SPECIFIC weekStart
        await prisma.weeklyPlan.upsert({
            where: { userId_weekStart: { userId: user.id, weekStart } },
            update: { content, phase: "DETOX" },
            create: {
                userId: user.id,
                weekStart,
                phase: "DETOX",
                content
            }
        })
    }

    console.log("Re-alignment complete!")
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect())
