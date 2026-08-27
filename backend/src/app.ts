import { Hono, type Context } from 'hono';
import { bodyLimit } from 'hono/body-limit';
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
import { centsToEur } from './domain.js';
import type { Mailer } from './mailer.js';
import { parseCentsAmount, parseOrderBody, webhookCallbackId } from './order-input.js';
import type { PaymentProvider } from './paysera.js';
import { buildInvoicePdf } from './pdf.js';
import { MemoryRateLimiter } from './rate-limit.js';
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
  allowMockPay: boolean;
  secureCookies: boolean;
}

const SESSION_MS = 12 * 60 * 60 * 1000;
const ORDER_JSON_MAX = 64 * 1024;
const UNPAID_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const HTML_CSP =
  "default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; img-src 'self' https: data:; form-action 'self'; frame-ancestors 'none'; base-uri 'none'";
const API_CSP = "default-src 'none'; frame-ancestors 'none'; base-uri 'none'";

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

function adminCookieName(secure: boolean): string {
  return secure ? '__Host-admin' : 'admin';
}

function makeSession(secret: string, password: string): string {
  const exp = String(Date.now() + SESSION_MS);
  const sid = randomToken(16);
  return `${exp}.${sid}.${hmacSha256Hex(`${exp}:${sid}:${password}`, secret)}`;
}

function sessionOk(cookie: string | undefined, secret: string, password: string): boolean {
  if (!cookie) return false;
  const parts = cookie.split('.');
  if (parts.length !== 3) return false;
  const [exp, sid, sig] = parts;
  if (!/^\d+$/.test(exp) || Number(exp) < Date.now()) return false;
  if (!/^[0-9a-f]+$/.test(sid) || !/^[0-9a-f]+$/.test(sig)) return false;
  return timingSafeEqual(hmacSha256Hex(`${exp}:${sid}:${password}`, secret), sig);
}

function readAdminCookie(c: Context, secure: boolean): string | undefined {
  return getCookie(c, adminCookieName(secure)) ?? getCookie(c, 'admin');
}

function passwordOk(given: string, expected: string, secret: string): boolean {
  return timingSafeEqual(hmacSha256Hex(`pw:${given}`, secret), hmacSha256Hex(`pw:${expected}`, secret));
}

function clientIp(c: { req: { header: (name: string) => string | undefined } }): string {
  const forwarded = c.req.header('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]!.trim() || 'unknown';
  return c.req.header('cf-connecting-ip') ?? 'unknown';
}

function readOrderToken(c: {
  req: { header: (name: string) => string | undefined; query: (name: string) => string | undefined };
}): string | undefined {
  const header = c.req.header('X-Order-Token') ?? c.req.header('x-order-token');
  if (header?.trim()) return header.trim();
  const query = c.req.query('token');
  return query?.trim() || undefined;
}

function tokenMatches(expected: string, given: string | undefined): boolean {
  if (!given) return false;
  return timingSafeEqual(expected, given);
}

function csrfFromCookie(cookie: string | undefined, secret: string, password: string): string | null {
  if (!cookie || !sessionOk(cookie, secret, password)) return null;
  const [exp, sid] = cookie.split('.');
  if (!exp || !sid) return null;
  return hmacSha256Hex(`csrf:${exp}:${sid}:${password}`, secret);
}

export function createApp(deps: AppDeps) {
  const app = new Hono();
  const loginLimiter = new MemoryRateLimiter({ max: 10, windowMs: 15 * 60 * 1000 });
  const orderLimiter = new MemoryRateLimiter({ max: 120, windowMs: 15 * 60 * 1000 });
  const webhookLimiter = new MemoryRateLimiter({ max: 120, windowMs: 60 * 1000 });
  let lastExpireAt = 0;

  async function maybeExpireUnpaid() {
    const now = Date.now();
    if (now - lastExpireAt < 60_000) return;
    lastExpireAt = now;
    try {
      await deps.store.expireUnpaid(UNPAID_TTL_MS);
    } catch (err) {
      console.error('expire unpaid failed', err);
    }
  }

  app.use('*', async (c, next) => {
    await next();
    c.header('Referrer-Policy', 'no-referrer');
    c.header('X-Content-Type-Options', 'nosniff');
    c.header('X-Frame-Options', 'DENY');
    c.header('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    const contentType = c.res.headers.get('content-type') ?? '';
    c.header('Content-Security-Policy', contentType.includes('text/html') ? HTML_CSP : API_CSP);
  });

  app.use(
    '*',
    bodyLimit({
      maxSize: ORDER_JSON_MAX,
      onError: (c) => c.json({ error: 'payload_too_large' }, 413),
    }),
  );

  app.use(
    '/api/*',
    cors({
      origin: corsAllowOrigin(deps.frontendOrigin),
      allowMethods: ['GET', 'POST', 'OPTIONS'],
      allowHeaders: ['Content-Type', 'X-Paysera-Signature', 'X-Order-Token'],
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
    await maybeExpireUnpaid();
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
    if (!orderLimiter.allow(`ip:${clientIp(c)}`)) {
      return c.json({ error: 'rate_limited' }, 429);
    }
    let raw: unknown;
    try {
      raw = await c.req.json();
    } catch {
      return c.json({ error: 'invalid_body' }, 400);
    }
    const parsed = parseOrderBody(raw);
    if (!parsed.ok) {
      return c.json({ error: parsed.error }, 400);
    }
    if (!orderLimiter.allow(`email:${parsed.buyer.email.toLowerCase()}`)) {
      return c.json({ error: 'rate_limited' }, 429);
    }
    const created = await deps.store.createOrderAtomic({
      orderId: randomId('ord'),
      token: randomToken(),
      items: parsed.items,
      buyer: parsed.buyer,
      delivery: parsed.delivery,
      language: parsed.language,
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
    if (!order || !tokenMatches(order.token, readOrderToken(c))) {
      return c.json({ error: 'not_found' }, 404);
    }
    const settings = await deps.store.getSettings();
    return c.json(publicOrder(order, settings.iban), 200, {
      'Cache-Control': 'private, no-store',
    });
  });

  app.get('/api/orders/:id/invoice.pdf', async (c) => {
    const order = await deps.store.getOrder(c.req.param('id'));
    if (!order || !tokenMatches(order.token, readOrderToken(c))) return c.body('unauthorized', 401);
    const pdf = await deps.store.getPdf(order.invoiceNumber);
    if (!pdf) return c.body('not found', 404);
    return new Response(new Uint8Array(pdf), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${order.invoiceNumber}.pdf"`,
        'Cache-Control': 'private, no-store',
        'Referrer-Policy': 'no-referrer',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  });

  async function handlePaysera(raw: string, signature: string | undefined) {
    if (!deps.payments.verifyWebhook(raw, signature)) {
      return { status: 401 as const, body: { error: 'invalid_signature' } };
    }
    let payload: {
      callback_id?: string;
      merchant_order_id?: string;
      amount?: unknown;
      payment_id?: string;
    };
    try {
      payload = JSON.parse(raw) as typeof payload;
    } catch {
      return { status: 400 as const, body: { error: 'invalid_json' } };
    }
    const callbackId = webhookCallbackId(payload.callback_id ?? payload.payment_id);
    if (!callbackId) return { status: 400 as const, body: { error: 'missing_callback_id' } };
    if (!payload.merchant_order_id || typeof payload.merchant_order_id !== 'string') {
      return { status: 400 as const, body: { error: 'missing_order' } };
    }
    const amountCents = parseCentsAmount(payload.amount);
    if (amountCents === null) {
      return { status: 400 as const, body: { error: 'invalid_amount' } };
    }
    const result = await deps.store.markPaidAtomic(payload.merchant_order_id, {
      amountCents,
      via: 'paysera',
      paymentId: typeof payload.payment_id === 'string' ? payload.payment_id : undefined,
      callbackId,
    });
    if (!result.ok) {
      if (result.error === 'underpaid') {
        return { status: 202 as const, body: { ok: false, error: 'underpaid' } };
      }
      if (result.error === 'cancelled') {
        return { status: 409 as const, body: { error: 'cancelled' } };
      }
      if (result.error === 'invalid_amount') {
        return { status: 400 as const, body: { error: 'invalid_amount' } };
      }
      return { status: 404 as const, body: { error: result.error } };
    }
    if (result.duplicate) {
      return { status: 200 as const, body: { ok: true, duplicate: true } };
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
    if (!webhookLimiter.allow(clientIp(c))) {
      return c.json({ error: 'rate_limited' }, 429);
    }
    const raw = await c.req.text();
    const result = await handlePaysera(
      raw,
      c.req.header('X-Paysera-Signature') ?? c.req.header('x-paysera-signature'),
    );
    return c.json(result.body, result.status);
  });

  if (deps.allowMockPay) {
    app.get('/mock-pay/:id', async (c) => {
      const order = await deps.store.getOrder(c.req.param('id'));
      if (!order || !tokenMatches(order.token, c.req.query('token'))) return c.body('not found', 404);
      return c.html(mockPayPage(order));
    });

    app.post('/mock-pay/:id', async (c) => {
      const order = await deps.store.getOrder(c.req.param('id'));
      if (!order) return c.body('not found', 404);
      const body = await c.req.parseBody();
      const token = String(body.token ?? c.req.query('token') ?? '');
      if (!tokenMatches(order.token, token)) return c.body('not found', 404);
      await deps.store.markPaidAtomic(order.id, {
        amountCents: order.amountCents,
        via: 'paysera',
        paymentId: `mockpay_${order.id}`,
      });
      return c.redirect(
        publicPageUrl(
          deps.frontendOrigin,
          `/checkout/confirmation#orderId=${encodeURIComponent(order.id)}&token=${encodeURIComponent(order.token)}`,
        ),
      );
    });
  }

  app.get('/admin/login', (c) => c.html(loginPage()));
  app.post('/admin/login', async (c) => {
    if (!loginLimiter.allow(clientIp(c))) {
      return c.html(loginPage('Too many attempts. Try again later.'), 429);
    }
    const body = await c.req.parseBody();
    const given = String(body.password ?? '');
    if (!passwordOk(given, deps.adminPassword, deps.sessionSecret)) {
      return c.html(loginPage('Invalid password'), 401);
    }
    setCookie(c, adminCookieName(deps.secureCookies), makeSession(deps.sessionSecret, deps.adminPassword), {
      httpOnly: true,
      path: '/',
      sameSite: 'Lax',
      secure: deps.secureCookies,
      maxAge: SESSION_MS / 1000,
    });
    return c.redirect('/admin/orders');
  });
  app.post('/admin/logout', (c) => {
    deleteCookie(c, adminCookieName(deps.secureCookies), { path: '/' });
    deleteCookie(c, 'admin', { path: '/' });
    return c.redirect('/admin/login');
  });

  app.use('/admin/*', async (c, next) => {
    if (c.req.path === '/admin/login') return next();
    const cookie = readAdminCookie(c, deps.secureCookies);
    if (!sessionOk(cookie, deps.sessionSecret, deps.adminPassword)) {
      return c.redirect('/admin/login');
    }
    if (c.req.method === 'POST') {
      const expected = csrfFromCookie(cookie, deps.sessionSecret, deps.adminPassword);
      let given = '';
      try {
        const form = await c.req.raw.clone().formData();
        given = String(form.get('_csrf') ?? '');
      } catch {
        given = '';
      }
      if (!expected || !given || !timingSafeEqual(expected, given)) {
        return c.body('forbidden', 403);
      }
    }
    await next();
  });

  app.get('/admin', (c) => c.redirect('/admin/orders'));
  app.get('/admin/orders', async (c) => {
    await maybeExpireUnpaid();
    const csrf = csrfFromCookie(readAdminCookie(c, deps.secureCookies), deps.sessionSecret, deps.adminPassword) ?? '';
    return c.html(ordersPage(await deps.store.listOrders(), deps.frontendOrigin, csrf));
  });
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
  app.get('/admin/inventory', async (c) => {
    const csrf = csrfFromCookie(readAdminCookie(c, deps.secureCookies), deps.sessionSecret, deps.adminPassword) ?? '';
    return c.html(inventoryPage(await deps.store.listInventory(), deps.frontendOrigin, csrf));
  });
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
  app.get('/admin/settings', async (c) => {
    const csrf = csrfFromCookie(readAdminCookie(c, deps.secureCookies), deps.sessionSecret, deps.adminPassword) ?? '';
    return c.html(settingsPage(await deps.store.getSettings(), csrf));
  });
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
