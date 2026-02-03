import { createServerClient } from './server';
import { createClient } from './client';
import type { Product, ProductFormData, ProductImage } from '@/types/product';
import { getCategoryIdByName, getManufacturerIdByName } from './lookups';

/**
 * Supabase manager dla produktów
 * Server-side functions używają service_role key (admin access)
 * Client-side functions używają anon key (public access)
 */

// ==================== SERVER-SIDE FUNCTIONS ====================

/**
 * Pobiera wszystkie produkty z Supabase (SERVER)
 * Używa join z categories i manufacturers dla pełnych danych
 */
export async function getAllProductsServer(): Promise<Product[]> {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      categories (name),
      manufacturers (name)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    throw new Error(`Failed to fetch products: ${error.message}`);
  }

  // Map database format to Product type
  return (data || []).map(mapDbToProduct);
}

/**
 * Pobiera produkt po ID (SERVER)
 */
export async function getProductByIdServer(id: string): Promise<Product | null> {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      categories (name),
      manufacturers (name)
    `)
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    console.error('Error fetching product:', error);
    throw new Error(`Failed to fetch product: ${error.message}`);
  }

  return data ? mapDbToProduct(data) : null;
}

/**
 * Pobiera wyróżnione produkty (bestsellery) (SERVER)
 */
export async function getFeaturedProductsServer(): Promise<Product[]> {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      categories (name),
      manufacturers (name)
    `)
    .eq('featured', true)
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching featured products:', error);
    throw new Error(`Failed to fetch featured products: ${error.message}`);
  }

  return (data || []).map(mapDbToProduct);
}

/**
 * Pobiera produkty z filtrami (SERVER)
 */
export async function getFilteredProductsServer(filters: {
  categories?: string[];
  manufacturers?: string[];
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  search?: string;
}): Promise<Product[]> {
  const supabase = createServerClient();

  let query = supabase
    .from('products')
    .select(`
      *,
      categories (name),
      manufacturers (name)
    `);

  // Filtruj po kategoriach (konwertuj nazwy na UUID)
  if (filters.categories && filters.categories.length > 0) {
    const categoryIds = await Promise.all(
      filters.categories.map(name => getCategoryIdByName(name))
    );
    const validIds = categoryIds.filter(id => id !== null) as string[];
    if (validIds.length > 0) {
      query = query.in('category_id', validIds);
    }
  }

  // Filtruj po producentach (konwertuj nazwy na UUID)
  if (filters.manufacturers && filters.manufacturers.length > 0) {
    const manufacturerIds = await Promise.all(
      filters.manufacturers.map(name => getManufacturerIdByName(name))
    );
    const validIds = manufacturerIds.filter(id => id !== null) as string[];
    if (validIds.length > 0) {
      query = query.in('manufacturer_id', validIds);
    }
  }

  // Filtruj po cenie
  if (filters.minPrice !== undefined) {
    query = query.gte('price', filters.minPrice);
  }
  if (filters.maxPrice !== undefined) {
    query = query.lte('price', filters.maxPrice);
  }

  // Filtruj po dostępności
  if (filters.inStock) {
    query = query.gt('stock', 0);
  }

  // Wyszukiwanie full-text
  if (filters.search && filters.search.trim().length > 0) {
    const searchTerm = filters.search.trim();
    query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
  }

  query = query.order('created_at', { ascending: false });

  const { data, error } = await query;

  if (error) {
    console.error('Error filtering products:', error);
    throw new Error(`Failed to filter products: ${error.message}`);
  }

  return (data || []).map(mapDbToProduct);
}

/**
 * Tworzy nowy produkt (SERVER / ADMIN)
 */
export async function createProductServer(data: ProductFormData): Promise<Product> {
  const supabase = createServerClient();

  // Lookup UUID dla kategorii i producenta
  const categoryId = await getCategoryIdByName(data.category);
  const manufacturerId = await getManufacturerIdByName(data.manufacturer);

  // Przygotuj dane dla bazy
  const dbProduct = {
    name: data.name,
    description: data.description || null,
    price: data.price,
    stock: data.stock,
    category_id: categoryId,
    manufacturer_id: manufacturerId,
    images: data.images || [],
    featured: data.featured || false,
    status: data.stock > 0 ? 'active' : 'inactive',
  };

  const { data: created, error } = await supabase
    .from('products')
    .insert(dbProduct)
    .select(`
      *,
      categories (name),
      manufacturers (name)
    `)
    .single();

  if (error) {
    console.error('Error creating product:', error);
    throw new Error(`Failed to create product: ${error.message}`);
  }

  console.log('✅ Created product in Supabase:', created.name);
  return mapDbToProduct(created);
}

/**
 * Aktualizuje produkt (SERVER / ADMIN)
 */
export async function updateProductServer(
  id: string,
  data: Partial<ProductFormData>
): Promise<Product | null> {
  const supabase = createServerClient();

  // Przygotuj dane do aktualizacji
  const updates: any = {
    updated_at: new Date().toISOString(),
  };

  if (data.name !== undefined) updates.name = data.name;
  if (data.description !== undefined) updates.description = data.description;
  if (data.price !== undefined) updates.price = data.price;
  if (data.stock !== undefined) {
    updates.stock = data.stock;
    updates.status = data.stock > 0 ? 'active' : 'inactive';
  }

  // Lookup UUID dla kategorii i producenta
  if (data.category !== undefined) {
    updates.category_id = await getCategoryIdByName(data.category);
  }
  if (data.manufacturer !== undefined) {
    updates.manufacturer_id = await getManufacturerIdByName(data.manufacturer);
  }

  if (data.images !== undefined) updates.images = data.images;
  if (data.featured !== undefined) updates.featured = data.featured;

  const { data: updated, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select(`
      *,
      categories (name),
      manufacturers (name)
    `)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    console.error('Error updating product:', error);
    throw new Error(`Failed to update product: ${error.message}`);
  }

  console.log('✅ Updated product in Supabase:', updated.name);
  return mapDbToProduct(updated);
}

/**
 * Usuwa produkt (SERVER / ADMIN)
 */
export async function deleteProductServer(id: string): Promise<boolean> {
  const supabase = createServerClient();

  const { error } = await supabase.from('products').delete().eq('id', id);

  if (error) {
    console.error('Error deleting product:', error);
    throw new Error(`Failed to delete product: ${error.message}`);
  }

  console.log('🗑️ Deleted product from Supabase:', id);
  return true;
}

// ==================== CLIENT-SIDE FUNCTIONS ====================

/**
 * Pobiera wszystkie produkty (CLIENT - public read)
 */
export async function getAllProductsClient(): Promise<Product[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      categories (name),
      manufacturers (name)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return (data || []).map(mapDbToProduct);
}

/**
 * Pobiera produkt po ID (CLIENT - public read)
 */
export async function getProductByIdClient(id: string): Promise<Product | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      categories (name),
      manufacturers (name)
    `)
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    console.error('Error fetching product:', error);
    return null;
  }

  return data ? mapDbToProduct(data) : null;
}

// ==================== STORAGE FUNCTIONS ====================

/**
 * Upload zdjęcia produktu do Supabase Storage (CLIENT)
 * @param file - File object z przeglądarki
 * @param productId - ID produktu (do organizacji folderów)
 * @returns Public URL zdjęcia lub null jeśli błąd
 */
export async function uploadProductImage(
  file: File,
  productId?: string
): Promise<string | null> {
  const supabase = createClient();

  try {
    // Generuj unikalną nazwę pliku
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 9);
    const ext = file.name.split('.').pop();
    const fileName = productId
      ? `${productId}/${timestamp}-${randomStr}.${ext}`
      : `temp/${timestamp}-${randomStr}.${ext}`;

    // Upload do Storage
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Error uploading image:', error);
      return null;
    }

    // Pobierz public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from('product-images').getPublicUrl(data.path);

    console.log('✅ Uploaded image:', publicUrl);
    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
}

/**
 * Usuwa zdjęcie produktu z Storage (SERVER/ADMIN)
 */
export async function deleteProductImageServer(imageUrl: string): Promise<boolean> {
  const supabase = createServerClient();

  try {
    // Extract file path from URL
    // Format: https://<project>.supabase.co/storage/v1/object/public/product-images/<path>
    const urlParts = imageUrl.split('/product-images/');
    if (urlParts.length !== 2) {
      console.error('Invalid image URL format');
      return false;
    }

    const filePath = urlParts[1];

    const { error } = await supabase.storage.from('product-images').remove([filePath]);

    if (error) {
      console.error('Error deleting image:', error);
      return false;
    }

    console.log('🗑️ Deleted image:', filePath);
    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Mapuje dane z bazy danych na typ Product
 */
function mapDbToProduct(dbProduct: any): Product {
  // Konwersja category/manufacturer z joined data
  const categoryName = dbProduct.categories?.name || undefined;
  const manufacturerName = dbProduct.manufacturers?.name || undefined;

  // Parsuj images JSONB do ProductImage[]
  const images: ProductImage[] = Array.isArray(dbProduct.images)
    ? dbProduct.images
    : [];

  // Znajdź główne zdjęcie dla kompatybilności wstecznej
  const mainImage = images.find((img) => img.isMain);
  const imageUrl = mainImage?.url || images[0]?.url || undefined;

  return {
    id: dbProduct.id,
    name: dbProduct.name,
    description: dbProduct.description || undefined,
    price: dbProduct.price,
    stock: dbProduct.stock,
    category: categoryName,
    manufacturer: manufacturerName,
    imageUrl: imageUrl,
    images: images,
    featured: dbProduct.featured || false,
    status: dbProduct.status as 'active' | 'inactive',
    createdAt: dbProduct.created_at,
    updatedAt: dbProduct.updated_at,
  };
}
