export function formatEur(cents: number, locale: 'lt' | 'en' = 'lt'): string {
  return new Intl.NumberFormat(locale === 'lt' ? 'lt-LT' : 'en-IE', {
    style: 'currency',
    currency: 'EUR',
  }).format(cents / 100);
}
