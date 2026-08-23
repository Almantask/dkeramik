export type Language = 'lt' | 'en';

export interface NavTranslations {
  home: string;
  about: string;
  portfolio: string;
  shop: string;
  cart: string;
  craft: string;
  journal: string;
  contact: string;
}

export interface HomeTranslations {
  headline: string;
  introText: string;
  ctaPortfolio: string;
  ctaAbout: string;
}

export interface AboutTranslations {
  quote: string;
  greeting: string;
  story: string;
  mission: string;
  journey: string;
  inspiration: string;
  hope: string;
  contactPrompt: string;
  contactLinkText: string;
}

export interface PortfolioTranslations {
  headline: string;
  subheadline: string;
  categoryAll: string;
  categoryBowls: string;
  categoryCups: string;
  categoryVases: string;
  categorySmallDecor: string;
  categoryKeepsakes: string;
  categorySeasonal: string;
  emptyState: string;
}

export interface ProductTranslations {
  categoryLabel: string;
  dimensionsLabel: string;
  materialLabel: string;
  careLabel: string;
  handmadeNoteTitle: string;
  handmadeNoteBody: string;
  backToPortfolio: string;
}

export interface CraftStep {
  title: string;
  description: string;
}

export interface CraftTranslations {
  headline: string;
  subheadline: string;
  intro: string;
  steps: CraftStep[];
  processLabels: string[];
  closing: string;
}

export interface JournalEntry {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  body: string[];
}

export interface JournalTranslations {
  headline: string;
  subheadline: string;
  readMore: string;
  backToJournal: string;
  entries: JournalEntry[];
}

export interface FooterTranslations {
  tagline: string;
  exploreHeading: string;
  contactHeading: string;
  contactPrompt: string;
  contactEmail: string;
  copyright: string;
  links: {
    portfolio: string;
    shop: string;
    about: string;
    journal: string;
    terms: string;
    returns: string;
    privacy: string;
  };
}

export interface CommonTranslations {
  handcraftedWith: string;
  languageSwitchLabel: string;
}

export interface ContactTranslations {
  headline: string;
  subheadline: string;
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  messageLabel: string;
  messagePlaceholder: string;
  sendButton: string;
  successMessage: string;
}

export interface ShopTranslations {
  title: string;
  intro: string;
  price: string;
  stock: string;
  inStock: string;
  soldOut: string;
  addToCart: string;
  addedToCart: string;
  viewCart: string;
  backToShop: string;
  apiUnavailable: string;
  notForSale: string;
}

export interface CartTranslations {
  title: string;
  empty: string;
  quantity: string;
  remove: string;
  subtotal: string;
  checkout: string;
  continueShopping: string;
  stockCap: string;
}

export interface CheckoutTranslations {
  title: string;
  name: string;
  email: string;
  phone: string;
  delivery: string;
  pickup: string;
  pickupHint: string;
  shipping: string;
  shippingHint: string;
  international: string;
  address: string;
  city: string;
  postalCode: string;
  submit: string;
  submitting: string;
  errorStock: string;
  errorGeneric: string;
  mailtoFallback: string;
  shippingTotal: string;
}

export interface ConfirmationTranslations {
  title: string;
  pending: string;
  paid: string;
  invoice: string;
  amount: string;
  payCta: string;
  iban: string;
  purpose: string;
  rights: string;
  downloadInvoice: string;
  loading: string;
  notFound: string;
}

export interface LegalTranslations {
  termsTitle: string;
  termsBody: string[];
  returnsTitle: string;
  returnsBody: string[];
  privacyTitle: string;
  privacyBody: string[];
}

export interface SiteTranslations {
  nav: NavTranslations;
  home: HomeTranslations;
  about: AboutTranslations;
  portfolio: PortfolioTranslations;
  product: ProductTranslations;
  shop: ShopTranslations;
  cart: CartTranslations;
  checkout: CheckoutTranslations;
  confirmation: ConfirmationTranslations;
  legal: LegalTranslations;
  craft: CraftTranslations;
  journal: JournalTranslations;
  contact: ContactTranslations;
  footer: FooterTranslations;
  common: CommonTranslations;
}
