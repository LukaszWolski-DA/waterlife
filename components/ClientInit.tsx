'use client';

import { useEffect } from 'react';
import { clearLegacyLocalStorage } from '@/lib/clear-old-data';

/**
 * Component wykonywany po stronie klienta przy pierwszym załadowaniu
 * Czysci stare dane localStorage po migracji do Supabase
 */
export function ClientInit() {
  useEffect(() => {
    clearLegacyLocalStorage();
  }, []);

  return null; // No visual output
}
