const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateDfgh() {
    // Set startDate to March 20, 2026 for user DFGH
    // Finding by exact email from previous step: justm6640@gmail.com
    const updated = await prisma.user.update({
        where: { email: 'justm6640@gmail.com' },
        data: { startDate: new Date('2026-03-20T00:00:00.000Z') },
        select: { firstName: true, startDate: true }
    });

    console.log('✅ Updated user DFGH startDate:');
    console.log(JSON.stringify(updated, null, 2));

    await prisma.$disconnect();
}

updateDfgh().catch(console.error);
