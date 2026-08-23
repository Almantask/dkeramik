import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ShopCatalog from '@/app/shop/ShopCatalog';
import { LanguageProvider } from '@/lib/i18n';
import { CartProvider } from '@/components/shop/CartProvider';
import { API_URL } from '@/lib/shop-api';

function renderShop() {
  return render(
    <LanguageProvider>
      <CartProvider>
        <ShopCatalog />
      </CartProvider>
    </LanguageProvider>,
  );
}

const inventory = [
  {
    productId: 'morning-coffee-mug',
    sku: 'DK-CUP-001',
    priceCents: 3200,
    priceEur: 32,
    stock: 3,
    forSale: true,
  },
  {
    productId: 'sculptural-vessel',
    sku: 'DK-VASE-002',
    priceCents: 12000,
    priceEur: 120,
    stock: 0,
    forSale: false,
  },
];

describe('Shop catalog', () => {
  beforeEach(() => {
    localStorage.clear();
    global.fetch = jest.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url === `${API_URL}/api/products`) {
        return {
          ok: true,
          json: async () => ({ products: inventory }),
        } as Response;
      }
      throw new Error(`unexpected ${url}`);
    }) as jest.Mock;
  });

  it('shows live price for a for-sale piece', async () => {
    renderShop();
    expect(await screen.findByRole('heading', { name: /parduotuvė/i })).toBeInTheDocument();
    expect(await screen.findByText(/32,00/)).toBeInTheDocument();
  });

  it('does not list portfolio-only pieces', async () => {
    renderShop();
    await screen.findByText(/32,00/);
    expect(screen.queryByText(/skulptūrinis/i)).not.toBeInTheDocument();
  });

  it('adds to cart up to live stock', async () => {
    const user = userEvent.setup();
    renderShop();
    const add = await screen.findByRole('button', { name: /į krepšelį/i });
    await user.click(add);
    await user.click(add);
    await user.click(add);
    await user.click(add);
    await waitFor(() => {
      expect(JSON.parse(localStorage.getItem('dkeramik-cart') ?? '[]')[0].qty).toBe(3);
    });
  });
});
