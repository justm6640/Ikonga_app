import { redirect } from "next/navigation"
import { getOrCreateUser } from "@/lib/actions/user"
import { getAvailableGroups } from "@/lib/actions/groups"
import { GroupCard } from "@/components/groups/GroupCard"
import { Users, Info, Sparkles } from "lucide-react"

export default async function GroupesHubPage() {
    const user = await getOrCreateUser();
    if (!user) redirect("/login");

    const groups = await getAvailableGroups(user.id);

    return (
        <div className="min-h-screen bg-slate-50/50">
            <div className="max-w-xl mx-auto pb-32 px-4 sm:px-6 pt-10 space-y-10">
                {/* Header */}
                <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-xl bg-ikonga-gradient flex items-center justify-center text-white">
                                <Sparkles size={16} />
                            </div>
                            <span className="font-serif font-black text-xl text-slate-900">IKONGA</span>
                        </div>
                        <div className="bg-white p-3 rounded-2xl shadow-sm text-slate-400">
                            <Users size={20} strokeWidth={2.5} />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-4xl font-serif font-black text-slate-900 leading-tight">
                            Ta Communauté
                        </h1>
                        <p className="text-sm text-slate-500 mt-2 font-medium">
                            Ici, tu n'es jamais seule. Échange, motivation et bienveillance.
                        </p>
                    </div>
                </div>

                {/* Groups Grid */}
                <div className="space-y-6">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">
                        Groupes accessibles
                    </h3>
                    <div className="grid gap-6">
                        {groups.map((group) => (
                            <GroupCard
                                key={group.id}
                                name={group.name}
                                description={group.description}
                                status={group.status}
                                unlockDate={group.unlockDate}
                                // We'll link to /[id] later
                                onClick={() => redirect(`/groupes/${group.id}`)}
                            />
                        ))}
                    </div>
                </div>

                {/* Pedagogy Card */}
                <div className="p-6 rounded-[2rem] bg-indigo-50/50 border border-indigo-100/50 flex gap-4">
                    <div className="mt-1">
                        <div className="bg-indigo-100 p-2 rounded-xl text-indigo-600">
                            <Info size={16} />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <h4 className="text-xs font-black text-indigo-900/80 uppercase tracking-wider">
                            Rappel des règles
                        </h4>
                        <p className="text-[11px] text-indigo-900/60 leading-relaxed font-medium">
                            L'accès aux groupes est automatique selon ta phase. <br />
                            Chaque message doit être porteur de soutien et d'ondes positives. ✨
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
