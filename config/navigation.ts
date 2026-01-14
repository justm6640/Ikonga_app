import { LayoutGrid, Map, Scale, MessageCircle, User, Dumbbell, Utensils, Shield } from "lucide-react";
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
        label: "Journal",
        href: "/journal",
        icon: Map, // Keeping Map or switching to something else if needed
        requiredFeature: 'JOURNAL'
    },
    {
        label: "Fitness",
        href: "/fitness",
        icon: Dumbbell,
        requiredFeature: 'FITNESS'
    },
    {
        label: "Nutrition",
        href: "/nutrition",
        icon: Utensils,
        requiredFeature: 'MENUS'
    },
    {
        label: "Pesée",
        href: "/weigh-in",
        icon: Scale,
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
