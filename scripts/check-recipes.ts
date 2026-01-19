
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function check() {
    console.log("Checking Recipe Database...")
    const count = await prisma.recipe.count()
    console.log(`Total Recipes: ${count}`)

    if (count > 0) {
        const byPhase = await prisma.recipe.groupBy({
            by: ['phase'],
            _count: {
                _all: true
            }
        })
        console.log("Recipes by Phase:", byPhase)
    } else {
        console.log("⚠️ No recipes found! This explains 'Repas Libre'.")
    }
}

check()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
