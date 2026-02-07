import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log("🌱 Starting Production-Ready Seeding...")

    try {
        // Note: Commented out user data cleanup to avoid FK constraint errors
        // If you really need to clean, do it manually in the correct order or use raw SQL CASCADE
        // console.log("🧹 Cleaning test user data...")
        // await prisma.notification.deleteMany({})
        // await prisma.contentLog.deleteMany({})
        // await prisma.message.deleteMany({})
        // await prisma.channelMember.deleteMany({})
        // await prisma.userBadge.deleteMany({})
        // await prisma.dailyLog.deleteMany({})
        // await prisma.userPhase.deleteMany({})
        // await prisma.ikongaSession.deleteMany({})
        // await prisma.userAnalysis.deleteMany({})
        // await prisma.wellnessAnalysis.deleteMany({})
        // await prisma.user.deleteMany({})
        // await prisma.channel.deleteMany({})
        console.log("⏭️ Skipping user data cleanup (FK constraints)...")

        // 2. SEED SYSTEM DATA: BADGES
        console.log("🐣 Seeding Badges...")
        const badges = [
            { code: "FIRST_STEP", name: "Départ Canon", description: "Première action validée sur l'application.", icon: "🐣" },
            { code: "STREAK_3", name: "On Fire", description: "3 jours d'activité consécutifs.", icon: "🔥" },
            { code: "STREAK_7", name: "Semaine de Fer", description: "7 jours d'activité consécutifs.", icon: "🏆" },
            { code: "FIRST_WEIGH_IN", name: "Premier Pas", description: "Première pesée enregistrée.", icon: "⚖️" },
            { code: "DETOX_CHEF", name: "Chef Détox", description: "3 jours de menus suivis rigoureusement.", icon: "🥗" },
            { code: "PISI_ACHIEVED", name: "PISI Atteint", description: "Tu as atteint ton Poids de Santé Idéal !", icon: "🏆" }
        ]
        for (const b of badges) {
            try {
                process.stdout.write(`   → Seeding badge: ${b.code}... `)
                await prisma.badge.upsert({
                    where: { code: b.code },
                    update: { name: b.name, description: b.description, icon: b.icon },
                    create: b
                })
                console.log("✅")
            } catch (err) {
                console.log("❌")
                console.error(`Failed to seed badge ${b.code}:`, err)
                throw err
            }
        }

        // 3. SEED SYSTEM DATA: RECIPES
        console.log("🥣 Seeding Recipes...")
        const recipes = [
            {
                name: "Smoothie Vert Détox",
                phase: "DETOX",
                ingredients: ["1 poignée d'épinards frais", "1 pomme verte", "1/2 concombre", "Jus de citron", "Gingembre frais", "Eau de coco"],
                instructions: ["Lavez tout.", "Coupez.", "Mixez.", "Dégustez."],
                calories: 180, protein: 4, carbs: 35, fat: 2, prepTime: 10
            },
            {
                name: "Salade de Quinoa & Avocat",
                phase: "DETOX",
                ingredients: ["150g Quinoa", "1/2 Avocat", "Tomates cerises", "Oignon rouge", "Huile d'olive"],
                instructions: ["Cuire le quinoa.", "Trancher l'avocat.", "Mélanger avec l'assaisonnement."],
                calories: 420, protein: 12, carbs: 45, fat: 22, prepTime: 20
            }
        ]
        for (const r of recipes) {
            try {
                process.stdout.write(`   → Seeding recipe: ${r.name}... `)
                const { name, phase, ...rest } = r;
                await prisma.recipe.upsert({
                    where: { name_phase: { name, phase } },
                    update: rest,
                    create: r
                })
                console.log("✅")
            } catch (err) {
                console.log("❌")
                console.error(`Failed to seed recipe ${r.name}:`, err)
                throw err
            }
        }

        // 4. SEED SYSTEM DATA: CONTENT LIBRARY
        console.log("💪 Seeding Content Library...")
        const contents = [
            {
                id: "FIT-CARDIO-DETOX",
                title: "Cardio Détox",
                category: "FITNESS",
                mediaUrl: "https://www.youtube.com/watch?v=1fG9T4V28vY",
                targetGender: ["FEMALE", "MALE"],
                targetPhases: ["DETOX"] as any,
                emotionalTags: ["Énergie", "Détox"],
                duration: 15,
                difficulty: "BEGINNER" as any,
                description: "Une séance de cardio douce pour stimuler le métabolisme.",
                metadata: {}
            },
            {
                id: "WELL-MEDITATION-ANCRAGE",
                title: "Méditation du Matin",
                category: "WELLNESS",
                mediaUrl: "https://www.youtube.com/watch?v=v7AYKMP6rOE",
                targetGender: ["FEMALE", "MALE"],
                targetPhases: ["DETOX", "EQUILIBRE"] as any,
                emotionalTags: ["Calme", "Stress"],
                duration: 10,
                difficulty: "BEGINNER" as any,
                description: "Réveillez votre esprit en douceur.",
                metadata: {}
            }
        ]
        for (const c of contents) {
            try {
                process.stdout.write(`   → Seeding content: ${c.id}... `)
                const { id, ...rest } = c;
                await prisma.contentLibrary.upsert({
                    where: { id },
                    update: rest,
                    create: c
                })
                console.log("✅")
            } catch (err) {
                console.log("❌")
                console.error(`Failed to seed content ${c.id}:`, err)
                throw err
            }
        }

        // 5. SEED SYSTEM DATA: MENUS
        console.log("📅 Seeding Initial Menus...")
        const menuDetox1 = {
            title: "Menu Détox Jour 1",
            phaseCompat: ["DETOX"] as any,
            isPremium: false,
            content: {
                breakfast: "Smoothie vert Détox",
                lunch: "Salade de Quinoa & Avocat",
                snack: "Une pomme",
                dinner: "Bouillon de légumes"
            }
        }
        try {
            process.stdout.write(`   → Seeding menu: ${menuDetox1.title}... `)
            await prisma.menu.upsert({
                where: { title: menuDetox1.title },
                update: {
                    phaseCompat: menuDetox1.phaseCompat,
                    isPremium: menuDetox1.isPremium,
                    content: menuDetox1.content
                },
                create: menuDetox1
            })
            console.log("✅")
        } catch (err) {
            console.log("❌")
            console.error(`Failed to seed menu ${menuDetox1.title}:`, err)
            throw err
        }

        // 6. SEED SYSTEM DATA: WORKOUTS
        console.log("🏋️ Seeding Workouts...")
        const workouts = [
            {
                title: "Réveil Musculaire",
                description: "Une séance douce pour réveiller ton corps.",
                videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                thumbnailUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800",
                duration: 10,
                intensity: "LOW" as any,
                type: "YOGA" as any,
                metValue: 3.0,
                category: "FULL_BODY" as any
            },
            {
                title: "Cardio Brûle-Graisse",
                description: "Une séance intense pour brûler un max de calories.",
                videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                thumbnailUrl: "https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?q=80&w=800",
                duration: 20,
                intensity: "MODERATE" as any,
                type: "HIIT" as any,
                metValue: 8.0,
                category: "FULL_BODY" as any
            }
        ]
        for (const w of workouts) {
            try {
                process.stdout.write(`   → Seeding workout: ${w.title}... `)
                const stableId = `seed-${w.title.replace(/\s+/g, '-').toLowerCase()}`
                await prisma.workout.upsert({
                    where: { id: stableId },
                    update: {
                        description: w.description, videoUrl: w.videoUrl, thumbnailUrl: w.thumbnailUrl,
                        duration: w.duration, intensity: w.intensity, type: w.type, metValue: w.metValue, category: w.category
                    },
                    create: { id: stableId, ...w }
                })
                console.log("✅")
            } catch (err) {
                console.log("❌")
                console.error(`Failed to seed workout ${w.title}:`, err)
                throw err
            }
        }

        console.log("✨ Seeding completed successfully. Ready for PROD.")
    } catch (error) {
        process.stdout.write("\n")
        console.error("❌ Seeding failed at a critical step.")
        process.exit(1)
    }
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
