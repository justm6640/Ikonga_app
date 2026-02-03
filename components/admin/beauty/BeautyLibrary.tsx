"use client"

import { useState, useEffect } from "react"
import { Sparkles, Plus, Search, Filter, Trash2, Edit2, Clock, Tags } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { getBeautyLibrary, createBeautyContent } from "@/lib/actions/beauty"
import { BeautyCategory, BeautyContentType, BeautyLevel, PhaseType, WorkoutGender } from "@prisma/client"

export function BeautyLibrary() {
    const [contents, setContents] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [showAddForm, setShowAddForm] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        loadLibrary()
    }, [])

    const loadLibrary = async () => {
        setIsLoading(true)
        const data = await getBeautyLibrary()
        setContents(data)
        setIsLoading(false)
    }

    const filteredContents = contents.filter(c =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.category.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-serif font-black text-slate-900">BIBLIOTHÈQUE BEAUTÉ</h2>
                    <p className="text-sm text-slate-500">Gère le catalogue de contenus et rituels.</p>
                </div>
                <Button
                    onClick={() => setShowAddForm(true)}
                    className="bg-ikonga-gradient text-white rounded-xl py-6 px-8 shadow-lg shadow-pink-500/20 hover:scale-105 transition-all"
                >
                    <Plus className="mr-2" size={18} /> Ajouter un contenu
                </Button>
            </div>

            {/* Toolbar */}
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <Input
                        placeholder="Rechercher un contenu..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 h-12 bg-white/50 border-slate-200 rounded-xl focus:ring-amber-500 focus:border-amber-500"
                    />
                </div>
                <Button variant="outline" className="h-12 rounded-xl border-slate-200 bg-white">
                    <Filter className="mr-2" size={18} /> Filtres
                </Button>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    Array(6).fill(0).map((_, i) => (
                        <div key={i} className="h-64 rounded-3xl bg-slate-100 animate-pulse" />
                    ))
                ) : filteredContents.length > 0 ? (
                    filteredContents.map((content) => (
                        <div
                            key={content.id}
                            className="group relative overflow-hidden bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 rounded-2xl bg-amber-50 text-amber-600">
                                    <Sparkles size={24} />
                                </div>
                                <div className="flex gap-1">
                                    <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400">
                                        <Edit2 size={14} />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full hover:bg-red-50 text-red-400">
                                        <Trash2 size={14} />
                                    </Button>
                                </div>
                            </div>

                            <h3 className="text-lg font-bold text-slate-900 mb-2 truncate">{content.title}</h3>
                            <p className="text-sm text-slate-500 line-clamp-2 mb-4">
                                {content.description}
                            </p>

                            <div className="flex flex-wrap gap-2 mb-4">
                                <Badge variant="secondary" className="bg-slate-50 text-slate-600 border-none font-bold text-[10px] uppercase tracking-wider">
                                    {content.category.replace('_', ' ')}
                                </Badge>
                                <Badge variant="secondary" className="bg-amber-50 text-amber-600 border-none font-bold text-[10px] uppercase tracking-wider">
                                    {content.type}
                                </Badge>
                            </div>

                            <div className="pt-4 border-t border-slate-50 flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                <div className="flex items-center gap-1">
                                    <Clock size={12} /> {content.duration || 5} min
                                </div>
                                <div className="flex items-center gap-1">
                                    <Tags size={12} /> {content.level}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full h-64 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-200 rounded-3xl">
                        <Sparkles size={48} className="text-slate-200 mb-4" />
                        <h3 className="text-lg font-bold text-slate-900">Aucun contenu trouvé</h3>
                        <p className="text-sm text-slate-500">Commence à peupler la bibliothèque IKOBEAUTY.</p>
                    </div>
                )}
            </div>

            {/* Add Form Modal Placeholder (would be a real Modal/Dialog in production) */}
            {showAddForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="w-full max-w-2xl bg-white rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                        <h3 className="text-2xl font-serif font-black text-slate-900 mb-6">NOUVEAU CONTENU BEAUTÉ</h3>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="col-span-2 space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Titre du contenu</label>
                                <Input placeholder="ex: Routine Éclat Matinale" className="h-12 rounded-xl" />
                            </div>
                            <div className="col-span-2 space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Description</label>
                                <textarea className="w-full rounded-xl border-slate-200 p-3 min-h-[100px] text-sm focus:ring-amber-500 focus:border-amber-500 outline-none border" placeholder="Décris les étapes du rituel..." />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Catégorie</label>
                                <select className="w-full h-12 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none">
                                    {Object.values(BeautyCategory).map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Type</label>
                                <select className="w-full h-12 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none">
                                    {Object.values(BeautyContentType).map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Button variant="outline" onClick={() => setShowAddForm(false)} className="flex-1 h-14 rounded-2xl font-bold uppercase tracking-widest">
                                Annuler
                            </Button>
                            <Button className="flex-1 h-14 rounded-2xl bg-ikonga-gradient text-white font-bold uppercase tracking-widest">
                                Enregistrer
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
