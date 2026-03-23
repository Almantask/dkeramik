export interface BilingualText {
  lt: string;
  en: string;
}

export interface Product {
  id: string;
  /** Category key maps to PortfolioTranslations keys */
  categoryKey: 'categoryBowls' | 'categoryCups' | 'categoryVases' | 'categorySmallDecor';
  name: BilingualText;
  image: string;
  gallery?: string[];
  description: BilingualText;
  dimensions: string;
  material: BilingualText;
  care: BilingualText;
}

// ─── Inline SVG placeholders (clay-palette coloured) ────────────────────────

const bowlSVG = `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="100" cy="98" rx="62" ry="12" fill="#d4b896" opacity="0.4"/>
  <path d="M 38 80 Q 38 140, 100 150 Q 162 140, 162 80 L 154 80 Q 154 132, 100 141 Q 46 132, 46 80 Z" fill="#d4b896"/>
  <ellipse cx="100" cy="80" rx="62" ry="12" fill="#c19572"/>
  <ellipse cx="100" cy="80" rx="50" ry="8" fill="#e8d5c0"/>
</svg>`;

const cupSVG = `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <rect x="65" y="65" width="72" height="82" rx="8" fill="#d4b896"/>
  <rect x="72" y="72" width="58" height="68" rx="5" fill="#e8d5c0"/>
  <path d="M 137 88 Q 155 88, 155 108 Q 155 128, 137 128" fill="none" stroke="#c19572" stroke-width="5" stroke-linecap="round"/>
  <ellipse cx="101" cy="65" rx="36" ry="7" fill="#c19572"/>
</svg>`;

const vaseSVG = `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <path d="M 78 60 Q 68 80, 68 105 L 68 150 Q 68 168, 84 172 L 116 172 Q 132 168, 132 150 L 132 105 Q 132 80, 122 60 Z" fill="#d4b896"/>
  <path d="M 80 62 Q 72 80, 72 104 L 72 148 Q 72 164, 86 168 L 114 168 Q 128 164, 128 148 L 128 104 Q 128 80, 120 62 Z" fill="#e8d5c0"/>
  <rect x="76" y="48" width="48" height="16" rx="4" fill="#c19572"/>
  <rect x="80" y="52" width="40" height="8" rx="3" fill="#e8d5c0"/>
</svg>`;

const vesselSVG = `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="100" cy="105" rx="68" ry="78" fill="#d4b896"/>
  <ellipse cx="100" cy="90" rx="55" ry="60" fill="#e8d5c0"/>
  <rect x="82" y="38" width="36" height="18" rx="4" fill="#c19572"/>
  <rect x="86" y="42" width="28" height="10" rx="3" fill="#e8d5c0"/>
</svg>`;

// ─── Gallery detail SVG placeholders ─────────────────────────────────────────

const bowlDetailSVG = `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="100" cy="110" rx="70" ry="14" fill="#d4b896" opacity="0.3"/>
  <path d="M 30 90 Q 30 155, 100 168 Q 170 155, 170 90 L 160 90 Q 160 145, 100 158 Q 40 145, 40 90 Z" fill="#c19572"/>
  <ellipse cx="100" cy="90" rx="70" ry="14" fill="#d4b896"/>
  <ellipse cx="100" cy="90" rx="56" ry="9" fill="#e8d5c0"/>
  <line x1="60" y1="120" x2="140" y2="120" stroke="#b8845a" stroke-width="1" opacity="0.4"/>
  <line x1="65" y1="135" x2="135" y2="135" stroke="#b8845a" stroke-width="1" opacity="0.3"/>
</svg>`;

const cupDetailSVG = `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <rect x="55" y="55" width="82" height="95" rx="10" fill="#c19572"/>
  <rect x="62" y="62" width="68" height="80" rx="7" fill="#e8d5c0"/>
  <path d="M 137 75 Q 160 75, 160 100 Q 160 125, 137 125" fill="none" stroke="#d4b896" stroke-width="6" stroke-linecap="round"/>
  <ellipse cx="96" cy="55" rx="41" ry="8" fill="#b8845a"/>
  <line x1="75" y1="85" x2="117" y2="85" stroke="#d4b896" stroke-width="1" opacity="0.5"/>
</svg>`;

const vaseDetailSVG = `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <path d="M 72 55 Q 60 78, 60 108 L 60 155 Q 60 175, 80 180 L 120 180 Q 140 175, 140 155 L 140 108 Q 140 78, 128 55 Z" fill="#c19572"/>
  <path d="M 75 58 Q 65 78, 65 106 L 65 152 Q 65 170, 82 175 L 118 175 Q 135 170, 135 152 L 135 106 Q 135 78, 125 58 Z" fill="#e8d5c0"/>
  <rect x="70" y="42" width="60" height="18" rx="5" fill="#b8845a"/>
  <rect x="75" y="47" width="50" height="9" rx="3" fill="#e8d5c0"/>
  <ellipse cx="100" cy="120" rx="25" ry="3" fill="#d4b896" opacity="0.3"/>
</svg>`;

const vesselDetailSVG = `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="100" cy="110" rx="74" ry="82" fill="#c19572"/>
  <ellipse cx="100" cy="95" rx="60" ry="65" fill="#e8d5c0"/>
  <rect x="78" y="34" width="44" height="22" rx="5" fill="#b8845a"/>
  <rect x="83" y="39" width="34" height="12" rx="4" fill="#e8d5c0"/>
  <ellipse cx="100" cy="115" rx="30" ry="4" fill="#d4b896" opacity="0.3"/>
</svg>`;

// ─── Product data ────────────────────────────────────────────────────────────

export const products: Product[] = [
  {
    id: 'rustic-dinner-bowl',
    categoryKey: 'categoryBowls',
    name: { lt: 'Vakarienės dubenėlis', en: 'Rustic Dinner Bowl' },
    image: bowlSVG,
    gallery: [bowlDetailSVG, vesselDetailSVG],
    description: {
      lt: 'Dubenėlis, kuriame telpa daugiau nei maistas – jame telpa susitikimo šiluma ir dalijimosi džiaugsmas. Kiekviena forma rankų liesta, kiekviena glazūra unikali.',
      en: 'A bowl that holds more than food — it holds the warmth of gathering and the joy of sharing. Each curve shaped by hand, each glaze unique.',
    },
    dimensions: '20 cm × 7 cm',
    material: {
      lt: 'Akmens masės molis su natūralia glazūra',
      en: 'Stoneware clay with natural glaze',
    },
    care: {
      lt: 'Galima plauti indaplovėje, tačiau rankinis plovimas išsaugo grožį ilgiau',
      en: 'Dishwasher safe, though hand washing preserves the beauty longer',
    },
  },
  {
    id: 'morning-coffee-mug',
    categoryKey: 'categoryCups',
    name: { lt: 'Ryto puodelis', en: 'Morning Coffee Mug' },
    image: cupSVG,
    gallery: [cupDetailSVG, bowlDetailSVG],
    description: {
      lt: 'Tavo rankos apglėbia šilumą. Tobulas svoris, tobula kreivė. Mažas kasdieninis malonumas, suteikiantis rytams intencijos.',
      en: 'Your hands wrapped around warmth. The perfect weight, the perfect curve. A small daily pleasure that makes mornings feel intentional.',
    },
    dimensions: '9 cm × 10 cm, ~350 ml',
    material: {
      lt: 'Akmens masė su matine glazūra',
      en: 'Stoneware with satin matte glaze',
    },
    care: {
      lt: 'Galima naudoti mikrobangų krosnelėje ir indaplovėje',
      en: 'Microwave and dishwasher safe',
    },
  },
  {
    id: 'petite-bud-vase',
    categoryKey: 'categoryVases',
    name: { lt: 'Mažytė vazutė', en: 'Petite Bud Vase' },
    image: vaseSVG,
    gallery: [vaseDetailSVG, cupDetailSVG],
    description: {
      lt: 'Viena šakelė tampa poezija. Ši subtili vazutė įneša gamtą į vidų, paverčia mažiausią detalę kažkuo vertu pastebėjimo.',
      en: 'A single stem becomes poetry. This delicate vase brings nature indoors, transforming the smallest detail into something worth noticing.',
    },
    dimensions: '7 cm × 15 cm',
    material: {
      lt: 'Porcelianas su kreminės spalvos glazūra',
      en: 'Porcelain with soft cream glaze',
    },
    care: {
      lt: 'Rekomenduojamas rankinis plovimas',
      en: 'Hand wash recommended',
    },
  },
  {
    id: 'sculptural-vessel',
    categoryKey: 'categoryVases',
    name: { lt: 'Skulptūrinis indas', en: 'Sculptural Vessel' },
    image: vesselSVG,
    gallery: [vesselDetailSVG, vaseDetailSVG],
    description: {
      lt: 'Menas ir funkcija susipina. Šis kūrinys gražiai stovi tuščias ar pripildytas – meditacija apie formą, traukianti žvilgsnį ir raminanti dvasią.',
      en: 'Art and function intertwined. This piece stands beautifully empty or filled — a meditation on form that draws the eye and soothes the spirit.',
    },
    dimensions: '12 cm × 20 cm',
    material: {
      lt: 'Akmens masė su sluoksniuota glazūra',
      en: 'Stoneware with layered glazes',
    },
    care: {
      lt: 'Valyti minkštu skudurėliu',
      en: 'Wipe clean with soft cloth',
    },
  },
  {
    id: 'nesting-bowls-set',
    categoryKey: 'categoryBowls',
    name: { lt: 'Trijų dubenėlių rinkinys', en: 'Nesting Bowls Set' },
    image: bowlSVG,
    gallery: [bowlDetailSVG, cupDetailSVG],
    description: {
      lt: 'Trys dubenėliai, kurie susideda vienas į kitą tarsi paslaptis. Patiekti, maišyti, laikyti namų ingredientus.',
      en: 'Three bowls that nestle together like a secret. For serving, for mixing, for holding the ingredients of home.',
    },
    dimensions: 'M: 13 cm, V: 18 cm, D: 23 cm',
    material: {
      lt: 'Akmens masė su suderintomis glazūromis',
      en: 'Stoneware with coordinating glazes',
    },
    care: {
      lt: 'Galima naudoti indaplovėje ir orkaitėje',
      en: 'Dishwasher and oven safe',
    },
  },
  {
    id: 'tea-cup-pair',
    categoryKey: 'categoryCups',
    name: { lt: 'Arbatos puodelių pora', en: 'Tea Cup Pair' },
    image: cupSVG,
    gallery: [cupDetailSVG, vaseDetailSVG],
    description: {
      lt: 'Bendriems momentams. Du puodeliai, priklausantys vienas kitam, kiekvienas šiek tiek unikalus – kaip geriausia draugystė.',
      en: 'For shared moments. Two cups that belong together, each slightly unique, like the best friendships.',
    },
    dimensions: '8 cm × 8 cm kiekvienas',
    material: {
      lt: 'Porcelianas su subtilia krašto apvyla',
      en: 'Porcelain with delicate rim detail',
    },
    care: {
      lt: 'Rankinis plovimas išsaugo subtilias detales',
      en: 'Hand wash to preserve delicate details',
    },
  },
  {
    id: 'speckled-planter',
    categoryKey: 'categorySmallDecor',
    name: { lt: 'Dėmėtas vazonėlis', en: 'Speckled Planter' },
    image: vesselSVG,
    gallery: [vesselDetailSVG, bowlDetailSVG],
    description: {
      lt: 'Kur auga gyvybė. Namai sukulentams, žolelėms ar mažiems žiedams. Dėmėta glazūra primena, kad netobulumas yra gražus.',
      en: 'Where life grows. A home for succulents, herbs, or small blooms. The speckled glaze reminds us that imperfection is beautiful.',
    },
    dimensions: '11 cm × 10 cm',
    material: {
      lt: 'Akmens masė su drenažo anga',
      en: 'Stoneware with drainage hole',
    },
    care: {
      lt: 'Tinka naudoti viduje ir lauke',
      en: 'Suitable for indoor and outdoor use',
    },
  },
  {
    id: 'candle-holder-trio',
    categoryKey: 'categorySmallDecor',
    name: { lt: 'Žvakidžių trijulė', en: 'Candle Holder Trio' },
    image: vesselSVG,
    gallery: [vesselDetailSVG, vaseDetailSVG],
    description: {
      lt: 'Šviesa tampa atmosfera. Trys skirtingo aukščio žvakidės ant bet kurio paviršiaus sukuria šilumos kraštovaizdį.',
      en: 'Light becomes atmosphere. Three holders of varying heights create a landscape of warmth on any surface.',
    },
    dimensions: 'Aukščiai: 5 cm, 8 cm, 10 cm',
    material: {
      lt: 'Akmens masė su matiniu paviršiumi',
      en: 'Stoneware with matte finish',
    },
    care: {
      lt: 'Valyti drėgnu skudurėliu',
      en: 'Wipe clean with damp cloth',
    },
  },
];

// Category filter keys used in the portfolio page
export const categoryKeys = [
  'categoryAll',
  'categoryBowls',
  'categoryCups',
  'categoryVases',
  'categorySmallDecor',
] as const;

export type CategoryKey = typeof categoryKeys[number];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByCategoryKey(key: CategoryKey): Product[] {
  if (key === 'categoryAll') return products;
  return products.filter((p) => p.categoryKey === key);
}
