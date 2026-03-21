import { render, screen } from '@testing-library/react';
import Footer from '@/components/layout/Footer';

describe('Footer', () => {
  it('renders the DKeramik brand name', () => {
    render(<Footer />);
    expect(screen.getByText('DKeramik')).toBeInTheDocument();
  });

  it('renders the tagline', () => {
    render(<Footer />);
    expect(screen.getByText(/Take it into your hands and feel the warmth of clay/i)).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<Footer />);
    
    expect(screen.getByText('Collection')).toBeInTheDocument();
    expect(screen.getByText('Our Craft')).toBeInTheDocument();
    expect(screen.getByText('Journal')).toBeInTheDocument();
    expect(screen.getByText('Custom Orders')).toBeInTheDocument();
  });

  it('renders social media links', () => {
    render(<Footer />);
    
    const socialLinks = screen.getAllByRole('link').filter(
      link => link.getAttribute('target') === '_blank'
    );
    
    expect(socialLinks.length).toBeGreaterThanOrEqual(2);
  });

  it('displays copyright text', () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`© ${currentYear} DKeramik`))).toBeInTheDocument();
  });
});
