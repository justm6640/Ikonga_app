import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
async function main() {
    console.log("Recipes:", await prisma.recipe.count());
    console.log("WeeklyPlans:", await prisma.weeklyPlan.count());
}
main().finally(() => prisma.$disconnect())
