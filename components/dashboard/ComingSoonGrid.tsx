"use client"

import { ShoppingBag, GraduationCap, Zap, Mic, Sparkles, Lock } from "lucide-react"
import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"

const FUTURE_ITEMS = [
    { id: "shop", label: "Shop", icon: ShoppingBag, color: "text-rose-400", bg: "bg-rose-50" },
    { id: "academy", label: "Academy", icon: GraduationCap, color: "text-indigo-400", bg: "bg-indigo-50" },
    { id: "challenges", label: "Défis", icon: Zap, color: "text-amber-400", bg: "bg-amber-50" },
    { id: "podcasts", label: "Podcasts", icon: Mic, color: "text-cyan-400", bg: "bg-cyan-50" },
    { id: "ai_scan", label: "Scan IA", icon: Sparkles, color: "text-fuchsia-400", bg: "bg-fuchsia-50" },
]

export function ComingSoonGrid() {
    return (
        <section className="space-y-4 pt-4 pb-12">
            <h3 className="text-lg font-serif font-black text-slate-800 ml-1">Bientôt disponible</h3>
            <div className="flex gap-3 overflow-x-auto pb-6 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-5">
                {FUTURE_ITEMS.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="min-w-[85px] sm:min-w-0 flex-1"
                    >
                        <Card className="border-none shadow-sm bg-white p-3 rounded-3xl flex flex-col items-center justify-center gap-3 relative overflow-hidden group h-full h-[100px]">
                            <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity ${item.bg}`} />

                            <div className="absolute top-2 right-2 opacity-20">
                                <Lock size={10} className="text-slate-400" />
                            </div>

                            <div className={`p-2.5 rounded-2xl ${item.bg} ${item.color} grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 mb-1`}>
                                <item.icon size={20} strokeWidth={2.5} />
                            </div>

                            <span className="text-[10px] font-black uppercase tracking-tight text-slate-400 group-hover:text-slate-600 transition-colors">
                                {item.label}
                            </span>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </section>
    )
}
