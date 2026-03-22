'use client';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useLanguage } from '@/lib/i18n';

interface JournalEntryProps {
  slug: string;
}

export default function JournalEntry({ slug }: JournalEntryProps) {
  const { t } = useLanguage();
  const j = t.journal;

  const entry = j.entries.find((e) => e.slug === slug);
  if (!entry) notFound();

  return (
    <div className="bg-clay-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-6 sm:px-10 py-16">
        {/* Back */}
        <Link
          href="/journal"
          className="text-clay-500 hover:text-clay-600 text-sm mb-8 inline-block transition-colors"
        >
          {j.backToJournal}
        </Link>

        {/* Header */}
        <header className="mb-12 mt-6">
          <p className="text-clay-400 text-xs uppercase tracking-widest mb-3">{entry.date}</p>
          <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl text-clay-700 leading-tight mb-4">
            {entry.title}
          </h1>
          <p className="text-clay-600 text-lg leading-loose italic">{entry.excerpt}</p>
        </header>

        {/* Body paragraphs */}
        <article className="space-y-6 text-clay-600 leading-loose">
          {entry.body.map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </article>
      </div>
    </div>
  );
}
