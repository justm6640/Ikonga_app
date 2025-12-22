export function Footer() {
    return (
        <footer className="bg-white py-24 px-4 border-t border-slate-100">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
                    <div className="col-span-1 md:col-span-2 space-y-6">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-ikonga-gradient rounded-full" />
                            <span className="font-serif text-2xl tracking-tighter">IKONGA</span>
                        </div>
                        <p className="text-slate-400 max-w-sm leading-relaxed">
                            Révélez votre éclat intérieur avec une méthode holistique alliant nutrition,
                            fitness et sérénité. Conçu pour les femmes d'aujourd'hui.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-slate-900">Navigation</h4>
                        <ul className="space-y-4 text-sm text-slate-500">
                            <li><a href="#method" className="hover:text-ikonga-pink transition-colors">La Méthode</a></li>
                            <li><a href="#how-it-works" className="hover:text-ikonga-pink transition-colors">Les Phases</a></li>
                            <li><a href="#testimonials" className="hover:text-ikonga-pink transition-colors">Témoignages</a></li>
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-slate-900">Légal</h4>
                        <ul className="space-y-4 text-sm text-slate-500">
                            <li><a href="#" className="hover:text-ikonga-pink transition-colors">CGU</a></li>
                            <li><a href="#" className="hover:text-ikonga-pink transition-colors">Confidentialité</a></li>
                            <li><a href="#" className="hover:text-ikonga-pink transition-colors">Mentions Légales</a></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-slate-400 text-xs tracking-tight">
                        © 2025 IKONGA. Créé avec ❤️ pour votre bien-être.
                    </p>
                    <div className="flex gap-8 items-center grayscale opacity-50">
                        <span className="text-[10px] font-bold uppercase tracking-tighter">Paiement Sécurisé</span>
                        <span className="text-[10px] font-bold uppercase tracking-tighter">Support 7j/7</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}
