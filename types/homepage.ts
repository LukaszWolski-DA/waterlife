/**
 * Homepage content types for WaterLife
 * Edytowalne treści na stronie głównej
 */

// Faza 1 - MVP: Hero, Stats, Contact
// Faza 2 - Extended: Categories, Brands

// Faza 2 - Categories
export interface CategoryIntro {
  sectionLabel: string;
  title: string;
  description: string;
}

export interface CategoryCard {
  title: string;
  description: string;
  productCount: string;
  image: string;
}

// Faza 2 - Brands
export interface Brand {
  name: string;
  url?: string;  // Optional URL to brand website
}

export interface BrandsContent {
  sectionLabel: string;
  brands: Brand[];  // Changed from brandNames: string[]
}

export interface HeroContent {
  companyName: string;
  mainTitle: string;
  subtitle: string;
  ctaButtonPrimary: string;
  ctaButtonSecondary: string;
  benefits: Array<{
    title: string;
    description: string;
  }>;
}

export interface StatItem {
  value: string;
  label: string;
}

export interface ContactInfo {
  sectionLabel: string;
  title: string;
  description: string;
  phone: string;
  phoneLink: string;
  email: string;
  emailLink: string;
  address: string;
  addressLink: string;
  workingHours: string;
  formTitle: string;
  formButtonText: string;
}

export interface HomepageContent {
  hero: HeroContent;
  stats: StatItem[];
  contact: ContactInfo;
  categoriesIntro: CategoryIntro;
  categoryCards: CategoryCard[];
  brands: BrandsContent;
  updatedAt: string;
}

export interface HomepageFormData {
  hero: HeroContent;
  stats: StatItem[];
  contact: ContactInfo;
  categoriesIntro: CategoryIntro;
  categoryCards: CategoryCard[];
  brands: BrandsContent;
}
