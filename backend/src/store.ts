import type { InventoryRecord, OrderRecord, PaidVia, ShopSettings } from './domain.js';

export interface CreateOrderAtomicInput {
  orderId: string;
  token: string;
  items: Array<{ productId: string; qty: number }>;
  buyer: OrderRecord['buyer'];
  delivery: OrderRecord['delivery'];
  language: OrderRecord['language'];
}

export type CreateOrderResult =
  | { ok: true; order: OrderRecord }
  | { ok: false; error: 'insufficient_stock' | 'not_for_sale' | 'unknown_product' | 'invalid_qty' };

export type MarkPaidResult =
  | { ok: true; order: OrderRecord; alreadyPaid: boolean }
  | { ok: false; error: 'not_found' | 'cancelled' | 'underpaid' };

export type CancelResult =
  | { ok: true; order: OrderRecord }
  | { ok: false; error: 'not_found' | 'already_paid' | 'already_cancelled' };

export interface Store {
  seedIfEmpty(): Promise<void>;
  reset(): Promise<void>;
  listInventory(): Promise<InventoryRecord[]>;
  getInventory(productId: string): Promise<InventoryRecord | null>;
  upsertInventory(item: InventoryRecord): Promise<void>;
  createOrderAtomic(input: CreateOrderAtomicInput): Promise<CreateOrderResult>;
  getOrder(id: string): Promise<OrderRecord | null>;
  listOrders(): Promise<OrderRecord[]>;
  updateOrder(id: string, patch: Partial<OrderRecord>): Promise<OrderRecord | null>;
  markPaidAtomic(
    id: string,
    opts: { amountCents: number; via: PaidVia; paymentId?: string },
  ): Promise<MarkPaidResult>;
  cancelAtomic(id: string): Promise<CancelResult>;
  savePdf(invoiceNumber: string, bytes: Buffer): Promise<void>;
  getPdf(invoiceNumber: string): Promise<Buffer | null>;
  getSettings(): Promise<ShopSettings>;
  saveSettings(settings: ShopSettings): Promise<void>;
  hasWebhook(id: string): Promise<boolean>;
  putWebhook(id: string): Promise<void>;
}
