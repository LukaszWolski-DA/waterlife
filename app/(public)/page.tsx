import { HeroSection } from '@/components/hero-section';
import { ProductsSection } from '@/components/products-section';
import { CategoriesSection } from '@/components/categories-section';
import { StatsSection } from '@/components/stats-section';
import { BrandsSection } from '@/components/brands-section';
import { ContactSection } from '@/components/contact-section';

/**
 * Strona główna WaterLife
 * Składa się z wszystkich sekcji: hero, produkty, kategorie, statystyki, marki, kontakt
 */
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ProductsSection />
      <CategoriesSection />
      <StatsSection />
      <BrandsSection />
      <ContactSection />
    </>
  );
}
