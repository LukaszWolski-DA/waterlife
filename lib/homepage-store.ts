import type { HomepageContent, HomepageFormData } from '@/types/homepage';

/**
 * Client-side functions for homepage content
 * UWAGA: Ten plik został zmigrowany z localStorage do Supabase API.
 * Wszystkie funkcje używają fetch API (client-side safe).
 * 
 * Dla Server Components użyj: lib/homepage-server.ts
 */

/**
 * @deprecated initializeHomepageStore is no longer needed (now using Supabase)
 */
export function initializeHomepageStore(): void {
  // No-op: localStorage is no longer used
  console.warn('[DEPRECATED] initializeHomepageStore() is deprecated. Data is now in Supabase.');
}

/**
 * Get homepage content from Supabase API
 */
export async function getHomepageContent(): Promise<HomepageContent> {
  try {
    const response = await fetch('/api/homepage', {
      method: 'GET',
      cache: 'no-store', // Always fetch fresh data for admin
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch homepage content: ${response.status}`);
    }

    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error('Error getting homepage content:', error);
    throw new Error('Failed to load homepage content');
  }
}

/**
 * Update homepage content via Supabase API
 */
export async function updateHomepageContent(data: HomepageFormData): Promise<HomepageContent> {
  try {
    const response = await fetch('/api/homepage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update homepage content');
    }

    const result = await response.json();
    return result.content;
  } catch (error) {
    console.error('Error updating homepage content:', error);
    throw error;
  }
}

/**
 * Reset homepage content to defaults via Supabase API
 */
export async function resetHomepageContent(): Promise<HomepageContent> {
  try {
    const response = await fetch('/api/homepage/reset', {
      method: 'POST',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to reset homepage content');
    }

    const result = await response.json();
    return result.content;
  } catch (error) {
    console.error('Error resetting homepage content:', error);
    throw error;
  }
}
