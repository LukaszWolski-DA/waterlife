/**
 * Utility do czyszczenia starych danych z localStorage po migracji do Supabase
 * Uruchamiane raz na użytkownika po załadowaniu aplikacji
 */

const MIGRATION_FLAG = 'waterlife_migrated_v2';

export function clearLegacyLocalStorage(): void {
  if (typeof window === 'undefined') return; // Only run in browser

  // Check if migration already completed
  const migrated = localStorage.getItem(MIGRATION_FLAG);
  if (migrated) return;

  console.log('🧹 Czyszczenie starych danych localStorage...');

  // Clear old product/category/manufacturer and auth data (now in Supabase)
  const keysToRemove = [
    'waterlife_products',
    'waterlife_manufacturers',
    'waterlife_categories',
    'waterlife_session',      // OLD AUTH SESSION
    'waterlife_users',         // OLD USER REGISTRY
  ];

  let removedCount = 0;
  keysToRemove.forEach(key => {
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key);
      removedCount++;
    }
  });

  // Set migration flag
  localStorage.setItem(MIGRATION_FLAG, 'true');

  if (removedCount > 0) {
    console.log(`✅ Wyczyszczono ${removedCount} starych kluczy localStorage`);
    console.log('💾 Wszystkie dane teraz w Supabase');
  } else {
    console.log('✅ Migracja zakończona (brak starych danych)');
  }
}
