
/**
 * Moteur de génération de liste de courses.
 * Gère l'agrégation des ingrédients et le regroupement par catégories.
 */

interface Ingredient {
    name: string
    quantity: string
    category: string
}

interface ShoppingItem {
    name: string
    quantity: string
    unit: string
    rawQuantity: number
}

interface ShoppingCategory {
    category: string
    items: Array<{ name: string; quantity: string }>
}

/**
 * Tente de parser une quantité (ex: "200g" -> { value: 200, unit: "g" })
 */
function parseQuantity(qtyStr: string): { value: number; unit: string } | null {
    if (!qtyStr) return null

    // Nettoyage basique
    const clean = qtyStr.toLowerCase().trim().replace(",", ".")

    // Regex pour capturer chiffre + unité
    const match = clean.match(/^(\d+(\.\d+)?)\s*([a-zA-Z]*)$/)
    if (match) {
        return {
            value: parseFloat(match[1]),
            unit: match[3] || "" // Unité peut être vide (ex: "2 oeufs" -> unit "oeufs" si écrit "2", ou rien)
        }
    }
    return null
}

/**
 * Génère la liste de courses agrégée à partir d'une liste de recettes.
 */
export function generateShoppingListFromRecipes(recipes: any[]): ShoppingCategory[] {
    const itemsMap = new Map<string, ShoppingItem>()

    for (const recipe of recipes) {
        if (!recipe?.ingredients) continue

        const ingredients = Array.isArray(recipe.ingredients)
            ? recipe.ingredients
            : typeof recipe.ingredients === 'string'
                ? JSON.parse(recipe.ingredients)
                : []

        for (const ing of ingredients) {
            if (!ing.name) continue

            // Clé unique basée sur le nom et la catégorie pour éviter les mélanges bizarres
            // On normalise le nom (minuscule, sans pluriel basique)
            const normalizedName = ing.name.toLowerCase().trim()
            const category = ing.category || "Autres"
            const key = `${category}|${normalizedName}`

            const parsed = parseQuantity(ing.quantity || "")

            if (itemsMap.has(key)) {
                const existing = itemsMap.get(key)!

                // Si on a réussi à parser les deux quantités et qu'elles ont la même unité
                if (parsed && existing.unit === parsed.unit) {
                    existing.rawQuantity += parsed.value
                    existing.quantity = `${existing.rawQuantity}${existing.unit}`
                } else {
                    // Sinon, on concatène (fallback moche mais sûr)
                    // ex: "200g" + "1 pincée" -> "200g + 1 pincée"
                    if (!existing.quantity.includes(ing.quantity)) {
                        existing.quantity = `${existing.quantity} + ${ing.quantity}`
                    }
                }
            } else {
                itemsMap.set(key, {
                    name: ing.name, // On garde le nom original du premier
                    quantity: ing.quantity || "",
                    unit: parsed?.unit || "",
                    rawQuantity: parsed?.value || 0
                })
            }
        }
    }

    // Regroupement par catégorie
    const categorized: Record<string, ShoppingCategory> = {}

    itemsMap.forEach((item, key) => {
        const [category] = key.split('|')

        if (!categorized[category]) {
            categorized[category] = { category, items: [] }
        }

        categorized[category].items.push({
            name: item.name,
            quantity: item.quantity
        })
    })

    // Tri (Catégories + Items)
    const result = Object.values(categorized).sort((a, b) => a.category.localeCompare(b.category))

    result.forEach(cat => {
        cat.items.sort((a, b) => a.name.localeCompare(b.name))
    })

    return result
}
