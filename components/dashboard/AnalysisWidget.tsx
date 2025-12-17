"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { AnalysisResult } from "@/lib/ai/generator"
import { Sparkles, Salad, Dumbbell, Heart, Quote } from "lucide-react"

interface AnalysisWidgetProps {
    analysis: AnalysisResult | null
}

export function AnalysisWidget({ analysis }: AnalysisWidgetProps) {
    if (!analysis) {
        return (
            <Card className="border-ikonga-pink/20 bg-background/50 backdrop-blur-sm shadow-sm mb-6">
                <CardContent className="py-8 text-center text-muted-foreground">
                    <Sparkles className="h-8 w-8 text-ikonga-pink mx-auto mb-2 opacity-50 animate-pulse" />
                    <p>Ton coach prépare ton bilan personnalisé...</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="border-ikonga-pink/20 bg-gradient-to-b from-white to-pink-50/30 overflow-hidden shadow-md mb-8">
            <CardHeader className="bg-ikonga-pink/5 border-b border-ikonga-pink/10 pb-4">
                <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-ikonga-pink" />
                    <CardTitle className="text-xl font-serif text-ikonga-pink">Ton Bilan Personnalisé</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                {/* Introduction Quote style */}
                <div className="relative pl-6 mb-6">
                    <Quote className="absolute top-0 left-0 h-4 w-4 text-ikonga-pink/40 -scale-x-100" />
                    <p className="text-muted-foreground italic font-medium leading-relaxed">
                        {analysis.introduction}
                    </p>
                </div>

                {/* Content Accordion */}
                <Accordion type="single" collapsible className="w-full space-y-2">

                    {/* Nutrition */}
                    {analysis.nutrition && (
                        <AccordionItem value="nutrition" className="border rounded-xl px-4 bg-white/60">
                            <AccordionTrigger className="hover:no-underline hover:text-ikonga-pink transition-colors py-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-full bg-green-100 text-green-600">
                                        <Salad className="h-4 w-4" />
                                    </div>
                                    <span className="font-semibold">Nutrition</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-2 pb-4 space-y-3">
                                <p className="text-sm text-foreground/80">{analysis.nutrition.analysis}</p>
                                <div className="space-y-1">
                                    {analysis.nutrition.tips?.map((tip, i) => (
                                        <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground bg-green-50/50 p-2 rounded-lg">
                                            <span className="text-green-500 font-bold">•</span>
                                            {tip}
                                        </div>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    )}

                    {/* Fitness */}
                    {analysis.fitness && (
                        <AccordionItem value="fitness" className="border rounded-xl px-4 bg-white/60">
                            <AccordionTrigger className="hover:no-underline hover:text-ikonga-pink transition-colors py-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-full bg-orange-100 text-orange-600">
                                        <Dumbbell className="h-4 w-4" />
                                    </div>
                                    <span className="font-semibold">Fitness</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-2 pb-4 space-y-3">
                                <p className="text-sm text-foreground/80">{analysis.fitness.analysis}</p>
                                <div className="space-y-1">
                                    {analysis.fitness.tips?.map((tip, i) => (
                                        <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground bg-orange-50/50 p-2 rounded-lg">
                                            <span className="text-orange-500 font-bold">•</span>
                                            {tip}
                                        </div>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    )}

                    {/* Wellness */}
                    {analysis.wellness && (
                        <AccordionItem value="wellness" className="border rounded-xl px-4 bg-white/60">
                            <AccordionTrigger className="hover:no-underline hover:text-ikonga-pink transition-colors py-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-full bg-purple-100 text-purple-600">
                                        <Heart className="h-4 w-4" />
                                    </div>
                                    <span className="font-semibold">Bien-être</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-2 pb-4 space-y-3">
                                <p className="text-sm text-foreground/80">{analysis.wellness.analysis}</p>
                                <div className="space-y-1">
                                    {analysis.wellness.tips?.map((tip, i) => (
                                        <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground bg-purple-50/50 p-2 rounded-lg">
                                            <span className="text-purple-500 font-bold">•</span>
                                            {tip}
                                        </div>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    )}

                </Accordion>

                {/* Conclusion */}
                <div className="mt-6 p-4 rounded-xl bg-ikonga-gradient/10 border border-ikonga-pink/10 text-center">
                    <p className="text-sm font-medium text-ikonga-pink-dark">
                        ✨ {analysis.conclusion}
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
