import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { BrandsSection } from "@/components/brands-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"
import { HomeRecommendations } from "@/components/home-recommendations"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <HomeRecommendations />
      <FeaturesSection />
      <BrandsSection />
      <CTASection />
      <Footer />
    </main>
  )
}
