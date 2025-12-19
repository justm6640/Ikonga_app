import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { PhaseType } from "@prisma/client";
import { differenceInDays } from "date-fns";

interface PhaseCardProps {
    phase: PhaseType | string;
    startDate: Date;
    plan?: string;
}

export function PhaseCard({ phase, startDate, plan }: PhaseCardProps) {
    const dayCurrent = Math.max(1, differenceInDays(new Date(), new Date(startDate)) + 1);

    // Defaulting to 14 days for Detox/Initial phases, can be dynamic later
    const dayTotal = 14;
    const progress = Math.min(100, (dayCurrent / dayTotal) * 100);

    const phaseLabel = phase.toString().replace("_", " ");

    return (
        <div className={cn(
            "relative overflow-hidden rounded-3xl p-6 text-white cursor-pointer transition-transform hover:scale-[1.02] shadow-lg",
            "bg-ikonga-gradient"
        )}>
            <div className="relative z-10 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm font-medium opacity-90">Phase actuelle</p>
                        <h3 className="text-2xl font-serif font-bold tracking-wide uppercase">{phaseLabel}</h3>
                        {plan && <p className="text-[10px] font-bold opacity-70 mt-1 uppercase tracking-wider">{plan}</p>}
                    </div>
                    <div className="text-right">
                        <span className="text-3xl font-bold">{dayCurrent}</span>
                        <span className="text-lg opacity-80">/{dayTotal}</span>
                        <p className="text-xs opacity-80">Jours</p>
                    </div>
                </div>

                <div className="space-y-2">
                    <Progress value={progress} className="h-2 bg-white/30" indicatorClassName="bg-white" />
                    <p className="text-xs text-right opacity-90">
                        {dayCurrent >= dayTotal ? "Phase terminée !" : `Reste ${dayTotal - dayCurrent} jours`}
                    </p>
                </div>
            </div>
        </div>
    );
}
