import { redirect } from "next/navigation";
import { getOrCreateUser } from "@/lib/actions/user";
import { subHours, isBefore } from "date-fns";
import { WaitingContent } from "@/components/waiting/WaitingContent";

export default async function WaitingPage() {
    const user = await getOrCreateUser();

    if (!user) {
        redirect("/login");
    }

    // Access is granted 48H before DETOX startDate
    const detoxPhase = user.phases?.find((p: any) => p.type === 'DETOX');
    const referenceDate = detoxPhase?.startDate
        ? new Date(detoxPhase.startDate)
        : (user.startDate ? new Date(user.startDate) : new Date());

    const unlockDate = subHours(referenceDate, 48);
    const now = new Date();

    // If already unlocked, redirect to dashboard
    if (user.role === 'ADMIN' || isBefore(unlockDate, now)) {
        redirect("/dashboard");
    }

    return (
        <WaitingContent
            unlockDate={unlockDate}
            userFirstName={user.firstName || "Inconnue"}
        />
    );
}
