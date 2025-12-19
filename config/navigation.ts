import { LayoutGrid, Map, Scale, MessageCircle, User, Dumbbell, ShoppingBasket } from "lucide-react";

export const NAV_ITEMS = [
    {
        label: "Accueil",
        href: "/dashboard",
        icon: LayoutGrid,
    },
    {
        label: "Fitness",
        href: "/fitness",
        icon: Dumbbell,
    },
    {
        label: "Courses",
        href: "/shopping-list",
        icon: ShoppingBasket,
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
