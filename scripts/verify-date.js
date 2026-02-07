const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDatePersist() {
    // 1. Simulate signup data
    const testEmail = `test_${Date.now()}@example.com`;
    const testDate = new Date('2026-03-20T00:00:00.000Z');

    console.log(`Creating test user ${testEmail} with startDate: ${testDate.toISOString()}`);

    try {
        const user = await prisma.user.create({
            data: {
                email: testEmail,
                firstName: "Test",
                lastName: "User",
                startDate: testDate
            }
        });

        console.log('✅ User created:', JSON.stringify(user, null, 2));

        if (user.startDate.toISOString() === testDate.toISOString()) {
            console.log('SUCCESS: startDate matches input!');
        } else {
            console.log('FAIL: startDate mismatch!');
            console.log('Expected:', testDate.toISOString());
            console.log('Got:', user.startDate.toISOString());
        }

        // Cleanup
        await prisma.user.delete({ where: { id: user.id } });

    } catch (e) {
        console.error('Error:', e);
    } finally {
        await prisma.$disconnect();
    }
}

checkDatePersist().catch(console.error);
