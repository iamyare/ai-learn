'use client'
import HeroSection from './components/hero-section'
import FeatureSection from './components/feature-section'
import FeatureMoreSection from './components/feacture-more-section'
import PricingSection from './components/pricing-section'
import FAQSection from './components/faq-section'
import Footer from './components/footer'

export default function Home() {


  return (
    <main className=' flex flex-col'>

    
    <HeroSection />
    <FeatureSection />
    <FeatureMoreSection />
    <PricingSection />
    <FAQSection />
    <Footer />
    </main>
  )
}
