"use client"

import Link from "next/link"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

const COUNTRY_CODES = [
    { code: "+33", country: "France", flag: "🇫🇷" },
    { code: "+1", country: "USA/Canada", flag: "🇺🇸" },
    { code: "+44", country: "UK", flag: "🇬🇧" },
    { code: "+212", country: "Maroc", flag: "🇲🇦" },
    { code: "+213", country: "Algérie", flag: "🇩🇿" },
    { code: "+216", country: "Tunisie", flag: "🇹🇳" },
    { code: "+32", country: "Belgique", flag: "🇧🇪" },
    { code: "+41", country: "Suisse", flag: "🇨🇭" },
    { code: "+49", country: "Allemagne", flag: "🇩🇪" },
    { code: "+34", country: "Espagne", flag: "🇪🇸" },
    { code: "+39", country: "Italie", flag: "🇮🇹" },
]

export function AuthForm({ mode }: AuthFormProps) {
    const [showPassword, setShowPassword] = useState(false)
    const [countryCode, setCountryCode] = useState("+33")
    const action = mode === "login" ? login : signup

    const handleSubmit = async (formData: FormData) => {
        // Combine country code with phone number before submission
        const phoneNumber = formData.get("phoneNumber") as string
        if (phoneNumber && mode === "signup") {
            formData.set("phone", `${countryCode}${phoneNumber}`)
        }

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
                        <>
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

                            <div className="grid gap-2">
                                <Label htmlFor="birthDate">Date de naissance</Label>
                                <Input
                                    id="birthDate"
                                    name="birthDate"
                                    type="date"
                                    required
                                    className="h-11 rounded-xl"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="phoneNumber">Numéro de téléphone</Label>
                                <div className="flex gap-2">
                                    <Select value={countryCode} onValueChange={setCountryCode}>
                                        <SelectTrigger className="w-[140px] h-11 rounded-xl">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {COUNTRY_CODES.map((item) => (
                                                <SelectItem key={item.code} value={item.code}>
                                                    <span className="flex items-center gap-2">
                                                        <span>{item.flag}</span>
                                                        <span>{item.code}</span>
                                                    </span>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Input
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        type="tel"
                                        placeholder="6 12 34 56 78"
                                        required
                                        className="flex-1 h-11 rounded-xl"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="heightCm">Taille (cm)</Label>
                                    <Input
                                        id="heightCm"
                                        name="heightCm"
                                        type="number"
                                        placeholder="165"
                                        min="100"
                                        max="250"
                                        required
                                        className="h-11 rounded-xl"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="startWeight">Poids de départ (kg)</Label>
                                    <Input
                                        id="startWeight"
                                        name="startWeight"
                                        type="number"
                                        step="0.1"
                                        placeholder="70"
                                        min="30"
                                        max="300"
                                        required
                                        className="h-11 rounded-xl"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="startDate">Date de début de cure</Label>
                                <Input
                                    id="startDate"
                                    name="startDate"
                                    type="date"
                                    required
                                    className="h-11 rounded-xl"
                                />
                            </div>
                        </>
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
