"use client"

import { PreCureInfoDialog } from "./PreCureInfoDialog"

interface DashboardClientProps {
    children: React.ReactNode
    isBeforeCureStart: boolean
    planStartDate: Date | null
    userId: string
}

export function DashboardClient({ children, isBeforeCureStart, planStartDate, userId }: DashboardClientProps) {
    return (
        <>
            <PreCureInfoDialog
                isBeforeCureStart={isBeforeCureStart}
                planStartDate={planStartDate}
                userId={userId}
            />
            {children}
        </>
    )
}
