"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { profileSchema, ProfileSchema } from "@/lib/validators/profile"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { updateProfile } from "@/lib/actions/profile"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { LogOut, Save, User as UserIcon, Crown, Ruler, Weight } from "lucide-react"
import { useTransition } from "react"

interface ProfileFormProps {
    user: any // Ideally typed User
}

export function ProfileForm({ user }: ProfileFormProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const supabase = createClient()

    const form = useForm<ProfileSchema>({
        resolver: zodResolver(profileSchema) as any,
        defaultValues: {
            firstName: user.firstName ?? "",
            lastName: user.lastName ?? "",
            heightCm: user.heightCm ?? 165,
            targetWeight: user.targetWeight ?? undefined,
        },
    })

    async function onSubmit(values: ProfileSchema) {
        startTransition(async () => {
            const result = await updateProfile(values)
            if (result.success) {
                toast.success("Profil mis à jour !")
            } else {
                toast.error(result.error)
            }
        })
    }

    async function handleSignOut() {
        await supabase.auth.signOut()
        router.refresh()
        router.push("/login")
    }

    const initials = `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() || "U"

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20 md:pb-0">
            {/* Header / Avatar Section */}
            <div className="flex flex-col items-center gap-4 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                <Avatar className="h-24 w-24 border-4 border-pillar-beauty/20">
                    <AvatarFallback className="text-2xl bg-ikonga-gradient text-white font-bold">
                        {initials}
                    </AvatarFallback>
                </Avatar>
                <div className="text-center">
                    <h2 className="text-2xl font-serif font-bold text-slate-900">
                        {user.firstName} {user.lastName}
                    </h2>
                    <div className="flex items-center justify-center gap-2 mt-1">
                        <Badge variant="secondary" className="font-mono text-slate-500 bg-slate-50 border-slate-200">
                            {user.email}
                        </Badge>
                    </div>
                </div>
            </div>

            {/* Subscription Tier Card */}
            <Card className="rounded-[2.5rem] border-none bg-ikonga-gradient shadow-md overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Crown size={120} />
                </div>
                <CardContent className="p-8 text-white relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <Crown size={24} />
                        <span className="text-sm font-bold tracking-widest uppercase">Mon Abonnement</span>
                    </div>
                    <h3 className="text-3xl font-serif font-bold">
                        Formule {user.subscriptionTier?.startsWith('STANDARD') ? 'Essentielle' : (user.subscriptionTier || 'Standard')}
                    </h3>
                    <p className="mt-2 text-white/80 text-sm italic">
                        Membre IKONGA depuis le {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                </CardContent>
            </Card>

            {/* Edit Form */}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* First Name */}
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2">
                                        <UserIcon size={16} className="text-pillar-beauty" />
                                        Prénom
                                    </FormLabel>
                                    <FormControl>
                                        <Input {...field} className="rounded-2xl h-12 bg-white border-slate-200" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Last Name */}
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2">
                                        <UserIcon size={16} className="text-pillar-beauty" />
                                        Nom
                                    </FormLabel>
                                    <FormControl>
                                        <Input {...field} className="rounded-2xl h-12 bg-white border-slate-200" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Height */}
                        <FormField
                            control={form.control}
                            name="heightCm"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2">
                                        <Ruler size={16} className="text-pillar-fitness" />
                                        Taille (cm)
                                    </FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} className="rounded-2xl h-12 bg-white border-slate-200" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Target Weight */}
                        <FormField
                            control={form.control}
                            name="targetWeight"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2">
                                        <Weight size={16} className="text-ikonga-pink" />
                                        Poids Cible (kg)
                                    </FormLabel>
                                    <FormControl>
                                        <Input type="number" step="0.1" {...field} className="rounded-2xl h-12 bg-white border-slate-200" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex flex-col gap-4 pt-4">
                        <Button
                            type="submit"
                            className="w-full h-14 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 transition-all font-bold text-lg flex gap-2"
                            disabled={isPending}
                        >
                            <Save size={20} />
                            {isPending ? "Enregistrement..." : "Enregistrer les modifications"}
                        </Button>

                        <Button
                            type="button"
                            variant="ghost"
                            onClick={handleSignOut}
                            className="w-full h-14 rounded-2xl text-red-500 hover:text-red-600 hover:bg-red-50 transition-all font-medium flex gap-2"
                        >
                            <LogOut size={20} />
                            Se déconnecter
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
