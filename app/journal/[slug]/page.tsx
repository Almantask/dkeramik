import { lt } from '@/lib/i18n';
import JournalEntry from './JournalEntry';

// generateStaticParams must live in a server component
export function generateStaticParams() {
  return lt.journal.entries.map((entry) => ({ slug: entry.slug }));
}

interface PageProps {
  params: { slug: string };
}

export default function JournalEntryPage({ params }: PageProps) {
  return <JournalEntry slug={params.slug} />;
}
