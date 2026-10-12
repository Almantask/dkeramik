// ═══════════════════════════════════════════════════════════════════════════════
// Landing-only mode
//
// While the shop is being prepared the public site shows only the
// "Laukiam kol pražys" landing page: header, footer and every other route are
// hidden, and visiting a hidden route sends the visitor back to "/".
//
// To bring the full site back, build with NEXT_PUBLIC_LANDING_ONLY=false — on
// GitHub Pages set the repository variable LANDING_ONLY=false. The Playwright
// e2e suite already runs with it off so the shop stays tested.
// ═══════════════════════════════════════════════════════════════════════════════

export const LANDING_ONLY = process.env.NEXT_PUBLIC_LANDING_ONLY !== 'false';
