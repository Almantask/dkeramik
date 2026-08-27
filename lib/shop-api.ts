export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8787').replace(
  /\/$/,
  '',
);

export type LiveInventory = {
  productId: string;
  sku: string;
  priceCents: number;
  priceEur: number;
  stock: number;
  forSale: boolean;
};

export type ShopSettings = {
  iban: string;
  pickupAddress: string;
  shippingLtCents: number;
  sellerName: string;
  currency: 'EUR';
};

export type PublicOrder = {
  orderId: string;
  invoiceNumber: string;
  status: string;
  amountCents: number;
  amountEur: number;
  currency: 'EUR';
  payUrl: string | null;
  iban: string;
  paymentPurpose: string;
  token: string;
  delivery: string;
  shippingCents: number;
  paidVia: string | null;
  underpaid: boolean;
  overpaid?: boolean;
  createdAt: string;
};

export async function fetchInventory(): Promise<LiveInventory[]> {
  const res = await fetch(`${API_URL}/api/products`);
  if (!res.ok) throw new Error('inventory_unavailable');
  const data = (await res.json()) as { products: LiveInventory[] };
  return data.products;
}

export async function fetchSettings(): Promise<ShopSettings> {
  const res = await fetch(`${API_URL}/api/settings`);
  if (!res.ok) throw new Error('settings_unavailable');
  return res.json() as Promise<ShopSettings>;
}

export async function fetchOrder(orderId: string, token: string): Promise<PublicOrder> {
  const res = await fetch(`${API_URL}/api/orders/${encodeURIComponent(orderId)}`, {
    headers: { 'X-Order-Token': token },
  });
  if (!res.ok) throw new Error('not_found');
  return res.json() as Promise<PublicOrder>;
}

export async function fetchInvoicePdf(orderId: string, token: string): Promise<Blob> {
  const res = await fetch(`${API_URL}/api/orders/${encodeURIComponent(orderId)}/invoice.pdf`, {
    headers: { 'X-Order-Token': token },
  });
  if (!res.ok) throw new Error('not_found');
  return res.blob();
}

export type CreateOrderBody = {
  items: Array<{ productId: string; qty: number }>;
  buyer: {
    name: string;
    email: string;
    phone: string;
    address?: string;
    city?: string;
    postalCode?: string;
  };
  delivery: 'pickup' | 'shipping';
  language: 'lt' | 'en';
};

export async function createOrder(
  body: CreateOrderBody,
): Promise<{ ok: true; order: PublicOrder } | { ok: false; status: number; error: string }> {
  const res = await fetch(`${API_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = (await res.json()) as PublicOrder & { error?: string };
  if (!res.ok) {
    return { ok: false, status: res.status, error: data.error ?? 'error' };
  }
  return { ok: true, order: data };
}
