"use client"

import Link from "next/link"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { login, signup } from "@/lib/actions/auth"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

interface AuthFormProps {
    mode: "login" | "signup"
}

function SubmitButton({ mode }: { mode: "login" | "signup" }) {
    const { pending } = useFormStatus()

    return (
        <Button
            type="submit"
            className="w-full h-12 text-lg rounded-2xl bg-ikonga-gradient shadow-lg hover:opacity-90"
            disabled={pending}
        >
            {pending ? "Chargement..." : mode === "login" ? "Se connecter" : "Créer mon compte"}
        </Button>
    )
}

export function AuthForm({ mode }: AuthFormProps) {
    const [showPassword, setShowPassword] = useState(false)
    const action = mode === "login" ? login : signup

    const handleSubmit = async (formData: FormData) => {
        // Client-side toast handling wrapper if needed, or rely on server redirect/error return
        // Server Actions usually return serializable objects.
        // The simplified example in `lib/actions/auth.ts` redirects on success.
        // On error it returns { error: string }.
        // We need to wrap it to catch the error.

        // NOTE: Direct form action attribute usage `<form action={action}>` is standard.
        // To handle errors, use `useFormState` hook (Next.js 14+) - but for speed simplicity here:
        // We will stick to standard action. To catch error, we'd need a client wrapper or `useFormState`.
        // Let's implement a simple wrapper here.
        const result = await action(formData);
        if (result?.error) {
            toast.error(result.error);
        }
    };

    return (
        <div className="grid gap-6">
            <form action={handleSubmit}>
                <div className="grid gap-4">

                    {mode === 'signup' && (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="firstName">Prénom</Label>
                                <Input id="firstName" name="firstName" placeholder="Anna" required className="h-11 rounded-xl" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="lastName">Nom</Label>
                                <Input id="lastName" name="lastName" placeholder="Doe" required className="h-11 rounded-xl" />
                            </div>
                        </div>
                    )}

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            placeholder="name@example.com"
                            type="email"
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect="off"
                            required
                            className="h-11 rounded-xl"
                        />
                    </div>
                    <div className="grid gap-2">
                        <div className="flex items-center">
                            <Label htmlFor="password">Mot de passe</Label>
                            {mode === 'login' && (
                                <Link
                                    href="/forgot-password"
                                    className="ml-auto inline-block text-sm underline text-muted-foreground"
                                >
                                    Oublié ?
                                </Link>
                            )}
                        </div>
                        <div className="relative">
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                required
                                className="h-11 rounded-xl pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-ikonga-pink focus:outline-none p-1 transition-colors duration-200"
                                tabIndex={-1}
                                title={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                            >
                                {showPassword ? <EyeOff size={20} className="text-ikonga-pink" /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <SubmitButton mode={mode} />

                </div>
            </form>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                        Ou continuer avec
                    </span>
                </div>
            </div>
            {/* Social Auth Placeholders */}
            <div className="flex justify-center gap-4">
                {/* Google / Apple */}
            </div>
        </div>
    )
}
