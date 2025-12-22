import { Leaf, Activity, Moon, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { DailyMenuCard } from "./DailyMenuCard";
import Link from "next/link";

interface PillarItem {
    title: string;
    content: any;
}

interface PillarsGridProps {
    nutrition: PillarItem | null;
    fitness: PillarItem | null;
    wellness: PillarItem | null;
    beauty: PillarItem | null;
}

export function PillarsGrid({ nutrition, fitness, wellness, beauty }: PillarsGridProps) {
    const mainPillars = [
        {
            key: "fitness",
            label: "Fitness",
            icon: Activity,
            color: "bg-pillar-fitness",
            textColor: "text-[#EF6C00]",
            data: fitness
        },
        {
            key: "wellness",
            label: "Wellness",
            icon: Moon,
            color: "bg-pillar-wellness",
            textColor: "text-[#7B1FA2]",
            data: wellness
        },
        {
            key: "beauty",
            label: "Beauty",
            icon: Sparkles,
            color: "bg-pillar-beauty",
            textColor: "text-[#C2185B]",
            data: beauty
        },
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Nutrition Pillar (Full Width on mobile) */}
            <div className="w-full">
                <DailyMenuCard menu={nutrition} />
            </div>

            {/* Other Pillars Sidebar/Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-4 h-fit">
                {mainPillars.map((pillar) => {
                    const Content = (
                        <Card
                            key={pillar.key}
                            className={cn(
                                "border-none shadow-sm flex flex-col items-center justify-center p-4 py-6 rounded-3xl cursor-pointer transition-transform hover:scale-105 active:scale-95 text-center min-h-[140px] w-full",
                                pillar.color
                            )}
                        >
                            <div className={cn("p-3 rounded-full bg-white/60 mb-3", pillar.textColor)}>
                                <pillar.icon size={24} />
                            </div>

                            <span className={cn("font-bold text-xs mb-1 leading-tight line-clamp-2", pillar.textColor)}>
                                {pillar.data?.title || pillar.label}
                            </span>

                            {pillar.data ? (
                                <span className="text-[10px] text-muted-foreground/80 font-medium uppercase tracking-wider">
                                    Séance du jour
                                </span>
                            ) : (
                                <span className="text-[10px] text-muted-foreground/60 italic uppercase tracking-wider">
                                    À venir
                                </span>
                            )}
                        </Card>
                    );

                    if (pillar.key === "fitness") {
                        return (
                            <Link key={pillar.key} href="/fitness" className="w-full">
                                {Content}
                            </Link>
                        );
                    }

                    return Content;
                })}
            </div>
        </div>
    );
}
