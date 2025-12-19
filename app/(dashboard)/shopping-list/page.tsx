import { getShoppingList } from "@/lib/actions/shopping"
import { ShoppingListView } from "@/components/dashboard/ShoppingListView"
import { redirect } from "next/navigation"

export const metadata = {
    title: "Ma Liste de Courses | IKONGA",
    description: "Consultez et gérez votre liste de courses pour votre phase actuelle.",
}

import { protectFeature } from "@/lib/security/permissions"

export default async function ShoppingListPage() {
    await protectFeature("SHOPPING_LIST")
    const data = await getShoppingList()

    if (data.error) {
        // Logically we could redirect or show an error state
        console.error(data.error)
    }

    return (
        <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header section can be simpler here as ShoppingListView has its own header */}
            <div className="pt-4">
                <h1 className="text-4xl font-serif font-black text-slate-900 uppercase tracking-tighter">
                    Courses
                </h1>
                <p className="text-slate-500 mt-2 font-medium">
                    Optimisez vos achats pour suivre parfaitement votre programme.
                </p>
            </div>

            <ShoppingListView
                initialIngredients={data.ingredients as any}
                phaseName={data.phaseName}
            />
        </div>
    )
}
