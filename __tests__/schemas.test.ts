import { describe, it, expect } from 'vitest';
import { contactSchema, zapytanieSchema } from '@/lib/schemas';

// --- contactSchema ---

describe('contactSchema', () => {
  const valid = {
    name: 'Jan Kowalski',
    email: 'jan@example.com',
    message: 'Proszę o kontakt w sprawie oferty.',
  };

  it('accepts valid data', () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });

  it('accepts optional phone and subject', () => {
    const result = contactSchema.safeParse({ ...valid, phone: '123456789', subject: 'Temat' });
    expect(result.success).toBe(true);
  });

  it('rejects empty name', () => {
    const result = contactSchema.safeParse({ ...valid, name: '' });
    expect(result.success).toBe(false);
    expect(result.error?.errors[0].message).toBe('Imię i nazwisko jest wymagane');
  });

  it('rejects missing email', () => {
    const result = contactSchema.safeParse({ ...valid, email: '' });
    expect(result.success).toBe(false);
    expect(result.error?.errors[0].message).toBe('Email jest wymagany');
  });

  it('rejects invalid email format', () => {
    const result = contactSchema.safeParse({ ...valid, email: 'not-an-email' });
    expect(result.success).toBe(false);
    expect(result.error?.errors[0].message).toBe('Nieprawidłowy format email');
  });

  it('rejects empty message', () => {
    const result = contactSchema.safeParse({ ...valid, message: '' });
    expect(result.success).toBe(false);
    expect(result.error?.errors[0].message).toBe('Wiadomość jest wymagana');
  });

  it('rejects message over 5000 chars', () => {
    const result = contactSchema.safeParse({ ...valid, message: 'a'.repeat(5001) });
    expect(result.success).toBe(false);
  });
});

// --- zapytanieSchema ---

const validItem = { id: '1', name: 'Filtr', price: 299, quantity: 2 };
const validCustomer = {
  firstName: 'Jan',
  lastName: 'Kowalski',
  email: 'jan@example.com',
  phone: '123456789',
};
const validZapytanie = {
  customer: validCustomer,
  items: [validItem],
  total: 598,
};

describe('zapytanieSchema', () => {
  it('accepts valid data', () => {
    expect(zapytanieSchema.safeParse(validZapytanie).success).toBe(true);
  });

  it('accepts optional customer fields', () => {
    const result = zapytanieSchema.safeParse({
      ...validZapytanie,
      customer: { ...validCustomer, company: 'Firma', nip: '1234567890', message: 'Uwagi' },
      isGuest: false,
      userId: 'user-123',
    });
    expect(result.success).toBe(true);
  });

  it('rejects missing firstName', () => {
    const result = zapytanieSchema.safeParse({
      ...validZapytanie,
      customer: { ...validCustomer, firstName: '' },
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid customer email', () => {
    const result = zapytanieSchema.safeParse({
      ...validZapytanie,
      customer: { ...validCustomer, email: 'zly-email' },
    });
    expect(result.success).toBe(false);
    expect(result.error?.errors[0].message).toBe('Nieprawidłowy format email');
  });

  it('rejects empty cart', () => {
    const result = zapytanieSchema.safeParse({ ...validZapytanie, items: [] });
    expect(result.success).toBe(false);
    expect(result.error?.errors[0].message).toBe('Koszyk jest pusty');
  });

  it('rejects negative price', () => {
    const result = zapytanieSchema.safeParse({
      ...validZapytanie,
      items: [{ ...validItem, price: -10 }],
    });
    expect(result.success).toBe(false);
  });

  it('rejects zero or negative quantity', () => {
    const result = zapytanieSchema.safeParse({
      ...validZapytanie,
      items: [{ ...validItem, quantity: 0 }],
    });
    expect(result.success).toBe(false);
  });

  it('rejects negative total', () => {
    const result = zapytanieSchema.safeParse({ ...validZapytanie, total: -1 });
    expect(result.success).toBe(false);
  });
});
