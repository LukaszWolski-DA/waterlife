import { describe, it, expect, vi, beforeEach } from 'vitest';

// vi.hoisted ensures mockSend is defined before vi.mock hoisting
const mockSend = vi.hoisted(() => vi.fn());

vi.mock('resend', () => ({
  Resend: class {
    emails = { send: mockSend };
  },
}));

import { sendCustomerOrderConfirmationEmail } from '@/lib/email';

const TEST_ORDER = {
  orderId: 'a3f8c1d2-0000-0000-0000-000000000000',
  customer: {
    firstName: 'Jan',
    lastName: 'Kowalski',
    email: 'jan@example.com',
    phone: '123456789',
    company: 'TestFirma Sp. z o.o.',
  },
  items: [
    { id: '1', name: 'Filtr Aqua Pro 500', price: 599, quantity: 2 },
    { id: '2', name: 'Wkład węglowy', price: 89, quantity: 4 },
  ],
  total: 1554,
  createdAt: '2026-03-19T10:00:00.000Z',
};

describe('sendCustomerOrderConfirmationEmail — HTML template', () => {
  let capturedHtml: string;

  beforeEach(async () => {
    mockSend.mockReset();
    mockSend.mockResolvedValue({ data: { id: 'mock-id' } });
    await sendCustomerOrderConfirmationEmail(TEST_ORDER);
    capturedHtml = mockSend.mock.calls[0][0].html as string;
  });

  it('sends exactly one email', () => {
    expect(mockSend).toHaveBeenCalledTimes(1);
  });

  it('sends to the customer email', () => {
    expect(mockSend.mock.calls[0][0].to).toBe('jan@example.com');
  });

  it('total-row td has explicit white color (email client fix)', () => {
    expect(capturedHtml).toContain('.total-row td');
    const totalRowTd = capturedHtml.match(/\.total-row td\s*\{[^}]+\}/)?.[0] ?? '';
    expect(totalRowTd).toContain('color: #ffffff');
  });

  it('order-meta uses table layout, not flexbox div', () => {
    expect(capturedHtml).toContain('<table class="order-meta"');
    expect(capturedHtml).not.toContain('<div class="order-meta-row"');
  });

  it('order-meta-row CSS does not use display:flex', () => {
    const metaRowCss = capturedHtml.match(/\.order-meta-row\s*\{[^}]+\}/)?.[0] ?? '';
    expect(metaRowCss).not.toContain('display: flex');
  });

  it('contains order number (first 8 chars uppercase)', () => {
    expect(capturedHtml).toContain('#A3F8C1D2');
  });

  it('contains customer first name in greeting', () => {
    expect(capturedHtml).toContain('Jan');
  });

  it('contains all product names', () => {
    expect(capturedHtml).toContain('Filtr Aqua Pro 500');
    expect(capturedHtml).toContain('Wkład węglowy');
  });

  it('contains default company name when not provided', () => {
    expect(capturedHtml).toContain('Waterlife');
  });
});
