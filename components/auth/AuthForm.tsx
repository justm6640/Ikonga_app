"use client"

import Link from "next/link"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
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
    // Europe
    { code: "+33", country: "France", flag: "🇫🇷" },
    { code: "+32", country: "Belgique", flag: "🇧🇪" },
    { code: "+41", country: "Suisse", flag: "🇨🇭" },
    { code: "+352", country: "Luxembourg", flag: "🇱🇺" },
    { code: "+377", country: "Monaco", flag: "🇲🇨" },
    { code: "+44", country: "Royaume-Uni", flag: "🇬🇧" },
    { code: "+49", country: "Allemagne", flag: "🇩🇪" },
    { code: "+34", country: "Espagne", flag: "🇪🇸" },
    { code: "+39", country: "Italie", flag: "🇮🇹" },
    { code: "+351", country: "Portugal", flag: "🇵🇹" },
    { code: "+31", country: "Pays-Bas", flag: "🇳🇱" },
    { code: "+48", country: "Pologne", flag: "🇵🇱" },
    { code: "+30", country: "Grèce", flag: "🇬🇷" },
    { code: "+46", country: "Suède", flag: "🇸🇪" },
    { code: "+47", country: "Norvège", flag: "🇳🇴" },
    { code: "+45", country: "Danemark", flag: "🇩🇰" },
    { code: "+358", country: "Finlande", flag: "🇫🇮" },
    { code: "+43", country: "Autriche", flag: "🇦🇹" },

    // Afrique du Nord
    { code: "+212", country: "Maroc", flag: "🇲🇦" },
    { code: "+213", country: "Algérie", flag: "🇩🇿" },
    { code: "+216", country: "Tunisie", flag: "🇹🇳" },
    { code: "+218", country: "Libye", flag: "🇱🇾" },
    { code: "+20", country: "Égypte", flag: "🇪🇬" },

    // Afrique de l'Ouest
    { code: "+221", country: "Sénégal", flag: "🇸🇳" },
    { code: "+225", country: "Côte d'Ivoire", flag: "🇨🇮" },
    { code: "+223", country: "Mali", flag: "🇲🇱" },
    { code: "+226", country: "Burkina Faso", flag: "🇧🇫" },
    { code: "+227", country: "Niger", flag: "🇳🇪" },
    { code: "+228", country: "Togo", flag: "🇹🇬" },
    { code: "+229", country: "Bénin", flag: "🇧🇯" },
    { code: "+224", country: "Guinée", flag: "🇬🇳" },
    { code: "+234", country: "Nigéria", flag: "🇳🇬" },
    { code: "+233", country: "Ghana", flag: "🇬🇭" },

    // Afrique Centrale
    { code: "+237", country: "Cameroun", flag: "🇨🇲" },
    { code: "+242", country: "Congo", flag: "🇨🇬" },
    { code: "+243", country: "RDC", flag: "🇨🇩" },
    { code: "+236", country: "RCA", flag: "🇨🇫" },
    { code: "+241", country: "Gabon", flag: "🇬🇦" },
    { code: "+235", country: "Tchad", flag: "🇹🇩" },

    // Afrique de l'Est
    { code: "+254", country: "Kenya", flag: "🇰🇪" },
    { code: "+255", country: "Tanzanie", flag: "🇹🇿" },
    { code: "+256", country: "Ouganda", flag: "🇺🇬" },
    { code: "+250", country: "Rwanda", flag: "🇷🇼" },
    { code: "+257", country: "Burundi", flag: "🇧🇮" },
    { code: "+251", country: "Éthiopie", flag: "🇪🇹" },

    // Afrique Australe
    { code: "+27", country: "Afrique du Sud", flag: "🇿🇦" },
    { code: "+264", country: "Namibie", flag: "🇳🇦" },
    { code: "+267", country: "Botswana", flag: "🇧🇼" },
    { code: "+260", country: "Zambie", flag: "🇿🇲" },
    { code: "+263", country: "Zimbabwe", flag: "🇿🇼" },
    { code: "+258", country: "Mozambique", flag: "🇲🇿" },
    { code: "+261", country: "Madagascar", flag: "🇲🇬" },
    { code: "+230", country: "Maurice", flag: "🇲🇺" },
    { code: "+262", country: "Réunion", flag: "🇷🇪" },
    { code: "+269", country: "Comores", flag: "🇰🇲" },

    // Amérique du Nord
    { code: "+1", country: "USA/Canada", flag: "🇺🇸" },
    { code: "+52", country: "Mexique", flag: "🇲🇽" },

    // Amérique Centrale et Caraïbes
    { code: "+590", country: "Guadeloupe", flag: "🇬🇵" },
    { code: "+596", country: "Martinique", flag: "🇲🇶" },
    { code: "+594", country: "Guyane", flag: "🇬🇫" },
    { code: "+509", country: "Haïti", flag: "🇭🇹" },

    // Amérique du Sud
    { code: "+55", country: "Brésil", flag: "🇧🇷" },
    { code: "+54", country: "Argentine", flag: "🇦🇷" },
    { code: "+56", country: "Chili", flag: "🇨🇱" },
    { code: "+57", country: "Colombie", flag: "🇨🇴" },
    { code: "+51", country: "Pérou", flag: "🇵🇪" },

    // Asie
    { code: "+86", country: "Chine", flag: "🇨🇳" },
    { code: "+91", country: "Inde", flag: "🇮🇳" },
    { code: "+81", country: "Japon", flag: "🇯🇵" },
    { code: "+82", country: "Corée du Sud", flag: "🇰🇷" },
    { code: "+84", country: "Vietnam", flag: "🇻🇳" },
    { code: "+66", country: "Thaïlande", flag: "🇹🇭" },
    { code: "+65", country: "Singapour", flag: "🇸🇬" },
    { code: "+60", country: "Malaisie", flag: "🇲🇾" },
    { code: "+62", country: "Indonésie", flag: "🇮🇩" },
    { code: "+63", country: "Philippines", flag: "🇵🇭" },

    // Moyen-Orient
    { code: "+971", country: "EAU", flag: "🇦🇪" },
    { code: "+966", country: "Arabie Saoudite", flag: "🇸🇦" },
    { code: "+974", country: "Qatar", flag: "🇶🇦" },
    { code: "+965", country: "Koweït", flag: "🇰🇼" },
    { code: "+973", country: "Bahreïn", flag: "🇧🇭" },
    { code: "+968", country: "Oman", flag: "🇴🇲" },
    { code: "+972", country: "Israël", flag: "🇮🇱" },
    { code: "+961", country: "Liban", flag: "🇱🇧" },
    { code: "+98", country: "Iran", flag: "🇮🇷" },
    { code: "+90", country: "Turquie", flag: "🇹🇷" },

    // Océanie
    { code: "+61", country: "Australie", flag: "🇦🇺" },
    { code: "+64", country: "Nouvelle-Zélande", flag: "🇳🇿" },
]

export function AuthForm({ mode }: AuthFormProps) {
    const [showPassword, setShowPassword] = useState(false)
    const [countryCode, setCountryCode] = useState("+33")
    const [gender, setGender] = useState("FEMALE")
    const action = mode === "login" ? login : signup

    const handleSubmit = async (formData: FormData) => {
        // Combine country code with phone number before submission
        const phoneNumber = formData.get("phoneNumber") as string
        if (phoneNumber && mode === "signup") {
            formData.set("phone", `${countryCode}${phoneNumber}`)
            formData.set("gender", gender)
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
                                <Label>Sexe</Label>
                                <RadioGroup value={gender} onValueChange={setGender} className="flex gap-4">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="FEMALE" id="female" />
                                        <Label htmlFor="female" className="font-normal cursor-pointer">Femme</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="MALE" id="male" />
                                        <Label htmlFor="male" className="font-normal cursor-pointer">Homme</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="OTHER" id="other" />
                                        <Label htmlFor="other" className="font-normal cursor-pointer">Autre</Label>
                                    </div>
                                </RadioGroup>
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
