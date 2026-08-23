'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import { useLanguage } from '@/lib/i18n';
import { formatEur } from '@/lib/format-money';
import { fetchInventory, type LiveInventory } from '@/lib/shop-api';
import { getShopProducts, type Product } from '@/content/products';
import { useCart } from '@/components/shop/CartProvider';

function merge(product: Product, live: LiveInventory | undefined) {
  return {
    product,
    priceCents: live?.priceCents ?? null,
    stock: live?.stock ?? 0,
    forSale: live?.forSale ?? product.forSale,
  };
}

export default function ShopCatalog() {
  const { language, t } = useLanguage();
  const cart = useCart();
  const [live, setLive] = useState<LiveInventory[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchInventory()
      .then(setLive)
      .catch(() => setError(true));
  }, []);

  const catalog = getShopProducts().map((product) =>
    merge(
      product,
      live?.find((row) => row.productId === product.id),
    ),
  );

  return (
    <div className="min-h-screen bg-clay-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="font-playfair text-3xl sm:text-4xl text-clay-700 mb-4">{t.shop.title}</h1>
        <p className="text-clay-600 max-w-2xl mb-10 leading-relaxed">{t.shop.intro}</p>
        {error && <p className="text-clay-700 mb-8">{t.shop.apiUnavailable}</p>}
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {catalog.map(({ product, priceCents, stock, forSale }) => {
            const soldOut = !forSale || stock < 1;
            return (
              <li key={product.id}>
                <article>
                  <Link href={`/shop/${product.id}`} className="group block [&_svg]:pointer-events-none">
                    <div
                      className="bg-clay-100 aspect-[3/4] flex items-center justify-center mb-4"
                      dangerouslySetInnerHTML={{ __html: product.image }}
                    />
                    <h2 className="font-playfair text-xl text-clay-700">{product.name[language]}</h2>
                  </Link>
                  {priceCents != null ? (
                    <p className="text-clay-600 mt-1">{formatEur(priceCents, language)}</p>
                  ) : (
                    <p className="text-clay-500 text-sm mt-1">{t.shop.price}</p>
                  )}
                  {soldOut ? (
                    <p className="text-clay-500 mt-3">{t.shop.soldOut}</p>
                  ) : (
                    <Button
                      className="mt-3"
                      type="button"
                      onClick={() => cart.add(product.id, stock)}
                    >
                      {t.shop.addToCart}
                    </Button>
                  )}
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
