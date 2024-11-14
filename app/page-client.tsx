'use client'

import FAQSection from './components/faq-section'
import FeactureMoreSection from './components/feacture-more-section'
import FeatureSection from './components/feature-section'
import Footer from './components/footer'
import HeroSection from './components/hero-section'
import PricingSection from './components/pricing-section'

export default function PageClient({ user }: { user: User | null }) {
  return (
    <main className=' flex flex-col'>
      <HeroSection user={user} />
      <FeatureSection />
      <FeactureMoreSection />
      <PricingSection />
      <FAQSection />
      <Footer />
    </main>
  )
}
