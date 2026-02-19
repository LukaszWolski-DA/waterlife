import type { HomepageContent } from '@/types/homepage';
import { createAuthServerClient } from '@/lib/supabase/server-auth';

/**
 * Server-side only functions for homepage content
 * UWAGA: Ten plik używa next/headers - tylko dla Server Components!
 */

// Domyślne wartości homepage (fallback gdy baza nie jest gotowa)
const DEFAULT_HOMEPAGE_CONTENT: HomepageContent = {
  hero: {
    companyName: 'Waterlife s.c.',
    mainTitle: 'Profesjonalna technika grzewcza i sanitarna',
    subtitle: 'Oferujemy kompleksowe rozwiązania dla instalacji grzewczych, sanitarnych oraz systemów nawadniających. Ponad 420 produktów najwyższej jakości.',
    ctaButtonPrimary: 'Przejdź do sklepu',
    ctaButtonSecondary: 'Skontaktuj się',
    benefits: [
      {
        title: 'Szybka dostawa',
        description: 'Na terenie całej Polski',
      },
      {
        title: 'Gwarancja jakości',
        description: 'Sprawdzeni producenci',
      },
      {
        title: 'Wsparcie techniczne',
        description: 'Doradztwo przy wyborze',
      },
    ],
  },
  stats: [
    { value: '420+', label: 'Produktów w ofercie' },
    { value: '15+', label: 'Lat doświadczenia' },
    { value: '98%', label: 'Zadowolonych klientów' },
    { value: '24h', label: 'Czas realizacji' },
  ],
  contact: {
    sectionLabel: 'Skontaktuj się z nami',
    title: 'Porozmawiajmy o Twoim projekcie',
    description: 'Nasi specjaliści pomogą Ci dobrać odpowiednie rozwiązania dla Twojego domu lub firmy. Skontaktuj się z nami, a odpowiemy na wszystkie pytania.',
    phone: '535-430-854',
    phoneLink: 'tel:+48535430854',
    email: 'biuro@waterlife.net.pl',
    emailLink: 'mailto:biuro@waterlife.net.pl',
    address: 'Oborniki Śląskie, Polska',
    addressLink: 'https://www.google.com/maps/place/Waterlife+s.c.+-+Technika+grzewcza+i+sanitarna,+instalacje+zewn%C4%99trzne,+systemy+nawadniaj%C4%85ce/@51.285607,16.9215649,1923m/data=!3m1!1e3!4m6!3m5!1s0x470f939d078a3731:0x660a10ce6c9d7b65!8m2!3d51.2907175!4d16.9110073!16s%2Fg%2F11shx62khf',
    workingHours: 'Pon-Pt: 8:00 - 16:00',
    formTitle: 'Wyślij wiadomość',
    formButtonText: 'Wyślij wiadomość',
  },
  categoriesIntro: {
    sectionLabel: 'Nasze kategorie',
    title: 'Kompleksowe rozwiązania dla Twojego domu',
    description: 'Znajdź wszystko, czego potrzebujesz do instalacji grzewczej, sanitarnej i nawadniającej w jednym miejscu.',
  },
  categoryCards: [
    {
      title: 'Technika Grzewcza',
      description: 'Kotły gazowe, nagrzewnice, pompy ciepła i akcesoria grzewcze od najlepszych producentów.',
      productCount: '180+ produktów',
      image: '/images/category-heating.jpg',
    },
    {
      title: 'Systemy Sanitarne',
      description: 'Podgrzewacze wody, zawory, pompy i kompletne systemy do instalacji wodno-kanalizacyjnych.',
      productCount: '150+ produktów',
      image: '/images/category-sanitary.jpg',
    },
    {
      title: 'Nawadnianie',
      description: 'Profesjonalne systemy nawadniające, elektrozawory, sterowniki i akcesoria do ogrodu.',
      productCount: '90+ produktów',
      image: '/images/category-irrigation.jpg',
    },
  ],
  brands: {
    sectionLabel: 'Współpracujemy z najlepszymi producentami',
    brands: [
      { name: 'TERMET', url: 'https://termet.pl' },
      { name: 'BOSCH', url: 'https://www.bosch.pl' },
      { name: 'Atlantic', url: 'https://www.atlantic.pl' },
      { name: 'VTS', url: 'https://vtsgroup.com' },
      { name: 'FLOWAIR', url: 'https://flowair.com' },
      { name: 'DANFOSS', url: 'https://www.danfoss.com' },
      { name: 'IMMERGAS', url: 'https://immergas.com' },
      { name: 'LG', url: 'https://www.lg.com/pl' },
    ],
  },
  updatedAt: new Date().toISOString(),
};

/**
 * Get homepage content directly from Supabase (Server-side only)
 * Używaj TYLKO w Server Components i API routes!
 * Dla Client Components użyj getHomepageContent() z homepage-store.ts
 * 
 * @returns Homepage content z Supabase lub domyślne wartości jako fallback
 */
export async function getHomepageContentServer(): Promise<HomepageContent> {
  try {
    const supabase = await createAuthServerClient();

    const { data, error } = await supabase
      .from('homepage_content')
      .select('content, updated_at')
      .eq('section', 'homepage')
      .single();

    if (error) {
      console.warn('[Homepage Server] Error fetching from Supabase:', error.message);
      console.warn('[Homepage Server] Using default content. Did you run the migration?');
      return DEFAULT_HOMEPAGE_CONTENT;
    }

    if (!data) {
      console.warn('[Homepage Server] No data found in Supabase. Using default content.');
      return DEFAULT_HOMEPAGE_CONTENT;
    }

    // Dane z bazy - dodaj updatedAt
    const content: HomepageContent = {
      ...data.content,
      updatedAt: data.updated_at,
    };

    return content;
  } catch (error) {
    console.error('[Homepage Server] Fatal error loading content:', error);
    console.warn('[Homepage Server] Falling back to default content');
    return DEFAULT_HOMEPAGE_CONTENT;
  }
}
