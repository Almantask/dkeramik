import { notFound } from 'next/navigation';
import { products, getProductById } from '@/content/products';

export async function generateStaticParams() {
  return products.map((product) => ({
    slug: product.id,
  }));
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProductById(params.slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-clay-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="bg-clay-100 rounded-sm aspect-square flex items-center justify-center">
            <div 
              className="w-3/4 h-3/4 flex items-center justify-center"
              dangerouslySetInnerHTML={{ __html: product.image }}
            />
          </div>

          {/* Product Details */}
          <div>
            <p className="text-clay-500 text-sm uppercase tracking-wider mb-2">
              {product.category}
            </p>
            <h1 className="font-playfair text-4xl text-clay-700 mb-4">
              {product.name}
            </h1>
            <p className="text-3xl text-clay-600 font-semibold mb-8">
              ${product.price}
            </p>

            {/* Description */}
            <div className="mb-8">
              <p className="text-clay-600 leading-relaxed italic">
                {product.description}
              </p>
            </div>

            {/* Specifications */}
            <div className="space-y-4 mb-8">
              <div>
                <h3 className="text-clay-700 font-semibold text-sm uppercase tracking-wider mb-1">
                  Dimensions
                </h3>
                <p className="text-clay-600">{product.dimensions}</p>
              </div>
              <div>
                <h3 className="text-clay-700 font-semibold text-sm uppercase tracking-wider mb-1">
                  Material
                </h3>
                <p className="text-clay-600">{product.material}</p>
              </div>
              <div>
                <h3 className="text-clay-700 font-semibold text-sm uppercase tracking-wider mb-1">
                  Care Instructions
                </h3>
                <p className="text-clay-600">{product.care}</p>
              </div>
            </div>

            {/* Handmade Note */}
            <div className="bg-clay-100 border border-clay-200 rounded-sm p-6">
              <p className="text-clay-600 text-sm leading-relaxed">
                <strong className="text-clay-700">Handmade variation:</strong> Each piece is
                individually crafted, so slight variations in size, shape, and glaze are natural
                and celebrated. Your piece will be beautifully unique.
              </p>
            </div>

            {/* Emotional Closing */}
            <div className="mt-8 pt-8 border-t border-clay-200">
              <p className="font-playfair text-clay-600 italic leading-relaxed">
                This piece is ready to become part of your daily rituals. To bring warmth to
                your table. To remind you that beautiful things don't have to wait for special
                occasions—they make ordinary moments special.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
