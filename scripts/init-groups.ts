import { PrismaClient, ChannelType } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
    console.log("Initializing IKONGA Groups...")

    const groups = [
        {
            type: ChannelType.GROUP_DETOX,
            name: "Groupe Détox",
        },
        {
            type: ChannelType.GROUP_ECE,
            name: "Groupe ECE",
        }
    ]

    for (const g of groups) {
        await prisma.channel.upsert({
            where: { id: g.type === ChannelType.GROUP_DETOX ? "group-detox-fixed-id" : "group-ece-fixed-id" },
            update: {},
            create: {
                id: g.type === ChannelType.GROUP_DETOX ? "group-detox-fixed-id" : "group-ece-fixed-id",
                type: g.type,
                name: g.name
            }
        })
    }

    console.log("Groups initialized.")
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
