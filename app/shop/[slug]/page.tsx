import { getShopProducts } from '@/content/products';
import ShopProductDetail from './ShopProductDetail';

export function generateStaticParams() {
  return getShopProducts().map((product) => ({ slug: product.id }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ShopProductPage({ params }: PageProps) {
  const { slug } = await params;
  return <ShopProductDetail slug={slug} />;
}
