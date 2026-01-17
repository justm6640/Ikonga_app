"use client"

import { motion } from "framer-motion"
import Link from "next/link"

export function FloatingNavbar() {
    return (
        <motion.nav
            initial={{ y: -100, x: "-50%", opacity: 0 }}
            animate={{ y: 0, x: "-50%", opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="fixed top-6 left-1/2 z-[100] w-[min(90%,1200px)]"
        >
            <div className="bg-white/60 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.05)] rounded-full px-8 py-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group shrink-0">
                    <div className="w-9 h-9 bg-ikonga-gradient rounded-full flex items-center justify-center shadow-lg shadow-pink-500/20 group-hover:scale-110 transition-transform">
                        <span className="text-white font-black text-xs">IK</span>
                    </div>
                    <span className="font-serif text-2xl tracking-tighter text-slate-900 hidden sm:inline-block">IKONGA</span>
                </Link>

                <div className="hidden md:flex items-center gap-10">
                    <Link href="#method" className="text-sm font-medium text-slate-500 hover:text-ikonga-pink transition-colors">La Méthode</Link>
                    <Link href="#how-it-works" className="text-sm font-medium text-slate-500 hover:text-ikonga-pink transition-colors">Les Phases</Link>
                    <Link href="#tarifs" className="text-sm font-medium text-slate-500 hover:text-ikonga-pink transition-colors">Tarifs</Link>
                    <Link href="#testimonials" className="text-sm font-medium text-slate-500 hover:text-ikonga-pink transition-colors">Témoignages</Link>
                </div>

                <div className="flex items-center gap-2 sm:gap-4">
                    <Link
                        href="/login"
                        className="text-[10px] sm:text-sm font-bold text-slate-900 hover:text-ikonga-pink transition-colors px-2 sm:px-4 py-2"
                    >
                        Connexion
                    </Link>
                    <Link
                        href="/signup"
                        className="bg-ikonga-gradient text-white px-5 sm:px-7 py-2.5 rounded-full text-xs sm:text-sm font-bold shadow-lg shadow-pink-500/20 hover:scale-[1.05] transition-all active:scale-95 whitespace-nowrap"
                    >
                        Bilan Gratuit
                    </Link>
                </div>
            </div>
        </motion.nav>
    )
}
