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
        // Breakdown: 5 Breakfasts, 5 Lunches/Dinners, 3 Snacks
        {
            name: "Porridge Avoine & Chia",
            phase: "DETOX",
            ingredients: ["Flocons d'avoine", "Lait d'amande", "Graines de chia", "Fruits rouges"],
            instructions: ["Mélanger avoine et chia", "Cuire avec le lait", "Garnir de fruits"],
            calories: 350, protein: 12, carbs: 45, fat: 10, prepTime: 10,
            difficulty: Difficulty.BEGINNER, isPremium: false
        },
        {
            name: "Smoothie Vert Détox",
            phase: "DETOX",
            ingredients: ["Epinards", "Pomme verte", "Céleri", "Citron", "Gingembre"],
            instructions: ["Mixer tous les ingrédients", "Boire frais"],
            calories: 180, protein: 5, carbs: 35, fat: 1, prepTime: 5,
            difficulty: Difficulty.BEGINNER, isPremium: false
        },
        {
            name: "Omelette Blancs d'Oeufs",
            phase: "DETOX",
            ingredients: ["Blancs d'oeufs", "Champignons", "Ciboulette", "Tomates cerises"],
            instructions: ["Battre les blancs", "Cuire avec légumes"],
            calories: 220, protein: 25, carbs: 5, fat: 8, prepTime: 10,
            difficulty: Difficulty.BEGINNER, isPremium: false
        },
        {
            name: "Poulet Yassa Light",
            phase: "DETOX",
            ingredients: ["Blancs de poulet", "Oignons", "Citrons vert", "Olives vertes", "Riz complet"],
            instructions: ["Mariner le poulet", "Saisir les oignons", "Mijoter avec pas mal de citron", "Servir avec le riz"],
            calories: 450, protein: 35, carbs: 50, fat: 12, prepTime: 30,
            difficulty: Difficulty.INTERMEDIATE, isPremium: false,
            cuisineType: "African", allergens: []
        },
        {
            name: "Bowl Vitaminé Quinoa",
            phase: "DETOX",
            ingredients: ["Quinoa", "Avocat", "Pois chiches", "Épinards", "Sauce Tahini"],
            instructions: ["Assembler les ingrédients", "Napper de sauce"],
            calories: 520, protein: 18, carbs: 65, fat: 22, prepTime: 15,
            difficulty: Difficulty.BEGINNER, isPremium: false,
            dietaryTags: ["Végétarien"]
        },
        {
            name: "Poisson Braisé & Alloco Diet",
            phase: "DETOX",
            ingredients: ["Dorade", "Epices", "Banane plantain (vapeur/four)", "Tomate"],
            instructions: ["Assaisonner le poisson", "Griller au four", "Cuire banane au four"],
            calories: 550, protein: 40, carbs: 60, fat: 15, prepTime: 45,
            difficulty: Difficulty.ADVANCED, isPremium: false,
            cuisineType: "African"
        },
        {
            name: "Soupe de Courge Butternut",
            phase: "DETOX",
            ingredients: ["Courge butternut", "Lait de coco light", "Curry", "Coriandre"],
            instructions: ["Cuire la courge", "Mixer avec lait coco et épices"],
            calories: 280, protein: 5, carbs: 40, fat: 10, prepTime: 25,
            difficulty: Difficulty.BEGINNER, isPremium: false
        },
        {
            name: "Salade de Lentilles Tièdes",
            phase: "DETOX",
            ingredients: ["Lentilles vertes", "Carottes", "Oignon rouge", "Vinaigrette légère"],
            instructions: ["Cuire lentilles", "Mélanger avec légumes crus"],
            calories: 320, protein: 18, carbs: 45, fat: 8, prepTime: 20,
            difficulty: Difficulty.BEGINNER, isPremium: false
        },
        {
            name: "Wok de Crevettes & Légumes",
            phase: "DETOX",
            ingredients: ["Crevettes", "Brocoli", "Poivron", "Sauce soja", "Ail"],
            instructions: ["Sauter les légumes", "Ajouter crevettes et sauce"],
            calories: 300, protein: 28, carbs: 15, fat: 5, prepTime: 15,
            difficulty: Difficulty.INTERMEDIATE, isPremium: false
        },
        {
            name: "Papillote de Cabillaud",
            phase: "DETOX",
            ingredients: ["Cabillaud", "Courgettes", "Citron", "Aneth"],
            instructions: ["Placer en papillote", "Cuire au four 20min"],
            calories: 250, protein: 30, carbs: 5, fat: 8, prepTime: 5,
            difficulty: Difficulty.BEGINNER, isPremium: false
        },
        {
            name: "Pomme au Four Cannelle",
            phase: "DETOX",
            ingredients: ["Pomme", "Cannelle"],
            instructions: ["Couper pomme", "Saupoudrer cannelle", "Au four 15min"],
            calories: 90, protein: 0, carbs: 22, fat: 0, prepTime: 5,
            difficulty: Difficulty.BEGINNER, isPremium: false
        },
        {
            name: "Yaourt Soja & Amandes",
            phase: "DETOX",
            ingredients: ["Yaourt soja", "Amandes effilées"],
            instructions: ["Mélanger", "Déguster"],
            calories: 120, protein: 8, carbs: 5, fat: 8, prepTime: 1,
            difficulty: Difficulty.BEGINNER, isPremium: false
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

    // Generate days array 0-6
    const days = []
    const meals = [
        { b: "Bowl Vitaminé Quinoa", l: "Poulet Yassa Light", s: "Pomme au Four Cannelle", d: "Soupe de Courge Butternut" },
        { b: "Porridge Avoine & Chia", l: "Poisson Braisé & Alloco Diet", s: "Yaourt Soja & Amandes", d: "Wok de Crevettes & Légumes" },
        { b: "Smoothie Vert Détox", l: "Salade de Lentilles Tièdes", s: "Une pomme", d: "Papillote de Cabillaud" },
        { b: "Omelette Blancs d'Oeufs", l: "Poulet Yassa Light", s: "Yaourt Soja & Amandes", d: "Soupe de Courge Butternut" },
        { b: "Bowl Vitaminé Quinoa", l: "Poisson Braisé & Alloco Diet", s: "Pomme au Four Cannelle", d: "Wok de Crevettes & Légumes" },
        { b: "Porridge Avoine & Chia", l: "Salade de Lentilles Tièdes", s: "Une pomme", d: "Papillote de Cabillaud" },
        { b: "Smoothie Vert Détox", l: "Poulet Yassa Light", s: "Yaourt Soja & Amandes", d: "Soupe de Courge Butternut" }
    ]

    for (let i = 0; i < 7; i++) {
        const m = meals[i] || meals[0]
        days.push({
            dayIndex: i,
            breakfast: m.b,
            lunch: m.l,
            snack: m.s,
            dinner: m.d
        })
    }

    const weeklyContent = {
        days: days,
        meta: {
            targetCalories: 1800,
            generatedAt: new Date(),
            seeded: true
        }
    }

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
