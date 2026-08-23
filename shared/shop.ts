export type OrderStatus = 'awaiting_payment' | 'paid' | 'cancelled' | 'expired';
export type DeliveryMethod = 'pickup' | 'shipping';
export type PaidVia = 'paysera' | 'manual';
export type ShopLanguage = 'lt' | 'en';

export interface InventoryPublic {
  productId: string;
  sku: string;
  priceEur: number;
  priceCents: number;
  stock: number;
  forSale: boolean;
}

export interface CartLineInput {
  productId: string;
  qty: number;
}

export interface BuyerInput {
  name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  postalCode?: string;
}

export interface CreateOrderRequest {
  items: CartLineInput[];
  buyer: BuyerInput;
  delivery: DeliveryMethod;
  language: ShopLanguage;
}

export interface CreateOrderResponse {
  orderId: string;
  invoiceNumber: string;
  amountCents: number;
  amountEur: number;
  currency: 'EUR';
  status: OrderStatus;
  payUrl: string | null;
  iban: string;
  paymentPurpose: string;
  token: string;
  delivery: DeliveryMethod;
  shippingCents: number;
}

export interface PublicOrder {
  orderId: string;
  invoiceNumber: string;
  status: OrderStatus;
  amountCents: number;
  amountEur: number;
  currency: 'EUR';
  payUrl: string | null;
  iban: string;
  paymentPurpose: string;
  delivery: DeliveryMethod;
  paidVia: PaidVia | null;
  underpaid: boolean;
  createdAt: string;
}

export interface ShopSettingsPublic {
  iban: string;
  pickupAddress: string;
  shippingLtCents: number;
  sellerName: string;
  currency: 'EUR';
}

export const DEFAULT_INVENTORY_SEED: Array<
  Omit<InventoryPublic, 'priceEur'> & { priceCents: number }
> = [
  { productId: 'rustic-dinner-bowl', sku: 'DK-BOWL-001', priceCents: 4500, stock: 2, forSale: true },
  { productId: 'morning-coffee-mug', sku: 'DK-CUP-001', priceCents: 3200, stock: 3, forSale: true },
  { productId: 'petite-bud-vase', sku: 'DK-VASE-001', priceCents: 2800, stock: 1, forSale: true },
  { productId: 'sculptural-vessel', sku: 'DK-VASE-002', priceCents: 12000, stock: 0, forSale: false },
  { productId: 'nesting-bowls-set', sku: 'DK-BOWL-002', priceCents: 8500, stock: 1, forSale: true },
  { productId: 'tea-cup-pair', sku: 'DK-CUP-002', priceCents: 4800, stock: 2, forSale: true },
  { productId: 'speckled-planter', sku: 'DK-DECOR-001', priceCents: 3600, stock: 2, forSale: true },
  { productId: 'candle-holder-trio', sku: 'DK-DECOR-002', priceCents: 4200, stock: 1, forSale: true },
];

export function centsToEur(cents: number): number {
  return Math.round(cents) / 100;
}

export function formatEur(cents: number, locale: ShopLanguage = 'lt'): string {
  return new Intl.NumberFormat(locale === 'lt' ? 'lt-LT' : 'en-IE', {
    style: 'currency',
    currency: 'EUR',
  }).format(centsToEur(cents));
}
