
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log("🌱 Start seeding...")

    // 1. Clean existing content
    await prisma.menu.deleteMany({})
    await prisma.contentLibrary.deleteMany({})
    console.log("🧹 Cleaned existing menus and content.")

    // 2. Seed Nutrition (Menu Detox)
    await prisma.menu.create({
        data: {
            title: "Menu Détox Jour 1",
            phaseCompat: ["DETOX"],
            content: {
                breakfast: "Smoothie vert (Epinards, Pomme, Gingembre)",
                lunch: "Salade de quinoa aux légumes croquants",
                snack: "Une poignée d'amandes",
                dinner: "Soupe de courge et lait de coco"
            },
            isPremium: false
        }
    })
    console.log("🥗 Created Detox Menu.")

    // 3. Seed Content Pillars (Fitness, Wellness, Beauty)
    const contents = [
        {
            category: "FITNESS",
            title: "Cardio Doux - Réveil Corporel",
            targetPhases: ["DETOX"],
            targetGender: ["FEMALE"],
            emotionalTags: ["Energie", "Matin"],
            metadata: { duration: "15 min", difficulty: "Easy" }
        },
        {
            category: "WELLNESS",
            title: "Méditation du Matin - Ancrage",
            targetPhases: ["DETOX"],
            targetGender: ["FEMALE"],
            emotionalTags: ["Calme", "Stress"],
            metadata: { duration: "10 min", type: "Audio" }
        },
        {
            category: "BEAUTY",
            title: "Automassage Visage - Éclat",
            targetPhases: ["DETOX"],
            targetGender: ["FEMALE"],
            emotionalTags: ["Confiance", "Rituel"],
            metadata: { duration: "5 min", equipement: "Huile" }
        }
    ]

    for (const content of contents) {
        await prisma.contentLibrary.create({
            data: {
                category: content.category,
                title: content.title,
                targetPhases: content.targetPhases as any[], // Casting for Enum compatibility if needed
                targetGender: content.targetGender,
                emotionalTags: content.emotionalTags,
                metadata: content.metadata
            }
        })
    }
    console.log("✨ Created Fitness, Wellness, Beauty content.")

    console.log("✅ Seeding finished.")
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
