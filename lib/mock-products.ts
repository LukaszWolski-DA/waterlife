import type { Product } from '@/types/product';

/**
 * Mockowane dane produktów dla WaterLife
 * Używane do testowania flow zakupowego przed podłączeniem bazy danych
 */

export const mockProducts: Product[] = [
  // TECHNIKA GRZEWCZA
  {
    id: '1',
    name: 'Kocioł gazowy TERMET EcoCondens',
    description: 'Nowoczesny kondensacyjny kocioł gazowy o mocy 24 kW. Wysoka efektywność energetyczna, cicha praca, kompaktowe wymiary. Idealny do ogrzewania domów jednorodzinnych.',
    price: 4500,
    stock: 12,
    category: 'Technika Grzewcza',
    manufacturer: 'Viessmann',
    imageUrl: '/placeholder.jpg',
    images: ['/placeholder.jpg'],
    featured: true,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Pompa ciepła powietrze-woda LG Therma V',
    description: 'Inwerterowa pompa ciepła 12 kW. Najwyższa klasa energetyczna A+++. Cicha praca, sterowanie przez aplikację mobilną. Idealna do nowoczesnych domów energooszczędnych.',
    price: 18900,
    stock: 5,
    category: 'Technika Grzewcza',
    manufacturer: 'Viessmann',
    imageUrl: '/placeholder.jpg',
    images: ['/placeholder.jpg'],
    featured: true,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Nagrzewnica powietrza FLOWAIR LEO',
    description: 'Wydajna nagrzewnica przemysłowa o mocy 30 kW. Silny strumień powietrza, trwała konstrukcja. Doskonała do hal produkcyjnych i magazynów.',
    price: 2100,
    stock: 8,
    category: 'Technika Grzewcza',
    manufacturer: 'Viessmann',
    imageUrl: '/placeholder.jpg',
    images: ['/placeholder.jpg'],
    featured: false,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // SYSTEMY SANITARNE
  {
    id: '4',
    name: 'Podgrzewacz wody Atlantic Vertigo 80L',
    description: 'Elektryczny podgrzewacz wody o pojemności 80 litrów. Szybkie nagrzewanie, trwała emaliowana komora. Funkcja Eco dla oszczędności energii.',
    price: 890,
    stock: 15,
    category: 'Systemy Sanitarne',
    manufacturer: 'Buderus',
    imageUrl: '/placeholder.jpg',
    images: ['/placeholder.jpg'],
    featured: true,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Pompa obiegowa Grundfos ALPHA2',
    description: 'Energooszczędna pompa obiegowa A-rated. Automatyczna regulacja, cicha praca. Idealna do systemów centralnego ogrzewania.',
    price: 650,
    stock: 20,
    category: 'Systemy Sanitarne',
    manufacturer: 'Buderus',
    imageUrl: '/placeholder.jpg',
    images: ['/placeholder.jpg'],
    featured: true,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Zawór termostatyczny DANFOSS RAE',
    description: 'Precyzyjny zawór termostatyczny z głowicą. Łatwy montaż, elegancki design. Dokładna regulacja temperatury w pomieszczeniach.',
    price: 145,
    stock: 50,
    category: 'Systemy Sanitarne',
    manufacturer: 'Buderus',
    imageUrl: '/placeholder.jpg',
    images: ['/placeholder.jpg'],
    featured: false,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // NAWADNIANIE
  {
    id: '7',
    name: 'Sterownik nawadniania Rain Bird ESP-TM2',
    description: 'Profesjonalny sterownik 8-strefowy. Programowanie przez WiFi, czujnik deszczu w zestawie. Idealne rozwiązanie dla średnich ogrodów.',
    price: 580,
    stock: 10,
    category: 'Nawadnianie',
    manufacturer: 'Vaillant',
    imageUrl: '/placeholder.jpg',
    images: ['/placeholder.jpg'],
    featured: true,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '8',
    name: 'Zraszacz wynurzalny Hunter PGP-ADJ',
    description: 'Profesjonalny zraszacz z regulowanym zasięgiem 6-15m. Trwała konstrukcja, równomierne nawadnianie. Najlepszy w swojej klasie.',
    price: 85,
    stock: 100,
    category: 'Nawadnianie',
    manufacturer: 'Vaillant',
    imageUrl: '/placeholder.jpg',
    images: ['/placeholder.jpg'],
    featured: false,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '9',
    name: 'Elektrozawór 24V Hunter PGV-101',
    description: 'Niezawodny elektrozawór 1 cal z regulacją przepływu. Odporny na zabrudzenia, łatwy serwis. Standard w profesjonalnych instalacjach.',
    price: 120,
    stock: 35,
    category: 'Nawadnianie',
    manufacturer: 'Vaillant',
    imageUrl: '/placeholder.jpg',
    images: ['/placeholder.jpg'],
    featured: false,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // DODATKOWE PRODUKTY
  {
    id: '10',
    name: 'Termostat pokojowy Bosch CW400',
    description: 'Bezprzewodowy termostat z ekranem dotykowym. Programowanie tygodniowe, sterowanie przez aplikację. Nowoczesne zarządzanie klimatem w domu.',
    price: 380,
    stock: 18,
    category: 'Technika Grzewcza',
    manufacturer: 'Junkers',
    imageUrl: '/placeholder.jpg',
    images: ['/placeholder.jpg'],
    featured: false,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '11',
    name: 'Naczynie przeponowe Reflex NG 25L',
    description: 'Zbiornik wyrównawczy do instalacji c.o. Trwała przepona EPDM, malowanie proszkowe. Maksymalne ciśnienie robocze 3 bar.',
    price: 180,
    stock: 25,
    category: 'Systemy Sanitarne',
    manufacturer: 'Junkers',
    imageUrl: '/placeholder.jpg',
    images: ['/placeholder.jpg'],
    featured: false,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '12',
    name: 'Rura kroplująca XFS 16mm 100m',
    description: 'Profesjonalna rura kroplująca co 30cm. Odporna na zabrudzenia, równomierne nawadnianie. Idealna do rabat i warzywników.',
    price: 240,
    stock: 40,
    category: 'Nawadnianie',
    manufacturer: 'Junkers',
    imageUrl: '/placeholder.jpg',
    images: ['/placeholder.jpg'],
    featured: false,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

/**
 * Helper functions do pracy z mockowymi danymi
 */

// Pobierz wszystkie produkty
export function getAllProducts(): Product[] {
  return mockProducts;
}

// Pobierz wyróżnione produkty
export function getFeaturedProducts(): Product[] {
  return mockProducts.filter(p => p.featured);
}

// Pobierz produkty z kategorii
export function getProductsByCategory(category: string): Product[] {
  return mockProducts.filter(p => p.category === category);
}

// Pobierz pojedynczy produkt
export function getProductById(id: string): Product | undefined {
  return mockProducts.find(p => p.id === id);
}

// Pobierz powiązane produkty (z tej samej kategorii)
export function getRelatedProducts(productId: string, limit: number = 4): Product[] {
  const product = getProductById(productId);
  if (!product) return [];

  return mockProducts
    .filter(p => p.category === product.category && p.id !== productId)
    .slice(0, limit);
}
