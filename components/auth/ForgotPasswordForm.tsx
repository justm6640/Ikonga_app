"use client"

import Link from "next/link"
import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { forgotPassword } from "@/lib/actions/auth"
import { toast } from "sonner"
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react"

export function ForgotPasswordForm() {
    const [isPending, startTransition] = useTransition()
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleSubmit = async (formData: FormData) => {
        startTransition(async () => {
            const result = await forgotPassword(formData)

            if (result.success) {
                setIsSubmitted(true)
                toast.success("Vérifie tes emails !")
            } else {
                // For security, even if error, we might want to show success on UI
                // but here let's stick to showing the error if it's technical
                toast.error(result.error || "Une erreur est survenue")
            }
        })
    }

    if (isSubmitted) {
        return (
            <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-center">
                    <div className="bg-green-50 p-4 rounded-full">
                        <CheckCircle2 className="h-12 w-12 text-green-500" />
                    </div>
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold font-serif">Email envoyé !</h2>
                    <p className="text-muted-foreground">
                        Si un compte existe pour cet email, tu recevras un lien pour réinitialiser ton mot de passe.
                    </p>
                </div>
                <Button asChild variant="outline" className="w-full rounded-2xl h-12">
                    <Link href="/login">Retour à la connexion</Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="grid gap-6">
            <form action={handleSubmit}>
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                        <div className="relative">
                            <Input
                                id="email"
                                name="email"
                                placeholder="name@example.com"
                                type="email"
                                required
                                className="h-12 rounded-2xl pl-11"
                                disabled={isPending}
                            />
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full h-12 text-lg rounded-2xl bg-ikonga-gradient shadow-lg hover:opacity-90 transition-all font-bold"
                    >
                        {isPending ? "Envoi en cours..." : "Réinitialiser mon mot de passe"}
                    </Button>
                </div>
            </form>

            <Link
                href="/login"
                className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-ikonga-pink transition-colors"
            >
                <ArrowLeft size={14} />
                Retour à la connexion
            </Link>
        </div>
    )
}
