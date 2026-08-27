import type { Metadata } from 'next';
// ═══════════════════════════════════════════════════════════════════════════════
// CUSTOM FONTS
//
// Fonts are self-hosted via the @fontsource npm packages — no external CDN
// requests required, so fonts work in CI/CD and offline builds.
//
// To change or add fonts:
//   1. Install the desired package:
//        npm install @fontsource/<font-name>
//      Browse available fonts at https://fontsource.org
//
//   2. Import the weight/style CSS files below (e.g. 600.css for bold).
//
//   3. Update the font-family stacks in tailwind.config.ts
//      (theme.extend.fontFamily) and globals.css body/h1-h6 rules
//      to reference the new font name.
//
// Current fonts:
//   • Headings  → Playfair Display  (elegant serif)
//   • Body text → Nunito            (rounded humanist sans-serif)
//   • Home page → Lato              (clean sans-serif, used on home body text)
// ═══════════════════════════════════════════════════════════════════════════════

// Playfair Display — serif for headings
import '@fontsource/playfair-display/400.css';
import '@fontsource/playfair-display/400-italic.css';
import '@fontsource/playfair-display/500.css';
import '@fontsource/playfair-display/600.css';
import '@fontsource/playfair-display/700.css';

// Nunito — rounded humanist sans-serif for body text
import '@fontsource/nunito/300.css';
import '@fontsource/nunito/400.css';
import '@fontsource/nunito/500.css';
import '@fontsource/nunito/600.css';
import '@fontsource/nunito/700.css';

// Lato — clean sans-serif for home page body text
import '@fontsource/lato/300.css';
import '@fontsource/lato/400.css';
import '@fontsource/lato/700.css';

import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { LanguageProvider } from '@/lib/i18n';
import { CartProvider } from '@/components/shop/CartProvider';

export const metadata: Metadata = {
  title: 'DKeramik — rankų darbo keramika Tavo namams',
  description:
    'Gražūs rankų darbo keramikos kūriniai, atsinešantys šilumą ir širdžiai mielas detales į Tavo namus.',
  referrer: 'no-referrer',
};

const apiOrigin = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8787').replace(/\/$/, '');
const shopCsp = [
  "default-src 'self'",
  "img-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  `connect-src 'self' ${apiOrigin} https:`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="lt">
      <head>
        <meta httpEquiv="Content-Security-Policy" content={shopCsp} />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      </head>
      <body className="font-nunito antialiased">
        <LanguageProvider>
          <CartProvider>
            <Header />
            <main>{children}</main>
            <Footer />
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
