import { Leaf, Activity, Moon, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const PILLARS = [
    { label: "Nutrition", icon: Leaf, color: "bg-pillar-nutrition", textColor: "text-[#2E7D32]" },
    { label: "Fitness", icon: Activity, color: "bg-pillar-fitness", textColor: "text-[#EF6C00]" },
    { label: "Wellness", icon: Moon, color: "bg-pillar-wellness", textColor: "text-[#7B1FA2]" },
    { label: "Beauty", icon: Sparkles, color: "bg-pillar-beauty", textColor: "text-[#C2185B]" },
];

export function PillarsGrid() {
    return (
        <div className="grid grid-cols-2 gap-4">
            {PILLARS.map((pillar) => (
                <Card
                    key={pillar.label}
                    className={cn(
                        "border-none shadow-sm flex flex-col items-center justify-center p-4 py-8 rounded-3xl cursor-pointer transition-transform hover:scale-105",
                        pillar.color
                    )}
                >
                    <div className={cn("p-3 rounded-full bg-white/60 mb-3", pillar.textColor)}>
                        <pillar.icon size={24} />
                    </div>
                    <span className={cn("font-medium text-sm", pillar.textColor)}>
                        {pillar.label}
                    </span>
                </Card>
            ))}
        </div>
    );
}
