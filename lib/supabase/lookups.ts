import { createServerClient } from './server';

/**
 * Helper functions do konwersji nazw na UUID
 * Używane przy zapisie produktów do Supabase
 */

/**
 * Znajdź UUID kategorii po nazwie
 * @param name - Nazwa kategorii (np. "Technika Grzewcza")
 * @returns UUID kategorii lub null jeśli nie znaleziono
 */
export async function getCategoryIdByName(name: string | undefined): Promise<string | null> {
  if (!name) return null;

  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('categories')
    .select('id')
    .eq('name', name)
    .single();

  if (error || !data) {
    console.warn(`Category "${name}" not found in database`);
    return null;
  }

  return data.id;
}

/**
 * Znajdź UUID producenta po nazwie
 * @param name - Nazwa producenta (np. "Vaillant")
 * @returns UUID producenta lub null jeśli nie znaleziono
 */
export async function getManufacturerIdByName(name: string | undefined): Promise<string | null> {
  if (!name) return null;

  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('manufacturers')
    .select('id')
    .eq('name', name)
    .single();

  if (error || !data) {
    console.warn(`Manufacturer "${name}" not found in database`);
    return null;
  }

  return data.id;
}
