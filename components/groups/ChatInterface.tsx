"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Image as ImageIcon, Smile, ShieldCheck, User } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface Message {
    id: string
    content?: string | null
    mediaUrl?: string | null
    createdAt: Date
    sender: {
        id: string
        name: string | null
        role: string
        image: string | null
    }
}

interface ChatInterfaceProps {
    channelId: string
    userId: string
    initialMessages: Message[]
    onSendMessage: (content: string, mediaUrl?: string) => Promise<void>
}

export function ChatInterface({ channelId, userId, initialMessages, onSendMessage }: ChatInterfaceProps) {
    const [messages, setMessages] = useState<Message[]>(initialMessages)
    const [inputValue, setInputValue] = useState("")
    const [isSending, setIsSending] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    // Scroll to bottom on load and new messages
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    const handleSend = async () => {
        if (!inputValue.trim() || isSending) return

        setIsSending(true)
        try {
            await onSendMessage(inputValue)
            setInputValue("")
        } finally {
            setIsSending(false)
        }
    }

    return (
        <div className="flex flex-col h-full bg-slate-50">
            {/* Message List */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-6 flex flex-col no-scrollbar"
            >
                <div className="mt-auto text-center py-8">
                    <div className="inline-block p-4 rounded-[2rem] bg-indigo-50/50 border border-indigo-100/50 text-indigo-900/60 max-w-xs">
                        <p className="text-xs font-medium italic">
                            💛 Ici, on s'encourage, on se respecte et on avance ensemble. Aucun jugement. Aucun shaming.
                        </p>
                    </div>
                </div>

                {initialMessages.map((msg, idx) => {
                    const isOwn = msg.sender.id === userId;
                    const isCoach = msg.sender.role === "ADMIN";

                    return (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            className={cn(
                                "flex items-start gap-3",
                                isOwn ? "flex-row-reverse" : "flex-row"
                            )}
                        >
                            {/* Avatar */}
                            <div className={cn(
                                "h-10 w-10 rounded-2xl shrink-0 overflow-hidden border-2",
                                isCoach ? "border-ikonga-orange" : "border-white"
                            )}>
                                {msg.sender.image ? (
                                    <img src={msg.sender.image} alt="avatar" className="h-full w-full object-cover" />
                                ) : (
                                    <div className="h-full w-full bg-slate-200 flex items-center justify-center text-slate-400">
                                        <User size={20} />
                                    </div>
                                )}
                            </div>

                            <div className={cn(
                                "max-w-[75%] space-y-1",
                                isOwn ? "items-end" : "items-start"
                            )}>
                                {/* Info Line */}
                                <div className={cn(
                                    "flex items-center gap-2",
                                    isOwn ? "flex-row-reverse" : "flex-row"
                                )}>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        {isOwn ? "Moi" : msg.sender.name || "Abonné(e)"}
                                    </span>
                                    {isCoach && (
                                        <span className="text-[8px] font-black uppercase tracking-wider bg-ikonga-orange text-white px-1.5 py-0.5 rounded-md flex items-center gap-1">
                                            <ShieldCheck size={8} />
                                            Coach IKONGA
                                        </span>
                                    )}
                                </div>

                                {/* Message Bubble */}
                                <Card className={cn(
                                    "rounded-[1.5rem] border-none shadow-sm overflow-hidden",
                                    isOwn ? "bg-ikonga-gradient text-white" :
                                        isCoach ? "bg-white ring-1 ring-ikonga-orange/20" : "bg-white",
                                    isOwn ? "rounded-tr-none" : "rounded-tl-none"
                                )}>
                                    <CardContent className="p-4">
                                        {msg.mediaUrl && (
                                            <img
                                                src={msg.mediaUrl}
                                                alt="post"
                                                className="rounded-xl mb-3 w-full object-cover max-h-64 shadow-md"
                                            />
                                        )}
                                        <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">
                                            {msg.content}
                                        </p>
                                    </CardContent>
                                </Card>

                                <span className="text-[9px] font-bold text-slate-300 px-1">
                                    {msg.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </motion.div>
                    )
                })}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-100">
                <div className="max-w-xl mx-auto flex items-center gap-3">
                    <Button variant="ghost" size="icon" className="rounded-2xl text-slate-400 hover:text-ikonga-pink">
                        <ImageIcon size={20} />
                    </Button>
                    <div className="relative flex-1">
                        <Input
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            placeholder="Écris un message bienveillant..."
                            className="rounded-3xl border-none bg-slate-50 focus-visible:ring-1 focus-visible:ring-ikonga-pink/20 pr-12 h-12 text-sm font-medium"
                        />
                        <Button
                            onClick={handleSend}
                            disabled={!inputValue.trim() || isSending}
                            size="icon"
                            className="absolute right-1 top-1 h-10 w-10 rounded-2xl bg-ikonga-gradient text-white shadow-lg shadow-pink-200/50 hover:scale-105 transition-all"
                        >
                            <Send size={18} />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
