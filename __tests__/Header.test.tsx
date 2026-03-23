import { render, screen, fireEvent } from '@testing-library/react';
import Header from '@/components/layout/Header';
import { LanguageProvider } from '@/lib/i18n';

function renderWithLanguage(ui: React.ReactElement) {
  return render(<LanguageProvider>{ui}</LanguageProvider>);
}

describe('Header', () => {
  it('renders the DKeramik logo', () => {
    renderWithLanguage(<Header />);
    expect(screen.getByText('DKeramik')).toBeInTheDocument();
  });

  it('renders LT navigation links by default', () => {
    renderWithLanguage(<Header />);
    expect(screen.getAllByText('Pradžia').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Apie mane').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Kolekcija').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Kūryba').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Dienoraštis').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Kontaktai').length).toBeGreaterThan(0);
  });

  it('has correct navigation link hrefs', () => {
    renderWithLanguage(<Header />);
    const links = screen.getAllByRole('link');
    const hrefs = links.map((link) => link.getAttribute('href'));
    expect(hrefs).toContain('/');
    expect(hrefs).toContain('/about');
    expect(hrefs).toContain('/collection');
    expect(hrefs).toContain('/craft');
    expect(hrefs).toContain('/journal');
    expect(hrefs).toContain('/contact');
  });

  it('shows EN language switcher label when language is LT', () => {
    renderWithLanguage(<Header />);
    // When language is LT, the button label shows "EN" (switch to EN)
    const switchBtn = screen.getAllByRole('button', { name: /switch language/i })[0];
    expect(switchBtn).toHaveTextContent('EN');
  });

  it('switches to EN navigation after clicking language button', () => {
    renderWithLanguage(<Header />);
    const switchBtn = screen.getAllByRole('button', { name: /switch language/i })[0];
    fireEvent.click(switchBtn);
    // After switching, EN nav labels should appear
    expect(screen.getAllByText('Home').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Collection').length).toBeGreaterThan(0);
  });
});
