
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
 * Catégories d'ingrédients avec mots-clés pour classification automatique
 */
const CATEGORY_KEYWORDS: Record<string, string[]> = {
    "Fruits & Légumes": ["tomate", "carotte", "oignon", "ail", "courgette", "aubergine", "poivron", "concombre", "salade", "laitue", "épinard", "chou", "brocoli", "haricot", "petit pois", "pomme", "banane", "orange", "citron", "avocat", "fraise", "framboise", "myrtille", "raisin", "poire", "mangue", "ananas", "kiwi", "melon", "pastèque", "pêche", "abricot", "cerise", "figue", "grenade", "céleri", "fenouil", "poireau", "radis", "navet", "betterave", "courge", "potiron", "champignon", "persil", "coriandre", "basilic", "menthe", "thym", "romarin", "ciboulette", "estragon", "laurier", "gingembre", "citronnelle"],
    "Viandes & Poissons": ["poulet", "boeuf", "veau", "porc", "agneau", "dinde", "canard", "lapin", "saumon", "thon", "cabillaud", "colin", "sole", "dorade", "bar", "truite", "maquereau", "sardine", "crevette", "gambas", "moule", "huître", "homard", "crabe", "poulpe", "calamar", "steak", "escalope", "filet", "cuisse", "aile", "jambon", "saucisse", "lardons", "bacon", "viande"],
    "Produits Laitiers": ["lait", "fromage", "yaourt", "yogourt", "beurre", "crème", "mascarpone", "ricotta", "mozzarella", "parmesan", "gruyère", "emmental", "chèvre", "feta", "roquefort", "camembert", "brie", "œuf", "oeuf", "oeufs"],
    "Épicerie": ["riz", "pâte", "spaghetti", "farine", "sucre", "sel", "poivre", "huile", "vinaigre", "sauce", "moutarde", "ketchup", "mayonnaise", "miel", "confiture", "chocolat", "cacao", "vanille", "levure", "bicarbonate", "maïzena", "fécule", "bouillon", "conserve", "tomate pelée", "concentré", "olive", "cornichon", "câpre"],
    "Céréales & Légumineuses": ["quinoa", "boulgour", "semoule", "avoine", "flocon", "muesli", "granola", "lentille", "pois chiche", "haricot rouge", "haricot blanc", "fève", "soja", "tofu", "tempeh"],
    "Fruits Secs & Oléagineux": ["amande", "noix", "noisette", "pistache", "cacahuète", "cajou", "noix de coco", "raisin sec", "datte", "figue sèche", "abricot sec", "pruneau", "cranberry", "graine", "sésame", "lin", "chia", "tournesol", "courge"],
    "Épices & Condiments": ["cumin", "paprika", "curry", "curcuma", "cannelle", "muscade", "clou de girofle", "anis", "cardamome", "safran", "herbes de provence", "origan", "piment", "cayenne", "sauce soja", "nuoc mam", "tahini", "harissa"],
    "Boissons": ["eau", "jus", "thé", "café", "lait végétal", "lait d'amande", "lait de coco", "lait de soja", "smoothie"]
}

/**
 * Parse un string d'ingrédient IA (ex: "200g de poulet grillé")
 * Retourne { quantity, name, category }
 */
function parseIngredientString(ingredientStr: string): { name: string; quantity: string; category: string } {
    if (!ingredientStr) {
        return { name: "", quantity: "", category: "Autres" }
    }

    const clean = ingredientStr.trim()

    // Regex pour capturer: quantité (optionnelle) + "de/d'" (optionnel) + nom
    // Ex: "200g de poulet", "1 cuillère à soupe d'huile", "sel et poivre"
    const match = clean.match(/^(\d+(?:[.,]\d+)?(?:\s*(?:g|kg|ml|cl|l|cuillère|c\.|cs|cc|tasse|verre|pincée|gousse|tranche|feuille|botte|bouquet|sachet|boîte)s?(?:\s+à\s+(?:soupe|café|thé))?)?)\s*(?:de\s+|d')?(.+)$/i)

    let quantity = ""
    let name = clean

    if (match) {
        quantity = match[1].trim()
        name = match[2].trim()
    } else {
        // Essayer de capturer juste un nombre au début
        const simpleMatch = clean.match(/^(\d+)\s+(.+)$/)
        if (simpleMatch) {
            quantity = simpleMatch[1]
            name = simpleMatch[2]
        }
    }

    // Déterminer la catégorie basée sur les mots-clés
    const nameLower = name.toLowerCase()
    let category = "Autres"

    for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
        if (keywords.some(keyword => nameLower.includes(keyword))) {
            category = cat
            break
        }
    }

    return { name, quantity, category }
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
            // Gérer les deux formats :
            // 1. Objet structuré : { name: "poulet", quantity: "200g", category: "Viandes" }
            // 2. String simple (format IA) : "200g de poulet grillé"
            let ingredientName: string
            let ingredientQuantity: string
            let ingredientCategory: string

            if (typeof ing === 'string') {
                // Parser le string d'ingrédient IA
                const parsed = parseIngredientString(ing)
                ingredientName = parsed.name
                ingredientQuantity = parsed.quantity
                ingredientCategory = parsed.category
            } else if (typeof ing === 'object' && ing.name) {
                ingredientName = ing.name
                ingredientQuantity = ing.quantity || ""
                ingredientCategory = ing.category || "Autres"
            } else {
                continue
            }

            if (!ingredientName) continue

            // Clé unique basée sur le nom et la catégorie pour éviter les mélanges bizarres
            // On normalise le nom (minuscule, sans pluriel basique)
            const normalizedName = ingredientName.toLowerCase().trim()
            const key = `${ingredientCategory}|${normalizedName}`

            const parsed = parseQuantity(ingredientQuantity || "")

            if (itemsMap.has(key)) {
                const existing = itemsMap.get(key)!

                // Si on a réussi à parser les deux quantités et qu'elles ont la même unité
                if (parsed && existing.unit === parsed.unit) {
                    existing.rawQuantity += parsed.value
                    existing.quantity = `${existing.rawQuantity}${existing.unit}`
                } else {
                    // Sinon, on concatène (fallback moche mais sûr)
                    // ex: "200g" + "1 pincée" -> "200g + 1 pincée"
                    if (!existing.quantity.includes(ingredientQuantity)) {
                        existing.quantity = `${existing.quantity} + ${ingredientQuantity}`
                    }
                }
            } else {
                itemsMap.set(key, {
                    name: ingredientName, // On garde le nom original du premier
                    quantity: ingredientQuantity || "",
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
