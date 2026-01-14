"use client"

import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, XCircle, Info } from "lucide-react"

interface PhaseGuidelinesProps {
    allowed: string[]
    forbidden: string[]
}

export function PhaseGuidelines({ allowed, forbidden }: PhaseGuidelinesProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* À Faire / Autorisé */}
            <Card className="rounded-[2rem] border-none bg-emerald-50/50 shadow-sm overflow-hidden">
                <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
                            <CheckCircle2 size={20} />
                        </div>
                        <h3 className="font-serif font-black text-emerald-900 uppercase tracking-widest text-sm">
                            À privilégier
                        </h3>
                    </div>
                    <ul className="space-y-3">
                        {allowed.length > 0 ? (
                            allowed.map((item, index) => (
                                <li key={index} className="flex items-start gap-3 text-sm font-bold text-emerald-800/70">
                                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                    {item}
                                </li>
                            ))
                        ) : (
                            <li className="text-sm italic text-emerald-600/50">Aucune directive spécifique.</li>
                        )}
                    </ul>
                </CardContent>
            </Card>

            {/* À Éviter / Interdit */}
            <Card className="rounded-[2rem] border-none bg-rose-50/50 shadow-sm overflow-hidden">
                <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-xl bg-rose-500 text-white shadow-lg shadow-rose-500/20">
                            <XCircle size={20} />
                        </div>
                        <h3 className="font-serif font-black text-rose-900 uppercase tracking-widest text-sm">
                            À éviter
                        </h3>
                    </div>
                    <ul className="space-y-3">
                        {forbidden.length > 0 ? (
                            forbidden.map((item, index) => (
                                <li key={index} className="flex items-start gap-3 text-sm font-bold text-rose-800/70">
                                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                                    {item}
                                </li>
                            ))
                        ) : (
                            <li className="text-sm italic text-rose-600/50">Aucune restriction majeure identifiée.</li>
                        )}
                    </ul>
                </CardContent>
            </Card>
        </div>
    )
}
