'use client';

import { useEffect, useState, type MouseEvent } from 'react';
import { useLanguage } from '@/lib/i18n';
import { formatEur } from '@/lib/format-money';
import { fetchInvoicePdf, fetchOrder, type PublicOrder } from '@/lib/shop-api';

function readCredentials(): { orderId: string; token: string } {
  if (typeof window === 'undefined') return { orderId: '', token: '' };
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  const search = new URLSearchParams(window.location.search);
  return {
    orderId: hash.get('orderId') || search.get('orderId') || '',
    token: hash.get('token') || search.get('token') || '',
  };
}

function ConfirmationInner() {
  const { language, t } = useLanguage();
  const [creds, setCreds] = useState<{ orderId: string; token: string } | null>(null);
  const [order, setOrder] = useState<PublicOrder | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const next = readCredentials();
    if (next.orderId && next.token && window.location.search.includes('token=')) {
      window.history.replaceState(
        null,
        '',
        `${window.location.pathname}#orderId=${encodeURIComponent(next.orderId)}&token=${encodeURIComponent(next.token)}`,
      );
    }
    setCreds(next);
  }, []);

  useEffect(() => {
    if (!creds) return;
    if (!creds.orderId || !creds.token) {
      setError(true);
      return;
    }
    fetchOrder(creds.orderId, creds.token)
      .then(setOrder)
      .catch(() => setError(true));
  }, [creds]);

  async function onDownloadInvoice(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    if (!order || !creds?.token) return;
    const blob = await fetchInvoicePdf(order.orderId, creds.token);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.rel = 'noopener';
    link.download = `${order.invoiceNumber}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  }

  if (error) return <p>{t.confirmation.notFound}</p>;
  if (!creds || !order) return <p>{t.confirmation.loading}</p>;

  const paid = order.status === 'paid';

  return (
    <div>
      <h1 className="font-playfair text-3xl text-clay-700 mb-4">{t.confirmation.title}</h1>
      <p className="mb-6">{paid ? t.confirmation.paid : t.confirmation.pending}</p>
      <div className="space-y-3">
        <div role="group" aria-label={t.confirmation.invoice}>
          <p className="text-sm uppercase tracking-widest text-clay-600">{t.confirmation.invoice}</p>
          <p role="definition">{order.invoiceNumber}</p>
        </div>
        <div role="group" aria-label={t.confirmation.amount}>
          <p className="text-sm uppercase tracking-widest text-clay-600">{t.confirmation.amount}</p>
          <p role="definition">{formatEur(order.amountCents, language)}</p>
        </div>
        <div role="group" aria-label={t.confirmation.iban}>
          <p className="text-sm uppercase tracking-widest text-clay-600">{t.confirmation.iban}</p>
          <p role="definition">{order.iban}</p>
        </div>
        <div role="group" aria-label={t.confirmation.purpose}>
          <p className="text-sm uppercase tracking-widest text-clay-600">{t.confirmation.purpose}</p>
          <p role="definition">{order.paymentPurpose}</p>
        </div>
      </div>
      {!paid && order.payUrl && (
        <p className="mt-6">
          <a className="underline" href={order.payUrl} referrerPolicy="no-referrer" rel="noopener noreferrer">
            {t.confirmation.payCta}
          </a>
        </p>
      )}
      <p className="mt-4">
        <a className="underline" href="#invoice" onClick={onDownloadInvoice}>
          {t.confirmation.downloadInvoice}
        </a>
      </p>
      <p className="mt-8 text-sm text-clay-600 leading-relaxed">{t.confirmation.rights}</p>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <div className="min-h-screen bg-clay-50">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <ConfirmationInner />
      </div>
    </div>
  );
}
