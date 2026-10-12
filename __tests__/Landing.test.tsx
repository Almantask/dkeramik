import { render, screen } from '@testing-library/react';
import Home from '@/app/page';
import SiteShell from '@/components/layout/SiteShell';
import { LanguageProvider } from '@/lib/i18n';
import { CartProvider } from '@/components/shop/CartProvider';

const replace = jest.fn();
let pathname = '/';

jest.mock('next/navigation', () => ({
  usePathname: () => pathname,
  useRouter: () => ({ replace }),
}));

function renderInShell(ui: React.ReactElement) {
  return render(
    <LanguageProvider>
      <CartProvider>
        <SiteShell>{ui}</SiteShell>
      </CartProvider>
    </LanguageProvider>,
  );
}

describe('Landing-only mode (default)', () => {
  beforeEach(() => {
    replace.mockClear();
    pathname = '/';
  });

  it('shows the "Laukiam kol pražys" landing on the home route', () => {
    render(<Home />);
    expect(screen.getByRole('heading', { level: 1, name: 'Laukiam kol pražys' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /aguona/i })).toBeInTheDocument();
  });

  it('paints the bloom, pod, seeds and sprouts', () => {
    const { container } = render(<Home />);
    // next/jest maps CSS-module class names to their keys.
    expect(container.querySelectorAll('.seed')).toHaveLength(12);
    expect(container.querySelectorAll('.sprout')).toHaveLength(6);
  });

  it('hides the header and footer navigation', () => {
    renderInShell(<Home />);
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
    expect(screen.queryByText('Parduotuvė')).not.toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });

  it('hides every other page and sends visitors back to the landing', () => {
    pathname = '/shop';
    renderInShell(<p>Shop catalog</p>);
    expect(screen.queryByText('Shop catalog')).not.toBeInTheDocument();
    expect(replace).toHaveBeenCalledWith('/');
  });
});
