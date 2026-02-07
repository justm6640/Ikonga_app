const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateStartDate() {
    // Set startDate to March 20, 2026
    const newStartDate = new Date('2026-03-20T00:00:00.000Z');

    const updated = await prisma.user.update({
        where: { id: 'de07ed65-d329-4e64-8399-4b96aba0f57b' },
        data: { startDate: newStartDate },
        select: { firstName: true, startDate: true }
    });

    console.log('✅ Updated user startDate:');
    console.log(JSON.stringify(updated, null, 2));
    console.log('\nUnlock date (48h before): March 18, 2026');
    console.log('You should now be redirected to /waiting');

    await prisma.$disconnect();
}

updateStartDate().catch(console.error);
