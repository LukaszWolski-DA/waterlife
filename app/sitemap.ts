import type { MetadataRoute } from 'next';
import { getAllProductsServer } from '@/lib/supabase/products';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://waterlife.net.pl';

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/produkty`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/kontakt`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/dostawa`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/faq`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/gwarancja`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/zwroty`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/regulamin`, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${baseUrl}/polityka-prywatnosci`, changeFrequency: 'yearly', priority: 0.4 },
  ];

  try {
    const products = await getAllProductsServer();
    const productPages: MetadataRoute.Sitemap = products
      .filter((p) => p.status === 'active')
      .map((p) => ({
        url: `${baseUrl}/produkty/${p.id}`,
        lastModified: new Date(p.updatedAt),
        changeFrequency: 'weekly',
        priority: 0.8,
      }));

    return [...staticPages, ...productPages];
  } catch {
    return staticPages;
  }
}
