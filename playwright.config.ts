import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: [
    {
      command: 'npm run dev',
      cwd: 'backend',
      url: 'http://localhost:8787/api/health',
      reuseExistingServer: !process.env.CI,
      env: {
        PORT: '8787',
        STORE: 'memory',
        ALLOW_TEST_RESET: 'true',
        PAYMENT_PROVIDER: 'mock',
        ADMIN_PASSWORD: 'test-admin',
        WEBHOOK_SECRET: 'test-webhook',
        SESSION_SECRET: 'test-session',
        FRONTEND_ORIGIN: 'http://localhost:3000',
        PUBLIC_API_URL: 'http://localhost:8787',
      },
    },
    {
      command: 'npx next dev -p 3000',
      url: 'http://localhost:3000',
      reuseExistingServer: !process.env.CI,
      env: {
        NEXT_PUBLIC_API_URL: 'http://localhost:8787',
      },
    },
  ],
});
