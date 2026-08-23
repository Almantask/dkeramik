export type OrderStatus = 'awaiting_payment' | 'paid' | 'cancelled' | 'expired';
export type DeliveryMethod = 'pickup' | 'shipping';
export type PaidVia = 'paysera' | 'manual';
export type ShopLanguage = 'lt' | 'en';

export interface InventoryRecord {
  productId: string;
  sku: string;
  priceCents: number;
  stock: number;
  forSale: boolean;
}

export interface BuyerInput {
  name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  postalCode?: string;
}

export interface OrderLine {
  productId: string;
  sku: string;
  nameLt: string;
  nameEn: string;
  qty: number;
  unitCents: number;
  lineCents: number;
}

export interface OrderRecord {
  id: string;
  invoiceNumber: string;
  status: OrderStatus;
  items: OrderLine[];
  buyer: BuyerInput;
  delivery: DeliveryMethod;
  language: ShopLanguage;
  shippingCents: number;
  subtotalCents: number;
  amountCents: number;
  payUrl: string | null;
  payseraPaymentId: string | null;
  token: string;
  paidVia: PaidVia | null;
  underpaid: boolean;
  overpaid: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ShopSettings {
  iban: string;
  sellerName: string;
  sellerAddress: string;
  pickupAddress: string;
  shippingLtCents: number;
  currency: 'EUR';
}

export function centsToEur(cents: number): number {
  return Math.round(cents) / 100;
}

export const DEFAULT_SETTINGS: ShopSettings = {
  iban: 'LT00 ACCT-000003',
  sellerName: 'DKeramik',
  sellerAddress: 'Kaunas, Lietuva',
  pickupAddress: 'Kaunas, Lietuva',
  shippingLtCents: 450,
  currency: 'EUR',
};
