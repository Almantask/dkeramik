import { describe, expect, it, beforeEach } from 'vitest';
import { createApp } from './app.js';
import { signWebhook } from './paysera.js';
import { MemoryStore } from './memory-store.js';
import { createPaymentProvider } from './paysera.js';

const webhookSecret = 'test-webhook';

function testApp(store: MemoryStore) {
  return createApp({
    store,
    payments: createPaymentProvider('http://localhost:8787'),
    mailer: {
      async sendOrderEmails() {},
      async sendPaidEmails() {},
    },
    publicApiUrl: 'http://localhost:8787',
    frontendOrigin: 'http://localhost:3000',
    adminPassword: 'test-admin',
    sessionSecret: 'test-session',
    webhookSecret,
    notifyEmail: 'shop@example.com',
    allowTestReset: true,
  });
}

const buyer = {
  name: 'Jonas Kazlauskas',
  email: 'jonas@example.com',
  phone: '+37060000000',
};

describe('shop API', () => {
  let store: MemoryStore;
  let app: ReturnType<typeof testApp>;

  beforeEach(async () => {
    process.env.PAYMENT_PROVIDER = 'mock';
    process.env.WEBHOOK_SECRET = webhookSecret;
    store = new MemoryStore();
    await store.seedIfEmpty();
    app = testApp(store);
  });

  it('lists inventory with prices and stock', async () => {
    const res = await app.request('/api/products');
    expect(res.status).toBe(200);
    const body = await res.json();
    const mug = body.products.find((p: { productId: string }) => p.productId === 'morning-coffee-mug');
    expect(mug.stock).toBe(3);
    expect(mug.priceCents).toBe(3200);
  });

  it('creates an order, decrements stock, and issues an invoice number', async () => {
    const res = await app.request('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{ productId: 'morning-coffee-mug', qty: 1 }],
        buyer,
        delivery: 'pickup',
        language: 'en',
      }),
    });
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.invoiceNumber).toMatch(/^DK-\d{4}-0001$/);
    expect(body.payUrl).toContain('/mock-pay/');
    const inv = await store.getInventory('morning-coffee-mug');
    expect(inv?.stock).toBe(2);
  });

  it('rejects oversell', async () => {
    const res = await app.request('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{ productId: 'petite-bud-vase', qty: 2 }],
        buyer,
        delivery: 'pickup',
        language: 'lt',
      }),
    });
    expect(res.status).toBe(409);
  });

  it('serializes concurrent stock-1 orders so only one succeeds', async () => {
    const payload = {
      items: [{ productId: 'petite-bud-vase', qty: 1 }],
      buyer,
      delivery: 'pickup',
      language: 'en',
    };
    const [a, b] = await Promise.all([
      app.request('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }),
      app.request('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }),
    ]);
    const statuses = [a.status, b.status].sort();
    expect(statuses).toEqual([201, 409]);
    const inv = await store.getInventory('petite-bud-vase');
    expect(inv?.stock).toBe(0);
  });

  it('issues monotonic invoice numbers', async () => {
    const mk = () =>
      app.request('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [{ productId: 'morning-coffee-mug', qty: 1 }],
          buyer,
          delivery: 'pickup',
          language: 'en',
        }),
      });
    const first = await (await mk()).json();
    const second = await (await mk()).json();
    expect(first.invoiceNumber < second.invoiceNumber).toBe(true);
  });

  it('requires a token for invoice PDF', async () => {
    const created = await app.request('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{ productId: 'speckled-planter', qty: 1 }],
        buyer,
        delivery: 'pickup',
        language: 'en',
      }),
    });
    const order = await created.json();
    const denied = await app.request(`/api/orders/${order.orderId}/invoice.pdf`);
    expect(denied.status).toBe(401);
    const ok = await app.request(`/api/orders/${order.orderId}/invoice.pdf?token=${order.token}`);
    expect(ok.status).toBe(200);
    expect(ok.headers.get('content-type')).toContain('pdf');
  });

  it('marks paid via a signed Paysera webhook and is idempotent', async () => {
    const created = await app.request('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{ productId: 'tea-cup-pair', qty: 1 }],
        buyer,
        delivery: 'pickup',
        language: 'en',
      }),
    });
    const order = await created.json();
    const raw = JSON.stringify({
      callback_id: 'cb-1',
      merchant_order_id: order.orderId,
      amount: order.amountCents,
      currency: 'EUR',
      payment_id: 'ps-1',
    });
    const sig = signWebhook(raw, webhookSecret);
    const paid = await app.request('/api/webhooks/paysera', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Paysera-Signature': sig },
      body: raw,
    });
    expect(paid.status).toBe(200);
    const replay = await app.request('/api/webhooks/paysera', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Paysera-Signature': sig },
      body: raw,
    });
    expect(replay.status).toBe(200);
    const dup = await replay.json();
    expect(dup.duplicate).toBe(true);
    const got = await store.getOrder(order.orderId);
    expect(got?.status).toBe('paid');
    const inv = await store.getInventory('tea-cup-pair');
    expect(inv?.stock).toBe(1);
  });

  it('rejects invalid webhook signatures', async () => {
    const created = await app.request('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{ productId: 'candle-holder-trio', qty: 1 }],
        buyer,
        delivery: 'pickup',
        language: 'en',
      }),
    });
    const order = await created.json();
    const raw = JSON.stringify({
      callback_id: 'cb-bad',
      merchant_order_id: order.orderId,
      amount: order.amountCents,
      payment_id: 'ps-bad',
    });
    const res = await app.request('/api/webhooks/paysera', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Paysera-Signature': 'nope' },
      body: raw,
    });
    expect(res.status).toBe(401);
    expect((await store.getOrder(order.orderId))?.status).toBe('awaiting_payment');
  });

  it('flags underpay and does not mark paid', async () => {
    const created = await app.request('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{ productId: 'nesting-bowls-set', qty: 1 }],
        buyer,
        delivery: 'pickup',
        language: 'en',
      }),
    });
    const order = await created.json();
    const raw = JSON.stringify({
      callback_id: 'cb-under',
      merchant_order_id: order.orderId,
      amount: 1,
      payment_id: 'ps-under',
    });
    const res = await app.request('/api/webhooks/paysera', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Paysera-Signature': signWebhook(raw, webhookSecret) },
      body: raw,
    });
    expect(res.status).toBe(202);
    const got = await store.getOrder(order.orderId);
    expect(got?.status).toBe('awaiting_payment');
    expect(got?.underpaid).toBe(true);
  });

  it('cancels unpaid orders, restocks, and ignores a late webhook', async () => {
    const created = await app.request('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{ productId: 'rustic-dinner-bowl', qty: 1 }],
        buyer,
        delivery: 'pickup',
        language: 'en',
      }),
    });
    const order = await created.json();
    const cookie = await loginCookie(app);
    const cancel = await app.request(`/admin/orders/${order.orderId}/cancel`, {
      method: 'POST',
      headers: { cookie },
    });
    expect(cancel.status).toBe(302);
    expect((await store.getInventory('rustic-dinner-bowl'))?.stock).toBe(2);
    const raw = JSON.stringify({
      callback_id: 'cb-late',
      merchant_order_id: order.orderId,
      amount: order.amountCents,
      payment_id: 'ps-late',
    });
    const late = await app.request('/api/webhooks/paysera', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Paysera-Signature': signWebhook(raw, webhookSecret) },
      body: raw,
    });
    expect(late.status).toBe(409);
    expect((await store.getOrder(order.orderId))?.status).toBe('cancelled');
  });

  it('lets admin mark paid when no webhook arrives', async () => {
    const created = await app.request('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{ productId: 'morning-coffee-mug', qty: 1 }],
        buyer,
        delivery: 'pickup',
        language: 'en',
      }),
    });
    const order = await created.json();
    const cookie = await loginCookie(app);
    await app.request(`/admin/orders/${order.orderId}/paid`, { method: 'POST', headers: { cookie } });
    expect((await store.getOrder(order.orderId))?.status).toBe('paid');
    expect((await store.getOrder(order.orderId))?.paidVia).toBe('manual');
  });

  it('requires admin login for mutations', async () => {
    const res = await app.request('/admin/orders');
    expect(res.status).toBe(302);
  });

  it('disables Paysera payments and webhooks when secrets are missing', async () => {
    process.env.PAYMENT_PROVIDER = 'paysera';
    delete process.env.PAYSERA_PROJECT_ID;
    delete process.env.PAYSERA_PASSWORD;
    const customApp = testApp(store);

    const res = await customApp.request('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{ productId: 'morning-coffee-mug', qty: 1 }],
        buyer,
        delivery: 'pickup',
        language: 'en',
      }),
    });
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.payUrl).toBeNull();

    const raw = JSON.stringify({ callback_id: 'cb-disabled', merchant_order_id: body.orderId, amount: body.amountCents });
    const webhookRes = await customApp.request('/api/webhooks/paysera', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Paysera-Signature': signWebhook(raw, webhookSecret) },
      body: raw,
    });
    expect(webhookRes.status).toBe(401);
  });

  it('disables Paysera payments when secrets are empty strings', async () => {
    process.env.PAYMENT_PROVIDER = 'paysera';
    process.env.PAYSERA_PROJECT_ID = '   ';
    process.env.PAYSERA_PASSWORD = '';
    const customApp = testApp(store);

    const res = await customApp.request('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{ productId: 'morning-coffee-mug', qty: 1 }],
        buyer,
        delivery: 'pickup',
        language: 'en',
      }),
    });
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.payUrl).toBeNull();
  });

  it('generates Paysera payUrl when Paysera provider and secrets are configured', async () => {
    process.env.PAYMENT_PROVIDER = 'paysera';
    process.env.PAYSERA_PROJECT_ID = '123456';
    process.env.PAYSERA_PASSWORD = 'secret-password';
    const customApp = testApp(store);

    const res = await customApp.request('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{ productId: 'morning-coffee-mug', qty: 1 }],
        buyer,
        delivery: 'pickup',
        language: 'en',
      }),
    });
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.payUrl).toContain('https://www.paysera.com/pay/?data=');
  });

  it('disables online payment when PAYMENT_PROVIDER is set to none or disabled', async () => {
    process.env.PAYMENT_PROVIDER = 'none';
    const customApp = testApp(store);

    const res = await customApp.request('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{ productId: 'morning-coffee-mug', qty: 1 }],
        buyer,
        delivery: 'pickup',
        language: 'en',
      }),
    });
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.payUrl).toBeNull();
  });
});

async function loginCookie(app: ReturnType<typeof testApp>): Promise<string> {
  const res = await app.request('/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'password=test-admin',
  });
  const setCookie = res.headers.get('set-cookie') ?? '';
  return setCookie.split(';')[0];
}
