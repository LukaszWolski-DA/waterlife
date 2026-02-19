import { HeroSection } from '@/components/hero-section';
import { ProductsSection } from '@/components/products-section';
import { CategoriesSection } from '@/components/categories-section';
import { StatsSection } from '@/components/stats-section';
import { BrandsSection } from '@/components/brands-section';
import { ContactSection } from '@/components/contact-section';
import { getHomepageContentServer } from '@/lib/homepage-server';

/**
 * ISR (Incremental Static Regeneration) - odświeża stronę co 5 minut
 * Dzięki temu strona jest szybka (statyczna) ale nadal aktualna
 */
export const revalidate = 300; // 5 minut w sekundach

/**
 * Strona główna WaterLife
 * Server Component z ISR - pobiera dane raz na 5 minut
 * Składa się z wszystkich sekcji: hero, produkty, kategorie, statystyki, marki, kontakt
 */
export default async function HomePage() {
  // Pobierz dane po stronie serwera (tylko raz na 5 minut dzięki ISR)
  const content = await getHomepageContentServer();

  return (
    <>
      <HeroSection content={content.hero} />
      <ProductsSection />
      <CategoriesSection intro={content.categoriesIntro} cards={content.categoryCards} />
      <StatsSection stats={content.stats} />
      <BrandsSection content={content.brands} />
      <ContactSection content={content.contact} />
    </>
  );
}
