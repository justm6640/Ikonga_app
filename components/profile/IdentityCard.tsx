"use client"

import { useState } from "react"
import { User } from "@prisma/client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, Mail, Phone, User as UserIcon, Save } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { updateUserProfile } from "@/lib/actions/profile"

const identitySchema = z.object({
    firstName: z.string().min(2, "Le prénom est trop court"),
    lastName: z.string().min(2, "Le nom est trop court"),
    phone: z.string().optional(),
})

interface IdentityCardProps {
    user: User
}

export function IdentityCard({ user }: IdentityCardProps) {
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof identitySchema>>({
        resolver: zodResolver(identitySchema),
        defaultValues: {
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            phone: user.phoneNumber || "",
        },
    })

    async function onSubmit(values: z.infer<typeof identitySchema>) {
        setIsLoading(true)
        try {
            // On concatène pour correspondre à l'action serveur existante qui attend "name"
            // Ou mieux, on met à jour l'action pour accepter firstName/lastName
            // Pour l'instant, on respecte l'interface de l'action : name = "First Last"
            const fullName = `${values.firstName} ${values.lastName}`.trim()

            const result = await updateUserProfile(user.id, {
                name: fullName,
                phone: values.phone,
            })

            if (result.success) {
                toast.success("Informations mises à jour")
            } else {
                toast.error(result.message || "Erreur lors de la mise à jour")
            }
        } catch (error) {
            toast.error("Une erreur inconnue est survenue")
        } finally {
            setIsLoading(false)
        }
    }

    const initials = `${user.firstName?.charAt(0) || ""}${user.lastName?.charAt(0) || ""}`.toUpperCase() || "U"

    return (
        <Card className="border-slate-100 shadow-sm">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-4">
                <Avatar className="h-16 w-16 border-2 border-slate-100">
                    <AvatarImage src="" /> {/* TODO: Add photo upload */}
                    <AvatarFallback className="bg-ikonga-gradient text-white text-xl font-bold">
                        {initials}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <CardTitle className="text-xl font-serif">Identité</CardTitle>
                    <CardDescription>Tes informations personnelles</CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center gap-2 text-slate-500">
                                            <UserIcon size={14} /> Prénom
                                        </FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Prénom" className="bg-slate-50 border-slate-200" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="lastName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center gap-2 text-slate-500">
                                            <UserIcon size={14} /> Nom
                                        </FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Nom" className="bg-slate-50 border-slate-200" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2 text-slate-500">
                                <Mail size={14} /> Email
                            </label>
                            <Input value={user.email || ""} disabled className="bg-slate-100/50 text-slate-500 border-dashed" />
                            <p className="text-[10px] text-slate-400 pl-1">L'email ne peut pas être modifié.</p>
                        </div>

                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2 text-slate-500">
                                        <Phone size={14} /> Téléphone
                                    </FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="+33 6..." className="bg-slate-50 border-slate-200" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="pt-2">
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-slate-900 hover:bg-slate-800 text-white"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enregistrement...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" /> Enregistrer les modifications
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
