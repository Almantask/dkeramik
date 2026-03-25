'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';
import type { Product } from '@/content/products';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { language } = useLanguage();

  return (
    <Link href={`/portfolio/${product.id}`} className="group">
      <div className="bg-clay-100 overflow-hidden aspect-[3/4] relative flex items-center justify-center">
        <div
          className="w-full h-full flex items-center justify-center bg-clay-200"
          dangerouslySetInnerHTML={{ __html: product.image }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-clay-700/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <h3 className="font-playfair text-lg text-clay-50">
            {product.name[language]}
          </h3>
        </div>
      </div>
    </Link>
  );
}
