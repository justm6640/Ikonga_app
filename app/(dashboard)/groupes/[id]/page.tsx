import { redirect, notFound } from "next/navigation"
import { getOrCreateUser } from "@/lib/actions/user"
import { getGroupMessages, sendGroupMessage, getAvailableGroups } from "@/lib/actions/groups"
import { ChatInterface } from "@/components/groups/ChatInterface"
import { ArrowLeft, Users } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import prisma from "@/lib/prisma"

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function GroupPage({ params }: PageProps) {
    const { id } = await params;
    const user = await getOrCreateUser();
    if (!user) redirect("/login");

    // 1. Verify access
    const availableGroups = await getAvailableGroups(user.id);
    const group = availableGroups.find(g => g.id === id);

    if (!group) return notFound();
    if (group.status === "LOCKED") {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center space-y-6">
                <div className="p-6 rounded-[2.5rem] bg-slate-50 text-slate-300">
                    <Users size={64} strokeWidth={1.5} />
                </div>
                <div className="space-y-2">
                    <h1 className="text-3xl font-serif font-black text-slate-900">Groupe Verrouillé</h1>
                    <p className="text-slate-500 max-w-xs mx-auto font-medium">
                        Ce groupe sera accessible dès le {group.unlockDate?.toLocaleDateString("fr-FR", { day: 'numeric', month: 'long' })}.
                        Patience, on s'y retrouve bientôt ! ✨
                    </p>
                </div>
                <Link href="/groupes">
                    <Button variant="outline" className="rounded-2xl gap-2 font-bold px-8">
                        <ArrowLeft size={18} />
                        Retour au Hub
                    </Button>
                </Link>
            </div>
        );
    }

    // 2. Fetch messages
    const initialMessages = await getGroupMessages(id);

    // 3. Define Action wrapper
    async function handleSendMessage(content: string, mediaUrl?: string) {
        "use server"
        await sendGroupMessage(user!.id, id, content, mediaUrl);
    }

    return (
        <div className="flex flex-col h-screen bg-white">
            {/* Header */}
            <div className="p-4 md:p-6 border-b border-slate-100 flex items-center justify-between bg-white z-20">
                <div className="flex items-center gap-4">
                    <Link href="/groupes">
                        <Button variant="ghost" size="icon" className="rounded-2xl hover:bg-slate-50 transition-all">
                            <ArrowLeft size={20} />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-xl font-serif font-black text-slate-900">{group.name}</h1>
                        <div className="flex items-center gap-1.5">
                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                48 abonnés en ligne
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm">
                            <img src={`https://i.pravatar.cc/100?u=${group.id}${i}`} alt="user" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-hidden relative">
                <ChatInterface
                    channelId={id}
                    userId={user.id}
                    initialMessages={JSON.parse(JSON.stringify(initialMessages))}
                    onSendMessage={handleSendMessage}
                />
            </div>
        </div>
    )
}
