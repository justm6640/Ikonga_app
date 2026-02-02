import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm"

export default function ForgotPasswordPage() {
    return (
        <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-[800px]">
            <div className="flex items-center justify-center py-12">
                <div className="mx-auto grid w-[350px] gap-6">
                    <div className="grid gap-2 text-center">
                        <h1 className="text-3xl font-bold font-serif">Mot de passe oublié</h1>
                        <p className="text-balance text-muted-foreground">
                            Pas de panique, ça arrive aux meilleurs. Saisis ton email ci-dessous.
                        </p>
                    </div>

                    <ForgotPasswordForm />
                </div>
            </div>
            <div className="hidden bg-muted lg:block relative">
                {/* Visual side panel matching login style */}
                <div className="absolute inset-0 bg-ikonga-gradient opacity-10" />
                <div className="flex flex-col items-center justify-center h-full space-y-4 p-12 text-center">
                    <h1 className="text-6xl font-serif text-ikonga-coral opacity-20">IKONGA</h1>
                    <p className="text-slate-400 font-medium max-w-sm">
                        "Prendre soin de soi commence par être bienveillant envers soi-même."
                    </p>
                </div>
            </div>
        </div>
    )
}
