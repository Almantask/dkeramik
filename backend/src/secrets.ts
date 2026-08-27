const DEFAULT_ADMIN = 'change-me';
const DEFAULT_SESSION = 'change-me-session';
const DEFAULT_WEBHOOK = 'change-me-webhook';

/** Firestore (production) must not boot with example secrets. */
export function assertProductionSecrets(env: NodeJS.ProcessEnv): void {
  if (env.STORE !== 'firestore') return;
  const missing: string[] = [];
  if (!env.ADMIN_PASSWORD || env.ADMIN_PASSWORD === DEFAULT_ADMIN) missing.push('ADMIN_PASSWORD');
  if (!env.SESSION_SECRET || env.SESSION_SECRET === DEFAULT_SESSION) missing.push('SESSION_SECRET');
  if (!env.WEBHOOK_SECRET || env.WEBHOOK_SECRET === DEFAULT_WEBHOOK) missing.push('WEBHOOK_SECRET');
  if (missing.length) {
    throw new Error(
      `Refusing to start with missing or example secrets (${missing.join(', ')}) when STORE=firestore`,
    );
  }
}
