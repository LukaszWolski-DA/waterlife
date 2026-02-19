import type { Manufacturer, ManufacturerFormData } from '@/types/manufacturer';

/**
 * Manufacturers Store - API version (migrated from localStorage to Supabase)
 * All functions are now asynchronous and interact with /api/admin/manufacturers
 */

/**
 * Get all manufacturers from API
 */
export async function getAllManufacturers(): Promise<Manufacturer[]> {
  try {
    const response = await fetch('/api/admin/manufacturers', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Error fetching manufacturers:', error);
      throw new Error(error.error || 'Nie udało się pobrać producentów');
    }

    const { manufacturers } = await response.json();
    return manufacturers;
  } catch (error) {
    console.error('Error getting manufacturers:', error);
    throw error;
  }
}

/**
 * Get manufacturer by ID from API
 */
export async function getManufacturerById(id: string): Promise<Manufacturer | null> {
  try {
    const response = await fetch(`/api/admin/manufacturers/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      const error = await response.json();
      console.error('Error fetching manufacturer:', error);
      throw new Error(error.error || 'Nie udało się pobrać producenta');
    }

    const { manufacturer } = await response.json();
    return manufacturer;
  } catch (error) {
    console.error('Error getting manufacturer:', error);
    throw error;
  }
}

/**
 * Create a new manufacturer via API
 */
export async function createManufacturer(data: ManufacturerFormData): Promise<Manufacturer> {
  try {
    const response = await fetch('/api/admin/manufacturers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Error creating manufacturer:', error);
      throw new Error(error.error || 'Nie udało się utworzyć producenta');
    }

    const { manufacturer } = await response.json();
    return manufacturer;
  } catch (error) {
    console.error('Error creating manufacturer:', error);
    throw error;
  }
}

/**
 * Update an existing manufacturer via API
 */
export async function updateManufacturer(id: string, data: Partial<ManufacturerFormData>): Promise<Manufacturer> {
  try {
    const response = await fetch(`/api/admin/manufacturers/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Error updating manufacturer:', error);
      throw new Error(error.error || 'Nie udało się zaktualizować producenta');
    }

    const { manufacturer } = await response.json();
    return manufacturer;
  } catch (error) {
    console.error('Error updating manufacturer:', error);
    throw error;
  }
}

/**
 * Delete a manufacturer via API
 */
export async function deleteManufacturer(id: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/admin/manufacturers/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Error deleting manufacturer:', error);
      throw new Error(error.error || 'Nie udało się usunąć producenta');
    }

    return true;
  } catch (error) {
    console.error('Error deleting manufacturer:', error);
    throw error;
  }
}

/**
 * Get manufacturer names only (for dropdowns)
 * Helper function that fetches all manufacturers and returns just the names
 */
export async function getManufacturerNames(): Promise<string[]> {
  try {
    const manufacturers = await getAllManufacturers();
    return manufacturers.map(m => m.name);
  } catch (error) {
    console.error('Error getting manufacturer names:', error);
    return [];
  }
}

/**
 * Check if manufacturer name already exists (case-insensitive)
 * Used for duplicate detection in forms (client-side validation helper)
 */
export async function manufacturerNameExists(name: string, excludeId?: string): Promise<boolean> {
  try {
    const manufacturers = await getAllManufacturers();
    const normalizedName = name.trim().toLowerCase();

    return manufacturers.some(m =>
      m.name.toLowerCase() === normalizedName && m.id !== excludeId
    );
  } catch (error) {
    console.error('Error checking manufacturer name:', error);
    return false;
  }
}

/**
 * Find manufacturer by name (case-insensitive, returns closest match)
 */
export async function findManufacturerByName(name: string): Promise<Manufacturer | null> {
  try {
    const manufacturers = await getAllManufacturers();
    const normalizedName = name.trim().toLowerCase();

    return manufacturers.find(m => m.name.toLowerCase() === normalizedName) || null;
  } catch (error) {
    console.error('Error finding manufacturer by name:', error);
    return null;
  }
}
