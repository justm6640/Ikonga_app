import { getUserAccessiblePhases } from "@/lib/utils/phase-access"
import { PhaseProgress } from "@/components/phases/PhaseProgress"
import { UpcomingPhaseBanner } from "@/components/phases/UpcomingPhaseBanner"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function PhasesDemoPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Récupérer les phases accessibles
    const accessible = await getUserAccessiblePhases(user.id)

    return (
        <div className="min-h-screen bg-slate-50 p-6 space-y-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-black text-slate-900 mb-2">
                    Gestion des Phases IKONGA
                </h1>
                <p className="text-slate-600 mb-8">
                    Exemple d'implémentation de la visibilité conditionnelle des phases
                </p>

                {/* Banner pour phase à venir (J-2) */}
                {accessible.upcoming && (
                    <UpcomingPhaseBanner upcomingPhase={accessible.upcoming} />
                )}

                {/* Timeline des phases */}
                {accessible.current && (
                    <PhaseProgress
                        current={accessible.current}
                        upcoming={accessible.upcoming}
                        past={accessible.past}
                        all={accessible.all}
                    />
                )}

                {/* Informations de debug */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200">
                    <h2 className="text-sm font-black uppercase tracking-wider text-slate-500 mb-4">
                        État des accès (Debug)
                    </h2>
                    <div className="space-y-2 text-sm">
                        <p className="text-slate-700">
                            <span className="font-bold">Phase active:</span>{" "}
                            {accessible.current?.type || "Aucune"}
                        </p>
                        <p className="text-slate-700">
                            <span className="font-bold">Phase suivante (preview J-2):</span>{" "}
                            {accessible.upcoming?.type || "Aucune"}
                        </p>
                        <p className="text-slate-700">
                            <span className="font-bold">Phases passées:</span>{" "}
                            {accessible.past.length > 0
                                ? accessible.past.map(p => p.type).join(", ")
                                : "Aucune"}
                        </p>
                        <p className="text-slate-700">
                            <span className="font-bold">Total phases:</span>{" "}
                            {accessible.all.length}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
