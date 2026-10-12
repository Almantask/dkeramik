import { render, screen } from '@testing-library/react';
import ClassicHome from '@/components/home/ClassicHome';
import { LanguageProvider } from '@/lib/i18n';

function renderWithLanguage(ui: React.ReactElement) {
  return render(<LanguageProvider>{ui}</LanguageProvider>);
}

describe('Classic home page (shown when landing-only mode is off)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the LT headline by default', () => {
    renderWithLanguage(<ClassicHome />);
    expect(
      screen.getByText(/Namai tampa tikrais namais/i),
    ).toBeInTheDocument();
  });

  it('renders the LT intro text', () => {
    renderWithLanguage(<ClassicHome />);
    expect(
      screen.getByText(/Namai kiekvienam iš mūsų reiškia kažką skirtingo/i),
    ).toBeInTheDocument();
  });

  it('renders two CTA buttons in LT', () => {
    renderWithLanguage(<ClassicHome />);
    expect(screen.getByText('Portfolio')).toBeInTheDocument();
    expect(screen.getByText('Apie')).toBeInTheDocument();
  });

  it('has a link to the portfolio page', () => {
    renderWithLanguage(<ClassicHome />);
    const link = screen.getByRole('link', { name: /Portfolio/i });
    expect(link).toHaveAttribute('href', '/portfolio');
  });

  it('has a link to the about page', () => {
    renderWithLanguage(<ClassicHome />);
    const link = screen.getByRole('link', { name: /Apie/i });
    expect(link).toHaveAttribute('href', '/about');
  });
});
