import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { loadEnv } from './load-env.js';

const createdKeys = ['LOAD_ENV_TEST_A', 'LOAD_ENV_TEST_B'] as const;

afterEach(() => {
  for (const key of createdKeys) delete process.env[key];
});

describe('loadEnv', () => {
  it('sets missing keys from the file and keeps existing env', () => {
    const dir = mkdtempSync(join(tmpdir(), 'dkeramik-env-'));
    const file = join(dir, '.env');
    writeFileSync(
      file,
      ['LOAD_ENV_TEST_A=from-file', 'LOAD_ENV_TEST_B=also-file', '# comment', 'NOT_A_PAIR'].join('\n'),
    );
    process.env.LOAD_ENV_TEST_A = 'already-set';
    loadEnv(file);
    expect(process.env.LOAD_ENV_TEST_A).toBe('already-set');
    expect(process.env.LOAD_ENV_TEST_B).toBe('also-file');
  });

  it('does nothing when the file is missing', () => {
    loadEnv(join(tmpdir(), 'dkeramik-missing.env'));
    expect(process.env.LOAD_ENV_TEST_B).toBeUndefined();
  });
});
