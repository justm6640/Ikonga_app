import { ContentForm } from "@/components/admin/ContentForm"
import { Card, CardContent } from "@/components/ui/card"

export default function NewContentPage() {
    return (
        <div className="p-4 md:p-8 lg:p-10 space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Ajouter du contenu</h2>
                    <p className="text-slate-500 mt-2 text-sm max-w-2xl">
                        Alimentez la bibliothèque de contenus avec des vidéos, audios ou conseils.
                        Visibilité pilotée par les phases.
                    </p>
                </div>
            </div>

            <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2rem] overflow-hidden bg-white">
                <CardContent className="p-6 md:p-8">
                    <ContentForm />
                </CardContent>
            </Card>
        </div>
    )
}
