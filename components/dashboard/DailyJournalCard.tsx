import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";

export function DailyJournalCard() {
    return (
        <Card className="rounded-3xl border border-dashed border-primary/20 bg-primary/5 shadow-sm">
            <CardContent className="p-6 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-serif font-bold text-foreground">Remplir mon journal</h3>
                    <p className="text-sm text-muted-foreground">Repas, Sport, Ressenti...</p>
                </div>
                <Button size="icon" className="h-12 w-12 rounded-full bg-ikonga-gradient shadow-md hover:opacity-90 transition-opacity">
                    <PlusCircle className="text-white" />
                </Button>
            </CardContent>
        </Card>
    );
}
