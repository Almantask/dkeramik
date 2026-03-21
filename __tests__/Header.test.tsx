import { render, screen } from '@testing-library/react';
import Header from '@/components/layout/Header';

describe('Header', () => {
  it('renders the DKeramik logo', () => {
    render(<Header />);
    expect(screen.getByText('DKeramik')).toBeInTheDocument();
  });

  it('renders all navigation links', () => {
    render(<Header />);
    
    expect(screen.getAllByText('Home').length).toBeGreaterThan(0);
    expect(screen.getAllByText('About').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Collection').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Craft').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Journal').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Custom Orders').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Contact').length).toBeGreaterThan(0);
  });

  it('has correct navigation links', () => {
    render(<Header />);
    
    const links = screen.getAllByRole('link');
    const hrefs = links.map(link => link.getAttribute('href'));
    
    expect(hrefs).toContain('/');
    expect(hrefs).toContain('/about');
    expect(hrefs).toContain('/collection');
    expect(hrefs).toContain('/craft');
    expect(hrefs).toContain('/journal');
    expect(hrefs).toContain('/custom');
    expect(hrefs).toContain('/contact');
  });
});
