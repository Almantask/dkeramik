'use client';

import Link from 'next/link';
import CeramicBackground from '@/components/ui/CeramicBackground';
import Button from '@/components/ui/Button';
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

          {/* Photo gallery boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="aspect-[4/5] bg-clay-200 rounded-sm flex items-center justify-center">
                <svg className="w-12 h-12 text-clay-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            ))}
          </div>

          {/* Journey */}
          <p>{a.journey}</p>

          {/* Inspiration */}
          <p>{a.inspiration}</p>

          {/* Hope */}
          <p className="font-semibold text-clay-700">{a.hope}</p>

          {/* Contact CTA */}
          <div className="border-t border-clay-200 pt-8">
            <p className="mb-6">{a.contactPrompt}</p>
            <Link href="/contact">
              <Button>{a.contactLinkText}</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
