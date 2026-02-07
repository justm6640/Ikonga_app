const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function check() {
    // Check both potential date fields for comparison
    const user = await prisma.user.findFirst({
        where: { firstName: { contains: 'Joel', mode: 'insensitive' } },
        select: {
            id: true,
            firstName: true,
            startDate: true,      // Account creation?
            planStartDate: true,  // Cure start?
            createdAt: true
        }
    });

    console.log('=== User JOEL Dates ===');
    console.log(JSON.stringify(user, null, 2));

    // Also check DFGH
    const dfgh = await prisma.user.findFirst({
        where: { email: { contains: 'justm', mode: 'insensitive' } },
        select: {
            id: true,
            firstName: true,
            startDate: true,
            planStartDate: true,
            createdAt: true
        }
    });
    console.log('\n=== User DFGH Dates ===');
    console.log(JSON.stringify(dfgh, null, 2));

    await prisma.$disconnect();
}

check().catch(console.error);
