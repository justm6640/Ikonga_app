import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
    console.log("Seeding badges...")

    const badges = [
        {
            code: "FIRST_STEP",
            name: "Départ Canon",
            description: "Première action validée sur l'application.",
            icon: "🐣"
        },
        {
            code: "STREAK_3",
            name: "On Fire",
            description: "3 jours d'activité consécutifs.",
            icon: "🔥"
        },
        {
            code: "STREAK_7",
            name: "Semaine de Fer",
            description: "7 jours d'activité consécutifs.",
            icon: "🏆"
        },
        {
            code: "FIRST_WEIGH_IN",
            name: "Premier Pas",
            description: "Première pesée enregistrée.",
            icon: "⚖️"
        },
        {
            code: "DETOX_CHEF",
            name: "Chef Détox",
            description: "3 jours de menus suivis rigoureusement.",
            icon: "🥗"
        }
    ]

    for (const badge of badges) {
        await prisma.badge.upsert({
            where: { code: badge.code },
            update: badge,
            create: badge
        })
    }

    console.log("Badges seeded successfully!")
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
