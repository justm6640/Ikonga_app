import { QuestionnaireWizard } from "@/components/questionnaire/QuestionnaireWizard";
import { getOrCreateUser } from "@/lib/actions/user";
import { redirect } from "next/navigation";

export default async function OnboardingPage() {
    const user = await getOrCreateUser();

    // If already completed, don't stay here
    if (user?.hasCompletedOnboarding) {
        redirect("/dashboard");
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex flex-col items-center pt-10 px-4">
            <div className="w-full max-w-2xl mb-8 text-center">
                <h1 className="text-4xl md:text-5xl font-serif font-black text-slate-900 tracking-tighter uppercase mb-4">
                    Bienvenue chez <span className="text-ikonga-pink">IKONGA</span>
                </h1>
                <p className="text-slate-500 text-lg md:text-xl font-light max-w-lg mx-auto leading-relaxed">
                    Quelques questions pour bâtir <span className="font-bold text-slate-800">ton programme idéal</span>.
                </p>
            </div>

            <div className="w-full max-w-2xl bg-white/40 backdrop-blur-xl shadow-2xl shadow-slate-200/50 rounded-[3rem] border border-white p-6 md:p-10">
                <QuestionnaireWizard />
            </div>

            <div className="mt-8 text-slate-400 text-xs font-medium uppercase tracking-[0.2em]">
                Piliers : Nutrition • Fitness • Wellness • Beauty
            </div>
        </div>
    );
}
