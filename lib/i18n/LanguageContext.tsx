'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { lt } from './translations.lt';
import { en } from './translations.en';
import type { Language, SiteTranslations } from './types';

const STORAGE_KEY = 'dkeramik-lang';
const DEFAULT_LANG: Language = 'lt';

const translationsMap: Record<Language, SiteTranslations> = { lt, en };

interface LanguageContextValue {
  language: Language;
  t: SiteTranslations;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  language: DEFAULT_LANG,
  t: lt,
  setLanguage: () => undefined,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANG);

  // Restore persisted language preference on mount (client-side only)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Language | null;
      if (stored && (stored === 'lt' || stored === 'en')) {
        setLanguageState(stored);
      }
    } catch {
      // localStorage unavailable (SSR/private mode) — use default
    }
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // localStorage unavailable — skip persistence
    }
  }, []);

  const value: LanguageContextValue = {
    language,
    t: translationsMap[language],
    setLanguage,
  };

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

/** Returns the current translation bundle and language controls. */
export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used inside <LanguageProvider>');
  }
  return ctx;
}
