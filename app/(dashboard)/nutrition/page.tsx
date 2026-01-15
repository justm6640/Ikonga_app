import { getNutritionData } from "@/lib/actions/nutrition"
import { getOrCreateUser } from "@/lib/actions/user"
import { redirect } from "next/navigation"
import { NutritionClient } from "@/components/nutrition/NutritionClient"
import { ShoppingBasket } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function NutritionPage() {
    const user = await getOrCreateUser()
    if (!user) redirect("/login")

    const nutritionData = await getNutritionData()

    // 1. Loading/Empty State
    if (!nutritionData || nutritionData.locked || !nutritionData.menu) {
        const activePhase = user.phases[0]?.type || "DETOX"
        return (
            <div className="max-w-4xl mx-auto p-6 text-center py-20 animate-in fade-in duration-700">
                <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6">
                    <ShoppingBasket className="text-slate-300" size={40} />
                </div>
                <h1 className="text-3xl font-serif font-black text-slate-900 mb-4 uppercase tracking-tighter">
                    {nutritionData?.locked ? "Contenu Verrouillé" : "Nutrition à venir"}
                </h1>
                <p className="text-slate-500 max-w-md mx-auto italic font-medium">
                    {nutritionData?.locked
                        ? `Ton menu pour la phase suivante sera disponible 48h avant son début.`
                        : `Ton menu personnalisé pour la phase ${activePhase} est en cours de préparation par Rosy.`
                    }
                </p>
                <div className="mt-8">
                    <Link href="/dashboard">
                        <Button variant="outline" className="rounded-full px-8 border-slate-200 text-slate-500 font-bold uppercase tracking-widest text-xs">
                            Retour au Dashboard
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-slate-50 min-h-screen p-4 sm:p-8">
            <NutritionClient
                initialData={nutritionData}
                subscriptionTier={user.subscriptionTier.replace('_', ' ') + " SEM."}
            />
        </div>
    )
}
