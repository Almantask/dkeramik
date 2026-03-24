'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useLanguage } from '@/lib/i18n';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, t, setLanguage } = useLanguage();

  const navLinks = [
    { href: '/', label: t.nav.home },
    { href: '/about', label: t.nav.about },
    { href: '/portfolio', label: t.nav.portfolio },
    { href: '/craft', label: t.nav.craft },
    { href: '/journal', label: t.nav.journal },
  ];

  function toggleLanguage() {
    setLanguage(language === 'lt' ? 'en' : 'lt');
  }

  return (
    <header className="bg-clay-50 border-b border-clay-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-5">
          {/* Logo */}
          <Link
            href="/"
            className="font-playfair text-2xl text-clay-600 font-semibold tracking-wide"
          >
            DKeramik
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-7" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-clay-600 hover:text-clay-500 transition-colors font-nunito text-sm"
              >
                {link.label}
              </Link>
            ))}

            {/* Language switcher */}
            <button
              onClick={toggleLanguage}
              className="ml-2 text-xs font-nunito font-semibold tracking-widest text-clay-500 hover:text-clay-600 border border-clay-300 hover:border-clay-400 px-2 py-1 transition-colors"
              aria-label={`Switch language to ${t.common.languageSwitchLabel}`}
            >
              {t.common.languageSwitchLabel}
            </button>
          </nav>

          {/* Mobile: language + hamburger */}
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={toggleLanguage}
              className="text-xs font-nunito font-semibold tracking-widest text-clay-500 hover:text-clay-600 border border-clay-300 px-2 py-1 transition-colors"
              aria-label={`Switch language to ${t.common.languageSwitchLabel}`}
            >
              {t.common.languageSwitchLabel}
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-clay-600 focus:outline-none"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                {isMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <nav className="md:hidden pb-4" aria-label="Mobile navigation">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-clay-600 hover:text-clay-500 transition-colors font-nunito text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
