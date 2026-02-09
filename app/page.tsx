import { getOrCreateUser } from "@/lib/actions/user"
import { redirect } from "next/navigation"
import { OnboardingSlides } from "@/components/onboarding/OnboardingSlides"

export default async function HomePage() {
  const user = await getOrCreateUser()

  // If user is already logged in, they don't need to see the slides again
  if (user) {
    redirect("/dashboard")
  }

  // Guests see the onboarding slides as the first point of entry
  return (
    <main className="relative bg-black selection:bg-pink-100 selection:text-pink-600 font-sans antialiased overflow-x-hidden">
      <OnboardingSlides mode="landing" />
    </main>
  )
}
