import nodeCrypto from 'node:crypto';
import { hmacSha256Hex, timingSafeEqual } from './crypto.js';
import type { OrderRecord } from './domain.js';

export interface PaymentProvider {
  createPayment(order: OrderRecord): Promise<{ payUrl: string; paymentId: string }>;
  verifyWebhook(rawBody: string, signature: string | undefined): boolean;
}

export function createPaymentProvider(publicApiUrl: string): PaymentProvider {
  const provider = process.env.PAYMENT_PROVIDER ?? 'mock';
  const webhookSecret = process.env.WEBHOOK_SECRET ?? 'change-me-webhook';

  if (provider === 'paysera') {
    const projectId = process.env.PAYSERA_PROJECT_ID ?? '';
    const password = process.env.PAYSERA_PASSWORD ?? '';
    return {
      async createPayment(order) {
        const params = new URLSearchParams({
          projectid: projectId,
          orderid: order.id,
          accepturl: `${publicApiUrl.replace(/\/$/, '')}/pay/return?orderId=${order.id}`,
          cancelurl: `${publicApiUrl.replace(/\/$/, '')}/pay/cancel?orderId=${order.id}`,
          callbackurl: `${publicApiUrl.replace(/\/$/, '')}/api/webhooks/paysera`,
          amount: String(order.amountCents),
          currency: 'EUR',
          country: 'LT',
          paytext: order.invoiceNumber,
          test: process.env.PAYSERA_TEST === 'true' ? '1' : '0',
        });
        const data = Buffer.from(params.toString())
          .toString('base64')
          .replace(/\+/g, '-')
          .replace(/\//g, '_');
        const sign = nodeCrypto.createHash('md5').update(data + password).digest('hex');
        return {
          payUrl: `https://www.paysera.com/pay/?data=${encodeURIComponent(data)}&sign=${sign}`,
          paymentId: `ps_${order.id}`,
        };
      },
      verifyWebhook(rawBody, signature) {
        if (!signature) return false;
        return timingSafeEqual(hmacSha256Hex(rawBody, webhookSecret), signature);
      },
    };
  }

  return {
    async createPayment(order) {
      return {
        payUrl: `${publicApiUrl.replace(/\/$/, '')}/mock-pay/${order.id}`,
        paymentId: `mock_${order.id}`,
      };
    },
    verifyWebhook(rawBody, signature) {
      if (!signature) return false;
      return timingSafeEqual(hmacSha256Hex(rawBody, webhookSecret), signature);
    },
  };
}

export function signWebhook(rawBody: string, secret: string): string {
  return hmacSha256Hex(rawBody, secret);
}
