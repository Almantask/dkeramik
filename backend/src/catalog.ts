import type { InventoryRecord } from './domain.js';

/** Seed rows — productId values must match content/products.ts */
export const DEFAULT_INVENTORY_SEED: InventoryRecord[] = [
  { productId: 'rustic-dinner-bowl', sku: 'DK-BOWL-001', priceCents: 4500, stock: 2, forSale: true },
  { productId: 'morning-coffee-mug', sku: 'DK-CUP-001', priceCents: 3200, stock: 3, forSale: true },
  { productId: 'petite-bud-vase', sku: 'DK-VASE-001', priceCents: 2800, stock: 1, forSale: true },
  { productId: 'sculptural-vessel', sku: 'DK-VASE-002', priceCents: 12000, stock: 0, forSale: false },
  { productId: 'nesting-bowls-set', sku: 'DK-BOWL-002', priceCents: 8500, stock: 1, forSale: true },
  { productId: 'tea-cup-pair', sku: 'DK-CUP-002', priceCents: 4800, stock: 2, forSale: true },
  { productId: 'speckled-planter', sku: 'DK-DECOR-001', priceCents: 3600, stock: 2, forSale: true },
  { productId: 'candle-holder-trio', sku: 'DK-DECOR-002', priceCents: 4200, stock: 1, forSale: true },
];

export const PRODUCT_NAMES: Record<string, { lt: string; en: string }> = {
  'rustic-dinner-bowl': { lt: 'Vakarienės dubenėlis', en: 'Rustic Dinner Bowl' },
  'morning-coffee-mug': { lt: 'Ryto puodelis', en: 'Morning Coffee Mug' },
  'petite-bud-vase': { lt: 'Mažytė vazutė', en: 'Petite Bud Vase' },
  'sculptural-vessel': { lt: 'Skulptūrinis indas', en: 'Sculptural Vessel' },
  'nesting-bowls-set': { lt: 'Trijų dubenėlių rinkinys', en: 'Nesting Bowls Set' },
  'tea-cup-pair': { lt: 'Arbatos puodelių pora', en: 'Tea Cup Pair' },
  'speckled-planter': { lt: 'Dėmėtas vazonėlis', en: 'Speckled Planter' },
  'candle-holder-trio': { lt: 'Žvakidžių trijulė', en: 'Candle Holder Trio' },
};
