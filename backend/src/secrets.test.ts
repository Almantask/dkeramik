import { describe, expect, it } from 'vitest';
import { assertProductionSecrets } from './secrets.js';

describe('assertProductionSecrets', () => {
  it('allows memory store with example secrets', () => {
    expect(() =>
      assertProductionSecrets({
        STORE: 'memory',
        ADMIN_PASSWORD: 'change-me',
        SESSION_SECRET: 'change-me-session',
        WEBHOOK_SECRET: 'change-me-webhook',
      }),
    ).not.toThrow();
  });

  it('refuses firestore with example secrets', () => {
    expect(() =>
      assertProductionSecrets({
        STORE: 'firestore',
        ADMIN_PASSWORD: 'change-me',
        SESSION_SECRET: 'long-enough-session',
        WEBHOOK_SECRET: 'long-enough-webhook',
      }),
    ).toThrow(/ADMIN_PASSWORD/);
  });

  it('allows firestore with real secrets', () => {
    expect(() =>
      assertProductionSecrets({
        STORE: 'firestore',
        ADMIN_PASSWORD: 'not-the-example',
        SESSION_SECRET: 'not-the-example-session',
        WEBHOOK_SECRET: 'not-the-example-webhook',
      }),
    ).not.toThrow();
  });
});
