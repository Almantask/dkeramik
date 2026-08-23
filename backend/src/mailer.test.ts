import { afterEach, describe, expect, it, vi } from 'vitest';
import type { OrderRecord } from './domain.js';

const sendMail = vi.fn(async () => ({ messageId: 'm1' }));
const createTransport = vi.fn(() => ({ sendMail }));

vi.mock('nodemailer', () => ({
  default: { createTransport },
}));

const order: OrderRecord = {
  id: 'ord_mail',
  invoiceNumber: 'DK-2026-0001',
  status: 'awaiting_payment',
  items: [],
  buyer: { name: 'Jonas Kazlauskas', email: 'jonas@example.com', phone: '+37060000000' },
  delivery: 'pickup',
  language: 'lt',
  shippingCents: 0,
  subtotalCents: 3200,
  amountCents: 3200,
  payUrl: 'https://pay.example/x',
  payseraPaymentId: null,
  token: 'tok',
  paidVia: null,
  underpaid: false,
  overpaid: false,
  createdAt: '2026-08-23T10:00:00.000Z',
  updatedAt: '2026-08-23T10:00:00.000Z',
};

afterEach(() => {
  sendMail.mockClear();
  createTransport.mockClear();
  vi.restoreAllMocks();
  delete process.env.SMTP_HOST;
  delete process.env.SMTP_PORT;
  delete process.env.SMTP_USER;
  delete process.env.SMTP_PASS;
  delete process.env.SMTP_FROM;
});

describe('createMailer', () => {
  it('logs instead of sending when SMTP_HOST is unset', async () => {
    const { createMailer } = await import('./mailer.js');
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const mailer = createMailer();
    await mailer.sendOrderEmails(order, Buffer.from('pdf'), null, 'shop@example.com');
    expect(createTransport).not.toHaveBeenCalled();
    expect(warn).toHaveBeenCalledWith(
      '[mail] SMTP_HOST is not set; invoices will be logged, not emailed',
    );
    expect(log).toHaveBeenCalledWith(expect.stringContaining('[mail] invoice DK-2026-0001'));
    log.mockRestore();
    warn.mockRestore();
  });

  it('sends invoice and shop-copy mail through SMTP when configured', async () => {
    process.env.SMTP_HOST = 'smtp.example.com';
    process.env.SMTP_PORT = '587';
    process.env.SMTP_USER = 'shop@example.com';
    process.env.SMTP_PASS = 'secret';
    process.env.SMTP_FROM = 'DKeramik <shop@example.com>';
    const { createMailer } = await import('./mailer.js');
    vi.spyOn(console, 'log').mockImplementation(() => {});
    const mailer = createMailer();
    expect(createTransport).toHaveBeenCalledWith(
      expect.objectContaining({
        host: 'smtp.example.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: { user: 'shop@example.com', pass: 'secret' },
      }),
    );
    await mailer.sendOrderEmails(order, Buffer.from('%PDF'), order.payUrl, 'info@dkeramik.lt');
    expect(sendMail).toHaveBeenCalledTimes(2);
    expect(sendMail).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ to: 'jonas@example.com', from: 'DKeramik <shop@example.com>' }),
    );
    expect(sendMail).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ to: 'info@dkeramik.lt' }),
    );
  });

  it('uses implicit TLS on port 465', async () => {
    process.env.SMTP_HOST = 'smtp.example.com';
    process.env.SMTP_PORT = '465';
    const { createMailer } = await import('./mailer.js');
    vi.spyOn(console, 'log').mockImplementation(() => {});
    createMailer();
    expect(createTransport).toHaveBeenCalledWith(
      expect.objectContaining({ port: 465, secure: true, requireTLS: false }),
    );
  });
});
