import { z } from 'zod';

// --- Formularz kontaktowy ---

export const contactSchema = z.object({
  name: z.string().min(1, 'Imię i nazwisko jest wymagane').max(100),
  email: z.string().min(1, 'Email jest wymagany').email('Nieprawidłowy format email'),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(1, 'Wiadomość jest wymagana').max(5000),
});

export type ContactInput = z.infer<typeof contactSchema>;

// --- Zapytanie ofertowe ---

export const cartItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number().nonnegative(),
  quantity: z.number().int().positive(),
  imageUrl: z.string().optional(),
});

export const zapytanieSchema = z.object({
  customer: z.object({
    firstName: z.string().min(1, 'Imię jest wymagane'),
    lastName: z.string().min(1, 'Nazwisko jest wymagane'),
    email: z.string().email('Nieprawidłowy format email'),
    phone: z.string().min(1, 'Telefon jest wymagany'),
    company: z.string().optional(),
    nip: z.string().optional(),
    message: z.string().optional(),
  }),
  items: z.array(cartItemSchema).min(1, 'Koszyk jest pusty'),
  total: z.number().nonnegative(),
  userId: z.string().optional(),
  isGuest: z.boolean().optional(),
});

export type ZapytanieInput = z.infer<typeof zapytanieSchema>;
