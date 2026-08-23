'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import { useCart } from '@/components/shop/CartProvider';
import { getProductById } from '@/content/products';
import { formatEur } from '@/lib/format-money';
import { useLanguage } from '@/lib/i18n';
import { fetchInventory, type LiveInventory } from '@/lib/shop-api';

export default function CartPage() {
  const { language, t } = useLanguage();
  const cart = useCart();
  const [live, setLive] = useState<LiveInventory[]>([]);

  useEffect(() => {
    fetchInventory()
      .then(setLive)
      .catch(() => setLive([]));
  }, []);

  const rows = cart.lines
    .map((line) => {
      const product = getProductById(line.productId);
      const inv = live.find((row) => row.productId === line.productId);
      return product
        ? {
            product,
            qty: inv ? Math.min(line.qty, inv.stock) : line.qty,
            stock: inv?.stock ?? 0,
            priceCents: inv?.priceCents ?? 0,
          }
        : null;
    })
    .filter((row): row is NonNullable<typeof row> => Boolean(row));

  const subtotal = rows.reduce((sum, row) => sum + row.priceCents * row.qty, 0);

  return (
    <div className="min-h-screen bg-clay-50">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="font-playfair text-3xl text-clay-700 mb-8">{t.cart.title}</h1>
        {rows.length === 0 ? (
          <p>{t.cart.empty}</p>
        ) : (
          <ul className="space-y-6">
            {rows.map((row) => (
              <li key={row.product.id} className="border-b border-clay-200 pb-4">
                <h2 className="font-playfair text-lg">{row.product.name[language]}</h2>
                <p>{formatEur(row.priceCents, language)}</p>
                <label className="block mt-2 text-sm">
                  {t.cart.quantity}
                  <input
                    className="ml-2 border border-clay-300 px-2 py-1 w-16"
                    type="number"
                    min={1}
                    max={Math.max(row.stock, 1)}
                    value={row.qty}
                    aria-label={`${t.cart.quantity} ${row.product.name[language]}`}
                    onChange={(e) =>
                      cart.setQty(row.product.id, Number(e.target.value), row.stock)
                    }
                  />
                </label>
                <button
                  type="button"
                  className="text-sm underline mt-2"
                  onClick={() => cart.remove(row.product.id)}
                >
                  {t.cart.remove}
                </button>
              </li>
            ))}
          </ul>
        )}
        {rows.length > 0 && (
          <p className="mt-6">
            {t.cart.subtotal}: {formatEur(subtotal, language)}
          </p>
        )}
        <div className="mt-8 flex gap-4">
          <Link href="/shop" className="underline text-clay-600">
            {t.cart.continueShopping}
          </Link>
          {rows.length > 0 && (
            <Link href="/checkout">
              <Button type="button">{t.cart.checkout}</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
