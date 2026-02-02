import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { JournalEntryForm } from "@/components/journal/JournalEntryForm"
import { getTodayJournalEntry } from "@/lib/actions/journal"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

import { protectFeature } from "@/lib/security/permissions"

export default async function JournalPage() {
    await protectFeature("JOURNAL")
    const todayEntry = await getTodayJournalEntry()
    const todayDate = format(new Date(), "EEEE d MMMM", { locale: fr })

    return (
        <main className="max-w-xl mx-auto px-6 pt-6 pb-12 min-h-screen bg-transparent">
            {/* Back Link */}
            <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest mb-8 hover:text-ikonga-coral transition-colors"
            >
                <ChevronLeft size={14} /> Retour au tableau de bord
            </Link>

            <header className="mb-10">
                <h1 className="text-3xl font-serif font-black text-slate-900 mb-1 leading-tight">
                    Comment vous sentez-vous aujourd'hui ?
                </h1>
                <p className="text-ikonga-coral font-hand text-2xl capitalize">
                    {todayDate}
                </p>
            </header>

            {todayEntry && (
                <div className="mb-10 p-6 bg-white border-2 border-emerald-100 rounded-[2rem] shadow-sm flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-100 shrink-0">
                        <span className="text-xl">✨</span>
                    </div>
                    <div>
                        <h3 className="text-emerald-900 font-black text-sm uppercase tracking-tight">Journal complété</h3>
                        <p className="text-emerald-600/70 text-xs font-medium italic">Vous pouvez toujours modifier vos entrées ci-dessous.</p>
                    </div>
                </div>
            )}

            <JournalEntryForm initialData={todayEntry} />
        </main>
    )
}
