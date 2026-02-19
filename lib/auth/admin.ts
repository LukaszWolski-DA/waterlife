/**
 * Admin authorization helpers
 * Funkcje pomocnicze do sprawdzania uprawnień admina
 */

/**
 * Sprawdza czy dany email jest na liście adminów
 * @param email - Email użytkownika do sprawdzenia
 * @returns true jeśli użytkownik jest adminem
 */
export function isAdminEmail(email: string | undefined): boolean {
  if (!email) return false;

  const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim().toLowerCase()) || [];
  
  if (adminEmails.length === 0) {
    console.warn('[AUTH] ADMIN_EMAILS not configured in .env.local');
    return false;
  }

  return adminEmails.includes(email.toLowerCase());
}

/**
 * Response dla braku uprawnień admina
 */
export const ADMIN_UNAUTHORIZED_RESPONSE = {
  error: 'Brak uprawnień admina. Tylko użytkownicy z listy ADMIN_EMAILS mogą wykonać tę operację.',
  status: 403,
} as const;

/**
 * Response dla braku autoryzacji (niezalogowany)
 */
export const UNAUTHORIZED_RESPONSE = {
  error: 'Musisz być zalogowany aby wykonać tę operację.',
  status: 401,
} as const;
