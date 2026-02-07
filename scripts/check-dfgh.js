const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function check() {
    const user = await prisma.user.findFirst({
        where: {
            OR: [
                { firstName: { contains: 'DFGH', mode: 'insensitive' } },
                { email: { contains: 'DFGH', mode: 'insensitive' } } // Just in case
            ]
        },
        select: {
            id: true,
            firstName: true,
            email: true,
            role: true,
            startDate: true
        }
    });
    console.log('=== User DFGH ===');
    console.log(JSON.stringify(user, null, 2));

    // Also check JOEL just to be sure if there was a mixup
    const joel = await prisma.user.findFirst({
        where: { firstName: { contains: 'Joel', mode: 'insensitive' } },
        select: { role: true, startDate: true }
    });
    console.log('=== User Joel ===');
    console.log(JSON.stringify(joel, null, 2));

    await prisma.$disconnect();
}

check().catch(console.error);
