
import { PrismaClient } from '@prisma/client'
import { startOfDay, addDays, differenceInCalendarDays, addHours } from 'date-fns'

const prisma = new PrismaClient()

async function diagnose() {
    console.log("🕵️ DIAGNOSING MENU GENERATION LOGIC")
    console.log("------------------------------------------------")

    // 1. Get User
    const user = await prisma.user.findFirst()
    if (!user) { console.error("No user found"); return }
    console.log(`User: ${user.email} (ID: ${user.id})`)

    // 2. Get Weekly Plan
    const plans = await prisma.weeklyPlan.findMany({
        where: { userId: user.id },
        orderBy: { weekStart: 'desc' },
        take: 1
    })

    if (plans.length === 0) { console.error("No weekly plan found"); return }
    const plan = plans[0]
    console.log(`Weekly Plan Start (DB Raw): ${plan.weekStart.toISOString()}`)
    console.log(`Weekly Plan Start (Local): ${plan.weekStart.toString()}`)

    // 3. Simulate Inputs
    // Client sends ISO Strings. 
    // Assuming Plan Start is Jan 19th (Midnight WAT -> Jan 18 23:00 UTC)

    // Day 1 (Lundi) -> Client sends Jan 19 23:00 UTC (Jan 20 00:00 WAT) ?? 
    // Wait, if WeekStart is Jan 19, Day 1 is Jan 19.

    const inputs = [
        "2026-01-18T23:00:00.000Z", // Sunday 23h UTC (Monday 00h WAT) - Should be Day 1 (Index 0)
        "2026-01-19T23:00:00.000Z", // Monday 23h UTC (Tuesday 00h WAT) - Should be Day 2 (Index 1)
        "2026-01-20T23:00:00.000Z", // Tuesday 23h UTC (Wednesday 00h WAT) - Should be Day 3 (Index 2)
    ]

    console.log("\n🧪 TESTING DATE LOGIC")
    for (const inputStr of inputs) {
        console.log(`\nInput String: ${inputStr}`)
        const inputDate = new Date(inputStr)

        // Logic from getNutritionData
        // const targetDate = startOfDay(inputDate) // OLD DANGEROUS ONE
        // Let's see what startOfDay does to it
        const startOfDayRes = startOfDay(inputDate)
        console.log(`  -> startOfDay(input): ${startOfDayRes.toISOString()} (Local: ${startOfDayRes.toString()})`)

        // The "Safe" Logic
        const safeTarget = addHours(startOfDayRes, 4)
        const safeStart = addHours(plan.weekStart, 4)
        const diff = differenceInCalendarDays(safeTarget, safeStart)

        console.log(`  -> SafeTarget (+4h): ${safeTarget.toISOString()}`)
        console.log(`  -> SafeStart (+4h):  ${safeStart.toISOString()}`)
        console.log(`  -> Calculated Index: ${diff}`)

        // Check content
        const content = plan.content as any
        const dayData = content.days?.find((d: any) => d.dayIndex === diff)
        console.log(`  -> Found Menu? ${dayData ? "✅ Yes (" + dayData.lunch + ")" : "❌ NO"}`)
    }

}

diagnose()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
