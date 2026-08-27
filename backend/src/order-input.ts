import type { BuyerInput, DeliveryMethod, ShopLanguage } from './domain.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CONTROL = /[\r\n\0]/;
const MAX_ITEMS = 50;
const MAX_QTY = 999;

function clean(value: unknown, max: number): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > max || CONTROL.test(trimmed)) return null;
  return trimmed;
}

export function parseCentsAmount(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value) && Number.isInteger(value) && value >= 0) {
    return value;
  }
  if (typeof value === 'string' && /^(0|[1-9]\d{0,11})$/.test(value)) {
    return Number(value);
  }
  return null;
}

export function mergeOrderItems(
  items: Array<{ productId: string; qty: number }>,
):
  | { ok: true; items: Array<{ productId: string; qty: number }> }
  | { ok: false; error: 'invalid_qty' | 'unknown_product' } {
  const qtyById = new Map<string, number>();
  if (!Array.isArray(items) || items.length === 0 || items.length > MAX_ITEMS) {
    return { ok: false, error: 'invalid_qty' };
  }
  for (const line of items) {
    if (typeof line.productId !== 'string' || line.productId.length < 1 || line.productId.length > 120) {
      return { ok: false, error: 'unknown_product' };
    }
    if (!Number.isInteger(line.qty) || line.qty < 1 || line.qty > MAX_QTY) {
      return { ok: false, error: 'invalid_qty' };
    }
    const next = (qtyById.get(line.productId) ?? 0) + line.qty;
    if (next > MAX_QTY) return { ok: false, error: 'invalid_qty' };
    qtyById.set(line.productId, next);
  }
  return {
    ok: true,
    items: [...qtyById.entries()].map(([productId, qty]) => ({ productId, qty })),
  };
}

export function parseOrderBody(body: unknown):
  | {
      ok: true;
      items: Array<{ productId: string; qty: number }>;
      buyer: BuyerInput;
      delivery: DeliveryMethod;
      language: ShopLanguage;
    }
  | { ok: false; error: 'invalid_body' } {
  if (!body || typeof body !== 'object') return { ok: false, error: 'invalid_body' };
  const raw = body as {
    items?: Array<{ productId: string; qty: number }>;
    buyer?: Partial<BuyerInput>;
    delivery?: string;
    language?: string;
  };
  if (!raw.items?.length) return { ok: false, error: 'invalid_body' };
  const merged = mergeOrderItems(raw.items);
  if (!merged.ok) return { ok: false, error: 'invalid_body' };

  const name = clean(raw.buyer?.name, 200);
  const email = clean(raw.buyer?.email, 254);
  const phone = clean(raw.buyer?.phone, 40);
  if (!name || !email || !phone || !EMAIL_RE.test(email)) {
    return { ok: false, error: 'invalid_body' };
  }

  const delivery: DeliveryMethod = raw.delivery === 'shipping' ? 'shipping' : 'pickup';
  const language: ShopLanguage = raw.language === 'en' ? 'en' : 'lt';
  const buyer: BuyerInput = { name, email, phone };

  if (delivery === 'shipping') {
    const address = clean(raw.buyer?.address, 300);
    const city = clean(raw.buyer?.city, 100);
    const postalCode = clean(raw.buyer?.postalCode, 20);
    if (!address || !city || !postalCode) return { ok: false, error: 'invalid_body' };
    buyer.address = address;
    buyer.city = city;
    buyer.postalCode = postalCode;
  }

  return { ok: true, items: merged.items, buyer, delivery, language };
}

export function webhookCallbackId(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const id = value.trim();
  if (!id || id.length > 200 || /[/\\]/.test(id)) return null;
  return id;
}
