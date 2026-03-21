import { render, screen } from '@testing-library/react';
import ProductCard from '@/components/ui/ProductCard';

const mockProduct = {
  id: 'test-bowl',
  name: 'Test Bowl',
  category: 'Bowls',
  price: 48,
  image: '<svg></svg>',
};

describe('ProductCard', () => {
  it('renders product name', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Test Bowl')).toBeInTheDocument();
  });

  it('renders product category', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Bowls')).toBeInTheDocument();
  });

  it('renders product price', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('$48')).toBeInTheDocument();
  });

  it('links to product detail page', () => {
    render(<ProductCard product={mockProduct} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/collection/test-bowl');
  });

  it('renders product image container', () => {
    const { container } = render(<ProductCard product={mockProduct} />);
    const imageContainer = container.querySelector('.bg-clay-200');
    expect(imageContainer).toBeInTheDocument();
  });
});
