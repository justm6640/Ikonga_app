import { PrismaClient, Difficulty, PhaseType } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
    console.log("Seeding fitness content...")

    const contents = [
        {
            title: "Cardio Détox",
            category: "FITNESS",
            mediaUrl: "https://www.youtube.com/watch?v=1fG9T4V28vY", // Realistic fitness vid
            targetGender: ["FEMALE", "MALE"],
            targetPhases: [PhaseType.DETOX],
            emotionalTags: ["Énergie", "Détox"],
            metadata: {},
            duration: 15,
            difficulty: Difficulty.BEGINNER,
            description: "Une séance de cardio douce pour stimuler le métabolisme et favoriser l'élimination des toxines."
        },
        {
            title: "Yoga du Matin",
            category: "FITNESS",
            mediaUrl: "https://www.youtube.com/watch?v=v7AYKMP6rOE", // Realistic yoga vid
            targetGender: ["FEMALE", "MALE"],
            targetPhases: [PhaseType.DETOX, PhaseType.EQUILIBRE],
            emotionalTags: ["Calme", "Souplesse"],
            metadata: {},
            duration: 20,
            difficulty: Difficulty.BEGINNER,
            description: "Réveillez votre corps en douceur avec cet enchaînement de postures fluides."
        },
        {
            title: "Renforcement Doux",
            category: "FITNESS",
            mediaUrl: "https://www.youtube.com/watch?v=JkVHrA5639U", // Realistic Pilates vid
            targetGender: ["FEMALE", "MALE"],
            targetPhases: [PhaseType.DETOX],
            emotionalTags: ["Force", "Précision"],
            metadata: {},
            duration: 30,
            difficulty: Difficulty.INTERMEDIATE,
            description: "Travaillez l'ensemble des muscles profonds pour une posture tonifiée."
        }
    ]

    for (const content of contents) {
        await prisma.contentLibrary.upsert({
            where: { id: "FIT-" + content.title.replace(/\s+/g, '-').toUpperCase() },
            update: content as any,
            create: {
                ...content,
                id: "FIT-" + content.title.replace(/\s+/g, '-').toUpperCase()
            } as any,
        })
    }

    console.log("Fitness content seeded successfully!")
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
