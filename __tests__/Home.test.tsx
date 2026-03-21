import { render, screen } from '@testing-library/react';
import Home from '@/app/page';

describe('Home Page', () => {
  it('renders the main headline', () => {
    render(<Home />);
    expect(screen.getByText(/Homes become true homes/i)).toBeInTheDocument();
  });

  it('renders heartfelt details text', () => {
    render(<Home />);
    expect(screen.getByText('heartfelt details')).toBeInTheDocument();
  });

  it('renders CTA buttons', () => {
    render(<Home />);
    expect(screen.getByText('Explore Collection')).toBeInTheDocument();
    expect(screen.getByText('Our Story')).toBeInTheDocument();
  });

  it('renders the signature statement', () => {
    render(<Home />);
    expect(screen.getByText(/Homes are created little by little/i)).toBeInTheDocument();
  });

  it('renders the invitation section', () => {
    render(<Home />);
    expect(screen.getByText('An Invitation')).toBeInTheDocument();
  });

  it('renders the warmth of clay tagline', () => {
    render(<Home />);
    expect(screen.getByText(/Take it in your hands and feel the warmth of clay/i)).toBeInTheDocument();
  });

  it('contains link to collection page', () => {
    render(<Home />);
    const collectionLink = screen.getByRole('link', { name: /Explore Collection/i });
    expect(collectionLink).toHaveAttribute('href', '/collection');
  });

  it('contains link to about page', () => {
    render(<Home />);
    const aboutLink = screen.getByRole('link', { name: /Our Story/i });
    expect(aboutLink).toHaveAttribute('href', '/about');
  });
});
