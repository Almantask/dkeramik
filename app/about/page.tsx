'use client';

import Link from 'next/link';
import CeramicBackground from '@/components/ui/CeramicBackground';
import { useLanguage } from '@/lib/i18n';

export default function AboutPage() {
  const { t } = useLanguage();
  const a = t.about;

  return (
    <div className="relative bg-clay-50 min-h-screen">
      <CeramicBackground />

      <div className="relative z-10 max-w-3xl mx-auto px-6 sm:px-10 lg:px-12 py-16 sm:py-24">
        {/* Featured quote */}
        <p className="font-playfair italic text-clay-500 text-xl sm:text-2xl mb-14">
          {a.quote}
        </p>

        <div className="space-y-8 text-clay-600 leading-loose">
          {/* Greeting */}
          <p className="font-playfair text-2xl sm:text-3xl text-clay-600">
            {a.greeting}
          </p>

          {/* Story */}
          <p>{a.story}</p>

          {/* Mission */}
          <p className="font-semibold text-clay-700">{a.mission}</p>

          {/* Journey */}
          <p>{a.journey}</p>

          {/* Inspiration */}
          <p>{a.inspiration}</p>

          {/* Hope */}
          <p className="font-semibold text-clay-700">{a.hope}</p>

          {/* Contact CTA */}
          <p className="border-t border-clay-200 pt-8">
            {a.contactPrompt}{' '}
            <Link
              href="/contact"
              className="underline text-clay-700 hover:text-clay-900 transition-colors"
            >
              {a.contactLinkText}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
