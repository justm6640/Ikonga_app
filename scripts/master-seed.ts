import { PrismaClient, PhaseType, Difficulty, GuidelineType } from "@prisma/client"
import { startOfWeek, addDays } from "date-fns"

const prisma = new PrismaClient()

async function main() {
    console.log("Starting master seed...")

    // 1. Create Sample Recipes for DETOX
    const recipes = [
        {
            name: "Porridge Avoine Coco",
            phase: "DETOX",
            ingredients: ["Flocons d'avoine", "Lait de coco", "Graines de chia", "Fruits rouges"],
            instructions: ["Mélanger l'avoine et le lait", "Laisser reposer toute la nuit", "Ajouter les fruits le matin"],
            calories: 350,
            protein: 12,
            carbs: 45,
            fat: 10,
            prepTime: 5,
            difficulty: Difficulty.BEGINNER,
            isPremium: false
        },
        {
            name: "Fruit & Noix",
            phase: "DETOX",
            ingredients: ["Pomme", "Poignée de noix", "Amandes"],
            instructions: ["Couper la pomme", "Mélanger avec les noix"],
            calories: 200,
            protein: 5,
            carbs: 25,
            fat: 12,
            prepTime: 2,
            difficulty: Difficulty.BEGINNER,
            isPremium: false
        },
        {
            name: "Salade Quinoa Avocat",
            phase: "DETOX",
            ingredients: ["Quinoa cuit", "Avocat", "Concombre", "Citron"],
            instructions: ["Mélanger tous les ingrédients", "Assaisonner avec du citron"],
            calories: 450,
            protein: 15,
            carbs: 55,
            fat: 18,
            prepTime: 10,
            difficulty: Difficulty.BEGINNER,
            isPremium: false
        },
        {
            name: "Soupe Détox Verte",
            phase: "DETOX",
            ingredients: ["Épinards", "Courgettes", "Bouillon de légumes"],
            instructions: ["Cuire les légumes", "Mixer le tout"],
            calories: 250,
            protein: 8,
            carbs: 30,
            fat: 5,
            prepTime: 20,
            difficulty: Difficulty.BEGINNER,
            isPremium: false
        }
    ]

    for (const r of recipes) {
        await prisma.recipe.upsert({
            where: { name_phase: { name: r.name, phase: r.phase } },
            update: r,
            create: r
        })
    }
    console.log("Recipes upserted.")

    // 2. Create Guidelines
    // Use upsert or clear first to avoid duplicates if necessary
    await prisma.phaseGuideline.deleteMany({ where: { phase: PhaseType.DETOX } })
    const guidelines = [
        { phase: PhaseType.DETOX, type: GuidelineType.ALLOWED, content: "Eau à volonté", order: 1 },
        { phase: PhaseType.DETOX, type: GuidelineType.ALLOWED, content: "Légumes verts", order: 2 },
        { phase: PhaseType.DETOX, type: GuidelineType.FORBIDDEN, content: "Sucre ajouté", order: 1 },
        { phase: PhaseType.DETOX, type: GuidelineType.FORBIDDEN, content: "Alcool", order: 2 }
    ]

    for (const g of guidelines) {
        await prisma.phaseGuideline.create({ data: g })
    }
    console.log("Guidelines reset and created.")

    // 3. Apply to ALL users
    const users = await prisma.user.findMany()
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })

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
        console.log(`Processing user: ${user.email}`)

        // Ensure user has DETOX phase active
        await prisma.userPhase.deleteMany({ where: { userId: user.id } })
        await prisma.userPhase.create({
            data: {
                userId: user.id,
                type: PhaseType.DETOX,
                isActive: true,
                startDate: new Date(),
                plannedEndDate: addDays(new Date(), 7) // Week long detox
            }
        })

        // Create Weekly Plan
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

    console.log(`Master seed complete for ${users.length} users!`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
