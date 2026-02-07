import prisma from './lib/prisma';

async function check() {
    const user = await prisma.user.findFirst({
        where: {
            OR: [
                { firstName: { contains: 'Joel', mode: 'insensitive' } },
                { firstName: { contains: 'JOEL', mode: 'insensitive' } }
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
    console.log(JSON.stringify(user, null, 2));
    await prisma.$disconnect();
}

check().catch(console.error);
