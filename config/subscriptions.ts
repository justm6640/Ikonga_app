import { SubscriptionTier } from "@prisma/client";

export type Feature =
    | 'PROFILE'
    | 'DASHBOARD_VIEW'
    | 'MENUS'
    | 'RECIPES'
    | 'SHOPPING_LIST'
    | 'FITNESS'
    | 'CHAT'
    | 'JOURNAL'
    | 'AI_ANALYSIS'
    | 'ADMIN_ACCESS';

export interface TierConfig {
    label: string;
    features: Feature[];
}

const BASIC_FEATURES: Feature[] = [
    'PROFILE',
    'DASHBOARD_VIEW',
    'MENUS',
    'RECIPES',
    'SHOPPING_LIST',
    'AI_ANALYSIS'
];

const PREMIUM_FEATURES: Feature[] = [
    ...BASIC_FEATURES,
    'FITNESS',
    'CHAT',
    'JOURNAL'
];

export const SUBSCRIPTION_TIERS: Record<SubscriptionTier, TierConfig> = {
    [SubscriptionTier.STANDARD_6]: { label: "Standard 6", features: BASIC_FEATURES },
    [SubscriptionTier.STANDARD_12]: { label: "Standard 12", features: BASIC_FEATURES },
    [SubscriptionTier.STANDARD_24]: { label: "Standard 24", features: BASIC_FEATURES },
    [SubscriptionTier.STANDARD_48]: { label: "Standard 48", features: BASIC_FEATURES },
    [SubscriptionTier.VIP_12]: { label: "VIP 12", features: PREMIUM_FEATURES },
    [SubscriptionTier.VIP_PLUS_16]: { label: "VIP++ 16", features: PREMIUM_FEATURES },
};

/**
 * Checks if a user tier has access to a specific feature.
 */
export function hasFeature(tier: SubscriptionTier | null | undefined, feature: Feature): boolean {
    if (!tier) return false;
    const config = SUBSCRIPTION_TIERS[tier];
    return config?.features.includes(feature) ?? false;
}
