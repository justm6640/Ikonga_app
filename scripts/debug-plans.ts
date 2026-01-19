
import { PrismaClient } from '@prisma/client'
import { startOfWeek } from 'date-fns'

const prisma = new PrismaClient()

async function debug() {
    console.log("🔍 Debugging Nutrition Data...")

    // 1. List Users
    const users = await prisma.user.findMany()
    console.log(`Found ${users.length} users:`)
    users.forEach(u => console.log(`- ${u.email} (ID: ${u.id})`))

    // 2. List Weekly Plans
    const plans = await prisma.weeklyPlan.findMany({
        include: { user: true }
    })
    console.log(`\nFound ${plans.length} Weekly Plans:`)
    plans.forEach(p => {
        console.log(`- Plan for ${p.user.email} starting ${p.weekStart.toISOString()}`)
        const content = p.content as any
        if (content.days && Array.isArray(content.days)) {
            console.log(`  ✅ Content 'days' array found. Length: ${content.days.length}`)
            content.days.forEach((d: any) => {
                console.log(`    - Day Index ${d.dayIndex}: ${d.breakfast?.name || d.breakfast} | ${d.lunch?.name || d.lunch}`)
            })
        } else {
            console.log("  ❌ Content 'days' array MISSING or Invalid:", content)
        }
    })

    // 3. Check Current Week Alignment
    const now = new Date()
    const currentWeekStart = startOfWeek(now, { weekStartsOn: 1 })
    console.log(`\nCurrent Date: ${now.toISOString()}`)
    console.log(`Expected WeekStart (Monday): ${currentWeekStart.toISOString()}`)
}

debug()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
