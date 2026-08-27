'use client';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import { useCart } from '@/components/shop/CartProvider';
import { getProductById } from '@/content/products';
import { formatEur } from '@/lib/format-money';
import { useLanguage } from '@/lib/i18n';
import { fetchInventory, type LiveInventory } from '@/lib/shop-api';
import ProductImage from '@/components/ui/ProductImage';

export default function ShopProductDetail({ slug }: { slug: string }) {
  const { language, t } = useLanguage();
  const cart = useCart();
  const product = getProductById(slug);
  const [live, setLive] = useState<LiveInventory | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchInventory()
      .then((rows) => setLive(rows.find((row) => row.productId === slug) ?? null))
      .catch(() => setError(true));
  }, [slug]);

  if (!product || !product.forSale) notFound();

  const stock = live?.stock ?? 0;
  const forSale = live?.forSale ?? product.forSale;
  const soldOut = !forSale || stock < 1;

  return (
    <div className="min-h-screen bg-clay-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link href="/shop" className="text-clay-500 hover:text-clay-600 text-sm">
          {t.shop.backToShop}
        </Link>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-8">
          <div className="bg-clay-100 aspect-square flex items-center justify-center">
            <ProductImage svg={product.image} alt={product.name[language]} />
          </div>
          <div>
            <h1 className="font-playfair text-3xl text-clay-700 mb-4">{product.name[language]}</h1>
            <p className="text-clay-600 leading-relaxed mb-6">{product.description[language]}</p>
            {error && <p className="mb-4">{t.shop.apiUnavailable}</p>}
            {live && (
              <p className="text-clay-700 text-xl mb-2">{formatEur(live.priceCents, language)}</p>
            )}
            <p className="text-clay-500 text-sm mb-6">
              {soldOut ? t.shop.soldOut : `${t.shop.stock}: ${stock}`}
            </p>
            {soldOut ? null : (
              <Button type="button" onClick={() => cart.add(product.id, stock)}>
                {t.shop.addToCart}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
