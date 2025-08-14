import Hero from "./components/Hero"
import PromotionalBanner from "./components/PromotionalBanner"
import ServiceListings from "./components/ServiceListings"
import HowItWorks from "./components/HowItWorks"
import PremiumQuality from "./components/PremiumQuality"
import Testimonials from "./components/Testimonials"
import ServiceSelectionGrid from "./components/ServiceSelectionGrid"
import CategorizedServices from './components/CleaningServices'

export default function HomePage() {
  return (
    <main>
      <Hero />
      <ServiceSelectionGrid/>
      <ServiceListings />
      <PromotionalBanner />
      <CategorizedServices />
      <HowItWorks />
      <PremiumQuality />
      <Testimonials />
    </main>
  )
}
