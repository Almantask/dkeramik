import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/collection/${product.id}`} className="group">
      <div className="bg-clay-100 rounded-sm overflow-hidden mb-4 aspect-square flex items-center justify-center">
        <div 
          className="w-full h-full flex items-center justify-center bg-clay-200"
          dangerouslySetInnerHTML={{ __html: product.image }}
        />
      </div>
      <h3 className="font-playfair text-lg text-clay-700 mb-1 group-hover:text-clay-500 transition-colors">
        {product.name}
      </h3>
      <p className="text-clay-500 text-sm mb-2">{product.category}</p>
      <p className="text-clay-600 font-semibold">${product.price}</p>
    </Link>
  );
}
