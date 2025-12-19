import { ContentForm } from "@/components/admin/ContentForm"

export default function NewContentPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-serif text-slate-800">Ajouter du contenu</h2>
            </div>

            <p className="text-slate-600 max-w-2xl">
                Ajoutez une nouvelle vidéo, un audio ou un conseil pour alimenter la bibliothèque de contenus.
                Ce contenu sera visible par les utilisatrices selon leur phase.
            </p>

            <ContentForm />
        </div>
    )
}
