
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log("🧹 Cleaning up Nutrition User Data...")

    // 1. Get the test user
    const user = await prisma.user.findFirst({
        where: { email: "test@ikonga.com" }
    }) || await prisma.user.findFirst({
        where: { email: "justm6640@gmail.com" }
    })

    if (!user) {
        console.log("❌ No user found to clean.")
        return
    }

    console.log(`👤 Cleaning data for: ${user.email}`)

    // 2. Delete Weekly Plans
    const deletedPlans = await prisma.weeklyPlan.deleteMany({
        where: { userId: user.id }
    })
    console.log(`✅ Deleted ${deletedPlans.count} Weekly Plans.`)

    // 3. Delete Custom Menus
    const deletedMenus = await prisma.userCustomMenu.deleteMany({
        where: { userId: user.id }
    })
    console.log(`✅ Deleted ${deletedMenus.count} Custom Daily Menus.`)

    console.log("\n🚀 User data reset. Visiting the 'Mes Menus' page will now trigger a fresh generation.")
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
