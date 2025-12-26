"use client"

import { useState } from "react"
import { User, Gender } from "@prisma/client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, Ruler, Weight, Target, Calendar, Save, Activity, User as UserIcon } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { updateUserProfile } from "@/lib/actions/profile"

const physicalSchema = z.object({
    height: z.coerce.number().min(50).max(300),
    startingWeight: z.coerce.number().min(20).max(500),
    targetWeight: z.coerce.number().min(20).max(500),
    birthDate: z.string().optional(), // On gère la date comme string pour l'input date
    gender: z.enum(["MALE", "FEMALE"]),
})

interface PhysicalCardProps {
    user: User
}

export function PhysicalCard({ user }: PhysicalCardProps) {
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof physicalSchema>>({
        resolver: zodResolver(physicalSchema),
        defaultValues: {
            height: user.heightCm || undefined,
            startingWeight: user.startWeight || undefined,
            targetWeight: user.targetWeight || undefined,
            birthDate: user.birthDate ? format(new Date(user.birthDate), "yyyy-MM-dd") : undefined,
            gender: user.gender || "FEMALE",
        },
    })

    async function onSubmit(values: z.infer<typeof physicalSchema>) {
        setIsLoading(true)
        try {
            const result = await updateUserProfile(user.id, {
                height: values.height,
                startingWeight: values.startingWeight,
                targetWeight: values.targetWeight,
                gender: values.gender as Gender,
                birthDate: values.birthDate ? new Date(values.birthDate) : undefined,
            })

            if (result.success) {
                toast.success("Métriques mises à jour")
            } else {
                toast.error(result.message || "Erreur lors de la mise à jour")
            }
        } catch (error) {
            toast.error("Une erreur inconnue est survenue")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="border-slate-100 shadow-sm relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                <Activity size={150} className="text-slate-900 -rotate-12" />
            </div>

            <CardHeader>
                <CardTitle className="text-xl font-serif">Mes Métriques</CardTitle>
                <CardDescription>Données physiques et objectifs</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="height"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center gap-2 text-slate-500">
                                            <Ruler size={14} /> Taille (cm)
                                        </FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} className="bg-slate-50 border-slate-200" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="gender"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center gap-2 text-slate-500">
                                            <UserIcon size={14} /> Genre
                                        </FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="bg-slate-50 border-slate-200">
                                                    <SelectValue placeholder="Sélectionner" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="FEMALE">Femme</SelectItem>
                                                <SelectItem value="MALE">Homme</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="startingWeight"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center gap-2 text-slate-500">
                                            <Weight size={14} /> Poids Départ (kg)
                                        </FormLabel>
                                        <FormControl>
                                            <Input type="number" step="0.1" {...field} className="bg-slate-50 border-slate-200" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="targetWeight"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center gap-2 text-ikonga-pink font-semibold">
                                            <Target size={14} /> Objectif (kg)
                                        </FormLabel>
                                        <FormControl>
                                            <Input type="number" step="0.1" {...field} className="bg-pink-50 border-pink-100 text-ikonga-pink font-bold" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="birthDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2 text-slate-500">
                                        <Calendar size={14} /> Date de naissance
                                    </FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} className="bg-slate-50 border-slate-200" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="pt-2">
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-white border border-slate-200 text-slate-900 hover:bg-slate-50"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Mise à jour...
                                    </>
                                ) : (
                                    <>
                                        <Activity className="mr-2 h-4 w-4 text-ikonga-pink" /> Mettre à jour mes métriques
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
