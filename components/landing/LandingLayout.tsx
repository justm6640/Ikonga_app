"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ShieldCheck, Instagram, Facebook } from "lucide-react"

export function Navbar() {
    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[min(90%,1200px)]"
        >
            <div className="bg-white/70 backdrop-blur-xl border border-white/20 shadow-2xl shadow-slate-200/50 rounded-full px-6 py-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-ikonga-gradient rounded-full flex items-center justify-center">
                        <span className="text-white font-black text-xs">IK</span>
                    </div>
                    <span className="font-black tracking-tighter text-xl text-slate-900">IKONGA</span>
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    <Link href="#features" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">La Méthode</Link>
                    <Link href="#showcase" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">L'App</Link>
                    <Link href="#testimonials" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">Témoignages</Link>
                </div>

                <Link
                    href="/dashboard"
                    className="bg-slate-900 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-slate-800 transition-all active:scale-95"
                >
                    S'inscrire
                </Link>
            </div>
        </motion.nav>
    )
}

export function Footer() {
    return (
        <footer className="bg-slate-50 py-20 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center gap-10 mb-20">
                    <div className="space-y-4 text-center md:text-left">
                        <div className="flex items-center gap-2 justify-center md:justify-start">
                            <div className="w-8 h-8 bg-ikonga-gradient rounded-full" />
                            <span className="font-black tracking-tighter text-2xl">IKONGA</span>
                        </div>
                        <p className="text-slate-400 max-w-xs">
                            Votre compagnon pour une vie équilibrée et rayonnante.
                        </p>
                    </div>

                    <div className="flex gap-10">
                        <div className="space-y-4">
                            <h4 className="font-bold text-slate-900 uppercase text-xs tracking-widest">Légal</h4>
                            <ul className="space-y-2 text-sm text-slate-500">
                                <li>CGU</li>
                                <li>Confidentialité</li>
                                <li>Mentions Légale</li>
                            </ul>
                        </div>
                        <div className="space-y-4">
                            <h4 className="font-bold text-slate-900 uppercase text-xs tracking-widest">Réseaux</h4>
                            <div className="flex gap-4">
                                <Instagram className="text-slate-400 cursor-pointer hover:text-ikonga-pink transition-colors" size={20} />
                                <Facebook className="text-slate-400 cursor-pointer hover:text-ikonga-pink transition-colors" size={20} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-10 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-400 text-xs">© 2025 IKONGA. Tous droits réservés.</p>
                    <div className="flex items-center gap-2 text-slate-400 text-xs">
                        <ShieldCheck size={14} className="text-emerald-500" />
                        Paiement 100% sécurisé
                    </div>
                </div>
            </div>
        </footer>
    )
}
