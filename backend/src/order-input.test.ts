import { describe, expect, it } from 'vitest';
import { mergeOrderItems, parseCentsAmount, parseOrderBody } from './order-input.js';

describe('mergeOrderItems', () => {
  it('sums duplicate product lines', () => {
    const merged = mergeOrderItems([
      { productId: 'morning-coffee-mug', qty: 1 },
      { productId: 'morning-coffee-mug', qty: 2 },
    ]);
    expect(merged).toEqual({
      ok: true,
      items: [{ productId: 'morning-coffee-mug', qty: 3 }],
    });
  });

  it('rejects non-integer qty', () => {
    expect(mergeOrderItems([{ productId: 'x', qty: 1.5 }]).ok).toBe(false);
  });
});

describe('parseCentsAmount', () => {
  it('accepts finite integer cents', () => {
    expect(parseCentsAmount(3200)).toBe(3200);
    expect(parseCentsAmount('0')).toBe(0);
  });

  it('rejects non-finite and fractional values', () => {
    expect(parseCentsAmount(Number.NaN)).toBeNull();
    expect(parseCentsAmount(Infinity)).toBeNull();
    expect(parseCentsAmount(32.5)).toBeNull();
    expect(parseCentsAmount(undefined)).toBeNull();
  });
});

describe('parseOrderBody', () => {
  const pickup = {
    items: [{ productId: 'morning-coffee-mug', qty: 1 }],
    buyer: { name: 'Jonas', email: 'jonas@example.com', phone: '+37060000000' },
    delivery: 'pickup',
    language: 'en',
  };

  it('requires a plausible email and phone', () => {
    expect(parseOrderBody({ ...pickup, buyer: { ...pickup.buyer, email: 'not-an-email' } }).ok).toBe(
      false,
    );
    expect(parseOrderBody({ ...pickup, buyer: { ...pickup.buyer, email: 'a@b.com\nBcc:x' } }).ok).toBe(
      false,
    );
    expect(parseOrderBody({ ...pickup, buyer: { ...pickup.buyer, phone: '' } }).ok).toBe(false);
  });

  it('requires address fields for shipping', () => {
    expect(parseOrderBody({ ...pickup, delivery: 'shipping' }).ok).toBe(false);
    expect(
      parseOrderBody({
        ...pickup,
        delivery: 'shipping',
        buyer: {
          ...pickup.buyer,
          address: 'Laisves 1',
          city: 'Kaunas',
          postalCode: '44280',
        },
      }).ok,
    ).toBe(true);
  });
});
