import { FloatingNavbar } from "@/components/landing/FloatingNavbar"
import { Footer } from "@/components/landing/Footer"
import { HeroSection } from "@/components/landing/HeroSection"
import { BentoMethod } from "@/components/landing/BentoMethod"
import { HowItWorks } from "@/components/landing/HowItWorks"
import { TestimonialsMarquee } from "@/components/landing/TestimonialsMarquee"
import { PricingSection } from "@/components/landing/PricingSection"

export default function LandingPage() {
  return (
    <main className="relative bg-white selection:bg-pink-100 selection:text-pink-600 font-sans antialiased overflow-x-hidden">
      <FloatingNavbar />

      <HeroSection />

      <div id="method">
        <BentoMethod />
      </div>

      <div id="how-it-works">
        <HowItWorks />
      </div>

      <div id="testimonials">
        <TestimonialsMarquee />
      </div>

      <div id="tarifs">
        <PricingSection />
      </div>

      <Footer />
    </main>
  )
}
