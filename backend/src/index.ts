import { serve } from '@hono/node-server';
import { createApp } from './app.js';
import { FirestoreStore } from './firestore-store.js';
import { loadEnv } from './load-env.js';
import { createMailer } from './mailer.js';
import { MemoryStore } from './memory-store.js';
import { createPaymentProvider } from './paysera.js';
import { assertProductionSecrets } from './secrets.js';
import type { Store } from './store.js';

loadEnv();
assertProductionSecrets(process.env);

async function createStore(): Promise<Store> {
  if (process.env.STORE === 'firestore') {
    const projectId = process.env.GCP_PROJECT_ID ?? 'dkeramik-fullstack';
    const bucket = process.env.GCS_BUCKET ?? 'dkeramik-fullstack-invoices';
    const store = new FirestoreStore(projectId, bucket);
    await store.seedIfEmpty();
    return store;
  }
  const store = new MemoryStore();
  await store.seedIfEmpty();
  return store;
}

const store = await createStore();
const publicApiUrl = process.env.PUBLIC_API_URL ?? `http://localhost:${process.env.PORT ?? '8787'}`;
const paymentProvider = process.env.PAYMENT_PROVIDER ?? 'mock';

const app = createApp({
  store,
  payments: createPaymentProvider(publicApiUrl),
  mailer: createMailer(),
  publicApiUrl,
  frontendOrigin: process.env.FRONTEND_ORIGIN ?? 'http://localhost:3000',
  adminPassword: process.env.ADMIN_PASSWORD ?? 'change-me',
  sessionSecret: process.env.SESSION_SECRET ?? 'change-me-session',
  webhookSecret: process.env.WEBHOOK_SECRET ?? 'change-me-webhook',
  notifyEmail: process.env.NOTIFY_EMAIL ?? 'info@dkeramik.lt',
  allowTestReset: process.env.ALLOW_TEST_RESET === 'true',
  allowMockPay: paymentProvider === 'mock' && process.env.STORE !== 'firestore',
  secureCookies: publicApiUrl.startsWith('https://'),
});

const port = Number(process.env.PORT ?? 8787);
serve({ fetch: app.fetch, port }, () => {
  console.log(`DKeramik API listening on ${port}`);
});
