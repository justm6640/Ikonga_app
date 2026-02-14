"use client";

import { useEffect, useState } from "react";
import { generateMetricAnalysis, IndicatorType } from "@/lib/actions/ai-indicators";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, BrainCircuit, HeartPulse, Target, ThumbsUp } from "lucide-react";
import { motion } from "framer-motion";

interface AIAnalysisProps {
    indicatorType: IndicatorType;
    metrics: {
        firstName: string;
        weight: number;
        heightCm: number;
        age: number;
        gender: string;
        bmi: number;
        pisi: number;
        targetWeight: number;
        bodyFat?: number;
        bmr?: number;
        metabolicAge?: number;
    };
}

export function AIAnalysis({ metrics, indicatorType }: AIAnalysisProps) {
    const [analysis, setAnalysis] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        async function fetchAnalysis() {
            setLoading(true);
            try {
                const result = await generateMetricAnalysis(metrics, indicatorType);
                if (mounted) {
                    setAnalysis(result);
                    setLoading(false);
                }
            } catch (error) {
                console.error("Failed to fetch analysis", error);
                if (mounted) setLoading(false);
            }
        }

        fetchAnalysis();

        return () => { mounted = false; };
    }, [metrics.weight, indicatorType]); // Re-run if weight or type changes

    if (loading) {
        return (
            <Card className="rounded-[2.5rem] border-none shadow-xl bg-gradient-to-br from-indigo-50 to-white overflow-hidden relative">
                <div className="absolute inset-0 bg-white/40 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-4">
                    <div className="relative">
                        <div className="w-16 h-16 rounded-full border-4 border-indigo-100 border-t-indigo-500 animate-spin" />
                        <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-500 animate-pulse" size={24} />
                    </div>
                    <p className="text-indigo-900 font-medium animate-pulse">Rosy analyse ton métabolisme...</p>
                </div>
                <CardContent className="p-8 opacity-50 blur-sm h-64" />
            </Card>
        );
    }

    if (!analysis) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-indigo-100/50 bg-white overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                            <BrainCircuit className="text-white" size={24} />
                        </div>
                        <div>
                            <h3 className="text-white font-serif font-bold text-xl">L'Analyse de Rosy</h3>
                            <p className="text-indigo-100 text-sm">Basée sur ta pesée actuelle</p>
                        </div>
                    </div>
                    <Sparkles className="text-yellow-300 animate-pulse" />
                </div>

                <CardContent className="p-8 space-y-8">
                    {/* Explanation */}
                    <div className="space-y-3">
                        <h4 className="flex items-center gap-2 text-indigo-900 font-bold uppercase tracking-wider text-sm">
                            <Target size={18} className="text-indigo-500" />
                            Comprendre ton chiffre
                        </h4>
                        <p className="text-slate-600 leading-relaxed text-lg">
                            {analysis.explanation}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Health Impact */}
                        <div className="bg-emerald-50/50 rounded-3xl p-6 space-y-3 border border-emerald-100">
                            <h4 className="flex items-center gap-2 text-emerald-800 font-bold uppercase tracking-wider text-sm">
                                <HeartPulse size={18} className="text-emerald-500" />
                                Impact Santé
                            </h4>
                            <p className="text-emerald-900/80 leading-relaxed text-sm font-medium">
                                {analysis.health_impact}
                            </p>
                        </div>

                        {/* Strategy */}
                        <div className="bg-amber-50/50 rounded-3xl p-6 space-y-3 border border-amber-100">
                            <h4 className="flex items-center gap-2 text-amber-800 font-bold uppercase tracking-wider text-sm">
                                <Sparkles size={18} className="text-amber-500" />
                                Stratégie IKONGA
                            </h4>
                            <p className="text-amber-900/80 leading-relaxed text-sm font-medium">
                                {analysis.ikonga_strategy}
                            </p>
                        </div>
                    </div>

                    {/* Encouragement */}
                    <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <ThumbsUp className="text-pink-500" size={24} />
                        <p className="text-slate-700 font-medium italic">
                            "{analysis.encouragement}"
                        </p>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
