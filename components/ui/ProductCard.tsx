'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';
import type { Product } from '@/content/products';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { language, t } = useLanguage();

  const categoryLabel =
    t.portfolio[product.categoryKey as keyof typeof t.portfolio] as string;

  return (
    <Link href={`/portfolio/${product.id}`} className="group block">
      <div className="relative bg-clay-100 overflow-hidden aspect-[4/5] flex items-center justify-center">
        <div
          className="w-full h-full flex items-center justify-center bg-clay-200"
          dangerouslySetInnerHTML={{ __html: product.image }}
        />
        {/* Title overlay */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-clay-700/70 to-transparent p-4 pt-12">
          <h3 className="font-playfair text-lg text-clay-50 group-hover:text-white transition-colors">
            {product.name[language]}
          </h3>
          <p className="text-clay-200 text-sm mt-1">{categoryLabel}</p>
        </div>
      </div>
    </Link>
  );
}
