"use client"

import { useState } from "react"
import { Play } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

// Mock Data for "Bibliothèque"
const MOCK_LIBRARY = [
    {
        id: "1",
        title: "Cardio Détox Doux",
        intensity: "DOUCE",
        zone: "Corps entier",
        duration: 15,
        thumbnail: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=800&q=80",
        type: "CARDIO"
    },
    {
        id: "2",
        title: "Abdos Hypopressifs",
        intensity: "MOYENNE",
        zone: "Ventre",
        duration: 10,
        thumbnail: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80",
        type: "STRENGTH"
    },
    {
        id: "3",
        title: "HIIT Brûle-Graisse",
        intensity: "TONIQUE",
        zone: "Corps entier",
        duration: 20,
        thumbnail: "https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=800&q=80",
        type: "HIIT"
    },
    {
        id: "4",
        title: "Fessiers Bombés",
        intensity: "MOYENNE",
        zone: "Bas du corps",
        duration: 15,
        thumbnail: null, // Test placeholder
        type: "STRENGTH"
    },
    {
        id: "5",
        title: "Yoga Morning Flow",
        intensity: "DOUCE",
        zone: "Mobilité",
        duration: 25,
        thumbnail: null,
        type: "YOGA"
    },
    {
        id: "6",
        title: "Bras Toniques",
        intensity: "MOYENNE",
        zone: "Haut du corps",
        duration: 10,
        thumbnail: null,
        type: "STRENGTH"
    }
]

export function LibraryView() {
    const [filterIntensity, setFilterIntensity] = useState("ALL")
    const [filterZone, setFilterZone] = useState("ALL")

    const filteredWorkouts = MOCK_LIBRARY.filter(workout => {
        const matchesIntensity = filterIntensity === "ALL" || workout.intensity === filterIntensity
        const matchesZone = filterZone === "ALL" || workout.zone === filterZone
        return matchesIntensity && matchesZone
    })

    return (
        <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Filters Row */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">Intensité</label>
                    <Select value={filterIntensity} onValueChange={setFilterIntensity}>
                        <SelectTrigger className="w-full rounded-xl border-slate-200 bg-white h-11 focus:ring-0 focus:ring-offset-0">
                            <SelectValue placeholder="Toutes" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">Toutes</SelectItem>
                            <SelectItem value="DOUCE">Douce</SelectItem>
                            <SelectItem value="MOYENNE">Moyenne</SelectItem>
                            <SelectItem value="TONIQUE">Tonique</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">Zone</label>
                    <Select value={filterZone} onValueChange={setFilterZone}>
                        <SelectTrigger className="w-full rounded-xl border-slate-200 bg-white h-11 focus:ring-0 focus:ring-offset-0">
                            <SelectValue placeholder="Toutes" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">Toutes</SelectItem>
                            <SelectItem value="Corps entier">Corps entier</SelectItem>
                            <SelectItem value="Ventre">Ventre</SelectItem>
                            <SelectItem value="Bas du corps">Bas du corps</SelectItem>
                            <SelectItem value="Haut du corps">Haut du corps</SelectItem>
                            <SelectItem value="Mobilité">Mobilité</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* List */}
            <div className="flex flex-col gap-3">
                {filteredWorkouts.map((workout) => (
                    <div
                        key={workout.id}
                        className="group flex items-center justify-between p-3 bg-white border border-slate-100 rounded-2xl hover:border-orange-200 hover:shadow-sm transition-all cursor-pointer"
                    >
                        <div className="flex items-center gap-4">
                            {/* Thumbnail */}
                            <div className="w-16 h-12 rounded-lg bg-slate-100 overflow-hidden relative shadow-inner">
                                {workout.thumbnail ? (
                                    <img src={workout.thumbnail} alt={workout.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-slate-200">
                                        <Play size={16} className="text-slate-400 fill-slate-400" />
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div>
                                <h3 className="font-bold text-sm text-slate-900 leading-tight mb-1">{workout.title}</h3>
                                <p className="text-xs text-slate-500 font-medium">
                                    <span className={cn(
                                        "font-bold mr-1",
                                        workout.intensity === "DOUCE" ? "text-emerald-600" :
                                            workout.intensity === "MOYENNE" ? "text-orange-600" :
                                                "text-red-600"
                                    )}>
                                        {workout.intensity}
                                    </span>
                                    • {workout.zone}
                                </p>
                            </div>
                        </div>

                        {/* Duration */}
                        <div className="text-xs font-bold text-slate-400 px-2">
                            {workout.duration} min
                        </div>
                    </div>
                ))}

                {filteredWorkouts.length === 0 && (
                    <div className="py-12 text-center text-slate-400 text-sm">
                        Aucune séance ne correspond à ta recherche. 🧘‍♀️
                    </div>
                )}
            </div>
        </div>
    )
}
