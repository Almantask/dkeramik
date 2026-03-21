import Link from 'next/link';

interface JournalEntry {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
}

interface JournalCardProps {
  entry: JournalEntry;
  readMoreLabel?: string;
}

export default function JournalCard({
  entry,
  readMoreLabel = 'Read more →',
}: JournalCardProps) {
  return (
    <Link href={`/journal/${entry.slug}`} className="group block">
      <article className="bg-clay-50 border border-clay-200 p-6 hover:border-clay-300 transition-colors">
        <p className="text-clay-400 text-xs uppercase tracking-widest mb-2">{entry.date}</p>
        <h3 className="font-playfair text-xl text-clay-700 mb-3 group-hover:text-clay-500 transition-colors leading-snug">
          {entry.title}
        </h3>
        <p className="text-clay-600 leading-relaxed text-sm">{entry.excerpt}</p>
        <div className="mt-4 text-clay-500 text-sm group-hover:text-clay-600 transition-colors">
          {readMoreLabel}
        </div>
      </article>
    </Link>
  );
}
