import { z } from 'zod';

/**
 * Schematy walidacji Zod
 * Używane do walidacji danych z formularzy i API
 */

// Schema produktu
export const productSchema = z.object({
  name: z.string().min(3, 'Nazwa musi mieć minimum 3 znaki'),
  description: z.string().optional(),
  price: z.number().min(0, 'Cena musi być większa lub równa 0'),
  stock: z.number().int().min(0, 'Stan magazynowy musi być liczbą całkowitą >= 0'),
  category: z.string().optional(),
  manufacturer: z.string().optional(),
  imageUrl: z.string().optional().or(z.literal('')), // Accepts both URLs and local paths
});

export type ProductInput = z.infer<typeof productSchema>;

// Schema producenta
export const manufacturerSchema = z.object({
  name: z.string().min(2, 'Nazwa producenta musi mieć minimum 2 znaki'),
});

export type ManufacturerInput = z.infer<typeof manufacturerSchema>;

// Schema zamówienia
export const orderSchema = z.object({
  customerName: z.string().min(2, 'Imię i nazwisko wymagane'),
  email: z.string().email('Nieprawidłowy adres email'),
  phone: z.string().min(9, 'Numer telefonu musi mieć minimum 9 cyfr'),
  address: z.string().min(5, 'Adres wymagany'),
  city: z.string().min(2, 'Miasto wymagane'),
  postalCode: z.string().regex(/^\d{2}-\d{3}$/, 'Kod pocztowy w formacie XX-XXX'),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().int().min(1),
    price: z.number().min(0),
  })),
});

export type OrderInput = z.infer<typeof orderSchema>;

// Schema wiadomości kontaktowej
export const contactSchema = z.object({
  name: z.string().min(2, 'Imię i nazwisko wymagane'),
  email: z.string().email('Nieprawidłowy adres email'),
  subject: z.string().optional(),
  message: z.string().min(10, 'Wiadomość musi mieć minimum 10 znaków'),
});

export type ContactInput = z.infer<typeof contactSchema>;

// Schema aktualizacji statusu zamówienia
export const orderStatusSchema = z.object({
  id: z.string(),
  status: z.enum([
    'pending',
    'processing',
    'shipped',
    'delivered',
    'cancelled'
  ]),
});

export type OrderStatusInput = z.infer<typeof orderStatusSchema>;

// Schema filtru produktów
export const productFilterSchema = z.object({
  category: z.string().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  inStock: z.boolean().optional(),
});

export type ProductFilterInput = z.infer<typeof productFilterSchema>;
