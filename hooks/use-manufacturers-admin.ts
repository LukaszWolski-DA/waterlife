import { useState, useEffect, useCallback } from 'react';
import type { Manufacturer, ManufacturerFormData } from '@/types/manufacturer';
import {
  getAllManufacturers,
  getManufacturerById,
  createManufacturer,
  updateManufacturer,
  deleteManufacturer,
  manufacturerNameExists,
  findManufacturerByName,
} from '@/lib/manufacturers-store';

/**
 * Hook for managing manufacturers in admin panel
 * Updated to work with asynchronous API calls
 */
export function useManufacturersAdmin() {
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadManufacturers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllManufacturers();
      setManufacturers(data);
      setError(null);
    } catch (err) {
      setError('Nie udało się załadować producentów');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadManufacturers();
  }, [loadManufacturers]);

  const getManufacturer = useCallback(async (id: string) => {
    return await getManufacturerById(id);
  }, []);

  const addManufacturer = useCallback(async (data: ManufacturerFormData) => {
    try {
      const newManufacturer = await createManufacturer(data);
      setManufacturers(prev => [...prev, newManufacturer]);
      return newManufacturer;
    } catch (err) {
      setError('Nie udało się utworzyć producenta');
      console.error(err);
      throw err;
    }
  }, []);

  const editManufacturer = useCallback(async (id: string, data: Partial<ManufacturerFormData>) => {
    try {
      const updated = await updateManufacturer(id, data);
      if (updated) {
        setManufacturers(prev =>
          prev.map(m => (m.id === id ? updated : m))
        );
        return updated;
      }
      throw new Error('Producent nie znaleziony');
    } catch (err) {
      setError('Nie udało się zaktualizować producenta');
      console.error(err);
      throw err;
    }
  }, []);

  const removeManufacturer = useCallback(async (id: string) => {
    try {
      const success = await deleteManufacturer(id);
      if (success) {
        setManufacturers(prev => prev.filter(m => m.id !== id));
      }
      return success;
    } catch (err) {
      setError('Nie udało się usunąć producenta');
      console.error(err);
      return false;
    }
  }, []);

  const checkNameExists = useCallback(async (name: string, excludeId?: string): Promise<boolean> => {
    return await manufacturerNameExists(name, excludeId);
  }, []);

  const findByName = useCallback(async (name: string): Promise<Manufacturer | null> => {
    return await findManufacturerByName(name);
  }, []);

  const refetch = useCallback(() => {
    loadManufacturers();
  }, [loadManufacturers]);

  return {
    manufacturers,
    loading,
    error,
    getManufacturer,
    createManufacturer: addManufacturer,
    updateManufacturer: editManufacturer,
    deleteManufacturer: removeManufacturer,
    checkNameExists,
    findByName,
    refetch,
  };
}
