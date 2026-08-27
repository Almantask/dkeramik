import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CheckoutPage from '@/app/checkout/page';
import { LanguageProvider } from '@/lib/i18n';
import { CartProvider } from '@/components/shop/CartProvider';
import { API_URL } from '@/lib/shop-api';

const push = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}));

function renderCheckout() {
  localStorage.setItem(
    'dkeramik-cart',
    JSON.stringify([{ productId: 'morning-coffee-mug', qty: 1 }]),
  );
  return render(
    <LanguageProvider>
      <CartProvider>
        <CheckoutPage />
      </CartProvider>
    </LanguageProvider>,
  );
}

describe('Checkout', () => {
  beforeEach(() => {
    push.mockReset();
    global.fetch = jest.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      if (url.endsWith('/api/products')) {
        return {
          ok: true,
          json: async () => ({
            products: [
              {
                productId: 'morning-coffee-mug',
                sku: 'DK-CUP-001',
                priceCents: 3200,
                priceEur: 32,
                stock: 3,
                forSale: true,
              },
            ],
          }),
        } as Response;
      }
      if (url.endsWith('/api/settings')) {
        return {
          ok: true,
          json: async () => ({
            iban: 'LT000000000000000000',
            pickupAddress: 'Kaunas',
            shippingLtCents: 450,
            sellerName: 'DKeramik',
            currency: 'EUR',
          }),
        } as Response;
      }
      if (url.endsWith('/api/orders') && init?.method === 'POST') {
        const body = JSON.parse(String(init.body));
        expect(body.items[0].productId).toBe('morning-coffee-mug');
        expect(body.delivery).toBe('pickup');
        return {
          ok: true,
          json: async () => ({
            orderId: 'ord_1',
            invoiceNumber: 'DK-2026-0001',
            token: 'tok',
            amountCents: 3200,
            payUrl: 'http://localhost:8787/mock-pay/ord_1',
          }),
        } as Response;
      }
      throw new Error(url);
    }) as jest.Mock;
  });

  it('marks name, email and phone as mandatory', async () => {
    renderCheckout();
    await screen.findByRole('button', { name: /pateikti užsakymą/i });
    expect(screen.getByText(/privalomi laukai pažymėti \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/vardas/i)).toBeRequired();
    expect(screen.getByLabelText(/el\. paštas/i)).toBeRequired();
    expect(screen.getByLabelText(/telefonas/i)).toBeRequired();
    expect(screen.getByLabelText(/vardas/i).closest('label')).toHaveTextContent(/\*/);
    expect(screen.getByLabelText(/el\. paštas/i).closest('label')).toHaveTextContent(/\*/);
    expect(screen.getByLabelText(/telefonas/i).closest('label')).toHaveTextContent(/\*/);
  });

  it('marks address fields as mandatory when shipping is selected', async () => {
    const user = userEvent.setup();
    renderCheckout();
    await screen.findByRole('button', { name: /pateikti užsakymą/i });
    await user.click(screen.getByRole('radio', { name: /siuntimas lietuvoje/i }));
    expect(screen.getByLabelText(/adresas/i)).toBeRequired();
    expect(screen.getByLabelText(/miestas/i)).toBeRequired();
    expect(screen.getByLabelText(/pašto kodas/i)).toBeRequired();
    expect(screen.getByLabelText(/adresas/i).closest('label')).toHaveTextContent(/\*/);
    expect(screen.getByLabelText(/miestas/i).closest('label')).toHaveTextContent(/\*/);
    expect(screen.getByLabelText(/pašto kodas/i).closest('label')).toHaveTextContent(/\*/);
  });

  it('posts an order and goes to confirmation', async () => {
    const user = userEvent.setup();
    renderCheckout();
    const submit = await screen.findByRole('button', { name: /pateikti užsakymą/i });
    await user.type(screen.getByLabelText(/vardas/i), 'Jonas');
    await user.type(screen.getByLabelText(/el\. paštas/i), 'jonas@example.com');
    await user.type(screen.getByLabelText(/telefonas/i), '+37060000000');
    await user.click(submit);
    await waitFor(() => {
      expect(push).toHaveBeenCalledWith(
        expect.stringContaining('/checkout/confirmation#orderId=ord_1'),
      );
    });
  });

  it('shows a stock error when the API rejects the cart', async () => {
    (global.fetch as jest.Mock).mockImplementation(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      if (url.endsWith('/api/products')) {
        return {
          ok: true,
          json: async () => ({
            products: [
              {
                productId: 'morning-coffee-mug',
                sku: 'DK-CUP-001',
                priceCents: 3200,
                priceEur: 32,
                stock: 0,
                forSale: true,
              },
            ],
          }),
        } as Response;
      }
      if (url.endsWith('/api/settings')) {
        return {
          ok: true,
          json: async () => ({
            iban: 'LT00',
            pickupAddress: 'Kaunas',
            shippingLtCents: 450,
            sellerName: 'DKeramik',
            currency: 'EUR',
          }),
        } as Response;
      }
      if (url.endsWith('/api/orders')) {
        return { ok: false, status: 409, json: async () => ({ error: 'insufficient_stock' }) } as Response;
      }
      throw new Error(url);
    });
    renderCheckout();
    expect(await screen.findByText(/krepšelis tuščias/i)).toBeInTheDocument();
  });
});
