"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { SubscriptionTier, Role } from "@prisma/client";
import { Feature, hasFeature } from "@/config/subscriptions";

interface SubscriptionContextType {
    tier: SubscriptionTier | null;
    role: Role | null;
    hasAccess: (feature: Feature) => boolean;
    isBeforeCureStart: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({
    children,
    tier,
    role,
    isBeforeCureStart = false
}: {
    children: ReactNode;
    tier: SubscriptionTier | null;
    role: Role | null;
    isBeforeCureStart?: boolean;
}) {
    const hasAccess = (feature: Feature) => {
        if (role === 'ADMIN') return true;
        return hasFeature(tier, feature);
    };

    return (
        <SubscriptionContext.Provider value={{ tier, role, hasAccess, isBeforeCureStart }}>
            {children}
        </SubscriptionContext.Provider>
    );
}

export function useSubscription() {
    const context = useContext(SubscriptionContext);
    if (context === undefined) {
        throw new Error("useSubscription must be used within a SubscriptionProvider");
    }
    return context;
}
