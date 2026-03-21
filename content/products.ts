const ceramicVesselSVG = `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><ellipse cx="100" cy="100" rx="60" ry="70" fill="#d4b896"/><ellipse cx="100" cy="90" rx="50" ry="55" fill="#e8d5c0"/><rect x="85" y="40" width="30" height="15" rx="3" fill="#c19572"/></svg>`;

const ceramicBowlSVG = `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path d="M 50 80 Q 50 120, 100 130 Q 150 120, 150 80 L 145 80 Q 145 115, 100 123 Q 55 115, 55 80 Z" fill="#d4b896"/><ellipse cx="100" cy="80" rx="45" ry="8" fill="#c19572"/></svg>`;

const ceramicCupSVG = `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect x="70" y="70" width="60" height="70" rx="5" fill="#e8d5c0"/><rect x="75" y="75" width="50" height="60" rx="3" fill="#f5ebe0"/><path d="M 130 90 Q 145 90, 145 105 Q 145 120, 130 120" fill="none" stroke="#c19572" stroke-width="4"/></svg>`;

const ceramicVaseSVG = `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path d="M 80 60 Q 75 70, 75 90 L 75 140 Q 75 160, 90 165 L 110 165 Q 125 160, 125 140 L 125 90 Q 125 70, 120 60 Z" fill="#d4b896"/><rect x="75" y="50" width="50" height="15" rx="3" fill="#c19572"/></svg>`;

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  dimensions: string;
  material: string;
  care: string;
}

export const products: Product[] = [
  {
    id: 'rustic-dinner-bowl',
    name: 'Rustic Dinner Bowl',
    category: 'Bowls',
    price: 48,
    image: ceramicBowlSVG,
    description: 'A bowl that holds more than food—it holds the ritual of gathering, the warmth of sharing. Each curve shaped by hand, each glaze unique.',
    dimensions: '8" diameter × 3" height',
    material: 'Stoneware clay with natural glaze',
    care: 'Dishwasher safe, though hand washing preserves the beauty longer',
  },
  {
    id: 'morning-coffee-mug',
    name: 'Morning Coffee Mug',
    category: 'Cups',
    price: 32,
    image: ceramicCupSVG,
    description: 'Your hands wrapped around warmth. The perfect weight, the perfect curve. A small daily pleasure that makes mornings feel intentional.',
    dimensions: '3.5" diameter × 4" height, holds 12oz',
    material: 'Stoneware with satin matte glaze',
    care: 'Microwave and dishwasher safe',
  },
  {
    id: 'petite-bud-vase',
    name: 'Petite Bud Vase',
    category: 'Vases',
    price: 36,
    image: ceramicVaseSVG,
    description: 'A single stem becomes poetry. This delicate vase brings nature indoors, transforming the smallest detail into something worth noticing.',
    dimensions: '3" diameter × 6" height',
    material: 'Porcelain with soft cream glaze',
    care: 'Hand wash recommended',
  },
  {
    id: 'sculptural-vessel',
    name: 'Sculptural Vessel',
    category: 'Vases',
    price: 64,
    image: ceramicVesselSVG,
    description: 'Art and function intertwined. This piece stands beautifully empty or filled, a meditation on form that draws the eye and soothes the spirit.',
    dimensions: '5" diameter × 8" height',
    material: 'Stoneware with layered glazes',
    care: 'Wipe clean with soft cloth',
  },
  {
    id: 'nesting-bowls-set',
    name: 'Nesting Bowls Set',
    category: 'Bowls',
    price: 112,
    image: ceramicBowlSVG,
    description: 'Three bowls that nestle together like a secret. For serving, for mixing, for holding the ingredients of home.',
    dimensions: 'Small: 5", Medium: 7", Large: 9" diameter',
    material: 'Stoneware with coordinating glazes',
    care: 'Dishwasher and oven safe',
  },
  {
    id: 'tea-cup-pair',
    name: 'Tea Cup Pair',
    category: 'Cups',
    price: 58,
    image: ceramicCupSVG,
    description: 'For shared moments. Two cups that belong together, each slightly unique, like the best friendships.',
    dimensions: '3" diameter × 3" height each',
    material: 'Porcelain with delicate rim',
    care: 'Hand wash to preserve delicate details',
  },
  {
    id: 'speckled-planter',
    name: 'Speckled Planter',
    category: 'Small Decor',
    price: 42,
    image: ceramicVesselSVG,
    description: 'Where life grows. A home for succulents, herbs, or small blooms. The speckled glaze reminds us that imperfection is beautiful.',
    dimensions: '4.5" diameter × 4" height',
    material: 'Stoneware with drainage hole',
    care: 'Suitable for indoor and outdoor use',
  },
  {
    id: 'candle-holder-trio',
    name: 'Candle Holder Trio',
    category: 'Small Decor',
    price: 54,
    image: ceramicVesselSVG,
    description: 'Light becomes atmosphere. Three holders of varying heights create a landscape of warmth on any surface.',
    dimensions: 'Heights: 2", 3", 4"',
    material: 'Stoneware with matte finish',
    care: 'Wipe clean',
  },
];

export const categories = [
  'All',
  'Bowls',
  'Cups',
  'Vases',
  'Small Decor',
];

export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  if (category === 'All') return products;
  return products.filter(p => p.category === category);
}
