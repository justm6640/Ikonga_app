import { getNewSubscribers } from "@/lib/actions/admin";
import { NewSubscribersClient } from "@/components/admin/NewSubscribersClient";

export default async function NewSubscribersPage() {
    const subscribers = await getNewSubscribers();

    return (
        <div className="p-6 md:p-10 space-y-8">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-serif font-black text-slate-900">
                    Pilotage Nouveaux Abonnés
                </h1>
                <p className="text-slate-500 font-medium">
                    Suivi et accompagnement des 7 derniers jours d'inscription
                </p>
            </div>

            <NewSubscribersClient initialData={subscribers} />
        </div>
    );
}
