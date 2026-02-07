const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateDfghPlanStart() {
    // Set planStartDate to March 20, 2026 for user DFGH
    const user = await prisma.user.findFirst({
        where: {
            OR: [
                { email: 'justm6640@gmail.com' },
                { firstName: { contains: 'DFGH', mode: 'insensitive' } }
            ]
        }
    });

    if (!user) {
        console.log('❌ User DFGH not found!');
        return;
    }

    const updated = await prisma.user.update({
        where: { id: user.id },
        data: {
            planStartDate: new Date('2026-03-20T00:00:00.000Z'),
        },
        select: { firstName: true, startDate: true, planStartDate: true }
    });

    console.log('✅ Updated user DFGH planStartDate:');
    console.log(JSON.stringify(updated, null, 2));

    await prisma.$disconnect();
}

updateDfghPlanStart().catch(console.error);
