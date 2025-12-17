import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
    return (
        <main className="min-h-screen bg-background p-8 font-sans">
            {/* Header avec la Typo Titre */}
            <header className="mb-12 text-center">
                <h1 className="font-serif text-5xl text-foreground mb-2">
                    Bienvenue sur <span className="text-transparent bg-clip-text bg-ikonga-gradient">IKONGA</span>
                </h1>
                <p className="text-muted-foreground font-hand text-2xl">
                    Votre transformation commence ici...
                </p>
            </header>

            {/* Test des Couleurs Piliers */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <Card className="bg-pillar-nutrition border-none shadow-sm">
                    <CardHeader><CardTitle className="text-green-800">Nutrition</CardTitle></CardHeader>
                    <CardContent>Manger mieux, pas moins.</CardContent>
                </Card>
                <Card className="bg-pillar-fitness border-none shadow-sm">
                    <CardHeader><CardTitle className="text-orange-800">Fitness</CardTitle></CardHeader>
                    <CardContent>Bouger pour le plaisir.</CardContent>
                </Card>
                <Card className="bg-pillar-wellness border-none shadow-sm">
                    <CardHeader><CardTitle className="text-purple-800">Wellness</CardTitle></CardHeader>
                    <CardContent>Gérer son stress.</CardContent>
                </Card>
                <Card className="bg-pillar-beauty border-none shadow-sm">
                    <CardHeader><CardTitle className="text-pink-800">Beauty</CardTitle></CardHeader>
                    <CardContent>Se réconcilier avec soi.</CardContent>
                </Card>
            </div>

            {/* Test des Composants Shadcn & Boutons */}
            <div className="space-y-4 text-center">
                <div className="flex justify-center gap-4">
                    <Button size="lg" className="bg-ikonga-gradient hover:opacity-90 transition-opacity rounded-2xl">
                        Commencer l'aventure
                    </Button>
                    <Button variant="outline" size="lg" className="rounded-2xl">
                        Se connecter
                    </Button>
                </div>
                <div className="mt-8">
                    <Badge variant="secondary" className="text-lg py-2 px-4">
                        Test Design System Validé ✅
                    </Badge>
                </div>
            </div>
        </main>
    );
}