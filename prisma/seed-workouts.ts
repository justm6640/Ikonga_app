import { PrismaClient, WorkoutType, WorkoutIntensity, WorkoutGender, WorkoutCategory, PhaseType } from "@prisma/client"

const prisma = new PrismaClient()

/**
 * Seed pour les séances de sport IKOFITNESS
 * Séances variées par type, intensité, durée et phase
 */
async function main() {
    console.log("🏋️ Seeding IKOFITNESS workouts...")

    const workouts = [
        // ==================== PHASE DETOX (LOW intensity) ====================
        {
            title: "Marche Active Détox",
            description: "15 minutes de marche active pour réveiller le corps en douceur. Idéale en phase détox.",
            videoUrl: "https://www.youtube.com/watch?v=nPVPMxpQQmk",
            duration: 15,
            metValue: 3.5,
            intensity: WorkoutIntensity.LOW,
            type: WorkoutType.CARDIO,
            category: WorkoutCategory.FULL_BODY,
            gender: WorkoutGender.ALL,
            allowedPhases: [PhaseType.DETOX, PhaseType.ENTRETIEN]
        },
        {
            title: "Yoga Doux Réveil",
            description: "Enchaînement de postures douces pour réveiller le corps et l'esprit. Respiration profonde.",
            videoUrl: "https://www.youtube.com/watch?v=v7AYKMP6rOE",
            duration: 20,
            metValue: 2.5,
            intensity: WorkoutIntensity.LOW,
            type: WorkoutType.YOGA,
            category: WorkoutCategory.MOBILITY,
            gender: WorkoutGender.ALL,
            allowedPhases: [PhaseType.DETOX, PhaseType.EQUILIBRE, PhaseType.ENTRETIEN]
        },
        {
            title: "Stretching Complet",
            description: "Séance d'étirements pour libérer les tensions et améliorer la souplesse.",
            videoUrl: "https://www.youtube.com/watch?v=g_tea8ZNk5A",
            duration: 15,
            metValue: 2.0,
            intensity: WorkoutIntensity.LOW,
            type: WorkoutType.RECOVERY,
            category: WorkoutCategory.MOBILITY,
            gender: WorkoutGender.ALL,
            allowedPhases: [PhaseType.DETOX, PhaseType.EQUILIBRE, PhaseType.CONSOLIDATION, PhaseType.ENTRETIEN]
        },
        {
            title: "Respiration & Mobilité",
            description: "Exercices de respiration profonde et mobilité articulaire douce.",
            videoUrl: "https://www.youtube.com/watch?v=tybOi4hjZFQ",
            duration: 10,
            metValue: 1.5,
            intensity: WorkoutIntensity.LOW,
            type: WorkoutType.RECOVERY,
            category: WorkoutCategory.BREATHING,
            gender: WorkoutGender.ALL,
            allowedPhases: [PhaseType.DETOX, PhaseType.EQUILIBRE, PhaseType.CONSOLIDATION, PhaseType.ENTRETIEN]
        },
        {
            title: "Cardio Doux 20min",
            description: "Cardio à faible impact pour stimuler le métabolisme sans fatigue excessive.",
            videoUrl: "https://www.youtube.com/watch?v=VWj8lzA8YJE",
            duration: 20,
            metValue: 4.0,
            intensity: WorkoutIntensity.LOW,
            type: WorkoutType.CARDIO,
            category: WorkoutCategory.FULL_BODY,
            gender: WorkoutGender.ALL,
            allowedPhases: [PhaseType.DETOX, PhaseType.ENTRETIEN]
        },

        // ==================== PHASE EQUILIBRE (LOW to MODERATE) ====================
        {
            title: "Cardio Brûle-Graisses",
            description: "Séance cardio modérée pour activer la combustion des graisses.",
            videoUrl: "https://www.youtube.com/watch?v=ml6cT4AZdqI",
            duration: 30,
            metValue: 6.0,
            intensity: WorkoutIntensity.MODERATE,
            type: WorkoutType.CARDIO,
            category: WorkoutCategory.FULL_BODY,
            gender: WorkoutGender.ALL,
            allowedPhases: [PhaseType.EQUILIBRE, PhaseType.CONSOLIDATION, PhaseType.ENTRETIEN]
        },
        {
            title: "Renforcement Full Body",
            description: "Travail de renforcement global pour tonifier l'ensemble du corps.",
            videoUrl: "https://www.youtube.com/watch?v=JkVHrA5639U",
            duration: 25,
            metValue: 5.0,
            intensity: WorkoutIntensity.MODERATE,
            type: WorkoutType.STRENGTH,
            category: WorkoutCategory.FULL_BODY,
            gender: WorkoutGender.ALL,
            allowedPhases: [PhaseType.EQUILIBRE, PhaseType.CONSOLIDATION, PhaseType.ENTRETIEN]
        },
        {
            title: "CAF - Cuisses Abdos Fessiers",
            description: "Focus sur le bas du corps : cuisses, abdos et fessiers. Séance sculpte.",
            videoUrl: "https://www.youtube.com/watch?v=G8L0c1mCHzk",
            duration: 20,
            metValue: 5.5,
            intensity: WorkoutIntensity.MODERATE,
            type: WorkoutType.STRENGTH,
            category: WorkoutCategory.CAF,
            gender: WorkoutGender.FEMALE,
            allowedPhases: [PhaseType.EQUILIBRE, PhaseType.CONSOLIDATION, PhaseType.ENTRETIEN]
        },
        {
            title: "Danse Fitness Fun",
            description: "Brûle des calories en t'amusant avec cette séance de danse énergique !",
            videoUrl: "https://www.youtube.com/watch?v=ZWk19OVon2k",
            duration: 25,
            metValue: 6.5,
            intensity: WorkoutIntensity.MODERATE,
            type: WorkoutType.DANCE,
            category: WorkoutCategory.FULL_BODY,
            gender: WorkoutGender.FEMALE,
            allowedPhases: [PhaseType.EQUILIBRE, PhaseType.CONSOLIDATION, PhaseType.ENTRETIEN]
        },
        {
            title: "Gainage Express",
            description: "10 minutes de gainage pour renforcer ta sangle abdominale.",
            videoUrl: "https://www.youtube.com/watch?v=1skBf6h2ksI",
            duration: 10,
            metValue: 4.0,
            intensity: WorkoutIntensity.MODERATE,
            type: WorkoutType.STRENGTH,
            category: WorkoutCategory.CORE,
            gender: WorkoutGender.ALL,
            allowedPhases: [PhaseType.EQUILIBRE, PhaseType.CONSOLIDATION, PhaseType.ENTRETIEN]
        },

        // ==================== PHASE CONSOLIDATION (MODERATE to HIGH) ====================
        {
            title: "HIIT Brûle-Graisses 20min",
            description: "High Intensity Interval Training pour maximiser la combustion calorique.",
            videoUrl: "https://www.youtube.com/watch?v=ml6cT4AZdqI",
            duration: 20,
            metValue: 9.0,
            intensity: WorkoutIntensity.HIGH,
            type: WorkoutType.HIIT,
            category: WorkoutCategory.FULL_BODY,
            gender: WorkoutGender.ALL,
            allowedPhases: [PhaseType.CONSOLIDATION, PhaseType.ENTRETIEN]
        },
        {
            title: "Tabata Cardio",
            description: "4 minutes de Tabata ultra-intense. 20 sec effort / 10 sec repos.",
            videoUrl: "https://www.youtube.com/watch?v=XIeCMhNWFQQ",
            duration: 15,
            metValue: 10.0,
            intensity: WorkoutIntensity.HIGH,
            type: WorkoutType.HIIT,
            category: WorkoutCategory.FULL_BODY,
            gender: WorkoutGender.ALL,
            allowedPhases: [PhaseType.CONSOLIDATION, PhaseType.ENTRETIEN]
        },
        {
            title: "Bootcamp Full Body",
            description: "Entraînement de type militaire : cardio + renfo. Challenge total !",
            videoUrl: "https://www.youtube.com/watch?v=kZDvg92tVxg",
            duration: 30,
            metValue: 8.5,
            intensity: WorkoutIntensity.HIGH,
            type: WorkoutType.BOOTCAMP,
            category: WorkoutCategory.FULL_BODY,
            gender: WorkoutGender.ALL,
            allowedPhases: [PhaseType.CONSOLIDATION, PhaseType.ENTRETIEN]
        },
        {
            title: "Cardio Boxing",
            description: "Boxe cardio sans contact. Frappe, esquive et brûle un max de calories !",
            videoUrl: "https://www.youtube.com/watch?v=sLs-PpUnhk4",
            duration: 25,
            metValue: 8.0,
            intensity: WorkoutIntensity.HIGH,
            type: WorkoutType.COMBAT,
            category: WorkoutCategory.FULL_BODY,
            gender: WorkoutGender.ALL,
            allowedPhases: [PhaseType.CONSOLIDATION, PhaseType.ENTRETIEN]
        },
        {
            title: "Circuit Training Intensif",
            description: "Circuit de 6 exercices enchaînés. Pas de temps mort !",
            videoUrl: "https://www.youtube.com/watch?v=UItWltVZZmE",
            duration: 20,
            metValue: 8.0,
            intensity: WorkoutIntensity.HIGH,
            type: WorkoutType.MIXED,
            category: WorkoutCategory.FULL_BODY,
            gender: WorkoutGender.ALL,
            allowedPhases: [PhaseType.CONSOLIDATION, PhaseType.ENTRETIEN]
        },

        // ==================== SEANCES CIBLEES ====================
        {
            title: "Bras & Épaules Toniques",
            description: "Sculpte tes bras et épaules avec cette séance ciblée.",
            videoUrl: "https://www.youtube.com/watch?v=9pqm-Z0jP50",
            duration: 15,
            metValue: 4.5,
            intensity: WorkoutIntensity.MODERATE,
            type: WorkoutType.STRENGTH,
            category: WorkoutCategory.UPPER_BODY,
            gender: WorkoutGender.FEMALE,
            allowedPhases: [PhaseType.EQUILIBRE, PhaseType.CONSOLIDATION, PhaseType.ENTRETIEN]
        },
        {
            title: "Jambes de Rêve",
            description: "Focus jambes : squats, fentes, et exercices ciblés pour des jambes galbées.",
            videoUrl: "https://www.youtube.com/watch?v=BL3OcQy-QBk",
            duration: 20,
            metValue: 5.0,
            intensity: WorkoutIntensity.MODERATE,
            type: WorkoutType.STRENGTH,
            category: WorkoutCategory.LOWER_BODY,
            gender: WorkoutGender.FEMALE,
            allowedPhases: [PhaseType.EQUILIBRE, PhaseType.CONSOLIDATION, PhaseType.ENTRETIEN]
        },
        {
            title: "Abdos Sculptés",
            description: "15 minutes pour travailler tes abdos sous tous les angles.",
            videoUrl: "https://www.youtube.com/watch?v=1919eTCoESo",
            duration: 15,
            metValue: 4.5,
            intensity: WorkoutIntensity.MODERATE,
            type: WorkoutType.STRENGTH,
            category: WorkoutCategory.CORE,
            gender: WorkoutGender.ALL,
            allowedPhases: [PhaseType.EQUILIBRE, PhaseType.CONSOLIDATION, PhaseType.ENTRETIEN]
        },
        {
            title: "Fessiers Bombés",
            description: "Programme fessiers : ponts, squats sumo, donkey kicks...",
            videoUrl: "https://www.youtube.com/watch?v=WcfE9QvZ0uA",
            duration: 15,
            metValue: 5.0,
            intensity: WorkoutIntensity.MODERATE,
            type: WorkoutType.STRENGTH,
            category: WorkoutCategory.CAF,
            gender: WorkoutGender.FEMALE,
            allowedPhases: [PhaseType.EQUILIBRE, PhaseType.CONSOLIDATION, PhaseType.ENTRETIEN]
        },

        // ==================== YOGA & RECUPERATION ====================
        {
            title: "Yoga Flow Énergisant",
            description: "Flow yoga dynamique pour booster ton énergie.",
            videoUrl: "https://www.youtube.com/watch?v=oBu-pQG6sTY",
            duration: 30,
            metValue: 3.0,
            intensity: WorkoutIntensity.LOW,
            type: WorkoutType.YOGA,
            category: WorkoutCategory.FULL_BODY,
            gender: WorkoutGender.ALL,
            allowedPhases: [PhaseType.DETOX, PhaseType.EQUILIBRE, PhaseType.CONSOLIDATION, PhaseType.ENTRETIEN]
        },
        {
            title: "Yoga Détente du Soir",
            description: "Séance relaxante pour décompresser et mieux dormir.",
            videoUrl: "https://www.youtube.com/watch?v=v7AYKMP6rOE",
            duration: 20,
            metValue: 2.0,
            intensity: WorkoutIntensity.LOW,
            type: WorkoutType.YOGA,
            category: WorkoutCategory.MOBILITY,
            gender: WorkoutGender.ALL,
            allowedPhases: [PhaseType.DETOX, PhaseType.EQUILIBRE, PhaseType.CONSOLIDATION, PhaseType.ENTRETIEN]
        },
        {
            title: "Récupération Active",
            description: "Séance douce post-effort pour favoriser la récupération musculaire.",
            videoUrl: "https://www.youtube.com/watch?v=g_tea8ZNk5A",
            duration: 15,
            metValue: 2.0,
            intensity: WorkoutIntensity.LOW,
            type: WorkoutType.RECOVERY,
            category: WorkoutCategory.FULL_BODY,
            gender: WorkoutGender.ALL,
            allowedPhases: [PhaseType.DETOX, PhaseType.EQUILIBRE, PhaseType.CONSOLIDATION, PhaseType.ENTRETIEN]
        },

        // ==================== SEANCES COURTES (EXPRESS) ====================
        {
            title: "Express Cardio 10min",
            description: "Pas le temps ? 10 minutes de cardio efficace !",
            videoUrl: "https://www.youtube.com/watch?v=VWj8lzA8YJE",
            duration: 10,
            metValue: 7.0,
            intensity: WorkoutIntensity.MODERATE,
            type: WorkoutType.CARDIO,
            category: WorkoutCategory.FULL_BODY,
            gender: WorkoutGender.ALL,
            allowedPhases: [PhaseType.EQUILIBRE, PhaseType.CONSOLIDATION, PhaseType.ENTRETIEN]
        },
        {
            title: "Express HIIT 7min",
            description: "7 minutes de HIIT ultra-efficace. Aucune excuse !",
            videoUrl: "https://www.youtube.com/watch?v=mmVxGJyq_Z8",
            duration: 7,
            metValue: 10.0,
            intensity: WorkoutIntensity.HIGH,
            type: WorkoutType.HIIT,
            category: WorkoutCategory.FULL_BODY,
            gender: WorkoutGender.ALL,
            allowedPhases: [PhaseType.CONSOLIDATION, PhaseType.ENTRETIEN]
        },
        {
            title: "Express Abdos 5min",
            description: "Challenge abdos de 5 minutes. Court mais intense !",
            videoUrl: "https://www.youtube.com/watch?v=1919eTCoESo",
            duration: 5,
            metValue: 5.0,
            intensity: WorkoutIntensity.MODERATE,
            type: WorkoutType.STRENGTH,
            category: WorkoutCategory.CORE,
            gender: WorkoutGender.ALL,
            allowedPhases: [PhaseType.EQUILIBRE, PhaseType.CONSOLIDATION, PhaseType.ENTRETIEN]
        },

        // ==================== SEANCES LONGUES ====================
        {
            title: "Full Body Challenge 45min",
            description: "Séance complète pour les plus motivées. Cardio + Renfo.",
            videoUrl: "https://www.youtube.com/watch?v=UBMk30rjy0o",
            duration: 45,
            metValue: 7.0,
            intensity: WorkoutIntensity.MODERATE,
            type: WorkoutType.MIXED,
            category: WorkoutCategory.FULL_BODY,
            gender: WorkoutGender.ALL,
            allowedPhases: [PhaseType.CONSOLIDATION, PhaseType.ENTRETIEN]
        },
        {
            title: "Yoga Complet 45min",
            description: "Séance de yoga complète : salutations, postures, relaxation.",
            videoUrl: "https://www.youtube.com/watch?v=oBu-pQG6sTY",
            duration: 45,
            metValue: 3.0,
            intensity: WorkoutIntensity.LOW,
            type: WorkoutType.YOGA,
            category: WorkoutCategory.FULL_BODY,
            gender: WorkoutGender.ALL,
            allowedPhases: [PhaseType.DETOX, PhaseType.EQUILIBRE, PhaseType.CONSOLIDATION, PhaseType.ENTRETIEN]
        },

        // ==================== SEANCES HOMMES ====================
        {
            title: "Upper Body Power",
            description: "Renforcement haut du corps : pectoraux, dos, épaules, bras.",
            videoUrl: "https://www.youtube.com/watch?v=BkS1-El_WlE",
            duration: 25,
            metValue: 6.0,
            intensity: WorkoutIntensity.MODERATE,
            type: WorkoutType.STRENGTH,
            category: WorkoutCategory.UPPER_BODY,
            gender: WorkoutGender.MALE,
            allowedPhases: [PhaseType.EQUILIBRE, PhaseType.CONSOLIDATION, PhaseType.ENTRETIEN]
        },
        {
            title: "Legs & Core Homme",
            description: "Jambes et abdos pour les hommes. Squats, fentes, gainage.",
            videoUrl: "https://www.youtube.com/watch?v=oAPCPjnU1wA",
            duration: 20,
            metValue: 6.0,
            intensity: WorkoutIntensity.MODERATE,
            type: WorkoutType.STRENGTH,
            category: WorkoutCategory.LOWER_BODY,
            gender: WorkoutGender.MALE,
            allowedPhases: [PhaseType.EQUILIBRE, PhaseType.CONSOLIDATION, PhaseType.ENTRETIEN]
        },
        {
            title: "HIIT Homme Challenge",
            description: "HIIT intense pour les hommes. Brûle un max en 20 minutes.",
            videoUrl: "https://www.youtube.com/watch?v=ml6cT4AZdqI",
            duration: 20,
            metValue: 10.0,
            intensity: WorkoutIntensity.HIGH,
            type: WorkoutType.HIIT,
            category: WorkoutCategory.FULL_BODY,
            gender: WorkoutGender.MALE,
            allowedPhases: [PhaseType.CONSOLIDATION, PhaseType.ENTRETIEN]
        }
    ]

    let created = 0
    let updated = 0

    for (const workout of workouts) {
        const id = `WKT-${workout.title.replace(/\s+/g, '-').toUpperCase().slice(0, 30)}`

        const existing = await prisma.workout.findUnique({ where: { id } })

        if (existing) {
            await prisma.workout.update({
                where: { id },
                data: workout
            })
            updated++
        } else {
            await prisma.workout.create({
                data: { id, ...workout }
            })
            created++
        }
    }

    console.log(`✅ IKOFITNESS seeding complete!`)
    console.log(`   📦 Created: ${created} workouts`)
    console.log(`   🔄 Updated: ${updated} workouts`)
    console.log(`   📊 Total: ${workouts.length} workouts`)
}

main()
    .catch((e) => {
        console.error("❌ Error seeding workouts:", e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
