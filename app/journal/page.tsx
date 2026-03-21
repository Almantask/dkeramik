'use client';

import CeramicBackground from '@/components/ui/CeramicBackground';
import JournalCard from '@/components/ui/JournalCard';
import { useLanguage } from '@/lib/i18n';

export default function JournalPage() {
  const { t } = useLanguage();
  const j = t.journal;

  return (
    <div className="relative bg-clay-50 min-h-screen">
      <CeramicBackground />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl text-clay-600 mb-4">
            {j.headline}
          </h1>
          <p className="text-clay-600 leading-relaxed max-w-xl mx-auto">
            {j.subheadline}
          </p>
        </div>

        {/* Entries */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {j.entries.map((entry) => (
            <JournalCard
              key={entry.slug}
              entry={{
                slug: entry.slug,
                title: entry.title,
                date: entry.date,
                excerpt: entry.excerpt,
              }}
              readMoreLabel={j.readMore}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
