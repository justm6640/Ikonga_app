import { QuestionnaireWizard } from "@/components/questionnaire/QuestionnaireWizard";

export default function OnboardingPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center pt-10">
            <div className="w-full max-w-2xl px-4 mb-8 text-center">
                <h1 className="text-4xl font-serif text-primary mb-2">Bienvenue chez IKONGA</h1>
                <p className="text-muted-foreground">
                    Construisons ensemble ton programme personnalisé.
                </p>
            </div>

            <div className="w-full bg-card shadow-sm rounded-3xl border border-border/50">
                <QuestionnaireWizard />
            </div>
        </div>
    );
}
