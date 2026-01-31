import type { HomepageContent, HomepageFormData } from '@/types/homepage';

const STORAGE_KEY = 'waterlife_homepage';

// Początkowe dane strony głównej (z obecnej wersji)
const INITIAL_CONTENT: HomepageContent = {
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
  // Faza 2 - Categories
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
  // Faza 2 - Brands
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
 * Initialize homepage store with default content if empty
 */
export function initializeHomepageStore(): void {
  if (typeof window === 'undefined') return;

  try {
    const existing = localStorage.getItem(STORAGE_KEY);
    if (!existing) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CONTENT));
    }
  } catch (error) {
    console.error('Error initializing homepage store:', error);
  }
}

/**
 * Get homepage content from localStorage
 */
export function getHomepageContent(): HomepageContent {
  if (typeof window === 'undefined') return INITIAL_CONTENT;

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      initializeHomepageStore();
      return INITIAL_CONTENT;
    }

    const parsed = JSON.parse(data);

    // Migration: Add Faza 2 fields if missing
    if (!parsed.categoriesIntro || !parsed.categoryCards || !parsed.brands) {
      const migrated: HomepageContent = {
        ...INITIAL_CONTENT,
        ...parsed,
        categoriesIntro: parsed.categoriesIntro || INITIAL_CONTENT.categoriesIntro,
        categoryCards: parsed.categoryCards || INITIAL_CONTENT.categoryCards,
        brands: parsed.brands || INITIAL_CONTENT.brands,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
      return migrated;
    }

    // Migration: Convert old brandNames to new brands format
    if (parsed.brands && Array.isArray((parsed.brands as any).brandNames)) {
      const migrated: HomepageContent = {
        ...parsed,
        brands: {
          sectionLabel: parsed.brands.sectionLabel,
          brands: (parsed.brands as any).brandNames.map((name: string) => ({ name, url: '' })),
        },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
      return migrated;
    }

    return parsed as HomepageContent;
  } catch (error) {
    console.error('Error getting homepage content:', error);
    return INITIAL_CONTENT;
  }
}

/**
 * Update homepage content
 */
export function updateHomepageContent(data: HomepageFormData): HomepageContent {
  const updated: HomepageContent = {
    ...data,
    updatedAt: new Date().toISOString(),
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('Error updating homepage content:', error);
    throw new Error('Failed to update homepage content');
  }
}

/**
 * Reset homepage content to defaults
 */
export function resetHomepageContent(): HomepageContent {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CONTENT));
    return INITIAL_CONTENT;
  } catch (error) {
    console.error('Error resetting homepage content:', error);
    throw new Error('Failed to reset homepage content');
  }
}
