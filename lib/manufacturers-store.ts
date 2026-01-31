import type { Manufacturer, ManufacturerFormData } from '@/types/manufacturer';

const STORAGE_KEY = 'waterlife_manufacturers';

// Initial manufacturers (mock data)
const INITIAL_MANUFACTURERS: Manufacturer[] = [
  {
    id: '1',
    name: 'Viessmann',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Buderus',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Vaillant',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Junkers',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

/**
 * Initialize manufacturers store with mock data if empty
 */
export function initializeManufacturersStore(): void {
  if (typeof window === 'undefined') return;

  try {
    const existing = localStorage.getItem(STORAGE_KEY);
    if (!existing) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MANUFACTURERS));
    }
  } catch (error) {
    console.error('Error initializing manufacturers store:', error);
  }
}

/**
 * Get all manufacturers from localStorage
 */
export function getAllManufacturers(): Manufacturer[] {
  if (typeof window === 'undefined') return [];

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      initializeManufacturersStore();
      return INITIAL_MANUFACTURERS;
    }
    return JSON.parse(data) as Manufacturer[];
  } catch (error) {
    console.error('Error getting manufacturers:', error);
    return [];
  }
}

/**
 * Get manufacturer by ID
 */
export function getManufacturerById(id: string): Manufacturer | null {
  const manufacturers = getAllManufacturers();
  return manufacturers.find(m => m.id === id) || null;
}

/**
 * Check if manufacturer name already exists (case-insensitive)
 * Used for duplicate detection in forms
 */
export function manufacturerNameExists(name: string, excludeId?: string): boolean {
  const manufacturers = getAllManufacturers();
  const normalizedName = name.trim().toLowerCase();

  return manufacturers.some(m =>
    m.name.toLowerCase() === normalizedName && m.id !== excludeId
  );
}

/**
 * Find manufacturer by name (case-insensitive, returns closest match)
 */
export function findManufacturerByName(name: string): Manufacturer | null {
  const manufacturers = getAllManufacturers();
  const normalizedName = name.trim().toLowerCase();

  return manufacturers.find(m => m.name.toLowerCase() === normalizedName) || null;
}

/**
 * Create a new manufacturer
 */
export function createManufacturer(data: ManufacturerFormData): Manufacturer {
  const manufacturers = getAllManufacturers();

  // Check for duplicate names
  if (manufacturerNameExists(data.name)) {
    throw new Error(`Producent "${data.name}" już istnieje`);
  }

  const newManufacturer: Manufacturer = {
    ...data,
    name: data.name.trim(),
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  manufacturers.push(newManufacturer);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(manufacturers));
  } catch (error) {
    console.error('Error creating manufacturer:', error);
    throw new Error('Failed to create manufacturer');
  }

  return newManufacturer;
}

/**
 * Update an existing manufacturer
 */
export function updateManufacturer(id: string, data: Partial<ManufacturerFormData>): Manufacturer | null {
  const manufacturers = getAllManufacturers();
  const index = manufacturers.findIndex(m => m.id === id);

  if (index === -1) {
    console.error('Manufacturer not found:', id);
    return null;
  }

  // Check for duplicate names (excluding current manufacturer)
  if (data.name && manufacturerNameExists(data.name, id)) {
    throw new Error(`Producent "${data.name}" już istnieje`);
  }

  const updated: Manufacturer = {
    ...manufacturers[index],
    ...data,
    name: data.name ? data.name.trim() : manufacturers[index].name,
    updatedAt: new Date().toISOString(),
  };

  manufacturers[index] = updated;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(manufacturers));
  } catch (error) {
    console.error('Error updating manufacturer:', error);
    throw new Error('Failed to update manufacturer');
  }

  return updated;
}

/**
 * Delete a manufacturer
 */
export function deleteManufacturer(id: string): boolean {
  const manufacturers = getAllManufacturers();
  const filtered = manufacturers.filter(m => m.id !== id);

  if (filtered.length === manufacturers.length) {
    console.error('Manufacturer not found:', id);
    return false;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error deleting manufacturer:', error);
    return false;
  }
}

/**
 * Get manufacturer names only (for dropdowns)
 */
export function getManufacturerNames(): string[] {
  const manufacturers = getAllManufacturers();
  return manufacturers.map(m => m.name);
}
