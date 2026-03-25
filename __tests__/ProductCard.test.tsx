import { render, screen } from '@testing-library/react';
import ProductCard from '@/components/ui/ProductCard';
import { LanguageProvider } from '@/lib/i18n';
import type { Product } from '@/content/products';

const mockProduct: Product = {
  id: 'test-bowl',
  categoryKey: 'categoryBowls',
  name: { lt: 'Bandymo dubenėlis', en: 'Test Bowl' },
  image: '<svg></svg>',
  gallery: ['<svg></svg>', '<svg></svg>'],
  description: { lt: 'Bandymo aprašymas', en: 'Test description' },
  dimensions: '20 cm × 7 cm',
  material: { lt: 'Molis', en: 'Clay' },
  care: { lt: 'Plauti rankomis', en: 'Hand wash' },
};

function renderWithLanguage(ui: React.ReactElement) {
  return render(<LanguageProvider>{ui}</LanguageProvider>);
}

describe('ProductCard', () => {
  it('renders product name in LT by default', () => {
    renderWithLanguage(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Bandymo dubenėlis')).toBeInTheDocument();
  });

  it('does NOT render a category label', () => {
    const { container } = renderWithLanguage(<ProductCard product={mockProduct} />);
    expect(container.textContent).not.toContain('Dubenėliai');
  });

  it('does NOT render a price', () => {
    const { container } = renderWithLanguage(<ProductCard product={mockProduct} />);
    // No price text should be present — this is a gallery, not a shop
    expect(container.textContent).not.toMatch(/\$\d+/);
    expect(container.textContent).not.toMatch(/€\d+/);
  });

  it('links to the product detail page', () => {
    renderWithLanguage(<ProductCard product={mockProduct} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/portfolio/test-bowl');
  });

  it('renders image container', () => {
    const { container } = renderWithLanguage(<ProductCard product={mockProduct} />);
    expect(container.querySelector('.bg-clay-200')).toBeInTheDocument();
  });

  it('title overlay is hidden by default and shown on hover', () => {
    const { container } = renderWithLanguage(<ProductCard product={mockProduct} />);
    // The overlay and title containers should have opacity-0 class (hidden by default)
    const overlays = container.querySelectorAll('.opacity-0');
    expect(overlays.length).toBeGreaterThanOrEqual(2);
    // They should have group-hover:opacity-100 for hover reveal
    overlays.forEach((el) => {
      expect(el.className).toContain('group-hover:opacity-100');
    });
  });
});
