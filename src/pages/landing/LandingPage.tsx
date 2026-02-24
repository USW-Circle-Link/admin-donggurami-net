import { Navbar } from './sections/Navbar'
import { HeroSection } from './sections/HeroSection'
import { FeaturesSection } from './sections/FeaturesSection'
import { AppPreviewSection } from './sections/AppPreviewSection'
import { HowItWorksSection } from './sections/HowItWorksSection'
import { CTASection } from './sections/CTASection'
import { Footer } from './sections/Footer'

export function LandingPage() {
  return (
    <div className="dark">
      <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
        <Navbar />
        <main>
          <HeroSection />
          <FeaturesSection />
          <AppPreviewSection />
          <HowItWorksSection />
          <CTASection />
        </main>
        <Footer />
      </div>
    </div>
  )
}
