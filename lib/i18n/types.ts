export type Language = 'lt' | 'en';

export interface NavTranslations {
  home: string;
  about: string;
  portfolio: string;
  craft: string;
  journal: string;
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
  connectHeading: string;
  copyright: string;
  links: {
    portfolio: string;
    craft: string;
    journal: string;
  };
}

export interface CommonTranslations {
  handcraftedWith: string;
  languageSwitchLabel: string;
}

export interface SiteTranslations {
  nav: NavTranslations;
  home: HomeTranslations;
  about: AboutTranslations;
  portfolio: PortfolioTranslations;
  product: ProductTranslations;
  craft: CraftTranslations;
  journal: JournalTranslations;
  footer: FooterTranslations;
  common: CommonTranslations;
}
