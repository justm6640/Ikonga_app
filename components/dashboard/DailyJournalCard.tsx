"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle, Utensils, Activity, Sparkles, Brain, Heart } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export function DailyJournalCard() {
    return (
        <Link href="/journal">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300 }}
            >
                <Card className="rounded-[2.5rem] border-none bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 shadow-xl shadow-indigo-100/50 overflow-hidden relative group cursor-pointer">
                    {/* Animated gradient orbs */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full -mr-12 -mt-12 blur-3xl opacity-50 group-hover:opacity-70 transition-opacity" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-pink-200 to-rose-200 rounded-full -ml-8 -mb-8 blur-3xl opacity-40 group-hover:opacity-60 transition-opacity" />

                    <CardContent className="p-6 sm:p-8 flex items-center justify-between relative z-10 gap-4">
                        <div className="space-y-2 flex-1">
                            <p className="text-[10px] uppercase font-black text-indigo-400 tracking-[0.2em]">Mon Journal</p>
                            <h3 className="text-lg sm:text-xl font-serif font-black text-slate-900 leading-tight">
                                Remplir mes repas & activités
                            </h3>
                            <div className="flex items-center gap-2 pt-1">
                                {[Utensils, Activity, Brain, Sparkles, Heart].map((Icon, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 0.5, scale: 1 }}
                                        transition={{ delay: 0.1 * i }}
                                        className="text-slate-400 group-hover:text-indigo-500 transition-colors"
                                    >
                                        <Icon size={14} strokeWidth={2.5} />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                        <Button
                            size="icon"
                            className="h-14 w-14 sm:h-16 sm:w-16 rounded-3xl bg-ikonga-gradient shadow-2xl shadow-pink-300/50 group-hover:rotate-90 group-hover:shadow-pink-400/60 transition-all duration-700 shrink-0"
                        >
                            <PlusCircle className="text-white" size={28} strokeWidth={2.5} />
                        </Button>
                    </CardContent>
                </Card>
            </motion.div>
        </Link>
    );
}
