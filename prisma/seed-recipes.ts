import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
    console.log("Seeding recipes...")

    const recipes = [
        {
            title: "Smoothie Vert Détox",
            description: "Un concentré de vitamines et d'antioxydants pour purifier l'organisme dès le matin.",
            imageUrl: "https://images.unsplash.com/photo-1544145945-f904253db0ad?q=80&w=800",
            calories: 180,
            protein: 4,
            carbs: 35,
            fat: 2,
            prepTime: 10,
            ingredients: [
                "1 poignée d'épinards frais",
                "1 pomme verte",
                "1/2 concombre",
                "Le jus d'un demi citron",
                "1 cm de gingembre frais",
                "200ml d'eau de coco"
            ],
            instructions: [
                "Lavez soigneusement tous les ingrédients.",
                "Coupez la pomme et le concombre en morceaux.",
                "Mettez tout dans le blender.",
                "Mixez jusqu'à obtenir une texture lisse.",
                "Dégustez immédiatement pour conserver toutes les vitamines."
            ]
        },
        {
            title: "Salade de Quinoa & Avocat",
            description: "Une salade riche en bons lipides et en protéines végétales pour un déjeuner rassasiant et léger.",
            imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800",
            calories: 420,
            protein: 12,
            carbs: 45,
            fat: 22,
            prepTime: 20,
            ingredients: [
                "150g de quinoa cuit",
                "1/2 avocat",
                "Quelques tomates cerises",
                "1/4 d'oignon rouge",
                "Persil frais",
                "1 cuillère à soupe d'huile d'olive",
                "Jus de citron"
            ],
            instructions: [
                "Faites cuire le quinoa selon les instructions et laissez-le refroidir.",
                "Coupez l'avocat en dés et les tomates en deux.",
                "Émincez finement l'oignon et le persil.",
                "Mélangez tous les ingrédients dans un grand bol.",
                "Assaisonnez avec l'huile d'olive, le citron, du sel et du poivre."
            ]
        },
        {
            title: "Soupe de Légumes de Saison",
            description: "Un diner réconfortant et digeste, idéal pour mettre le système digestif au repos.",
            imageUrl: "https://images.unsplash.com/photo-1547592110-8036e3c2852d?q=80&w=800",
            calories: 210,
            protein: 6,
            carbs: 28,
            fat: 8,
            prepTime: 30,
            ingredients: [
                "2 carottes",
                "1 poireau",
                "1 branche de céleri",
                "1 petite pomme de terre",
                "1 cuillère à café de curcuma",
                "Bouillon de légumes maison"
            ],
            instructions: [
                "Épluchez et coupez les légumes en morceaux.",
                "Faites-les revenir 5 minutes dans un peu d'huile d'olive.",
                "Couvrez avec le bouillon de légumes.",
                "Laissez mijoter 20 à 25 minutes.",
                "Ajustez l'assaisonnement et mixez si vous préférez un velouté."
            ]
        }
    ]

    for (const recipe of recipes) {
        await prisma.recipe.upsert({
            where: { title: recipe.title },
            update: recipe,
            create: recipe,
        })
    }

    console.log("Recipes seeded successfully!")
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
