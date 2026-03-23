'use client';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';
import { getProductById } from '@/content/products';

interface ProductDetailProps {
  slug: string;
}

export default function ProductDetail({ slug }: ProductDetailProps) {
  const { language, t } = useLanguage();
  const p = t.product;

  const product = getProductById(slug);
  if (!product) notFound();

  const categoryLabel =
    t.portfolio[product.categoryKey as keyof typeof t.portfolio] as string;

  return (
    <div className="min-h-screen bg-clay-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Back link */}
        <Link
          href="/portfolio"
          className="text-clay-500 hover:text-clay-600 text-sm mb-8 inline-block transition-colors"
        >
          {p.backToPortfolio}
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-6">
          {/* Image */}
          <div className="bg-clay-100 aspect-square flex items-center justify-center">
            <div
              className="w-3/4 h-3/4 flex items-center justify-center"
              dangerouslySetInnerHTML={{ __html: product.image }}
            />
          </div>

          {/* Details */}
          <div>
            <p className="text-clay-400 text-xs uppercase tracking-widest mb-2">
              {categoryLabel}
            </p>
            <h1 className="font-playfair text-3xl sm:text-4xl text-clay-700 mb-8 leading-tight">
              {product.name[language]}
            </h1>

            {/* Description */}
            <p className="text-clay-600 leading-loose mb-8">
              {product.description[language]}
            </p>

            {/* Compact specifications */}
            <p className="text-clay-500 text-sm mb-8">
              {product.material[language]} · {product.dimensions}
            </p>

            {/* Handmade variation note */}
            <div className="bg-clay-100 border border-clay-200 p-6">
              <p className="text-clay-600 text-sm leading-relaxed">
                <strong className="text-clay-700">{p.handmadeNoteTitle}: </strong>
                {p.handmadeNoteBody}
              </p>
            </div>
          </div>
        </div>

        {/* Gallery section */}
        {product.gallery && product.gallery.length > 0 && (
          <div className="mt-16">
            <h2 className="font-playfair text-2xl text-clay-600 mb-6">
              {p.galleryHeading}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {product.gallery.map((img, i) => (
                <div
                  key={i}
                  className="bg-clay-100 aspect-square flex items-center justify-center"
                >
                  <div
                    className="w-3/4 h-3/4 flex items-center justify-center"
                    dangerouslySetInnerHTML={{ __html: img }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
