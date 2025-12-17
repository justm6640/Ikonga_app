import { LayoutGrid, Map, Scale, MessageCircle, User } from "lucide-react";

export const NAV_ITEMS = [
    {
        label: "Accueil",
        href: "/dashboard",
        icon: LayoutGrid,
    },
    {
        label: "Phases",
        href: "/phases",
        icon: Map,
    },
    {
        label: "Pesée",
        href: "/weigh-in",
        icon: Scale,
    },
    {
        label: "Coach",
        href: "/chat",
        icon: MessageCircle,
    },
    {
        label: "Profil",
        href: "/profile",
        icon: User,
    },
];
