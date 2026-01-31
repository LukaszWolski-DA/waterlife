/**
 * Manufacturer types for WaterLife
 * Simple manufacturer structure - stores only the name
 */

export interface Manufacturer {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ManufacturerFormData {
  name: string;
}

export type ManufacturerInput = Omit<Manufacturer, 'id' | 'createdAt' | 'updatedAt'>;
