import { useState, useEffect, useCallback } from 'react';
import type { Manufacturer, ManufacturerFormData } from '@/types/manufacturer';
import {
  getAllManufacturers,
  getManufacturerById,
  createManufacturer,
  updateManufacturer,
  deleteManufacturer,
  initializeManufacturersStore,
  manufacturerNameExists,
  findManufacturerByName,
} from '@/lib/manufacturers-store';

export function useManufacturersAdmin() {
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadManufacturers = useCallback(() => {
    try {
      setLoading(true);
      initializeManufacturersStore();
      const data = getAllManufacturers();
      setManufacturers(data);
      setError(null);
    } catch (err) {
      setError('Failed to load manufacturers');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadManufacturers();
  }, [loadManufacturers]);

  const getManufacturer = useCallback((id: string) => {
    return getManufacturerById(id);
  }, []);

  const addManufacturer = useCallback(async (data: ManufacturerFormData) => {
    try {
      const newManufacturer = createManufacturer(data);
      setManufacturers(prev => [...prev, newManufacturer]);
      return newManufacturer;
    } catch (err) {
      setError('Failed to create manufacturer');
      console.error(err);
      throw err;
    }
  }, []);

  const editManufacturer = useCallback(async (id: string, data: Partial<ManufacturerFormData>) => {
    try {
      const updated = updateManufacturer(id, data);
      if (updated) {
        setManufacturers(prev =>
          prev.map(m => (m.id === id ? updated : m))
        );
        return updated;
      }
      throw new Error('Manufacturer not found');
    } catch (err) {
      setError('Failed to update manufacturer');
      console.error(err);
      throw err;
    }
  }, []);

  const removeManufacturer = useCallback(async (id: string) => {
    try {
      const success = deleteManufacturer(id);
      if (success) {
        setManufacturers(prev => prev.filter(m => m.id !== id));
      }
      return success;
    } catch (err) {
      setError('Failed to delete manufacturer');
      console.error(err);
      return false;
    }
  }, []);

  const checkNameExists = useCallback((name: string, excludeId?: string): boolean => {
    return manufacturerNameExists(name, excludeId);
  }, []);

  const findByName = useCallback((name: string): Manufacturer | null => {
    return findManufacturerByName(name);
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
