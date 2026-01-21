import { getOrCreateUser } from "@/lib/actions/user";
import { redirect } from "next/navigation";
import { OnboardingClient } from "@/components/onboarding/OnboardingClient";

export default async function OnboardingPage() {
    const user = await getOrCreateUser();

    // If already completed, don't stay here
    if (user?.hasCompletedOnboarding) {
        redirect("/dashboard");
    }

    return <OnboardingClient />;
}
