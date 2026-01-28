import { MenuBuilder } from "@/components/admin/MenuBuilder"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

export default function NewMenuPage() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex flex-col gap-4">
                <Link
                    href="/admin/menus"
                    className="flex items-center gap-2 text-sm text-slate-500 hover:text-ikonga-pink transition-colors w-fit"
                >
                    <ChevronLeft size={16} />
                    Retour aux menus
                </Link>

                <div className="flex flex-col gap-1">
                    <h2 className="text-4xl font-serif text-slate-900">Création de Menu</h2>
                    <p className="text-lg text-slate-500 font-light">
                        Définissez les repas conseillés selon les phases de l'aventure IKONGA.
                    </p>
                </div>
            </div>

            <MenuBuilder />
        </div>
    )
}
