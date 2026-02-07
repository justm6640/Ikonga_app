const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateStartDate() {
    // Update DFGH to start on March 20, 2026 to TEST LOCKING
    // Find by email justm6640@gmail.com
    console.log('Updating startDate for justm6640@gmail.com...');

    // Check current state
    const before = await prisma.user.findUnique({
        where: { email: 'justm6640@gmail.com' },
        select: { startDate: true, createdAt: true }
    });
    console.log('Current:', JSON.stringify(before, null, 2));

    const updated = await prisma.user.update({
        where: { email: 'justm6640@gmail.com' },
        data: {
            startDate: new Date('2026-03-20T00:00:00.000Z')
        },
        select: { firstName: true, startDate: true }
    });

    console.log('✅ NEW State:', JSON.stringify(updated, null, 2));
    console.log('You should now be able to see the WAITING PAGE.');

    await prisma.$disconnect();
}

updateStartDate().catch(console.error);
