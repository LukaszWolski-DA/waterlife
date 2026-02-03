import { createClient } from './client';

/**
 * Client-side functions for fetching metadata (categories, manufacturers)
 * Uses anon key - safe for client-side use
 * Tables have public read access via RLS policies
 */

/**
 * Pobierz wszystkie kategorie z bazy (CLIENT-SIDE)
 * @returns Array nazw kategorii
 */
export async function getAllCategories(): Promise<string[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('categories')
    .select('name')
    .order('name');

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return data.map(row => row.name);
}

/**
 * Pobierz wszystkich producentów z bazy (CLIENT-SIDE)
 * @returns Array nazw producentów
 */
export async function getAllManufacturers(): Promise<string[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('manufacturers')
    .select('name')
    .order('name');

  if (error) {
    console.error('Error fetching manufacturers:', error);
    return [];
  }

  return data.map(row => row.name);
}
