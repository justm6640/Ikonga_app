import { LayoutGrid, Map, Scale, MessageCircle, User, Dumbbell, Utensils, Shield, Sparkles } from "lucide-react";
import { Feature } from "./subscriptions";

export interface NavItem {
    label: string;
    href: string;
    icon: any;
    requiredFeature?: Feature;
}

export const NAV_ITEMS: NavItem[] = [
    {
        label: "Accueil",
        href: "/dashboard",
        icon: LayoutGrid,
        requiredFeature: 'DASHBOARD_VIEW'
    },
    {
        label: "Pesée",
        href: "/weigh-in",
        icon: Scale,
        requiredFeature: 'DASHBOARD_VIEW'
    },
    {
        label: "IKO-NUTRITION",
        href: "/nutrition",
        icon: Utensils,
        requiredFeature: 'MENUS'
    },
    {
        label: "IKO-WELLNESS",
        href: "/wellness",
        icon: Map,
        requiredFeature: 'JOURNAL'
    },
    {
        label: "IKO-FITNESS",
        href: "/fitness",
        icon: Dumbbell,
        requiredFeature: 'FITNESS'
    },
    {
        label: "IKO-BEAUTY",
        href: "/beauty",
        icon: Sparkles,
        requiredFeature: 'DASHBOARD_VIEW'
    },
    {
        label: "Profil",
        href: "/profile",
        icon: User,
        requiredFeature: 'PROFILE'
    },
    {
        label: "Admin",
        href: "/admin",
        icon: Shield,
        requiredFeature: 'ADMIN_ACCESS'
    },
];
