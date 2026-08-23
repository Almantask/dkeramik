import { createHmac } from 'node:crypto';
import { expect, request, test, type Page } from '@playwright/test';

const API = 'http://localhost:8787';
const WEBHOOK_SECRET = 'test-webhook';

function sign(raw: string): string {
  return createHmac('sha256', WEBHOOK_SECRET).update(raw).digest('hex');
}

async function reset() {
  const ctx = await request.newContext();
  const res = await ctx.post(`${API}/api/test/reset`);
  expect(res.ok()).toBeTruthy();
  await ctx.dispose();
}

function mugCard(page: Page) {
  return page.getByRole('article').filter({
    has: page.getByRole('heading', { name: /ryto puodelis|morning coffee mug/i }),
  });
}

/** Chromium names native <dd> from contents; labeled groups expose the term. */
function definitionFor(page: Page, label: RegExp) {
  return page.getByRole('group', { name: label }).getByRole('definition');
}

async function addMugFromCatalog(page: Page) {
  await page.goto('/shop');
  await expect(page.getByRole('heading', { name: /parduotuvė|shop/i })).toBeVisible();
  const card = mugCard(page);
  await expect(card.getByText(/32/)).toBeVisible();
  await card.getByRole('button', { name: /į krepšelį|add to cart/i }).click();
}

test.beforeEach(async () => {
  await reset();
});

test('pickup checkout shows invoice, pay link, and IBAN', async ({ page }) => {
  await addMugFromCatalog(page);
  await page.goto('/checkout');
  await page.getByLabel(/vardas|name/i).fill('Jonas Kazlauskas');
  await page.getByLabel(/el\. paštas|email/i).fill('jonas@example.com');
  await page.getByLabel(/telefonas|phone/i).fill('+37060000000');
  await page.getByRole('radio', { name: /atsiėmimas|pickup/i }).check();
  await page.getByRole('button', { name: /pateikti užsakymą|place order/i }).click();
  await expect(page.getByRole('heading', { name: /ačiū|thank you/i })).toBeVisible();
  await expect(definitionFor(page, /sąskaitos numeris|invoice number/i)).toHaveText(
    /DK-\d{4}-\d{4}/,
  );
  await expect(page.getByRole('link', { name: /paysera/i })).toBeVisible();
  await expect(definitionFor(page, /iban/i)).toBeVisible();
});

test('Lithuania shipping adds the flat rate', async ({ page }) => {
  await addMugFromCatalog(page);
  await page.goto('/checkout');
  await page.getByLabel(/vardas|name/i).fill('Jonas Kazlauskas');
  await page.getByLabel(/el\. paštas|email/i).fill('jonas@example.com');
  await page.getByLabel(/telefonas|phone/i).fill('+37060000000');
  await page.getByRole('radio', { name: /siuntimas|shipping/i }).check();
  await page.getByLabel(/adresas|address/i).fill('Laisvės al. 1');
  await page.getByLabel(/miestas|city/i).fill('Kaunas');
  await page.getByLabel(/pašto kodas|postal/i).fill('44280');
  await expect(page.getByText(/4[.,]50/)).toBeVisible();
  await page.getByRole('button', { name: /pateikti užsakymą|place order/i }).click();
  await expect(page.getByRole('heading', { name: /ačiū|thank you/i })).toBeVisible();
  await expect(definitionFor(page, /sąskaitos numeris|invoice number/i)).toHaveText(
    /DK-\d{4}-\d{4}/,
  );
});

test('English checkout labels', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /switch language/i }).click();
  await page.goto('/shop');
  await expect(page.getByRole('heading', { name: 'Shop' })).toBeVisible();
  const card = mugCard(page);
  await expect(card.getByText(/32/)).toBeVisible();
  await card.getByRole('button', { name: /add to cart/i }).click();
  await page.goto('/checkout');
  await expect(page.getByLabel('Name')).toBeVisible();
  await expect(page.getByRole('button', { name: /place order/i })).toBeVisible();
});

test('sold-out product cannot be ordered', async ({ page, request: api }) => {
  await api.post(`${API}/api/orders`, {
    data: {
      items: [{ productId: 'petite-bud-vase', qty: 1 }],
      buyer: { name: 'A', email: 'a@example.com', phone: '1' },
      delivery: 'pickup',
      language: 'lt',
    },
  });
  await page.goto('/shop/petite-bud-vase');
  await expect(page.getByText(/išparduota|sold out/i)).toBeVisible();
  await expect(page.getByRole('button', { name: /į krepšelį|add to cart/i })).toHaveCount(0);
});

test('cart quantity cannot exceed live stock', async ({ page }) => {
  await page.goto('/shop/morning-coffee-mug');
  const add = page.getByRole('button', { name: /į krepšelį|add to cart/i });
  await add.click();
  await add.click();
  await add.click();
  await add.click();
  await page.goto('/cart');
  await expect(page.getByLabel(/kiekis|quantity/i)).toHaveValue('3');
});

test('footer legal links open', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: /sąlygos|terms/i }).click();
  await expect(page.getByRole('heading', { name: /sąlygos|terms/i })).toBeVisible();
  await page.getByRole('link', { name: /grąžinimai|returns/i }).click();
  await expect(page.getByRole('heading', { name: /grąžinimai|returns/i })).toBeVisible();
  await page.getByRole('link', { name: /privatumas|privacy/i }).click();
  await expect(page.getByRole('heading', { name: /privatumas|privacy/i })).toBeVisible();
});

test('portfolio piece that is not for sale has no price or buy button', async ({ page }) => {
  await page.goto('/portfolio/sculptural-vessel');
  await expect(
    page.getByRole('heading', { name: /skulptūrinis indas|sculptural vessel/i }),
  ).toBeVisible();
  await expect(page.getByText(/€\d/)).toHaveCount(0);
  await expect(page.getByRole('button', { name: /į krepšelį|add to cart|buy/i })).toHaveCount(0);
});

test('signed webhook marks paid once and does not restock', async ({ page, request: api }) => {
  await page.goto('/shop/tea-cup-pair');
  await page.getByRole('button', { name: /į krepšelį|add to cart/i }).click();
  await page.goto('/checkout');
  await page.getByLabel(/vardas|name/i).fill('Jonas');
  await page.getByLabel(/el\. paštas|email/i).fill('jonas@example.com');
  await page.getByLabel(/telefonas|phone/i).fill('+37060000000');
  await page.getByRole('button', { name: /pateikti užsakymą|place order/i }).click();
  await expect(page.getByRole('heading', { name: /ačiū|thank you/i })).toBeVisible();
  await expect(definitionFor(page, /sąskaitos numeris|invoice number/i)).toHaveText(
    /DK-\d{4}-\d{4}/,
  );
  const orderId = new URL(page.url()).searchParams.get('orderId');
  const token = new URL(page.url()).searchParams.get('token');
  expect(orderId).toBeTruthy();
  const raw = JSON.stringify({
    callback_id: 'cb-e2e',
    merchant_order_id: orderId,
    amount: 4800,
    payment_id: 'ps-e2e',
  });
  const paid = await api.post(`${API}/api/webhooks/paysera`, {
    headers: { 'X-Paysera-Signature': sign(raw), 'Content-Type': 'application/json' },
    data: raw,
  });
  expect(paid.status()).toBe(200);
  const replay = await api.post(`${API}/api/webhooks/paysera`, {
    headers: { 'X-Paysera-Signature': sign(raw), 'Content-Type': 'application/json' },
    data: raw,
  });
  expect(replay.status()).toBe(200);
  expect((await replay.json()).duplicate).toBe(true);
  const order = await api.get(`${API}/api/orders/${orderId}?token=${token}`);
  expect((await order.json()).status).toBe('paid');
  const products = await (await api.get(`${API}/api/products`)).json();
  const tea = products.products.find((p: { productId: string }) => p.productId === 'tea-cup-pair');
  expect(tea.stock).toBe(1);
});

test('invalid webhook signature is rejected', async ({ request: api }) => {
  const created = await api.post(`${API}/api/orders`, {
    data: {
      items: [{ productId: 'candle-holder-trio', qty: 1 }],
      buyer: { name: 'A', email: 'a@example.com', phone: '1' },
      delivery: 'pickup',
      language: 'en',
    },
  });
  const order = await created.json();
  const raw = JSON.stringify({
    callback_id: 'bad',
    merchant_order_id: order.orderId,
    amount: order.amountCents,
  });
  const res = await api.post(`${API}/api/webhooks/paysera`, {
    headers: { 'X-Paysera-Signature': 'nope', 'Content-Type': 'application/json' },
    data: raw,
  });
  expect(res.status()).toBe(401);
});

test('underpay stays unpaid; admin mark paid; cancel restocks and blocks late webhook', async ({
  request: api,
  page,
}) => {
  const created = await api.post(`${API}/api/orders`, {
    data: {
      items: [{ productId: 'speckled-planter', qty: 1 }],
      buyer: { name: 'A', email: 'a@example.com', phone: '1' },
      delivery: 'pickup',
      language: 'en',
    },
  });
  const order = await created.json();
  const under = JSON.stringify({
    callback_id: 'under',
    merchant_order_id: order.orderId,
    amount: 1,
  });
  const underRes = await api.post(`${API}/api/webhooks/paysera`, {
    headers: { 'X-Paysera-Signature': sign(under), 'Content-Type': 'application/json' },
    data: under,
  });
  expect(underRes.status()).toBe(202);

  await page.goto(`${API}/admin/login`);
  await page.locator('input[name="password"]').fill('test-admin');
  await page.getByRole('button', { name: /sign in/i }).click();
  await expect(page.getByRole('heading', { name: /orders/i })).toBeVisible();
  await page.locator(`form[action="/admin/orders/${order.orderId}/paid"] button`).click();

  const created2 = await api.post(`${API}/api/orders`, {
    data: {
      items: [{ productId: 'nesting-bowls-set', qty: 1 }],
      buyer: { name: 'B', email: 'b@example.com', phone: '1' },
      delivery: 'pickup',
      language: 'en',
    },
  });
  const order2 = await created2.json();
  await page.goto(`${API}/admin/orders`);
  await page.locator(`form[action="/admin/orders/${order2.orderId}/cancel"] button`).click();
  const late = JSON.stringify({
    callback_id: 'late',
    merchant_order_id: order2.orderId,
    amount: order2.amountCents,
  });
  const lateRes = await api.post(`${API}/api/webhooks/paysera`, {
    headers: { 'X-Paysera-Signature': sign(late), 'Content-Type': 'application/json' },
    data: late,
  });
  expect(lateRes.status()).toBe(409);
  const products = await (await api.get(`${API}/api/products`)).json();
  const bowls = products.products.find(
    (p: { productId: string }) => p.productId === 'nesting-bowls-set',
  );
  expect(bowls.stock).toBe(1);
});
