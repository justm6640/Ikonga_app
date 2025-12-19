import { redirect } from "next/navigation";
import { getOrCreateUser } from "@/lib/actions/user";
import { Feature, hasFeature } from "@/config/subscriptions";

/**
 * Ensures a user has access to a specific feature before proceeding.
 * Should be used in Server Components (Pages/Layouts) or Server Actions.
 * 
 * @param feature The feature key to check (e.g., 'FITNESS')
 * @param redirectTo The path to redirect to if access is denied (defaults to dashboard)
 */
export async function protectFeature(feature: Feature, redirectTo: string = "/dashboard") {
    const user = await getOrCreateUser();

    if (!user) {
        redirect("/login");
    }

    // 1. ADMINS have total access
    if (user.role === "ADMIN") {
        return user;
    }

    // 2. Regular subscription check
    const authorized = hasFeature(user.subscriptionTier, feature);

    if (!authorized) {
        console.warn(`Unauthorized access attempt: User ${user.email} tried to access ${feature}`);
        redirect(redirectTo);
    }

    return user;
}
