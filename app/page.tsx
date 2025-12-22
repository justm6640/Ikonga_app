import { Navbar, Footer } from "@/components/landing/LandingLayout"
import { HeroSection } from "@/components/landing/HeroSection"
import { BentoFeatures } from "@/components/landing/BentoFeatures"
import { ScrollShowcase } from "@/components/landing/ScrollShowcase"
import { TestimonialsMarquee } from "@/components/landing/TestimonialsMarquee"

export default function LandingPage() {
  return (
    <main className="relative bg-white selection:bg-pink-100 selection:text-pink-600 font-sans antialiased">
      <Navbar />

      <HeroSection />

      <div id="features">
        <BentoFeatures />
      </div>

      <div id="showcase">
        <ScrollShowcase />
      </div>

      <div id="testimonials">
        <TestimonialsMarquee />
      </div>

      <Footer />
    </main>
  )
}
