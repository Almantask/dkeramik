import { render, screen, fireEvent } from '@testing-library/react';
import ContactPage from '@/app/contact/page';
import { LanguageProvider } from '@/lib/i18n';

function renderWithLanguage(ui: React.ReactElement) {
  return render(<LanguageProvider>{ui}</LanguageProvider>);
}

describe('Contact Page', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the LT headline by default', () => {
    renderWithLanguage(<ContactPage />);
    expect(screen.getByText('Susisiekime')).toBeInTheDocument();
  });

  it('renders the LT subheadline', () => {
    renderWithLanguage(<ContactPage />);
    expect(
      screen.getByText(/Turi klausimų/i),
    ).toBeInTheDocument();
  });

  it('renders form fields with LT labels', () => {
    renderWithLanguage(<ContactPage />);
    expect(screen.getByLabelText('Vardas')).toBeInTheDocument();
    expect(screen.getByLabelText('El. paštas')).toBeInTheDocument();
    expect(screen.getByLabelText('Žinutė')).toBeInTheDocument();
  });

  it('renders the send button in LT', () => {
    renderWithLanguage(<ContactPage />);
    expect(screen.getByRole('button', { name: 'Siųsti žinutę' })).toBeInTheDocument();
  });

  it('allows filling in form fields', () => {
    renderWithLanguage(<ContactPage />);
    const nameInput = screen.getByLabelText('Vardas') as HTMLInputElement;
    const emailInput = screen.getByLabelText('El. paštas') as HTMLInputElement;
    const messageInput = screen.getByLabelText('Žinutė') as HTMLTextAreaElement;

    fireEvent.change(nameInput, { target: { value: 'Test Name' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(messageInput, { target: { value: 'Hello!' } });

    expect(nameInput.value).toBe('Test Name');
    expect(emailInput.value).toBe('test@example.com');
    expect(messageInput.value).toBe('Hello!');
  });

  it('shows EN content after switching language', () => {
    render(
      <LanguageProvider>
        <ContactPage />
      </LanguageProvider>,
    );
    // Default is LT, switch to EN via localStorage
    localStorage.setItem('dkeramik-lang', 'en');
    // Re-render
    const { unmount } = render(
      <LanguageProvider>
        <ContactPage />
      </LanguageProvider>,
    );
    expect(screen.getByText('Get in Touch')).toBeInTheDocument();
    unmount();
  });
});
