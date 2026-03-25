'use client';

import CeramicBackground from '@/components/ui/CeramicBackground';
import ProductCard from '@/components/ui/ProductCard';
import { useLanguage } from '@/lib/i18n';
import { products } from '@/content/products';

export default function PortfolioPage() {
  const { t } = useLanguage();
  const c = t.portfolio;

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

        {/* Gallery grid — no prices shown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
