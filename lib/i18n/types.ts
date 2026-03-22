export type Language = 'lt' | 'en';

export interface NavTranslations {
  home: string;
  about: string;
  collection: string;
  craft: string;
  journal: string;
  customOrders: string;
  contact: string;
}

export interface HomeTranslations {
  headline: string;
  introParagraph1Part1: string;
  introBold1: string;
  introParagraph1Part2: string;
  introBold2: string;
  introParagraph1Part3: string;
  introBold3: string;
  introParagraph1Part4: string;
  introBold4: string;
  introParagraph1Part5: string;
  introParagraph2: string;
  introParagraph3Part1: string;
  introParagraph3Bold: string;
  introParagraph3Part2: string;
  introParagraph4: string;
  signature: string;
  invitation: string;
  closing: string;
  ctaCollection: string;
  ctaAbout: string;
}

export interface AboutTranslations {
  headline: string;
  subheadline: string;
  section1Heading: string;
  section1Body: string;
  section1Bold: string;
  section2Heading: string;
  section2Body: string;
  section2Bold1: string;
  section2Bold2: string;
  section3Heading: string;
  section3Body: string;
  section3Bold: string;
  section4Heading: string;
  section4Body: string;
  section4Bold: string;
  closing: string;
}

export interface CollectionTranslations {
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
  closingBody: string;
  backToCollection: string;
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

export interface CustomOrdersTranslations {
  headline: string;
  subheadline: string;
  intro1: string;
  intro2Part1: string;
  intro2Bold: string;
  intro2Part2: string;
  whatHeading: string;
  whatItems: string[];
  processHeading: string;
  processSteps: string[];
  formNameLabel: string;
  formNamePlaceholder: string;
  formEmailLabel: string;
  formEmailPlaceholder: string;
  formMessageLabel: string;
  formMessagePlaceholder: string;
  formSubmit: string;
  formSuccessTitle: string;
  formSuccessBody: string;
  closing: string;
}

export interface ContactTranslations {
  headline: string;
  subheadline: string;
  intro: string;
  emailLabel: string;
  studioLabel: string;
  studioValue: string;
  socialHeading: string;
  closing: string;
}

export interface FooterTranslations {
  tagline: string;
  exploreHeading: string;
  connectHeading: string;
  copyright: string;
  links: {
    collection: string;
    craft: string;
    journal: string;
    customOrders: string;
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
  collection: CollectionTranslations;
  product: ProductTranslations;
  craft: CraftTranslations;
  journal: JournalTranslations;
  customOrders: CustomOrdersTranslations;
  contact: ContactTranslations;
  footer: FooterTranslations;
  common: CommonTranslations;
}
