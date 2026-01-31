/**
 * Konfiguracja klienta Supabase
 * Używane do połączenia z bazą danych i storage
 *
 * TODO: Dodać zmienne środowiskowe w .env.local:
 * - NEXT_PUBLIC_SUPABASE_URL
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY
 */

// import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Przykładowe funkcje pomocnicze do pracy z Supabase
 */

// Pobierz wszystkie produkty
export async function getProducts(filters?: {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}) {
  // TODO: Implementacja zapytania do Supabase
  // let query = supabase.from('products').select('*');
  // if (filters?.category) query = query.eq('category', filters.category);
  // if (filters?.minPrice) query = query.gte('price', filters.minPrice);
  // if (filters?.maxPrice) query = query.lte('price', filters.maxPrice);
  // const { data, error } = await query;
  // return data;

  return [];
}

// Pobierz produkt po ID
export async function getProductById(id: string) {
  // TODO: Implementacja
  // const { data, error } = await supabase
  //   .from('products')
  //   .select('*')
  //   .eq('id', id)
  //   .single();
  // return data;

  return null;
}

// Utwórz nowe zamówienie
export async function createOrder(orderData: any) {
  // TODO: Implementacja
  // const { data, error } = await supabase
  //   .from('orders')
  //   .insert([orderData])
  //   .select()
  //   .single();
  // return data;

  return null;
}

// Upload pliku do Supabase Storage
export async function uploadFile(file: File, bucket: string) {
  // TODO: Implementacja
  // const fileName = `${Date.now()}-${file.name}`;
  // const { data, error } = await supabase.storage
  //   .from(bucket)
  //   .upload(fileName, file);
  //
  // if (error) throw error;
  //
  // const { data: { publicUrl } } = supabase.storage
  //   .from(bucket)
  //   .getPublicUrl(fileName);
  //
  // return publicUrl;

  return '';
}
