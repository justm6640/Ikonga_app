"use client"

import { differenceInCalendarDays } from "date-fns"
import { Calendar, ShoppingBag, Sparkles, User } from "lucide-react"
import Link from "next/link"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface CountdownHeroProps {
    daysRemaining: number
    userName: string
}

export function CountdownHero({ daysRemaining, userName }: CountdownHeroProps) {
    const isPreparationMode = daysRemaining <= 2

    return (
        <Card className="border-none shadow-lg overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 p-12 opacity-[0.06] pointer-events-none">
                <Sparkles size={200} className="text-slate-900 -rotate-12" />
            </div>

            <CardContent className="p-8 md:p-12 relative z-10">
                <div className="max-w-3xl mx-auto text-center space-y-6">
                    {/* Greeting */}
                    <div className="flex items-center justify-center gap-2 text-slate-500">
                        <User size={16} />
                        <p className="text-sm font-medium uppercase tracking-widest">
                            Bonjour {userName}
                        </p>
                    </div>

                    {/* Main Title */}
                    <div className="space-y-3">
                        {isPreparationMode ? (
                            <>
                                <h1 className="text-4xl md:text-5xl font-serif font-black text-slate-900 tracking-tight">
                                    C'est pour bientôt ! 🎉
                                </h1>
                                <div className="inline-block">
                                    <div className="bg-ikonga-gradient text-white px-6 py-3 rounded-2xl shadow-lg">
                                        <p className="text-2xl md:text-3xl font-bold">
                                            J-{daysRemaining}
                                        </p>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <h1 className="text-3xl md:text-4xl font-serif font-black text-slate-900 tracking-tight">
                                    Ton voyage commence dans
                                </h1>
                                <div className="inline-block">
                                    <div className="bg-white border-2 border-slate-200 px-8 py-4 rounded-3xl shadow-sm">
                                        <p className="text-5xl md:text-6xl font-black text-ikonga-coral">
                                            {daysRemaining}
                                        </p>
                                        <p className="text-sm text-slate-500 font-medium uppercase tracking-widest mt-1">
                                            {daysRemaining > 1 ? "jours" : "jour"}
                                        </p>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Message */}
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/80 shadow-sm">
                        <div className="flex items-start gap-3 text-left max-w-xl mx-auto">
                            <Calendar className="text-indigo-500 mt-1 flex-shrink-0" size={20} />
                            <div className="space-y-2">
                                <p className="text-slate-700 font-medium leading-relaxed">
                                    {isPreparationMode ? (
                                        <>
                                            Tes menus sont prêts ! Tu peux déjà consulter ta{" "}
                                            <span className="font-bold text-ikonga-coral">liste de courses</span> pour
                                            tout préparer sereinement.
                                        </>
                                    ) : (
                                        <>
                                            Profite pour te reposer, faire le vide.{" "}
                                            <span className="font-bold text-indigo-600">Nous préparons tout pour toi</span>
                                            {" "}en coulisse. 🧘‍♀️✨
                                        </>
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Button (Preparation mode only) */}
                    {isPreparationMode && (
                        <div className="pt-4">
                            <Link href="/shopping-list">
                                <Button
                                    size="lg"
                                    className="bg-ikonga-gradient hover:opacity-90 text-white shadow-lg hover:shadow-xl transition-all font-bold px-8 py-6 text-base"
                                >
                                    <ShoppingBag className="mr-2 h-5 w-5" />
                                    Voir ma liste de courses
                                </Button>
                            </Link>
                        </div>
                    )}

                    {/* Footer hint */}
                    <div className="pt-2">
                        <p className="text-xs text-slate-400 font-light">
                            Pas prêt ? Tu peux{" "}
                            <Link href="/profile" className="underline hover:text-ikonga-coral transition-colors font-medium">
                                changer ta date
                            </Link>
                            {" "}dans ton profil.
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
