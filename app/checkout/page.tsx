'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, type ReactNode, useEffect, useMemo, useState } from 'react';
import Button from '@/components/ui/Button';
import { useCart } from '@/components/shop/CartProvider';
import { getProductById } from '@/content/products';
import { formatEur } from '@/lib/format-money';
import { useLanguage } from '@/lib/i18n';
import {
  createOrder,
  fetchInventory,
  fetchSettings,
  type LiveInventory,
  type ShopSettings,
} from '@/lib/shop-api';

function RequiredField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      {label}{' '}
      <span aria-hidden="true">*</span>
      {children}
    </label>
  );
}

export default function CheckoutPage() {
  const { language, t } = useLanguage();
  const cart = useCart();
  const router = useRouter();
  const [inventory, setInventory] = useState<LiveInventory[]>([]);
  const [settings, setSettings] = useState<ShopSettings | null>(null);
  const [catalogReady, setCatalogReady] = useState(false);
  const [delivery, setDelivery] = useState<'pickup' | 'shipping'>('pickup');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetchInventory()
        .then((rows) => {
          if (!cancelled) setInventory(rows);
        })
        .catch(() => {
          if (!cancelled) setInventory([]);
        }),
      fetchSettings()
        .then((value) => {
          if (!cancelled) setSettings(value);
        })
        .catch(() => {
          if (!cancelled) setSettings(null);
        }),
    ]).finally(() => {
      if (!cancelled) setCatalogReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const rows = cart.lines
    .map((line) => {
      const product = getProductById(line.productId);
      const inv = inventory.find((row) => row.productId === line.productId);
      if (!product || !inv) return null;
      return { product, qty: Math.min(line.qty, inv.stock), priceCents: inv.priceCents, stock: inv.stock };
    })
    .filter((row): row is NonNullable<typeof row> => row != null && row.qty > 0);

  const subtotal = rows.reduce((sum, row) => sum + row.priceCents * row.qty, 0);
  const shippingCents = delivery === 'shipping' ? (settings?.shippingLtCents ?? 0) : 0;
  const total = subtotal + shippingCents;

  const mailtoHref = useMemo(() => {
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
      `Delivery: ${delivery}`,
      ...rows.map((row) => `${row.product.name[language]} x ${row.qty}`),
    ].join('\n');
    return `mailto:info@dkeramik.lt?subject=${encodeURIComponent('DKeramik order')}&body=${encodeURIComponent(body)}`;
  }, [name, email, phone, delivery, rows, language]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    const result = await createOrder({
      items: rows.map((row) => ({ productId: row.product.id, qty: row.qty })),
      buyer: {
        name,
        email,
        phone,
        address: delivery === 'shipping' ? address : undefined,
        city: delivery === 'shipping' ? city : undefined,
        postalCode: delivery === 'shipping' ? postalCode : undefined,
      },
      delivery,
      language,
    });
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error === 'insufficient_stock' ? t.checkout.errorStock : t.checkout.errorGeneric);
      return;
    }
    cart.clear();
    router.push(
      `/checkout/confirmation#orderId=${encodeURIComponent(result.order.orderId)}&token=${encodeURIComponent(result.order.token)}`,
    );
  }

  return (
    <div className="min-h-screen bg-clay-50">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <h1 className="font-playfair text-3xl text-clay-700 mb-8">{t.checkout.title}</h1>
        {!catalogReady ? (
          <p>{t.confirmation.loading}</p>
        ) : rows.length === 0 ? (
          <p>
            {t.cart.empty}{' '}
            <Link href="/shop" className="underline">
              {t.cart.continueShopping}
            </Link>
          </p>
        ) : (
          <form onSubmit={onSubmit} className="space-y-6">
            <p className="text-sm text-clay-500">{t.checkout.requiredHint}</p>
            <RequiredField label={t.checkout.name}>
              <input
                required
                name="name"
                className="mt-1 w-full border border-clay-300 px-3 py-2"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </RequiredField>
            <RequiredField label={t.checkout.email}>
              <input
                required
                type="email"
                name="email"
                className="mt-1 w-full border border-clay-300 px-3 py-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </RequiredField>
            <RequiredField label={t.checkout.phone}>
              <input
                required
                name="phone"
                className="mt-1 w-full border border-clay-300 px-3 py-2"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </RequiredField>
            <fieldset>
              <legend>{t.checkout.delivery}</legend>
              <label className="block mt-2">
                <input
                  type="radio"
                  name="delivery"
                  checked={delivery === 'pickup'}
                  onChange={() => setDelivery('pickup')}
                />{' '}
                {t.checkout.pickup}
              </label>
              <p className="text-sm text-clay-500 ml-6">{t.checkout.pickupHint}</p>
              <label className="block mt-2">
                <input
                  type="radio"
                  name="delivery"
                  checked={delivery === 'shipping'}
                  onChange={() => setDelivery('shipping')}
                />{' '}
                {t.checkout.shipping}
              </label>
              <p className="text-sm text-clay-500 ml-6">{t.checkout.shippingHint}</p>
            </fieldset>
            {delivery === 'shipping' && (
              <>
                <RequiredField label={t.checkout.address}>
                  <input
                    required
                    name="address"
                    className="mt-1 w-full border border-clay-300 px-3 py-2"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </RequiredField>
                <RequiredField label={t.checkout.city}>
                  <input
                    required
                    name="city"
                    className="mt-1 w-full border border-clay-300 px-3 py-2"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </RequiredField>
                <RequiredField label={t.checkout.postalCode}>
                  <input
                    required
                    name="postalCode"
                    className="mt-1 w-full border border-clay-300 px-3 py-2"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                  />
                </RequiredField>
              </>
            )}
            <p className="text-sm text-clay-600">{t.checkout.international}</p>
            <p>
              {t.cart.subtotal}: {formatEur(subtotal, language)}
            </p>
            {delivery === 'shipping' && (
              <p>
                {t.checkout.shippingTotal}: {formatEur(shippingCents, language)}
              </p>
            )}
            <p className="font-semibold">{formatEur(total, language)}</p>
            {error && <p role="alert">{error}</p>}
            <Button type="submit" disabled={submitting}>
              {submitting ? t.checkout.submitting : t.checkout.submit}
            </Button>
            <p>
              <a href={mailtoHref} className="underline text-sm">
                {t.checkout.mailtoFallback}
              </a>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
