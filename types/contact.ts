/**
 * Typy TypeScript dla wiadomości kontaktowych
 */

export type MessageStatus =
  | 'unread'    // Nieprzeczytana
  | 'read'      // Przeczytana
  | 'replied'   // Odpowiedziana
  | 'archived'; // Zarchiwizowana

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  attachmentUrl?: string;
  attachmentName?: string;
  status: MessageStatus;
  createdAt: string;
  readAt?: string;
  repliedAt?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject?: string;
  message: string;
  attachment?: File;
}

export interface ContactReply {
  id: string;
  messageId: string;
  replyText: string;
  repliedBy: string; // ID administratora
  createdAt: string;
}
