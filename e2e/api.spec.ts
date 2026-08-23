import { test, expect } from '@playwright/test';

const API = 'http://localhost:8787';

test.beforeEach(async ({ request }) => {
  const res = await request.post(`${API}/api/test/reset`);
  expect(res.ok()).toBeTruthy();
});

test('concurrent stock-1 orders: one 201, one 409, stock 0', async ({ request }) => {
  const payload = {
    items: [{ productId: 'petite-bud-vase', qty: 1 }],
    buyer: { name: 'A', email: 'a@example.com', phone: '1' },
    delivery: 'pickup',
    language: 'en',
  };
  const [a, b] = await Promise.all([
    request.post(`${API}/api/orders`, { data: payload }),
    request.post(`${API}/api/orders`, { data: payload }),
  ]);
  const statuses = [a.status(), b.status()].sort();
  expect(statuses).toEqual([201, 409]);
  const products = await (await request.get(`${API}/api/products`)).json();
  const vase = products.products.find(
    (p: { productId: string }) => p.productId === 'petite-bud-vase',
  );
  expect(vase.stock).toBe(0);
});

test('invoice numbers are monotonic', async ({ request }) => {
  const mk = () =>
    request.post(`${API}/api/orders`, {
      data: {
        items: [{ productId: 'morning-coffee-mug', qty: 1 }],
        buyer: { name: 'A', email: 'a@example.com', phone: '1' },
        delivery: 'pickup',
        language: 'en',
      },
    });
  const first = await (await mk()).json();
  const second = await (await mk()).json();
  expect(first.invoiceNumber < second.invoiceNumber).toBeTruthy();
});

test('invoice PDF requires token', async ({ request }) => {
  const created = await request.post(`${API}/api/orders`, {
    data: {
      items: [{ productId: 'speckled-planter', qty: 1 }],
      buyer: { name: 'A', email: 'a@example.com', phone: '1' },
      delivery: 'pickup',
      language: 'en',
    },
  });
  const order = await created.json();
  const denied = await request.get(`${API}/api/orders/${order.orderId}/invoice.pdf`);
  expect(denied.status()).toBe(401);
  const ok = await request.get(
    `${API}/api/orders/${order.orderId}/invoice.pdf?token=${order.token}`,
  );
  expect(ok.status()).toBe(200);
  expect(ok.headers()['content-type']).toContain('pdf');
});

test('admin login is required', async ({ request }) => {
  const res = await request.get(`${API}/admin/orders`, { maxRedirects: 0 });
  expect(res.status()).toBe(302);
  const mutation = await request.post(`${API}/admin/orders/missing/paid`, { maxRedirects: 0 });
  expect(mutation.status()).toBe(302);
});
