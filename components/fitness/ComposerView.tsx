"use client"

import { useState } from "react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Sparkles, Activity, Target, Timer } from "lucide-react"
import { cn } from "@/lib/utils"

export function ComposerView() {
    const [duration, setDuration] = useState([20])
    const [intensity, setIntensity] = useState("MOYENNE")
    const [zone, setZone] = useState("CORPS_ENTIER")

    return (
        <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Duration Section */}
            <div className="space-y-4">
                <div className="flex items-end justify-between">
                    <label className="text-xs font-black text-slate-900 uppercase tracking-wide">Durée souhaitée</label>
                    <span className="text-sm font-bold text-pink-500">{duration[0]} min</span>
                </div>

                <div className="px-2">
                    <Slider
                        defaultValue={[20]}
                        max={45}
                        min={5}
                        step={5}
                        value={duration}
                        onValueChange={setDuration}
                        className="[&>.relative>.absolute]:bg-pink-500 [&>span]:border-pink-500 [&>span]:focus:ring-pink-200"
                    />
                    <div className="flex justify-between mt-2">
                        <span className="text-[10px] text-slate-400 font-medium">5 min</span>
                        <span className="text-[10px] text-slate-400 font-medium">20 min</span>
                        <span className="text-[10px] text-slate-400 font-medium">45 min</span>
                    </div>
                </div>
            </div>

            {/* Intensity Section */}
            <div className="space-y-3">
                <label className="text-xs font-black text-slate-900 uppercase tracking-wide">Intensité</label>
                <div className="flex w-full bg-slate-50 p-1 rounded-xl">
                    <button
                        onClick={() => setIntensity("DOUCE")}
                        className={cn(
                            "flex-1 py-2.5 text-xs font-bold rounded-lg transition-all",
                            intensity === "DOUCE"
                                ? "bg-white text-emerald-600 shadow-sm"
                                : "text-slate-400 hover:text-slate-600"
                        )}
                    >
                        Douce
                    </button>
                    <button
                        onClick={() => setIntensity("MOYENNE")}
                        className={cn(
                            "flex-1 py-2.5 text-xs font-bold rounded-lg transition-all",
                            intensity === "MOYENNE"
                                ? "bg-orange-500 text-white shadow-md shadow-orange-200"
                                : "text-slate-400 hover:text-slate-600"
                        )}
                    >
                        Moyenne
                    </button>
                    <button
                        onClick={() => setIntensity("TONIQUE")}
                        className={cn(
                            "flex-1 py-2.5 text-xs font-bold rounded-lg transition-all",
                            intensity === "TONIQUE"
                                ? "bg-red-500 text-white shadow-md shadow-red-200"
                                : "text-slate-400 hover:text-slate-600"
                        )}
                    >
                        Tonique
                    </button>
                </div>
            </div>

            {/* Zone Section */}
            <div className="space-y-3">
                <label className="text-xs font-black text-slate-900 uppercase tracking-wide">Zone cible</label>
                <div className="grid grid-cols-2 gap-3">
                    {[
                        { id: "CORPS_ENTIER", label: "Corps entier" },
                        { id: "VENTRE", label: "Ventre" },
                        { id: "BAS_DU_CORPS", label: "Bas du corps" },
                        { id: "HAUT_DU_CORPS", label: "Haut du corps" }
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setZone(item.id)}
                            className={cn(
                                "py-3 px-4 text-xs font-bold rounded-xl transition-all border",
                                zone === item.id
                                    ? "bg-pink-500 text-white border-pink-500 shadow-md shadow-pink-200"
                                    : "bg-white text-slate-500 border-slate-100 hover:border-slate-200"
                            )}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Generate Button */}
            <div className="pt-4">
                <Button
                    className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-sm shadow-lg shadow-slate-200 flex items-center justify-center gap-2 group"
                >
                    <Sparkles size={18} className="text-amber-400 fill-amber-400 group-hover:scale-110 transition-transform" />
                    Générer avec IA
                </Button>
            </div>

        </div>
    )
}
