/**
 * Formatowanie cen w aplikacji WaterLife
 * Format: a bbb.cc (spacja jako separator tysięcy, kropka jako separator dziesiętny)
 * Przykład: 12000.45 → "12 000.45"
 */

/**
 * Formatuje cenę z separatorem tysięcy (spacja) i dwoma miejscami dziesiętnymi
 * @param price - Cena jako number
 * @returns Sformatowana cena jako string (np. "12 000.45")
 */
export function formatPrice(price: number): string {
  // Używamy toFixed(2) aby zapewnić 2 miejsca dziesiętne
  const fixed = price.toFixed(2);

  // Rozdzielamy część całkowitą i dziesiętną
  const [integerPart, decimalPart] = fixed.split('.');

  // Formatujemy część całkowitą ze spacjami jako separatorami tysięcy
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  // Łączymy z powrotem z kropką jako separatorem dziesiętnym
  return `${formattedInteger}.${decimalPart}`;
}

/**
 * Formatuje cenę z walutą (zł)
 * @param price - Cena jako number
 * @returns Sformatowana cena z walutą (np. "12 000.45 zł")
 */
export function formatPriceWithCurrency(price: number): string {
  return `${formatPrice(price)} zł`;
}
