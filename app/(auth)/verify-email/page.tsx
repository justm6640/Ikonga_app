import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"
import Link from "next/link"

export default function VerifyEmailPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-ikonga-soft p-4">
            <Card className="w-full max-w-md border-ikonga-coral/20 bg-white/80 backdrop-blur-sm shadow-xl">
                <CardHeader className="text-center pb-2">
                    <div className="mx-auto mb-4 bg-ikonga-coral/10 p-3 rounded-full w-fit">
                        <Mail className="h-8 w-8 text-ikonga-coral" />
                    </div>
                    <CardTitle className="text-2xl font-serif text-primary">
                        Vérifiez votre boîte mail
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-6">
                    <p className="text-muted-foreground leading-relaxed">
                        Un lien de connexion vient d'être envoyé à votre adresse email.
                        Cliquez dessus pour activer votre compte et commencer l'aventure IKONGA.
                    </p>

                    <div className="pt-2">
                        <Button variant="outline" className="w-full rounded-xl" asChild>
                            <Link href="/login">
                                Retour à la connexion
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
