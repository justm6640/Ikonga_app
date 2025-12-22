"use client"

import { motion } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"

export function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#fafafa] pt-32 pb-20 px-4">
            {/* Breathing Gradient Blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none overflow-hidden sm:overflow-visible">
                <motion.div
                    animate={{
                        scale: [1, 1.1, 0.9, 1],
                        opacity: [0.3, 0.5, 0.3],
                        rotate: [0, 90, 180, 270, 360]
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-pink-200/50 via-orange-100/50 to-rose-200/50 rounded-full blur-[100px]"
                />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                {/* Left Content */}
                <div className="text-center lg:text-left space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-md border border-white px-4 py-2 rounded-full mb-6">
                            <Sparkles size={16} className="text-ikonga-pink" />
                            <span className="text-xs font-bold uppercase tracking-widest text-slate-600">Le coaching nouvelle génération</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl md:text-7xl xl:text-8xl font-serif text-slate-950 leading-[1.05] tracking-tight">
                            La Métamorphose,<br />
                            <span className="italic bg-ikonga-gradient bg-clip-text text-transparent">sans la frustration.</span>
                        </h1>

                        {/* Handwritten Accent */}
                        <motion.div
                            initial={{ opacity: 0, rotate: -5 }}
                            animate={{ opacity: 1, rotate: -2 }}
                            transition={{ delay: 1, duration: 1 }}
                            className="absolute -top-4 -right-8 hidden xl:block"
                        >
                            <span className="font-hand text-3xl text-ikonga-pink opacity-80 decoration-ikonga-pink underline decoration-2 underline-offset-8">
                                Enfin pour vous !
                            </span>
                        </motion.div>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="text-lg md:text-xl text-slate-500 max-w-xl lg:mx-0 mx-auto leading-relaxed font-sans"
                    >
                        Nutrition, Fitness, Bien-être. Révélez votre éclat intérieur.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                        className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6"
                    >
                        <button className="group relative bg-ikonga-gradient text-white px-10 py-5 rounded-full font-bold text-lg shadow-2xl shadow-pink-500/30 hover:scale-[1.05] active:scale-95 transition-all flex items-center gap-3">
                            Commencer mon bilan
                            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <div className="flex items-center gap-4">
                            <div className="flex -space-x-3">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className={`w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden`}>
                                        <div className="w-full h-full bg-ikonga-gradient opacity-40" />
                                    </div>
                                ))}
                            </div>
                            <span className="text-sm font-medium text-slate-400 italic">Rejoignez +10k femmes</span>
                        </div>
                    </motion.div>
                </div>

                {/* Right Mockup */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                    className="relative hidden lg:flex justify-center"
                >
                    <div className="relative w-[340px] h-[680px] bg-slate-950 rounded-[3.5rem] border-[10px] border-slate-900 shadow-[0_50px_100px_rgba(0,0,0,0.15)] p-4 overflow-hidden ring-1 ring-white/10">
                        {/* Notch */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-8 bg-slate-900 rounded-b-3xl z-20 flex items-end justify-center pb-1">
                            <div className="w-10 h-1 bg-slate-800 rounded-full mb-1" />
                        </div>

                        {/* Screen Content */}
                        <div className="relative h-full w-full bg-white rounded-[2.8rem] overflow-hidden flex flex-col pt-10 px-6">
                            <div className="flex justify-between items-center mb-8">
                                <div className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center">
                                    <div className="w-4 h-4 rounded-full bg-ikonga-pink" />
                                </div>
                                <div className="w-8 h-8 rounded-full bg-slate-100" />
                            </div>

                            <h2 className="text-2xl font-serif mb-6 leading-tight">Bonjour, <br /><span className="text-ikonga-pink">Sophie ✨</span></h2>

                            <div className="space-y-6">
                                <div className="p-5 bg-pink-50 rounded-3xl space-y-3">
                                    <div className="flex justify-between text-xs font-bold text-pink-600 uppercase tracking-widest">
                                        <span>Ma Détox</span>
                                        <span>Jour 4/14</span>
                                    </div>
                                    <div className="h-2 bg-white rounded-full overflow-hidden">
                                        <div className="h-full bg-ikonga-pink w-1/3" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="aspect-square rounded-3xl bg-slate-50 p-4 flex flex-col justify-between">
                                        <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                                            <Sparkles size={16} />
                                        </div>
                                        <span className="text-xs font-bold text-slate-400 uppercase">Énergie</span>
                                        <span className="text-xl font-bold text-slate-900">Top</span>
                                    </div>
                                    <div className="aspect-square rounded-3xl bg-slate-50 p-4 flex flex-col justify-between">
                                        <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                                            <Sparkles size={16} />
                                        </div>
                                        <span className="text-xs font-bold text-slate-400 uppercase">Sommeil</span>
                                        <span className="text-xl font-bold text-slate-900">8h</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-auto pb-6">
                                <div className="h-16 w-full bg-ikonga-gradient rounded-3xl flex items-center justify-center text-white font-bold shadow-lg shadow-pink-500/20">
                                    Mon programme du jour
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Secondary Accents */}
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -left-12 bottom-20 bg-white/80 backdrop-blur-xl border border-white p-5 rounded-3xl shadow-xl flex items-center gap-4 z-30"
                    >
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                            <Sparkles size={20} />
                        </div>
                        <div>
                            <div className="text-sm font-black text-slate-900">-2.4kg</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase">Semaine 1</div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                animate={{ y: [0, 10, 0], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            >
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Défiler</span>
                <div className="w-px h-12 bg-slate-200" />
            </motion.div>
        </section>
    )
}
