"use server"

import prisma from "@/lib/prisma";
import { ChannelType, PhaseType, MemberStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export type GroupStatus = "ACTIVE" | "ANTICIPATED" | "LOCKED" | "EXPANDED";

export interface GroupAccess {
    id: string;
    type: ChannelType;
    name: string;
    description: string;
    status: GroupStatus;
    unlockDate?: Date;
}

/**
 * Determine accessible groups for a user based on their current phase and 48h preview.
 */
export async function getAvailableGroups(userId: string): Promise<GroupAccess[]> {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            phases: { orderBy: { startDate: "desc" } },
            channels: { include: { channel: true } }
        }
    });

    if (!user) return [];

    const currentPhase = user.phases.find(p => p.isActive);
    const nextPhase = user.phases.find(p => !p.isActive && p.startDate > new Date());

    const availableGroups: GroupAccess[] = [];
    const now = new Date();

    // 1. Determine Logic based on standard phase mapping
    const phaseToGroup: Record<PhaseType, ChannelType> = {
        DETOX: ChannelType.GROUP_DETOX,
        EQUILIBRE: ChannelType.GROUP_ECE,
        CONSOLIDATION: ChannelType.GROUP_ECE,
        ENTRETIEN: ChannelType.GROUP_ECE,
    };

    // 2. Fetch all community groups
    const groups = await prisma.channel.findMany({
        where: {
            type: { in: [ChannelType.GROUP_DETOX, ChannelType.GROUP_ECE] }
        }
    });

    for (const group of groups) {
        let status: GroupStatus = "LOCKED";
        let unlockDate: Date | undefined;

        // COACH OVERRIDE (Expanded access)
        const membership = user.channels.find(c => c.channelId === group.id);
        if (membership && membership.status === MemberStatus.ACTIVE) {
            status = "EXPANDED";
        }

        // STANDARD ACCESS
        if (currentPhase && phaseToGroup[currentPhase.type] === group.type) {
            status = "ACTIVE";
        }

        // ANTICIPATED ACCESS (48h before)
        if (status === "LOCKED" && nextPhase && phaseToGroup[nextPhase.type] === group.type) {
            const timeDiff = nextPhase.startDate.getTime() - now.getTime();
            if (timeDiff <= 48 * 60 * 60 * 1000) {
                status = "ANTICIPATED";
                unlockDate = nextPhase.startDate;
            }
        }

        // Descriptions
        const descriptions: Record<ChannelType, string> = {
            GROUP_DETOX: "Soutien et motivation pendant ta phase Détox. On avance ensemble !",
            GROUP_ECE: "Inspiration lifestyle et stabilisation. Partage ton équilibre.",
            PRIVATE_COACH: "" // Should not happen here
        };

        availableGroups.push({
            id: group.id,
            type: group.type,
            name: group.type === ChannelType.GROUP_DETOX ? "Groupe Détox" : "Groupe ECE",
            description: descriptions[group.type as ChannelType] || "",
            status,
            unlockDate
        });
    }

    return availableGroups;
}

/**
 * Fetch messages for a group with sender and reaction details.
 */
export async function getGroupMessages(channelId: string) {
    return await prisma.message.findMany({
        where: { channelId },
        include: {
            sender: {
                select: {
                    id: true,
                    name: true,
                    role: true,
                    image: true
                }
            }
        },
        orderBy: { createdAt: "asc" }
    });
}

/**
 * Send a message to a group.
 */
export async function sendGroupMessage(userId: string, channelId: string, content?: string, mediaUrl?: string) {
    const message = await prisma.message.create({
        data: {
            content,
            mediaUrl,
            senderId: userId,
            channelId
        }
    });

    revalidatePath(`/groupes/${channelId}`);
    return message;
}
