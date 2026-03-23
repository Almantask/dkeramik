'use client';

import Link from 'next/link';
import CeramicBackground from '@/components/ui/CeramicBackground';
import Button from '@/components/ui/Button';
import { useLanguage } from '@/lib/i18n';

export default function Home() {
  const { t } = useLanguage();
  const h = t.home;

  // Split headline on \n for line breaks
  const headlineLines = h.headline.split('\n');

  return (
    <div className="relative bg-clay-50 min-h-screen">
      {/* ── Hero section ────────────────────────────────────────── */}
      {/* Replace the gradient below with a background-image once a */}
      {/* ceramic photo is available, e.g.:                         */}
      {/*   style={{ backgroundImage: "url('/images/hero.jpg')" }} */}
      <section className="relative min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-clay-200 via-clay-100 to-clay-50 overflow-hidden">
        <CeramicBackground />

        <h1 className="relative z-10 font-playfair text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-clay-700 leading-tight text-center px-6 max-w-4xl">
          {headlineLines.map((line, i) => (
            <span key={i}>
              {line}
              {i < headlineLines.length - 1 && <br />}
            </span>
          ))}
        </h1>
      </section>

      {/* ── Intro text & CTAs ───────────────────────────────────── */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 sm:px-10 lg:px-12 py-16 sm:py-20">
        <p className="font-lato text-clay-600 text-lg leading-relaxed mb-12">
          {h.introText}
        </p>

        <div className="flex flex-wrap gap-4">
          <Link href="/portfolio">
            <Button>{h.ctaPortfolio}</Button>
          </Link>
          <Link href="/about">
            <Button variant="secondary">{h.ctaAbout}</Button>
          </Link>
          <Link href="/contact">
            <Button variant="secondary">{h.ctaContact}</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
