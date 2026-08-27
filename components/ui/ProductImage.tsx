'use client';

/** Render catalog SVGs as images so markup cannot execute as HTML. */
export function svgDataUrl(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export default function ProductImage({
  svg,
  alt,
  className = 'w-full h-full object-contain',
}: {
  svg: string;
  alt: string;
  className?: string;
}) {
  return <img src={svgDataUrl(svg)} alt={alt} className={className} />;
}
