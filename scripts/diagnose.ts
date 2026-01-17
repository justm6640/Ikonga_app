import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
    console.log("--- DATABASE DIAGNOSTICS ---")

    const users = await prisma.user.findMany({
        include: {
            phases: true,
            weeklyPlans: true
        }
    })

    console.log(`Found ${users.length} users.`)

    for (const user of users) {
        console.log(`\nUser: ${user.email} (${user.id})`)
        console.log(`- Phases: ${user.phases.length}`)
        user.phases.forEach(p => console.log(`  * Type: ${p.type}, Active: ${p.isActive}`))

        console.log(`- Weekly Plans: ${user.weeklyPlans.length}`)
        user.weeklyPlans.forEach(wp => console.log(`  * Start: ${wp.weekStart.toISOString()}, Phase: ${wp.phase}`))
    }

    const recipes = await prisma.recipe.count()
    console.log(`\nTotal Recipes: ${recipes}`)

    const guidelines = await prisma.phaseGuideline.count()
    console.log(`Total Guidelines: ${guidelines}`)

    console.log("\n--- END DIAGNOSTICS ---")
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect())
