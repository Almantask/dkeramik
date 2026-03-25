import { render, screen } from '@testing-library/react';
import Footer from '@/components/layout/Footer';
import { LanguageProvider } from '@/lib/i18n';

function renderWithLanguage(ui: React.ReactElement) {
  return render(<LanguageProvider>{ui}</LanguageProvider>);
}

describe('Footer', () => {
  it('renders the DKeramik brand name', () => {
    renderWithLanguage(<Footer />);
    expect(screen.getByText('DKeramik')).toBeInTheDocument();
  });

  it('renders the LT tagline by default', () => {
    renderWithLanguage(<Footer />);
    expect(
      screen.getByText(/Įkvėpta Baltiškos gamtos/i),
    ).toBeInTheDocument();
  });

  it('renders navigation links in LT by default', () => {
    renderWithLanguage(<Footer />);
    expect(screen.getByText('Portfolio')).toBeInTheDocument();
    expect(screen.getByText('Apie mane')).toBeInTheDocument();
    expect(screen.getByText('Minčių Koštuvas')).toBeInTheDocument();
  });

  it('renders contact email link', () => {
    renderWithLanguage(<Footer />);
    const emailLink = screen.getByText('info@dkeramik.lt');
    expect(emailLink).toBeInTheDocument();
    expect(emailLink.closest('a')).toHaveAttribute('href', 'mailto:info@dkeramik.lt');
  });

  it('displays copyright year', () => {
    renderWithLanguage(<Footer />);
    const year = new Date().getFullYear();
    expect(screen.getByText(new RegExp(String(year)))).toBeInTheDocument();
  });
});
