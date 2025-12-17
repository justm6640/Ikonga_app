import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export function PhaseCard() {
    // Mock Data
    const currentPhase = "DÉTOX";
    const dayCurrent = 4;
    const dayTotal = 14;
    const progress = (dayCurrent / dayTotal) * 100;

    return (
        <div className={cn(
            "relative overflow-hidden rounded-3xl p-6 text-white cursor-pointer transition-transform hover:scale-[1.02] shadow-lg",
            "bg-ikonga-gradient"
        )}>
            {/* Background Pattern or Overlay could go here */}

            <div className="relative z-10 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm font-medium opacity-90">Phase actuelle</p>
                        <h3 className="text-2xl font-serif font-bold tracking-wide">{currentPhase}</h3>
                    </div>
                    <div className="text-right">
                        <span className="text-3xl font-bold">{dayCurrent}</span>
                        <span className="text-lg opacity-80">/{dayTotal}</span>
                        <p className="text-xs opacity-80">Jours</p>
                    </div>
                </div>

                <div className="space-y-2">
                    <Progress value={progress} className="h-2 bg-white/30" indicatorClassName="bg-white" />
                    <p className="text-xs text-right opacity-90">Restent {dayTotal - dayCurrent} jours</p>
                </div>
            </div>
        </div>
    );
}
