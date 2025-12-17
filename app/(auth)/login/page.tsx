import Link from "next/link"
import { AuthForm } from "@/components/auth/AuthForm"

export default function LoginPage() {
    return (
        <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-[800px]">
            <div className="flex items-center justify-center py-12">
                <div className="mx-auto grid w-[350px] gap-6">
                    <div className="grid gap-2 text-center">
                        <h1 className="text-3xl font-bold font-serif">Bienvenue</h1>
                        <p className="text-balance text-muted-foreground">
                            Entrez votre email pour vous connecter
                        </p>
                    </div>

                    <AuthForm mode="login" />

                    <div className="mt-4 text-center text-sm">
                        Pas encore de compte ?{" "}
                        <Link href="/signup" className="underline font-medium text-ikonga-pink">
                            S'inscrire
                        </Link>
                    </div>
                </div>
            </div>
            <div className="hidden bg-muted lg:block relative">
                {/* Placeholder for Image */}
                <div className="absolute inset-0 bg-ikonga-gradient opacity-10" />
                <div className="flex items-center justify-center h-full">
                    <h1 className="text-6xl font-serif text-ikonga-pink opacity-20">IKONGA</h1>
                </div>
            </div>
        </div>
    )
}
