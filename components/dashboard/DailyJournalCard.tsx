import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export function DailyJournalCard() {
    return (
        <Link href="/journal">
            <Card className="rounded-[2rem] border border-dashed border-ikonga-pink/20 bg-ikonga-pink/5 shadow-sm transition-transform hover:scale-[1.02] active:scale-95 cursor-pointer group">
                <CardContent className="p-6 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-serif font-black text-slate-800">Mon Journal de Bord</h3>
                        <p className="text-sm text-slate-400 font-medium">Sommeil, Humeur, Digestion...</p>
                    </div>
                    <Button
                        size="icon"
                        className="h-14 w-14 rounded-full bg-ikonga-gradient shadow-lg shadow-pink-200 group-hover:rotate-90 transition-transform duration-500"
                    >
                        <PlusCircle className="text-white" size={28} />
                    </Button>
                </CardContent>
            </Card>
        </Link>
    );
}
