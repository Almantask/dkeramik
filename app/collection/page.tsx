'use client';

import { useState } from 'react';
import CeramicBackground from '@/components/ui/CeramicBackground';
import ProductCard from '@/components/ui/ProductCard';
import { useLanguage } from '@/lib/i18n';
import { products, categoryKeys, type CategoryKey } from '@/content/products';

export default function CollectionPage() {
  const { t } = useLanguage();
  const c = t.collection;

  const [selectedKey, setSelectedKey] = useState<CategoryKey>('categoryAll');

  const filteredProducts =
    selectedKey === 'categoryAll'
      ? products
      : products.filter((p) => p.categoryKey === selectedKey);

  return (
    <div className="relative bg-clay-50 min-h-screen">
      <CeramicBackground />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl text-clay-600 mb-4">
            {c.headline}
          </h1>
          <p className="text-clay-600 leading-relaxed max-w-xl mx-auto">
            {c.subheadline}
          </p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categoryKeys.map((key) => (
            <button
              key={key}
              onClick={() => setSelectedKey(key)}
              className={`px-5 py-2 text-sm font-nunito transition-colors ${
                selectedKey === key
                  ? 'bg-clay-500 text-clay-50'
                  : 'bg-clay-100 text-clay-600 hover:bg-clay-200'
              }`}
            >
              {c[key as keyof typeof c] as string}
            </button>
          ))}
        </div>

        {/* Gallery grid — no prices shown */}
        {filteredProducts.length === 0 ? (
          <p className="text-center text-clay-500 py-16">{c.emptyState}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
