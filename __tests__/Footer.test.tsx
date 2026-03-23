import { render, screen } from '@testing-library/react';
import Footer from '@/components/layout/Footer';
import { LanguageProvider } from '@/lib/i18n';
import { lt } from '@/lib/i18n/translations.lt';

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
      screen.getByText(/Paimk į rankas ir pajusk molio šilumą/i),
    ).toBeInTheDocument();
  });

  it('renders navigation links in LT by default', () => {
    renderWithLanguage(<Footer />);
    expect(screen.getByText('Kolekcija')).toBeInTheDocument();
    expect(screen.getByText('Kūryba')).toBeInTheDocument();
    expect(screen.getByText('Dienoraštis')).toBeInTheDocument();
    expect(screen.getByText('Individualūs užsakymai')).toBeInTheDocument();
  });

  it('renders social media links', () => {
    renderWithLanguage(<Footer />);
    const socialLinks = screen
      .getAllByRole('link')
      .filter((link) => link.getAttribute('target') === '_blank');
    expect(socialLinks.length).toBeGreaterThanOrEqual(2);
  });

  it('displays copyright year', () => {
    renderWithLanguage(<Footer />);
    const year = new Date().getFullYear();
    expect(screen.getByText(new RegExp(String(year)))).toBeInTheDocument();
  });

  it('uses translated aria-labels for social links', () => {
    renderWithLanguage(<Footer />);
    expect(screen.getByLabelText(lt.footer.socialInstagram)).toBeInTheDocument();
    expect(screen.getByLabelText(lt.footer.socialPinterest)).toBeInTheDocument();
  });
});
