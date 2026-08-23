import { describe, expect, it } from 'vitest';
import { buildInvoicePdf } from './pdf.js';
import { DEFAULT_SETTINGS, type OrderRecord } from './domain.js';

const order: OrderRecord = {
  id: 'ord_test',
  invoiceNumber: 'DK-2026-0007',
  status: 'awaiting_payment',
  items: [
    {
      productId: 'morning-coffee-mug',
      sku: 'DK-CUP-001',
      nameLt: 'Ryto puodelis',
      nameEn: 'Morning Coffee Mug',
      qty: 1,
      unitCents: 3200,
      lineCents: 3200,
    },
  ],
  buyer: { name: 'Jonas Kazlauskas', email: 'jonas@example.com', phone: '+37060000000' },
  delivery: 'pickup',
  language: 'lt',
  shippingCents: 0,
  subtotalCents: 3200,
  amountCents: 3200,
  payUrl: null,
  payseraPaymentId: null,
  token: 'tok',
  paidVia: null,
  underpaid: false,
  overpaid: false,
  createdAt: '2026-08-23T10:00:00.000Z',
  updatedAt: '2026-08-23T10:00:00.000Z',
};

function asHexAscii(value: string): string {
  return Buffer.from(value, 'ascii').toString('hex');
}

describe('invoice PDF', () => {
  it('contains invoice number, IBAN, buyer, and totals', async () => {
    const pdf = await buildInvoicePdf(order, DEFAULT_SETTINGS);
    const hex = pdf.toString('latin1').toLowerCase();
    expect(hex).toContain(asHexAscii('DK-2026-0007'));
    expect(hex).toContain(asHexAscii('Jonas Kazlauskas'));
    expect(hex).toContain(asHexAscii('32.00 EUR'));
    expect(hex).toContain(asHexAscii('IBAN'));
    expect(hex).toContain(asHexAscii('PVM'));
  });
});
