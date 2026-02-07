const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function check() {
    const phases = await prisma.userPhase.findMany({
        where: {
            userId: 'de07ed65-d329-4e64-8399-4b96aba0f57b'
        },
        select: {
            type: true,
            startDate: true,
            plannedEndDate: true,
            isActive: true
        },
        orderBy: { startDate: 'asc' }
    });
    console.log('=== Phases de JOEL ===');
    phases.forEach(p => console.log(JSON.stringify(p)));
    await prisma.$disconnect();
}

check().catch(console.error);
