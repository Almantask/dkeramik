import { products } from '@/content/products';
import ProductDetail from './ProductDetail';

// generateStaticParams must live in a server component (no 'use client')
export function generateStaticParams() {
  return products.map((product) => ({ slug: product.id }));
}

// In Next.js 15, params is a Promise — the page must be async to await it
interface PageProps {
  params: Promise<{ slug: string }>;
}

// Server component — delegates rendering to a client component
export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  return <ProductDetail slug={slug} />;
}
