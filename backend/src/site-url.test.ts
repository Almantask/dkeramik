import { describe, expect, it } from 'vitest';
import { corsAllowOrigin, publicPageUrl, siteBaseUrl } from './site-url.js';

describe('siteBaseUrl', () => {
  it('adds /dkeramik on github.io when the repo path is missing', () => {
    expect(siteBaseUrl('https://almantask.github.io')).toBe(
      'https://almantask.github.io/dkeramik',
    );
    expect(siteBaseUrl('https://almantask.github.io/')).toBe(
      'https://almantask.github.io/dkeramik',
    );
  });

  it('does not double the repo path when FRONTEND_ORIGIN already has it', () => {
    expect(siteBaseUrl('https://almantask.github.io/dkeramik')).toBe(
      'https://almantask.github.io/dkeramik',
    );
    expect(siteBaseUrl('https://almantask.github.io/dkeramik/')).toBe(
      'https://almantask.github.io/dkeramik',
    );
  });

  it('leaves localhost and custom domains unchanged', () => {
    expect(siteBaseUrl('http://localhost:3000')).toBe('http://localhost:3000');
    expect(siteBaseUrl('https://www.dkeramik.lt')).toBe('https://www.dkeramik.lt');
  });
});

describe('corsAllowOrigin', () => {
  it('strips the path so GitHub Pages CORS still matches', () => {
    expect(corsAllowOrigin('https://almantask.github.io/dkeramik')).toBe(
      'https://almantask.github.io',
    );
    expect(corsAllowOrigin('http://localhost:3000')).toBe('http://localhost:3000');
  });
});

describe('publicPageUrl', () => {
  it('builds portfolio links under /dkeramik on github.io', () => {
    expect(
      publicPageUrl('https://almantask.github.io', '/portfolio/rustic-dinner-bowl'),
    ).toBe('https://almantask.github.io/dkeramik/portfolio/rustic-dinner-bowl');
  });
});
