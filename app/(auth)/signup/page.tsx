import Link from "next/link"
import { AuthForm } from "@/components/auth/AuthForm"

export default function SignupPage() {
    return (
        <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-[800px]">
            <div className="flex items-center justify-center py-12">
                <div className="mx-auto grid w-[350px] gap-6">
                    <div className="grid gap-2 text-center">
                        <h1 className="text-3xl font-bold font-serif">Créer un compte</h1>
                        <p className="text-balance text-muted-foreground">
                            Rejoignez l'aventure IKONGA
                        </p>
                    </div>

                    <AuthForm mode="signup" />

                    <div className="mt-4 text-center text-sm">
                        Déjà un compte ?{" "}
                        <Link href="/login" className="underline font-medium text-ikonga-coral">
                            Se connecter
                        </Link>
                    </div>
                </div>
            </div>
            <div className="hidden bg-muted lg:block relative">
                <div className="absolute inset-0 bg-ikonga-gradient opacity-10" />
                <div className="flex items-center justify-center h-full">
                    <h1 className="text-6xl font-serif text-ikonga-coral opacity-20">IKONGA</h1>
                </div>
            </div>
        </div>
    )
}
