import { render, screen, fireEvent } from '@testing-library/react';
import AboutPage from '@/app/about/page';
import Header from '@/components/layout/Header';
import { LanguageProvider } from '@/lib/i18n';
import { lt } from '@/lib/i18n/translations.lt';
import { en } from '@/lib/i18n/translations.en';

function renderWithLanguage(ui: React.ReactElement) {
  return render(<LanguageProvider>{ui}</LanguageProvider>);
}

describe('About Page', () => {
  it('renders the LT headline by default', () => {
    renderWithLanguage(<AboutPage />);
    expect(screen.getByText(lt.about.headline)).toBeInTheDocument();
  });

  it('renders all LT section headings', () => {
    renderWithLanguage(<AboutPage />);
    expect(screen.getByText(lt.about.section1Heading)).toBeInTheDocument();
    expect(screen.getByText(lt.about.section2Heading)).toBeInTheDocument();
    expect(screen.getByText(lt.about.section3Heading)).toBeInTheDocument();
    expect(screen.getByText(lt.about.section4Heading)).toBeInTheDocument();
  });

  it('renders section 2 translated text instead of hardcoded conditionals', () => {
    renderWithLanguage(<AboutPage />);
    expect(screen.getByText(lt.about.section2Bold1)).toBeInTheDocument();
    expect(screen.getByText(lt.about.section2Bold2)).toBeInTheDocument();
  });

  it('renders section 3 translated bold text instead of hardcoded conditionals', () => {
    renderWithLanguage(<AboutPage />);
    expect(screen.getByText(lt.about.section3Bold2)).toBeInTheDocument();
  });

  it('renders the LT closing statement', () => {
    renderWithLanguage(<AboutPage />);
    expect(screen.getByText(lt.about.closing)).toBeInTheDocument();
  });

  it('switches to EN content after language toggle', () => {
    renderWithLanguage(
      <>
        <Header />
        <AboutPage />
      </>,
    );
    const switchBtn = screen.getAllByRole('button', { name: /switch language/i })[0];
    fireEvent.click(switchBtn);

    expect(screen.getByText(en.about.headline)).toBeInTheDocument();
    expect(screen.getByText(en.about.section1Heading)).toBeInTheDocument();
    expect(screen.getByText(en.about.section2Heading)).toBeInTheDocument();
    expect(screen.getByText(en.about.section3Heading)).toBeInTheDocument();
    expect(screen.getByText(en.about.section4Heading)).toBeInTheDocument();
    expect(screen.getByText(en.about.section3Bold2)).toBeInTheDocument();
    expect(screen.getByText(en.about.closing)).toBeInTheDocument();
  });
});

describe('i18n translation completeness', () => {
  it('has matching keys in both LT and EN translations', () => {
    const ltKeys = Object.keys(lt);
    const enKeys = Object.keys(en);
    expect(ltKeys.sort()).toEqual(enKeys.sort());
  });

  it('has matching about section keys in both languages', () => {
    const ltAboutKeys = Object.keys(lt.about);
    const enAboutKeys = Object.keys(en.about);
    expect(ltAboutKeys.sort()).toEqual(enAboutKeys.sort());
  });

  it('has no empty about translation values in EN', () => {
    for (const [key, value] of Object.entries(en.about)) {
      expect(value).toBeTruthy();
      if (typeof value === 'string') {
        expect(value.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it('has no empty about translation values in LT', () => {
    for (const [key, value] of Object.entries(lt.about)) {
      expect(value).toBeTruthy();
      if (typeof value === 'string') {
        expect(value.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it('has matching top-level section keys in both languages', () => {
    const ltSections = Object.keys(lt).sort();
    const enSections = Object.keys(en).sort();
    expect(ltSections).toEqual(enSections);

    for (const section of ltSections) {
      const ltSectionKeys = Object.keys((lt as Record<string, unknown>)[section] as object).sort();
      const enSectionKeys = Object.keys((en as Record<string, unknown>)[section] as object).sort();
      expect(ltSectionKeys).toEqual(enSectionKeys);
    }
  });
});
