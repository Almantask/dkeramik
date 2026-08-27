import { Firestore, type DocumentReference } from '@google-cloud/firestore';
import { Storage } from '@google-cloud/storage';
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

function invoiceNumber(year: number, seq: number): string {
  return `DK-${year}-${String(seq).padStart(4, '0')}`;
}

export class FirestoreStore implements Store {
  private db: Firestore;
  private bucketName: string;
  private storage: Storage;

  constructor(projectId: string, bucketName: string) {
    this.db = new Firestore({ projectId });
    this.bucketName = bucketName;
    this.storage = new Storage({ projectId });
  }

  private inventoryCol() {
    return this.db.collection('inventory');
  }

  private ordersCol() {
    return this.db.collection('orders');
  }

  async seedIfEmpty(): Promise<void> {
    const snap = await this.inventoryCol().limit(1).get();
    if (!snap.empty) return;
    const batch = this.db.batch();
    for (const row of DEFAULT_INVENTORY_SEED) {
      batch.set(this.inventoryCol().doc(row.productId), row);
    }
    batch.set(this.db.doc('meta/settings'), DEFAULT_SETTINGS);
    batch.set(this.db.doc('meta/invoiceCounter'), { year: new Date().getUTCFullYear(), seq: 0 });
    await batch.commit();
  }

  async reset(): Promise<void> {
    throw new Error('reset is only available for the memory store');
  }

  async listInventory(): Promise<InventoryRecord[]> {
    const snap = await this.inventoryCol().get();
    return snap.docs.map((d) => d.data() as InventoryRecord);
  }

  async getInventory(productId: string): Promise<InventoryRecord | null> {
    const doc = await this.inventoryCol().doc(productId).get();
    return doc.exists ? (doc.data() as InventoryRecord) : null;
  }

  async upsertInventory(item: InventoryRecord): Promise<void> {
    await this.inventoryCol().doc(item.productId).set(item);
  }

  async createOrderAtomic(input: CreateOrderAtomicInput): Promise<CreateOrderResult> {
    return this.db.runTransaction(async (tx) => {
      const settingsSnap = await tx.get(this.db.doc('meta/settings'));
      const settings = (settingsSnap.data() as ShopSettings) ?? DEFAULT_SETTINGS;
      const counterRef = this.db.doc('meta/invoiceCounter');
      const counterSnap = await tx.get(counterRef);
      const year = new Date().getUTCFullYear();
      let seq = 0;
      if (counterSnap.exists) {
        const data = counterSnap.data() as { year: number; seq: number };
        seq = data.year === year ? data.seq : 0;
      }

      const merged = mergeOrderItems(input.items);
      if (!merged.ok) return { ok: false, error: merged.error };
      const lines: OrderRecord['items'] = [];
      const invSnaps: Array<{ ref: DocumentReference; inv: InventoryRecord; qty: number }> =
        [];
      for (const line of merged.items) {
        const ref = this.inventoryCol().doc(line.productId);
        const snap = await tx.get(ref);
        if (!snap.exists) return { ok: false, error: 'unknown_product' };
        const inv = snap.data() as InventoryRecord;
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
        invSnaps.push({ ref, inv, qty: line.qty });
      }

      for (const row of invSnaps) {
        tx.update(row.ref, { stock: row.inv.stock - row.qty });
      }

      seq += 1;
      tx.set(counterRef, { year, seq });

      const subtotalCents = lines.reduce((sum, l) => sum + l.lineCents, 0);
      const shippingCents = input.delivery === 'shipping' ? settings.shippingLtCents : 0;
      const now = new Date().toISOString();
      const order: OrderRecord = {
        id: input.orderId,
        invoiceNumber: invoiceNumber(year, seq),
        status: 'awaiting_payment',
        items: lines,
        buyer: input.buyer,
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
      tx.set(this.ordersCol().doc(order.id), order);
      return { ok: true, order };
    });
  }

  async getOrder(id: string): Promise<OrderRecord | null> {
    const doc = await this.ordersCol().doc(id).get();
    return doc.exists ? (doc.data() as OrderRecord) : null;
  }

  async listOrders(): Promise<OrderRecord[]> {
    const snap = await this.ordersCol().orderBy('createdAt', 'desc').get();
    return snap.docs.map((d) => d.data() as OrderRecord);
  }

  async updateOrder(id: string, patch: Partial<OrderRecord>): Promise<OrderRecord | null> {
    const ref = this.ordersCol().doc(id);
    const doc = await ref.get();
    if (!doc.exists) return null;
    const next = { ...(doc.data() as OrderRecord), ...patch, updatedAt: new Date().toISOString() };
    await ref.set(next);
    return next;
  }

  async markPaidAtomic(
    id: string,
    opts: { amountCents: number; via: PaidVia; paymentId?: string; callbackId?: string },
  ): Promise<MarkPaidResult> {
    return this.db.runTransaction(async (tx) => {
      const ref = this.ordersCol().doc(id);
      const webhookRef = opts.callbackId
        ? this.db.doc(`processedWebhooks/${opts.callbackId}`)
        : null;
      const webhookSnap = webhookRef ? await tx.get(webhookRef) : null;
      const snap = await tx.get(ref);

      if (webhookSnap?.exists) {
        if (!snap.exists) return { ok: false, error: 'not_found' };
        const existing = snap.data() as OrderRecord;
        return {
          ok: true,
          order: existing,
          alreadyPaid: existing.status === 'paid',
          duplicate: true,
        };
      }

      if (!snap.exists) return { ok: false, error: 'not_found' };
      const order = snap.data() as OrderRecord;
      if (
        !Number.isFinite(opts.amountCents) ||
        !Number.isInteger(opts.amountCents) ||
        opts.amountCents < 0
      ) {
        return { ok: false, error: 'invalid_amount' };
      }
      if (order.status === 'cancelled') return { ok: false, error: 'cancelled' };
      if (order.status === 'paid') {
        if (webhookRef) tx.set(webhookRef, { at: new Date().toISOString(), orderId: id });
        return { ok: true, order, alreadyPaid: true };
      }
      if (opts.amountCents < order.amountCents) {
        order.underpaid = true;
        order.updatedAt = new Date().toISOString();
        tx.set(ref, order);
        return { ok: false, error: 'underpaid' };
      }
      order.status = 'paid';
      order.paidVia = opts.via;
      order.underpaid = false;
      order.overpaid = opts.amountCents > order.amountCents;
      if (opts.paymentId) order.payseraPaymentId = opts.paymentId;
      order.updatedAt = new Date().toISOString();
      tx.set(ref, order);
      if (webhookRef) tx.set(webhookRef, { at: new Date().toISOString(), orderId: id });
      return { ok: true, order, alreadyPaid: false };
    });
  }

  async cancelAtomic(id: string): Promise<CancelResult> {
    return this.db.runTransaction(async (tx) => {
      const ref = this.ordersCol().doc(id);
      const snap = await tx.get(ref);
      if (!snap.exists) return { ok: false, error: 'not_found' };
      const order = snap.data() as OrderRecord;
      if (order.status === 'paid') return { ok: false, error: 'already_paid' };
      if (order.status === 'cancelled') return { ok: false, error: 'already_cancelled' };
      for (const line of order.items) {
        const invRef = this.inventoryCol().doc(line.productId);
        const invSnap = await tx.get(invRef);
        if (invSnap.exists) {
          const inv = invSnap.data() as InventoryRecord;
          tx.update(invRef, { stock: inv.stock + line.qty });
        }
      }
      order.status = 'cancelled';
      order.updatedAt = new Date().toISOString();
      tx.set(ref, order);
      return { ok: true, order };
    });
  }

  async savePdf(invoiceNumber: string, bytes: Buffer): Promise<void> {
    const file = this.storage.bucket(this.bucketName).file(`invoices/${invoiceNumber}.pdf`);
    await file.save(bytes, { contentType: 'application/pdf' });
  }

  async getPdf(invoiceNumber: string): Promise<Buffer | null> {
    const file = this.storage.bucket(this.bucketName).file(`invoices/${invoiceNumber}.pdf`);
    const [exists] = await file.exists();
    if (!exists) return null;
    const [buf] = await file.download();
    return buf;
  }

  async getSettings(): Promise<ShopSettings> {
    const snap = await this.db.doc('meta/settings').get();
    return (snap.data() as ShopSettings) ?? DEFAULT_SETTINGS;
  }

  async saveSettings(settings: ShopSettings): Promise<void> {
    await this.db.doc('meta/settings').set(settings);
  }

  async hasWebhook(id: string): Promise<boolean> {
    const snap = await this.db.doc(`processedWebhooks/${id}`).get();
    return snap.exists;
  }

  async putWebhook(id: string): Promise<void> {
    await this.db.doc(`processedWebhooks/${id}`).set({ at: new Date().toISOString() });
  }

  async expireUnpaid(maxAgeMs: number): Promise<number> {
    const cutoff = Date.now() - maxAgeMs;
    const orders = await this.listOrders();
    let expired = 0;
    for (const order of orders) {
      if (order.status !== 'awaiting_payment' || Date.parse(order.createdAt) >= cutoff) continue;
      const result = await this.cancelAtomic(order.id);
      if (result.ok) expired += 1;
    }
    return expired;
  }
}
