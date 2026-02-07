import { redirect } from "next/navigation";
import { getOrCreateUser } from "@/lib/actions/user";
import { subHours, isBefore } from "date-fns";
import { WaitingContent } from "@/components/waiting/WaitingContent";

export default async function WaitingPage() {
    const user = await getOrCreateUser();

    if (!user) {
        redirect("/login");
    }

    // Access is granted 48H before planStartDate (Cure Start Date)
    const targetDate = user.planStartDate
        ? new Date(user.planStartDate)
        : (user.startDate ? new Date(user.startDate) : new Date());

    const unlockDate = subHours(targetDate, 48);
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
