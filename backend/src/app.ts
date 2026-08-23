import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { deleteCookie, getCookie, setCookie } from 'hono/cookie';
import {
  inventoryPage,
  loginPage,
  mockPayPage,
  ordersPage,
  settingsPage,
} from './admin-html.js';
import { hmacSha256Hex, randomId, randomToken, timingSafeEqual } from './crypto.js';
import { centsToEur, type BuyerInput, type DeliveryMethod, type ShopLanguage } from './domain.js';
import type { Mailer } from './mailer.js';
import type { PaymentProvider } from './paysera.js';
import { signWebhook } from './paysera.js';
import { buildInvoicePdf } from './pdf.js';
import { corsAllowOrigin, publicPageUrl } from './site-url.js';
import type { Store } from './store.js';

export interface AppDeps {
  store: Store;
  payments: PaymentProvider;
  mailer: Mailer;
  publicApiUrl: string;
  frontendOrigin: string;
  adminPassword: string;
  sessionSecret: string;
  webhookSecret: string;
  notifyEmail: string;
  allowTestReset: boolean;
}

function publicOrder(
  order: {
    id: string;
    invoiceNumber: string;
    status: string;
    amountCents: number;
    payUrl: string | null;
    paidVia: string | null;
    underpaid: boolean;
    overpaid?: boolean;
    createdAt: string;
    delivery: string;
    shippingCents: number;
    token: string;
  },
  iban: string,
) {
  return {
    orderId: order.id,
    invoiceNumber: order.invoiceNumber,
    status: order.status,
    amountCents: order.amountCents,
    amountEur: centsToEur(order.amountCents),
    currency: 'EUR' as const,
    payUrl: order.payUrl,
    iban,
    paymentPurpose: order.invoiceNumber,
    token: order.token,
    delivery: order.delivery,
    shippingCents: order.shippingCents,
    paidVia: order.paidVia,
    underpaid: order.underpaid,
    overpaid: order.overpaid,
    createdAt: order.createdAt,
  };
}

function makeSession(secret: string, password: string): string {
  const exp = String(Date.now() + 12 * 60 * 60 * 1000);
  return `${exp}.${hmacSha256Hex(`${exp}:${password}`, secret)}`;
}

function sessionOk(cookie: string | undefined, secret: string, password: string): boolean {
  if (!cookie?.includes('.')) return false;
  const [exp, sig] = cookie.split('.');
  if (Number(exp) < Date.now()) return false;
  return timingSafeEqual(hmacSha256Hex(`${exp}:${password}`, secret), sig);
}

export function createApp(deps: AppDeps) {
  const app = new Hono();

  app.use(
    '/api/*',
    cors({
      origin: corsAllowOrigin(deps.frontendOrigin),
      allowMethods: ['GET', 'POST', 'OPTIONS'],
      allowHeaders: ['Content-Type', 'X-Paysera-Signature'],
    }),
  );

  app.get('/api/health', (c) => c.json({ ok: true }));

  if (deps.allowTestReset) {
    app.post('/api/test/reset', async (c) => {
      await deps.store.reset();
      return c.json({ ok: true });
    });
  }

  app.get('/api/products', async (c) => {
    const items = await deps.store.listInventory();
    return c.json({
      products: items.map((item) => ({
        productId: item.productId,
        sku: item.sku,
        priceCents: item.priceCents,
        priceEur: centsToEur(item.priceCents),
        stock: item.stock,
        forSale: item.forSale,
      })),
    });
  });

  app.get('/api/settings', async (c) => {
    const settings = await deps.store.getSettings();
    return c.json({
      iban: settings.iban,
      pickupAddress: settings.pickupAddress,
      shippingLtCents: settings.shippingLtCents,
      sellerName: settings.sellerName,
      currency: settings.currency,
    });
  });

  app.post('/api/orders', async (c) => {
    const body = await c.req.json<{
      items?: Array<{ productId: string; qty: number }>;
      buyer?: BuyerInput;
      delivery?: DeliveryMethod;
      language?: ShopLanguage;
    }>();
    if (!body.items?.length || !body.buyer?.email || !body.buyer?.name) {
      return c.json({ error: 'invalid_body' }, 400);
    }
    const created = await deps.store.createOrderAtomic({
      orderId: randomId('ord'),
      token: randomToken(),
      items: body.items,
      buyer: body.buyer,
      delivery: body.delivery === 'shipping' ? 'shipping' : 'pickup',
      language: body.language === 'en' ? 'en' : 'lt',
    });
    if (!created.ok) {
      return c.json(
        { error: created.error },
        created.error === 'insufficient_stock' ? 409 : 400,
      );
    }
    let order = created.order;
    const settings = await deps.store.getSettings();
    const pdf = await buildInvoicePdf(order, settings);
    await deps.store.savePdf(order.invoiceNumber, pdf);
    try {
      const payment = await deps.payments.createPayment(order);
      if (payment?.payUrl) {
        order =
          (await deps.store.updateOrder(order.id, {
            payUrl: payment.payUrl,
            payseraPaymentId: payment.paymentId,
          })) ?? order;
      }
    } catch (err) {
      console.error('payment create failed', err);
    }
    try {
      await deps.mailer.sendOrderEmails(order, pdf, order.payUrl, deps.notifyEmail);
    } catch (err) {
      console.error('mail failed', err);
    }
    return c.json(publicOrder(order, settings.iban), 201);
  });

  app.get('/api/orders/:id', async (c) => {
    const order = await deps.store.getOrder(c.req.param('id'));
    if (!order || order.token !== c.req.query('token')) return c.json({ error: 'not_found' }, 404);
    const settings = await deps.store.getSettings();
    return c.json(publicOrder(order, settings.iban));
  });

  app.get('/api/orders/:id/invoice.pdf', async (c) => {
    const order = await deps.store.getOrder(c.req.param('id'));
    if (!order || order.token !== c.req.query('token')) return c.body('unauthorized', 401);
    const pdf = await deps.store.getPdf(order.invoiceNumber);
    if (!pdf) return c.body('not found', 404);
    return new Response(new Uint8Array(pdf), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${order.invoiceNumber}.pdf"`,
      },
    });
  });

  async function handlePaysera(raw: string, signature: string | undefined) {
    if (!deps.payments.verifyWebhook(raw, signature)) {
      return { status: 401 as const, body: { error: 'invalid_signature' } };
    }
    const payload = JSON.parse(raw) as {
      callback_id?: string;
      merchant_order_id?: string;
      amount?: number;
      payment_id?: string;
    };
    const callbackId = payload.callback_id ?? payload.payment_id;
    if (!callbackId) return { status: 400 as const, body: { error: 'missing_callback_id' } };
    if (await deps.store.hasWebhook(callbackId)) {
      return { status: 200 as const, body: { ok: true, duplicate: true } };
    }
    await deps.store.putWebhook(callbackId);
    if (!payload.merchant_order_id) return { status: 400 as const, body: { error: 'missing_order' } };
    const result = await deps.store.markPaidAtomic(payload.merchant_order_id, {
      amountCents: Number(payload.amount),
      via: 'paysera',
      paymentId: payload.payment_id,
    });
    if (!result.ok) {
      if (result.error === 'underpaid') {
        return { status: 202 as const, body: { ok: false, error: 'underpaid' } };
      }
      if (result.error === 'cancelled') {
        return { status: 409 as const, body: { error: 'cancelled' } };
      }
      return { status: 404 as const, body: { error: result.error } };
    }
    if (!result.alreadyPaid) {
      try {
        await deps.mailer.sendPaidEmails(result.order, deps.notifyEmail);
      } catch (err) {
        console.error('paid mail failed', err);
      }
    }
    return { status: 200 as const, body: { ok: true, alreadyPaid: result.alreadyPaid } };
  }

  app.post('/api/webhooks/paysera', async (c) => {
    const raw = await c.req.text();
    const result = await handlePaysera(
      raw,
      c.req.header('X-Paysera-Signature') ?? c.req.header('x-paysera-signature'),
    );
    return c.json(result.body, result.status);
  });

  app.get('/mock-pay/:id', async (c) => {
    const order = await deps.store.getOrder(c.req.param('id'));
    if (!order) return c.body('not found', 404);
    return c.html(mockPayPage(order));
  });

  app.post('/mock-pay/:id', async (c) => {
    const order = await deps.store.getOrder(c.req.param('id'));
    if (!order) return c.body('not found', 404);
    const raw = JSON.stringify({
      callback_id: `mock-${order.id}-${Date.now()}`,
      merchant_order_id: order.id,
      status: 'paid',
      amount: order.amountCents,
      currency: 'EUR',
      payment_id: `mockpay_${order.id}`,
    });
    await handlePaysera(raw, signWebhook(raw, deps.webhookSecret));
    return c.redirect(
      publicPageUrl(
        deps.frontendOrigin,
        `/checkout/confirmation?orderId=${order.id}&token=${order.token}`,
      ),
    );
  });

  app.get('/admin/login', (c) => c.html(loginPage()));
  app.post('/admin/login', async (c) => {
    const body = await c.req.parseBody();
    if (String(body.password ?? '') !== deps.adminPassword) {
      return c.html(loginPage('Invalid password'), 401);
    }
    setCookie(c, 'admin', makeSession(deps.sessionSecret, deps.adminPassword), {
      httpOnly: true,
      path: '/',
      sameSite: 'Lax',
    });
    return c.redirect('/admin/orders');
  });
  app.post('/admin/logout', (c) => {
    deleteCookie(c, 'admin', { path: '/' });
    return c.redirect('/admin/login');
  });

  app.use('/admin/*', async (c, next) => {
    if (c.req.path === '/admin/login') return next();
    if (!sessionOk(getCookie(c, 'admin'), deps.sessionSecret, deps.adminPassword)) {
      return c.redirect('/admin/login');
    }
    await next();
  });

  app.get('/admin', (c) => c.redirect('/admin/orders'));
  app.get('/admin/orders', async (c) => c.html(ordersPage(await deps.store.listOrders(), deps.frontendOrigin)));
  app.post('/admin/orders/:id/paid', async (c) => {
    const order = await deps.store.getOrder(c.req.param('id'));
    if (!order) return c.body('not found', 404);
    await deps.store.markPaidAtomic(order.id, { amountCents: order.amountCents, via: 'manual' });
    return c.redirect('/admin/orders');
  });
  app.post('/admin/orders/:id/cancel', async (c) => {
    await deps.store.cancelAtomic(c.req.param('id'));
    return c.redirect('/admin/orders');
  });
  app.post('/admin/orders/:id/resend', async (c) => {
    const order = await deps.store.getOrder(c.req.param('id'));
    if (!order) return c.body('not found', 404);
    const pdf = await deps.store.getPdf(order.invoiceNumber);
    if (!pdf) return c.body('not found', 404);
    await deps.mailer.sendOrderEmails(order, pdf, order.payUrl, deps.notifyEmail);
    return c.redirect('/admin/orders');
  });
  app.get('/admin/orders/:id/invoice.pdf', async (c) => {
    const order = await deps.store.getOrder(c.req.param('id'));
    if (!order) return c.body('not found', 404);
    const pdf = await deps.store.getPdf(order.invoiceNumber);
    if (!pdf) return c.body('not found', 404);
    return new Response(new Uint8Array(pdf), { headers: { 'Content-Type': 'application/pdf' } });
  });
  app.get('/admin/inventory', async (c) => c.html(inventoryPage(await deps.store.listInventory(), deps.frontendOrigin)));
  app.post('/admin/inventory', async (c) => {
    const body = await c.req.parseBody({ all: true });
    const formString = (value: unknown): string | undefined => {
      const first = Array.isArray(value) ? value[0] : value;
      return typeof first === 'string' ? first : undefined;
    };
    const ids = [
      ...new Set(
        Object.keys(body)
          .filter((key) => key.startsWith('priceCents_'))
          .map((key) => key.slice('priceCents_'.length)),
      ),
    ];
    for (const id of ids) {
      const existing = await deps.store.getInventory(id);
      if (!existing) continue;
      const price = formString(body[`priceCents_${id}`]);
      const stock = formString(body[`stock_${id}`]);
      existing.priceCents = Number(price ?? existing.priceCents);
      existing.stock = Number(stock ?? existing.stock);
      existing.forSale = formString(body[`forSale_${id}`]) === 'on';
      await deps.store.upsertInventory(existing);
    }
    return c.redirect('/admin/inventory');
  });
  app.post('/admin/inventory/:id', async (c) => {
    const existing = await deps.store.getInventory(c.req.param('id'));
    if (!existing) return c.body('not found', 404);
    const body = await c.req.parseBody();
    existing.priceCents = Number(body.priceCents ?? existing.priceCents);
    existing.stock = Number(body.stock ?? existing.stock);
    existing.forSale = body.forSale === 'on';
    await deps.store.upsertInventory(existing);
    return c.redirect('/admin/inventory');
  });
  app.get('/admin/settings', async (c) => c.html(settingsPage(await deps.store.getSettings())));
  app.post('/admin/settings', async (c) => {
    const body = await c.req.parseBody();
    const current = await deps.store.getSettings();
    await deps.store.saveSettings({
      ...current,
      iban: String(body.iban ?? current.iban),
      sellerName: String(body.sellerName ?? current.sellerName),
      sellerAddress: String(body.sellerAddress ?? current.sellerAddress),
      pickupAddress: String(body.pickupAddress ?? current.pickupAddress),
      shippingLtCents: Number(body.shippingLtCents ?? current.shippingLtCents),
    });
    return c.redirect('/admin/settings');
  });

  return app;
}
