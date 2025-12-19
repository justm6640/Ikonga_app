"use server"

import prisma from "@/lib/prisma"
import { isYesterday, isToday, startOfDay } from "date-fns"

/**
 * Updates the user's streak based on their last activity.
 */
export async function updateStreak(userId: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { currentStreak: true, longestStreak: true, lastActivityDate: true }
        })

        if (!user) return

        const now = new Date()
        const lastActivity = user.lastActivityDate

        // If active today, do nothing
        if (lastActivity && isToday(lastActivity)) {
            return
        }

        let newStreak = 1

        if (lastActivity && isYesterday(lastActivity)) {
            newStreak = user.currentStreak + 1
        }

        const newLongestStreak = Math.max(user.longestStreak, newStreak)

        await prisma.user.update({
            where: { id: userId },
            data: {
                currentStreak: newStreak,
                longestStreak: newLongestStreak,
                lastActivityDate: now
            }
        })

        // Check for badges
        await checkStreakBadges(userId, newStreak)

        // Also check for "FIRST_STEP" if this is the first update ever recorded
        if (!lastActivity) {
            await awardBadge(userId, "FIRST_STEP")
        }

    } catch (error) {
        console.error("Error updating streak:", error)
    }
}

/**
 * Awards a badge to a user by badge code.
 */
export async function awardBadge(userId: string, badgeCode: string) {
    try {
        const badge = await prisma.badge.findUnique({
            where: { code: badgeCode }
        })

        if (!badge) return

        await prisma.userBadge.upsert({
            where: {
                userId_badgeId: {
                    userId: userId,
                    badgeId: badge.id
                }
            },
            create: {
                userId: userId,
                badgeId: badge.id
            },
            update: {} // Do nothing if already exists
        })
    } catch (error) {
        console.error(`Error awarding badge ${badgeCode}:`, error)
    }
}

/**
 * Internal logic for streak-based badges.
 */
async function checkStreakBadges(userId: string, streak: number) {
    if (streak >= 3) {
        await awardBadge(userId, "STREAK_3")
    }
    if (streak >= 7) {
        await awardBadge(userId, "STREAK_7")
    }
}

/**
 * Fetches the user's earned badges.
 */
export async function getUserBadges(userId: string) {
    try {
        const allBadges = await prisma.badge.findMany()
        const userEarnedBadges = await prisma.userBadge.findMany({
            where: { userId },
            select: { badgeId: true }
        })

        const earnedIds = new Set(userEarnedBadges.map(ub => ub.badgeId))

        return allBadges.map(badge => ({
            ...badge,
            isEarned: earnedIds.has(badge.id)
        }))
    } catch (error) {
        console.error("Error fetching user badges:", error)
        return []
    }
}
