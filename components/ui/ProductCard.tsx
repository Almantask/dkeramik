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
    t.collection[product.categoryKey as keyof typeof t.collection] as string;

  return (
    <Link href={`/collection/${product.id}`} className="group">
      <div className="bg-clay-100 overflow-hidden mb-4 aspect-square flex items-center justify-center">
        <div
          className="w-full h-full flex items-center justify-center bg-clay-200"
          dangerouslySetInnerHTML={{ __html: product.image }}
        />
      </div>
      <h3 className="font-playfair text-lg text-clay-700 mb-1 group-hover:text-clay-500 transition-colors">
        {product.name[language]}
      </h3>
      <p className="text-clay-400 text-sm">{categoryLabel}</p>
    </Link>
  );
}
