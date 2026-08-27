import { describe, expect, it } from 'vitest';
import { escapeHtml } from './html.js';

describe('escapeHtml', () => {
  it('encodes markup and quotes for attributes', () => {
    expect(escapeHtml(`<img src="x" alt='y' &>`)).toBe(
      '&lt;img src=&quot;x&quot; alt=&#39;y&#39; &amp;&gt;',
    );
  });
});
