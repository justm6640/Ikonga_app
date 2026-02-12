"use client"

import { Card, CardContent } from "@/components/ui/card"
import { AnalysisResult } from "@/lib/validators/analysis"
import {
    Sparkles,
    Salad,
    Dumbbell,
    Heart,
    Zap,
    Coffee,
    User,
    Star,
    ArrowRight,
    Quote
} from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface AnalysisWidgetProps {
    analysis: AnalysisResult | null
}

export function AnalysisWidget({ analysis }: AnalysisWidgetProps) {
    if (!analysis) {
        return (
            <Card className="border-none bg-gradient-to-br from-pink-50 to-purple-50 backdrop-blur-sm shadow-xl mb-6 rounded-[2.5rem] overflow-hidden">
                <CardContent className="py-16 text-center relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-ikonga-coral/5 to-purple-500/5" />
                    <motion.div
                        animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="relative z-10"
                    >
                        <Sparkles className="h-12 w-12 text-ikonga-coral mx-auto mb-4 animate-glow" />
                    </motion.div>
                    <p className="text-lg font-serif italic text-slate-600 relative z-10">
                        Rosy analyse ton profil avec attention...
                    </p>
                </CardContent>
            </Card>
        )
    }

    const sections = [
        {
            key: 'nutrition',
            title: 'IKONUTRITION',
            icon: Salad,
            gradient: 'from-emerald-400 to-teal-500',
            bg: 'bg-emerald-50'
        },
        {
            key: 'fitness',
            title: 'IKOFITNESS',
            icon: Dumbbell,
            gradient: 'from-orange-400 to-red-500',
            bg: 'bg-orange-50'
        },
        {
            key: 'wellness',
            title: 'IKOWELLNESS',
            icon: Heart,
            gradient: 'from-purple-400 to-pink-500',
            bg: 'bg-purple-50'
        },
        {
            key: 'nutrition_plus',
            title: 'IKONUTRITION+',
            icon: Zap,
            gradient: 'from-yellow-400 to-orange-500',
            bg: 'bg-yellow-50'
        },
        {
            key: 'lifestyle',
            title: 'IKOLIFESTYLE',
            icon: Coffee,
            gradient: 'from-cyan-400 to-blue-500',
            bg: 'bg-cyan-50'
        },
        {
            key: 'beauty',
            title: 'IKOBEAUTY',
            icon: User,
            gradient: 'from-pink-400 to-rose-500',
            bg: 'bg-pink-50'
        }
    ]

    return (
        <div className="space-y-6 mb-8">
            {/* Hero Introduction Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-[2.5rem] bg-ikonga-gradient p-[3px] shadow-premium"
            >
                <div className="bg-white rounded-[2.4rem] p-8 md:p-10 relative overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-48 h-48 bg-ikonga-coral/5 rounded-full -mr-24 -mt-24 blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-400/5 rounded-full -ml-16 -mb-16 blur-2xl" />

                    <Quote className="absolute top-6 left-6 h-8 w-8 text-ikonga-orange/20 fill-ikonga-orange/20" />

                    <div className="relative z-10 space-y-3">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="bg-ikonga-gradient p-2 rounded-xl">
                                <Sparkles size={18} className="text-white" />
                            </div>
                            <span className="text-xs font-black uppercase tracking-[0.2em] text-ikonga-orange">Analyse Rosy</span>
                        </div>
                        <p className="text-xl md:text-2xl font-serif text-slate-800 leading-relaxed italic">
                            {analysis.introduction}
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Core Sections - Magazine Grid */}
            <div className="grid grid-cols-1 gap-5">
                {sections.map((section, index) => {
                    const rawContent = (analysis as any)[section.key]
                    if (!rawContent) return null

                    const content = typeof rawContent === 'string'
                        ? rawContent
                        : typeof rawContent === 'object' && rawContent.analysis
                            ? rawContent.analysis
                            : JSON.stringify(rawContent)

                    const Icon = section.icon

                    return (
                        <motion.div
                            key={section.key}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 rounded-[2rem] overflow-hidden group bg-white">
                                <div className={cn("h-2 bg-gradient-to-r", section.gradient)} />
                                <CardContent className="p-6 md:p-8">
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className={cn(
                                            "p-3 rounded-2xl shrink-0 shadow-sm transition-transform group-hover:scale-110 duration-300",
                                            section.bg
                                        )}>
                                            <Icon size={24} className={cn("bg-gradient-to-br bg-clip-text text-transparent", section.gradient)} strokeWidth={2.5} />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-1">
                                                {section.title}
                                            </h3>
                                            <div className={cn("h-1 w-12 rounded-full bg-gradient-to-r", section.gradient)} />
                                        </div>
                                    </div>
                                    <div className="prose prose-sm max-w-none">
                                        <p className="text-slate-600 leading-relaxed whitespace-pre-line text-sm">
                                            {content}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )
                })}
            </div>

        </div>
    )
}
