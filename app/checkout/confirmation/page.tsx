'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '@/lib/i18n';
import { formatEur } from '@/lib/format-money';
import { fetchOrder, invoicePdfUrl, type PublicOrder } from '@/lib/shop-api';

function ConfirmationInner() {
  const { language, t } = useLanguage();
  const params = useSearchParams();
  const orderId = params.get('orderId') ?? '';
  const token = params.get('token') ?? '';
  const [order, setOrder] = useState<PublicOrder | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!orderId || !token) {
      setError(true);
      return;
    }
    fetchOrder(orderId, token)
      .then(setOrder)
      .catch(() => setError(true));
  }, [orderId, token]);

  if (error) return <p>{t.confirmation.notFound}</p>;
  if (!order) return <p>{t.confirmation.loading}</p>;

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
          <a className="underline" href={order.payUrl}>
            {t.confirmation.payCta}
          </a>
        </p>
      )}
      <p className="mt-4">
        <a className="underline" href={invoicePdfUrl(order.orderId, token)}>
          {t.confirmation.downloadInvoice}
        </a>
      </p>
      <p className="mt-8 text-sm text-clay-600 leading-relaxed">{t.confirmation.rights}</p>
    </div>
  );
}

export default function ConfirmationPage() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-clay-50">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <Suspense fallback={<p>{t.confirmation.loading}</p>}>
          <ConfirmationInner />
        </Suspense>
      </div>
    </div>
  );
}
