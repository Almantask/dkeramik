import { render, screen, fireEvent } from '@testing-library/react';
import ContactPage from '@/app/contact/page';
import Header from '@/components/layout/Header';
import { LanguageProvider } from '@/lib/i18n';
import { lt } from '@/lib/i18n/translations.lt';
import { en } from '@/lib/i18n/translations.en';

function renderWithLanguage(ui: React.ReactElement) {
  return render(<LanguageProvider>{ui}</LanguageProvider>);
}

describe('Contact Page', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the LT headline by default', () => {
    renderWithLanguage(<ContactPage />);
    expect(screen.getByText(lt.contact.headline)).toBeInTheDocument();
  });

  it('renders social link text from translations in LT', () => {
    renderWithLanguage(<ContactPage />);
    expect(screen.getByText(lt.contact.socialInstagram)).toBeInTheDocument();
    expect(screen.getByText(lt.contact.socialPinterest)).toBeInTheDocument();
  });

  it('renders social link text from translations in EN', () => {
    renderWithLanguage(
      <>
        <Header />
        <ContactPage />
      </>,
    );
    const switchBtn = screen.getAllByRole('button', { name: /switch language/i })[0];
    fireEvent.click(switchBtn);
    expect(screen.getByText(en.contact.socialInstagram)).toBeInTheDocument();
    expect(screen.getByText(en.contact.socialPinterest)).toBeInTheDocument();
  });

  it('renders all contact sections from translations', () => {
    renderWithLanguage(<ContactPage />);
    expect(screen.getByText(lt.contact.emailLabel)).toBeInTheDocument();
    expect(screen.getByText(lt.contact.studioLabel)).toBeInTheDocument();
    expect(screen.getByText(lt.contact.socialHeading)).toBeInTheDocument();
    expect(screen.getByText(lt.contact.closing)).toBeInTheDocument();
  });
});
