import { products } from '@/content/products';
import ProductDetail from './ProductDetail';

// generateStaticParams must live in a server component (no 'use client')
export function generateStaticParams() {
  return products.map((product) => ({ slug: product.id }));
}

interface PageProps {
  params: { slug: string };
}

// Server component — delegates rendering to a client component
export default function ProductPage({ params }: PageProps) {
  return <ProductDetail slug={params.slug} />;
}
