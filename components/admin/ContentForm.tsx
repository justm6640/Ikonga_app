"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { createContentItem } from "@/lib/actions/admin"
import { useRef, useTransition } from "react"

const formSchema = z.object({
    title: z.string().min(2, "Titre trop court"),
    category: z.enum(["FITNESS", "WELLNESS", "BEAUTY", "NUTRITION_TIP"]),
    mediaUrl: z.string().optional(),
    targetPhases: z.array(z.string()).refine((value) => value.length > 0, {
        message: "Sélectionnez au moins une phase",
    }),
    emotionalTags: z.string().optional(),
})

const PHASES = [
    { id: "DETOX", label: "Détox" },
    { id: "EQUILIBRE", label: "Équilibre" },
    { id: "CONSOLIDATION", label: "Consolidation" },
    { id: "ENTRETIEN", label: "Entretien" },
]

export function ContentForm() {
    const [isPending, startTransition] = useTransition()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            targetPhases: [],
            emotionalTags: "",
            mediaUrl: ""
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const formData = new FormData()
        formData.append("title", values.title)
        formData.append("category", values.category)
        if (values.mediaUrl) formData.append("mediaUrl", values.mediaUrl)
        if (values.emotionalTags) formData.append("emotionalTags", values.emotionalTags)

        values.targetPhases.forEach(p => formData.append("targetPhases", p))

        startTransition(async () => {
            const result = await createContentItem({}, formData)
            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success("Contenu ajouté avec succès !")
                form.reset()
            }
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-lg bg-white p-6 rounded-xl shadow-sm border">

                {/* Title */}
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Titre du contenu</FormLabel>
                            <FormControl>
                                <Input placeholder="Ex: Yoga du matin" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Category */}
                <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Catégorie</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choisir une catégorie" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="FITNESS">Fitness</SelectItem>
                                    <SelectItem value="WELLNESS">Wellness</SelectItem>
                                    <SelectItem value="BEAUTY">Beauty</SelectItem>
                                    <SelectItem value="NUTRITION_TIP">Conseil Nutrition</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Media URL */}
                <FormField
                    control={form.control}
                    name="mediaUrl"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>URL Média (Optionnel)</FormLabel>
                            <FormControl>
                                <Input placeholder="https://youtube.com/..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Phases */}
                <FormField
                    control={form.control}
                    name="targetPhases"
                    render={() => (
                        <FormItem>
                            <FormLabel className="mb-4 block">Phases ciblées</FormLabel>
                            <div className="grid grid-cols-2 gap-2">
                                {PHASES.map((item) => (
                                    <FormField
                                        key={item.id}
                                        control={form.control}
                                        name="targetPhases"
                                        render={({ field }) => {
                                            return (
                                                <FormItem
                                                    key={item.id}
                                                    className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3 shadow-sm hover:bg-gray-50"
                                                >
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value?.includes(item.id)}
                                                            onCheckedChange={(checked) => {
                                                                return checked
                                                                    ? field.onChange([...field.value, item.id])
                                                                    : field.onChange(
                                                                        field.value?.filter(
                                                                            (value) => value !== item.id
                                                                        )
                                                                    )
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormLabel className="text-sm font-normal cursor-pointer w-full">
                                                        {item.label}
                                                    </FormLabel>
                                                </FormItem>
                                            )
                                        }}
                                    />
                                ))}
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Emotional Tags */}
                <FormField
                    control={form.control}
                    name="emotionalTags"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tags Émotionnels (séparés par virgule)</FormLabel>
                            <FormControl>
                                <Input placeholder="Stress, Energie, Matin..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full bg-ikonga-gradient text-white" disabled={isPending}>
                    {isPending ? "Ajout en cours..." : "Ajouter le contenu"}
                </Button>
            </form>
        </Form>
    )
}
