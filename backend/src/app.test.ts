import { describe, expect, it, beforeEach } from 'vitest';
import { createApp } from './app.js';
import { DEFAULT_INVENTORY_SEED } from './catalog.js';
import { signWebhook } from './paysera.js';
import { MemoryStore } from './memory-store.js';
import { createPaymentProvider } from './paysera.js';

const webhookSecret = 'test-webhook';

function testApp(store: MemoryStore, frontendOrigin = 'http://localhost:3000') {
  return createApp({
    store,
    payments: createPaymentProvider('http://localhost:8787'),
    mailer: {
      async sendOrderEmails() {},
      async sendPaidEmails() {},
    },
    publicApiUrl: 'http://localhost:8787',
    frontendOrigin,
    adminPassword: 'test-admin',
    sessionSecret: 'test-session',
    webhookSecret,
    notifyEmail: 'shop@example.com',
    allowTestReset: true,
    allowMockPay: true,
    secureCookies: false,
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

  it('accepts an empty test reset', async () => {
    const res = await app.request('/api/test/reset', { method: 'POST' });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
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
    expect(body.payUrl).toContain(`token=${body.token}`);
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
    const { cookie, csrf } = await adminAuth(app);
    const cancel = await app.request(`/admin/orders/${order.orderId}/cancel`, {
      method: 'POST',
      headers: { cookie, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `_csrf=${csrf}`,
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
    const { cookie, csrf } = await adminAuth(app);
    await app.request(`/admin/orders/${order.orderId}/paid`, {
      method: 'POST',
      headers: { cookie, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `_csrf=${csrf}`,
    });
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

  it('renders product links in admin inventory that open in a new tab', async () => {
    const cookie = await loginCookie(app);
    const res = await app.request('/admin/inventory', {
      headers: { cookie },
    });
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).toContain('http://localhost:3000/shop/rustic-dinner-bowl');
    expect(html).toContain('http://localhost:3000/portfolio/sculptural-vessel');
  });

  it('renders one disabled Save changes button on inventory instead of per-row saves', async () => {
    const cookie = await loginCookie(app);
    const res = await app.request('/admin/inventory', {
      headers: { cookie },
    });
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain('id="save-changes"');
    expect(html).toContain('Save changes');
    expect(html).toMatch(/id="save-changes"[^>]*\bdisabled\b/);
    expect(html).not.toContain('>Save</button>');
    expect(html).toContain('action="/admin/inventory"');
    expect(html).not.toContain('action="/admin/inventory/morning-coffee-mug"');
    expect(html).toContain('data-original="3200"');
    expect(html).toContain('data-original="3"');
  });

  it('saves multiple inventory rows in one request', async () => {
    const { cookie, csrf } = await adminAuth(app);
    const body = new URLSearchParams();
    body.append('_csrf', csrf);
    body.append('priceCents_morning-coffee-mug', '3300');
    body.append('stock_morning-coffee-mug', '5');
    body.append('forSale_morning-coffee-mug', 'on');
    body.append('priceCents_sculptural-vessel', '11000');
    body.append('stock_sculptural-vessel', '1');

    const res = await app.request('/admin/inventory', {
      method: 'POST',
      headers: {
        cookie,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });
    expect(res.status).toBe(302);

    const mug = await store.getInventory('morning-coffee-mug');
    expect(mug?.priceCents).toBe(3300);
    expect(mug?.stock).toBe(5);
    expect(mug?.forSale).toBe(true);

    const vessel = await store.getInventory('sculptural-vessel');
    expect(vessel?.priceCents).toBe(11000);
    expect(vessel?.stock).toBe(1);
    expect(vessel?.forSale).toBe(false);

    const bowl = await store.getInventory('rustic-dinner-bowl');
    expect(bowl?.priceCents).toBe(4500);
    expect(bowl?.stock).toBe(2);
  });

  it('prefixes every GitHub Pages inventory and order product link with /dkeramik', async () => {
    const origin = 'https://almantask.github.io';
    const site = `${origin}/dkeramik`;
    const pagesApp = testApp(store, origin);
    const cookie = await loginCookie(pagesApp);
    const inventory = await pagesApp.request('/admin/inventory', {
      headers: { cookie },
    });
    const inventoryHtml = await inventory.text();
    for (const item of DEFAULT_INVENTORY_SEED) {
      const path = item.forSale ? `/shop/${item.productId}` : `/portfolio/${item.productId}`;
      expect(inventoryHtml).toContain(`${site}${path}`);
      expect(inventoryHtml).not.toContain(`${origin}${path}`);
    }

    const orderItems = DEFAULT_INVENTORY_SEED.filter((item) => item.forSale).map((item) => ({
      productId: item.productId,
      qty: 1,
    }));
    const created = await pagesApp.request('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: orderItems,
        buyer,
        delivery: 'pickup',
        language: 'en',
      }),
    });
    expect(created.status).toBe(201);
    const orders = await pagesApp.request('/admin/orders', {
      headers: { cookie },
    });
    const ordersHtml = await orders.text();
    for (const item of orderItems) {
      expect(ordersHtml).toContain(`${site}/portfolio/${item.productId}`);
      expect(ordersHtml).not.toContain(`${origin}/portfolio/${item.productId}"`);
    }
  });

  it('renders product links in admin orders that open in a new tab', async () => {
    await app.request('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{ productId: 'morning-coffee-mug', qty: 1 }],
        buyer,
        delivery: 'pickup',
        language: 'en',
      }),
    });
    const cookie = await loginCookie(app);
    const res = await app.request('/admin/orders', {
      headers: { cookie },
    });
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).toContain('http://localhost:3000/portfolio/morning-coffee-mug');
  });

  it('rejects duplicate line items that would oversell', async () => {
    const res = await app.request('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [
          { productId: 'petite-bud-vase', qty: 1 },
          { productId: 'petite-bud-vase', qty: 1 },
        ],
        buyer,
        delivery: 'pickup',
        language: 'en',
      }),
    });
    expect(res.status).toBe(409);
    const inv = await store.getInventory('petite-bud-vase');
    expect(inv?.stock).toBe(1);
  });

  it('rejects invalid buyer email and shipping without an address', async () => {
    const badEmail = await app.request('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{ productId: 'morning-coffee-mug', qty: 1 }],
        buyer: { ...buyer, email: 'not-an-email' },
        delivery: 'pickup',
        language: 'en',
      }),
    });
    expect(badEmail.status).toBe(400);
    const shipping = await app.request('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{ productId: 'morning-coffee-mug', qty: 1 }],
        buyer,
        delivery: 'shipping',
        language: 'en',
      }),
    });
    expect(shipping.status).toBe(400);
  });

  it('accepts an order token via header', async () => {
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
    const res = await app.request(`/api/orders/${order.orderId}`, {
      headers: { 'X-Order-Token': order.token },
    });
    expect(res.status).toBe(200);
    expect(res.headers.get('referrer-policy')).toBe('no-referrer');
  });

  it('rejects a webhook with a non-finite amount', async () => {
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
      callback_id: 'cb-nan',
      merchant_order_id: order.orderId,
      payment_id: 'ps-nan',
    });
    const res = await app.request('/api/webhooks/paysera', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Paysera-Signature': signWebhook(raw, webhookSecret) },
      body: raw,
    });
    expect(res.status).toBe(400);
    expect((await store.getOrder(order.orderId))?.status).toBe('awaiting_payment');
  });

  it('does not expose mock-pay when it is disabled', async () => {
    const locked = createApp({
      store,
      payments: createPaymentProvider('http://localhost:8787'),
      mailer: { async sendOrderEmails() {}, async sendPaidEmails() {} },
      publicApiUrl: 'http://localhost:8787',
      frontendOrigin: 'http://localhost:3000',
      adminPassword: 'test-admin',
      sessionSecret: 'test-session',
      webhookSecret,
      notifyEmail: 'shop@example.com',
      allowTestReset: true,
      allowMockPay: false,
      secureCookies: false,
    });
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
    const get = await locked.request(`/mock-pay/${order.orderId}?token=${order.token}`);
    expect(get.status).toBe(404);
    const post = await locked.request(`/mock-pay/${order.orderId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `token=${order.token}`,
    });
    expect(post.status).toBe(404);
    expect((await store.getOrder(order.orderId))?.status).toBe('awaiting_payment');
  });

  it('requires the order token for mock-pay', async () => {
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
    const denied = await app.request(`/mock-pay/${order.orderId}`, { method: 'POST' });
    expect(denied.status).toBe(404);
    const ok = await app.request(`/mock-pay/${order.orderId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `token=${order.token}`,
    });
    expect(ok.status).toBe(302);
    expect((await store.getOrder(order.orderId))?.status).toBe('paid');
  });

  it('rejects admin mutations without a CSRF token', async () => {
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
    const res = await app.request(`/admin/orders/${order.orderId}/paid`, {
      method: 'POST',
      headers: { cookie, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: '',
    });
    expect(res.status).toBe(403);
    expect((await store.getOrder(order.orderId))?.status).toBe('awaiting_payment');
  });

  it('expires stale unpaid orders and restocks', async () => {
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
    await store.updateOrder(order.orderId, {
      createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    });
    expect(await store.expireUnpaid(7 * 24 * 60 * 60 * 1000)).toBe(1);
    expect((await store.getOrder(order.orderId))?.status).toBe('cancelled');
    expect((await store.getInventory('morning-coffee-mug'))?.stock).toBe(3);
  });

  it('sets framing and CSP headers', async () => {
    const res = await app.request('/api/health');
    expect(res.headers.get('x-frame-options')).toBe('DENY');
    expect(res.headers.get('content-security-policy')).toContain("frame-ancestors 'none'");
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

async function adminAuth(app: ReturnType<typeof testApp>): Promise<{ cookie: string; csrf: string }> {
  const cookie = await loginCookie(app);
  const page = await app.request('/admin/orders', { headers: { cookie } });
  const html = await page.text();
  const csrf = html.match(/name="_csrf" value="([^"]+)"/)?.[1] ?? '';
  return { cookie, csrf };
}
