/**
 * Typy TypeScript dla wiadomości kontaktowych
 * Zgodne ze strukturą tabeli contact_messages w Supabase
 */

export type MessageStatus =
  | 'new'       // Nowa (nieprzeczytana)
  | 'read'      // Przeczytana
  | 'replied'   // Odpowiedziana
  | 'archived'; // Zarchiwizowana

/**
 * Struktura customer_info (JSONB w Supabase)
 */
export interface CustomerInfo {
  name: string;
  email: string;
  phone?: string;
}

/**
 * ContactMessage - zgodny z tabelą contact_messages
 */
export interface ContactMessage {
  id: string;
  customer_info: CustomerInfo;
  subject?: string | null;
  message: string;
  status: MessageStatus;
  admin_notes?: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Dane z formularza kontaktowego (do wysłania)
 */
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

/**
 * Dane do aktualizacji wiadomości (admin)
 */
export interface ContactMessageUpdate {
  status?: MessageStatus;
  admin_notes?: string;
}
