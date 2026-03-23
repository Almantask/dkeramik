'use client';

import { useLanguage } from '@/lib/i18n';

export default function ContactPage() {
  const { t } = useLanguage();
  const c = t.contact;

  return (
    <div className="min-h-screen bg-clay-50">
      <div className="max-w-2xl mx-auto px-6 sm:px-10 py-16 sm:py-24">
        {/* Header */}
        <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl text-clay-600 mb-3">
          {c.headline}
        </h1>
        <p className="font-playfair italic text-clay-400 text-lg mb-12">{c.subheadline}</p>

        {/* Intro */}
        <p className="text-clay-600 leading-loose mb-12">{c.intro}</p>

        {/* Contact details */}
        <div className="bg-clay-100 border border-clay-200 p-8 mb-12 space-y-6">
          <div>
            <h3 className="text-clay-700 font-semibold text-xs uppercase tracking-widest mb-2">
              {c.emailLabel}
            </h3>
            <a
              href="mailto:hello@dkeramik.com"
              className="text-clay-600 hover:text-clay-500 transition-colors"
            >
              hello@dkeramik.com
            </a>
          </div>
          <div>
            <h3 className="text-clay-700 font-semibold text-xs uppercase tracking-widest mb-2">
              {c.studioLabel}
            </h3>
            {c.studioValue.split('\n').map((line, i) => (
              <p key={i} className="text-clay-600">{line}</p>
            ))}
          </div>
          <div>
            <h3 className="text-clay-700 font-semibold text-xs uppercase tracking-widest mb-3">
              {c.socialHeading}
            </h3>
            <div className="flex space-x-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-clay-600 hover:text-clay-500 transition-colors text-sm"
              >
                {c.socialInstagram}
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-clay-600 hover:text-clay-500 transition-colors text-sm"
              >
                {c.socialPinterest}
              </a>
            </div>
          </div>
        </div>

        {/* Closing */}
        <p className="font-playfair italic text-clay-500 text-lg text-center">
          {c.closing}
        </p>
      </div>
    </div>
  );
}
