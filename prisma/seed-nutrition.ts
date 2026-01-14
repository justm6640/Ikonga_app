import { PrismaClient, PhaseType, Difficulty, GuidelineType } from '@prisma/client'
import { startOfWeek, startOfDay } from 'date-fns'

const prisma = new PrismaClient()

async function main() {
    console.log("🥗 Seeding Nutrition Test Data...")

    // 1. Find or create a test user
    const user = await prisma.user.findFirst() || await prisma.user.create({
        data: {
            email: "test@ikonga.com",
            firstName: "Test",
            lastName: "User",
        }
    })
    console.log(`👤 Using User: ${user.email}`)

    // 2. Ensure user has an active phase
    await prisma.userPhase.upsert({
        where: { id: "test-phase-id" }, // Using a fixed ID for simplicity in seeding
        update: { isActive: true, type: "DETOX" },
        create: {
            id: "test-phase-id",
            userId: user.id,
            type: "DETOX",
            startDate: new Date(),
            isActive: true
        }
    })

    // 3. Seed Recipes
    const recipes = [
        {
            name: "Poulet Yassa Light",
            phase: "DETOX",
            ingredients: ["Blancs de poulet", "Oignons", "Citrons vert", "Olives vertes", "Riz complet"],
            instructions: ["Mariner le poulet", "Saisir les oignons", "Mijoter avec le jus de citron", "Servir avec le riz"],
            calories: 450, protein: 35, carbs: 50, fat: 12, prepTime: 30,
            difficulty: Difficulty.INTERMEDIATE,
            isPremium: false
        },
        {
            name: "Bowl Vitaminé",
            phase: "DETOX",
            ingredients: ["Quinoa", "Avocat", "Pois chiches", "Épinards", "Sauce Tahini"],
            instructions: ["Assembler les ingrédients", "Napper de sauce"],
            calories: 520, protein: 18, carbs: 65, fat: 22, prepTime: 15,
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
    console.log("✅ Recipes seeded.")

    // 4. Seed Guidelines
    // Clear existing for this phase to avoid duplicates on rerun
    await prisma.phaseGuideline.deleteMany({
        where: { phase: PhaseType.DETOX }
    })

    const guidelines = [
        { phase: PhaseType.DETOX, type: GuidelineType.ALLOWED, content: "Boire 2L d'eau par jour", order: 1 },
        { phase: PhaseType.DETOX, type: GuidelineType.ALLOWED, content: "Privilégier les légumes verts", order: 2 },
        { phase: PhaseType.DETOX, type: GuidelineType.FORBIDDEN, content: "Sucre raffiné et pâtisseries", order: 1 },
        { phase: PhaseType.DETOX, type: GuidelineType.FORBIDDEN, content: "Boissons gazeuses", order: 2 }
    ]

    for (const g of guidelines) {
        await prisma.phaseGuideline.create({ data: g })
    }
    console.log("✅ Phase Guidelines seeded.")

    // 5. Seed Weekly Plan
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const weeklyContent: any = {}
    dayNames.forEach(day => {
        weeklyContent[day] = {
            breakfast: "Bowl Vitaminé",
            lunch: "Poulet Yassa Light",
            snack: "Une pomme",
            dinner: "Bouillon de légumes"
        }
    })

    await prisma.weeklyPlan.upsert({
        where: { userId_weekStart: { userId: user.id, weekStart: startOfDay(weekStart) } },
        update: { content: weeklyContent, phase: "DETOX" },
        create: {
            userId: user.id,
            weekStart: startOfDay(weekStart),
            content: weeklyContent,
            phase: "DETOX"
        }
    })
    console.log("✅ Weekly Plan seeded.")

    console.log("🚀 Testing data ready! Visit /nutrition on your app.")
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
