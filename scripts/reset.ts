import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
async function main() {
    await prisma.weeklyPlan.deleteMany({})
    await prisma.recipe.deleteMany({})
    console.log("WeeklyPlans and Recipes Cleared.")
}
main().finally(() => prisma.$disconnect())
