import { render, screen } from '@testing-library/react';
import Home from '@/app/page';
import { LanguageProvider } from '@/lib/i18n';

function renderWithLanguage(ui: React.ReactElement) {
  return render(<LanguageProvider>{ui}</LanguageProvider>);
}

describe('Home Page', () => {
  it('renders the LT headline by default', () => {
    renderWithLanguage(<Home />);
    expect(
      screen.getByText(/Namai tampa tikrais namais/i),
    ).toBeInTheDocument();
  });

  it('renders bold keywords in LT intro paragraph', () => {
    renderWithLanguage(<Home />);
    expect(screen.getByText('prisiminimų')).toBeInTheDocument();
    expect(screen.getByText('tradicijų')).toBeInTheDocument();
    expect(screen.getByText('šilumos')).toBeInTheDocument();
    expect(screen.getByText('mažų detalių')).toBeInTheDocument();
  });

  it('renders the LT signature statement', () => {
    renderWithLanguage(<Home />);
    expect(
      screen.getByText(/Namai kuriami po truputį/i),
    ).toBeInTheDocument();
  });

  it('renders the LT invitation', () => {
    renderWithLanguage(<Home />);
    expect(
      screen.getByText(/pajusk molio šilumą/i),
    ).toBeInTheDocument();
  });

  it('renders CTA buttons in LT', () => {
    renderWithLanguage(<Home />);
    expect(screen.getByText('Žiūrėti portfolio')).toBeInTheDocument();
    expect(screen.getByText('Apie mane')).toBeInTheDocument();
  });

  it('has a link to the portfolio page', () => {
    renderWithLanguage(<Home />);
    const link = screen.getByRole('link', { name: /Žiūrėti portfolio/i });
    expect(link).toHaveAttribute('href', '/portfolio');
  });

  it('has a link to the about page', () => {
    renderWithLanguage(<Home />);
    const link = screen.getByRole('link', { name: /Apie mane/i });
    expect(link).toHaveAttribute('href', '/about');
  });

  it('renders the brand mark DKeramik text', () => {
    renderWithLanguage(<Home />);
    // Brand mark renders "DKeramik" text
    const dkeramikElements = screen.getAllByText('DKeramik');
    expect(dkeramikElements.length).toBeGreaterThan(0);
  });
});
