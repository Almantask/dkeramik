import { DEFAULT_INVENTORY_SEED, PRODUCT_NAMES } from './catalog.js';
import { mergeOrderItems } from './order-input.js';
import {
  DEFAULT_SETTINGS,
  type InventoryRecord,
  type OrderRecord,
  type PaidVia,
  type ShopSettings,
} from './domain.js';
import type {
  CancelResult,
  CreateOrderAtomicInput,
  CreateOrderResult,
  MarkPaidResult,
  Store,
} from './store.js';

class Mutex {
  private queue = Promise.resolve();

  runExclusive<T>(fn: () => Promise<T>): Promise<T> {
    const run = this.queue.then(fn, fn);
    this.queue = run.then(
      () => undefined,
      () => undefined,
    );
    return run;
  }
}

function clone<T>(value: T): T {
  return structuredClone(value);
}

function invoiceNumber(year: number, seq: number): string {
  return `DK-${year}-${String(seq).padStart(4, '0')}`;
}

export class MemoryStore implements Store {
  private inventory = new Map<string, InventoryRecord>();
  private orders = new Map<string, OrderRecord>();
  private pdfs = new Map<string, Buffer>();
  private webhooks = new Set<string>();
  private settings: ShopSettings = { ...DEFAULT_SETTINGS };
  private invoiceSeq = 0;
  private mutex = new Mutex();

  async seedIfEmpty(): Promise<void> {
    if (this.inventory.size > 0) return;
    for (const row of DEFAULT_INVENTORY_SEED) {
      this.inventory.set(row.productId, clone(row));
    }
  }

  async reset(): Promise<void> {
    this.inventory.clear();
    this.orders.clear();
    this.pdfs.clear();
    this.webhooks.clear();
    this.settings = { ...DEFAULT_SETTINGS };
    this.invoiceSeq = 0;
    await this.seedIfEmpty();
  }

  async listInventory(): Promise<InventoryRecord[]> {
    return [...this.inventory.values()].map(clone);
  }

  async getInventory(productId: string): Promise<InventoryRecord | null> {
    const row = this.inventory.get(productId);
    return row ? clone(row) : null;
  }

  async upsertInventory(item: InventoryRecord): Promise<void> {
    this.inventory.set(item.productId, clone(item));
  }

  async createOrderAtomic(input: CreateOrderAtomicInput): Promise<CreateOrderResult> {
    return this.mutex.runExclusive(async () => {
      const merged = mergeOrderItems(input.items);
      if (!merged.ok) return { ok: false, error: merged.error };
      const lines: OrderRecord['items'] = [];

      for (const line of merged.items) {
        const inv = this.inventory.get(line.productId);
        if (!inv) return { ok: false, error: 'unknown_product' };
        if (!inv.forSale) return { ok: false, error: 'not_for_sale' };
        if (inv.stock < line.qty) return { ok: false, error: 'insufficient_stock' };
        const names = PRODUCT_NAMES[line.productId] ?? { lt: line.productId, en: line.productId };
        lines.push({
          productId: inv.productId,
          sku: inv.sku,
          nameLt: names.lt,
          nameEn: names.en,
          qty: line.qty,
          unitCents: inv.priceCents,
          lineCents: inv.priceCents * line.qty,
        });
      }

      for (const line of lines) {
        const inv = this.inventory.get(line.productId)!;
        inv.stock -= line.qty;
      }

      const subtotalCents = lines.reduce((sum, l) => sum + l.lineCents, 0);
      const shippingCents = input.delivery === 'shipping' ? this.settings.shippingLtCents : 0;
      const now = new Date().toISOString();
      const year = new Date().getUTCFullYear();
      this.invoiceSeq += 1;

      const order: OrderRecord = {
        id: input.orderId,
        invoiceNumber: invoiceNumber(year, this.invoiceSeq),
        status: 'awaiting_payment',
        items: lines,
        buyer: clone(input.buyer),
        delivery: input.delivery,
        language: input.language,
        shippingCents,
        subtotalCents,
        amountCents: subtotalCents + shippingCents,
        payUrl: null,
        payseraPaymentId: null,
        token: input.token,
        paidVia: null,
        underpaid: false,
        overpaid: false,
        createdAt: now,
        updatedAt: now,
      };
      this.orders.set(order.id, order);
      return { ok: true, order: clone(order) };
    });
  }

  async getOrder(id: string): Promise<OrderRecord | null> {
    const row = this.orders.get(id);
    return row ? clone(row) : null;
  }

  async listOrders(): Promise<OrderRecord[]> {
    return [...this.orders.values()].map(clone).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async updateOrder(id: string, patch: Partial<OrderRecord>): Promise<OrderRecord | null> {
    const row = this.orders.get(id);
    if (!row) return null;
    Object.assign(row, patch, { updatedAt: new Date().toISOString() });
    return clone(row);
  }

  async markPaidAtomic(
    id: string,
    opts: { amountCents: number; via: PaidVia; paymentId?: string; callbackId?: string },
  ): Promise<MarkPaidResult> {
    return this.mutex.runExclusive(async () => {
      if (opts.callbackId && this.webhooks.has(opts.callbackId)) {
        const existing = this.orders.get(id);
        if (!existing) return { ok: false, error: 'not_found' };
        return {
          ok: true,
          order: clone(existing),
          alreadyPaid: existing.status === 'paid',
          duplicate: true,
        };
      }
      const order = this.orders.get(id);
      if (!order) return { ok: false, error: 'not_found' };
      if (
        !Number.isFinite(opts.amountCents) ||
        !Number.isInteger(opts.amountCents) ||
        opts.amountCents < 0
      ) {
        return { ok: false, error: 'invalid_amount' };
      }
      if (order.status === 'cancelled') return { ok: false, error: 'cancelled' };
      if (order.status === 'paid') {
        if (opts.callbackId) this.webhooks.add(opts.callbackId);
        return { ok: true, order: clone(order), alreadyPaid: true };
      }
      if (opts.amountCents < order.amountCents) {
        order.underpaid = true;
        order.updatedAt = new Date().toISOString();
        return { ok: false, error: 'underpaid' };
      }
      order.status = 'paid';
      order.paidVia = opts.via;
      order.underpaid = false;
      order.overpaid = opts.amountCents > order.amountCents;
      if (opts.paymentId) order.payseraPaymentId = opts.paymentId;
      order.updatedAt = new Date().toISOString();
      if (opts.callbackId) this.webhooks.add(opts.callbackId);
      return { ok: true, order: clone(order), alreadyPaid: false };
    });
  }

  async cancelAtomic(id: string): Promise<CancelResult> {
    return this.mutex.runExclusive(async () => {
      const order = this.orders.get(id);
      if (!order) return { ok: false, error: 'not_found' };
      if (order.status === 'paid') return { ok: false, error: 'already_paid' };
      if (order.status === 'cancelled') return { ok: false, error: 'already_cancelled' };
      for (const line of order.items) {
        const inv = this.inventory.get(line.productId);
        if (inv) inv.stock += line.qty;
      }
      order.status = 'cancelled';
      order.updatedAt = new Date().toISOString();
      return { ok: true, order: clone(order) };
    });
  }

  async savePdf(invoiceNumber: string, bytes: Buffer): Promise<void> {
    this.pdfs.set(invoiceNumber, bytes);
  }

  async getPdf(invoiceNumber: string): Promise<Buffer | null> {
    return this.pdfs.get(invoiceNumber) ?? null;
  }

  async getSettings(): Promise<ShopSettings> {
    return clone(this.settings);
  }

  async saveSettings(settings: ShopSettings): Promise<void> {
    this.settings = clone(settings);
  }

  async hasWebhook(id: string): Promise<boolean> {
    return this.webhooks.has(id);
  }

  async putWebhook(id: string): Promise<void> {
    this.webhooks.add(id);
  }

  async expireUnpaid(maxAgeMs: number): Promise<number> {
    const cutoff = Date.now() - maxAgeMs;
    const ids = [...this.orders.values()]
      .filter((order) => order.status === 'awaiting_payment' && Date.parse(order.createdAt) < cutoff)
      .map((order) => order.id);
    let expired = 0;
    for (const id of ids) {
      const result = await this.cancelAtomic(id);
      if (result.ok) expired += 1;
    }
    return expired;
  }
}
